// server/api/group-and-access.get.ts (contoh path)
import { defineEventHandler, getQuery, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const q = getQuery(event) as Partial<Record<string, string | number>>;
    const rawLimit = Number(q.limit);
    const rawPage = Number(q.page);

    const limit =
      Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : 10;
    const page =
      Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;

    const search = q.search ? String(q.search).toLowerCase() : "";
    const statusFilter = q.status ? String(q.status) : "";
    const sortOrder = q.sort === "asc" ? "asc" : "desc"; // Default descending (terbaru)

    const storage = useStorage("assets:");
    const key = "server:documents.json";
    const exists = await storage.hasItem(key);
    if (!exists) throw new Error(`Asset not found in assets: ${key}`);

    const raw = await storage.getItem<any>(key);
    if (raw == null) throw new Error(`Asset is empty: ${key}`);

    const text =
      typeof raw === "string"
        ? raw
        : Buffer.isBuffer(raw)
          ? raw.toString("utf8")
          : JSON.stringify(raw);

    const parsed = JSON.parse(text);

    const sourceArray: any[] = Array.isArray(parsed)
      ? parsed
      : Object.values(parsed ?? {});

    // 1. Search berdasarkan Document Title
    let filteredArray = search
      ? sourceArray.filter((doc) => doc.documentTitle?.toLowerCase().includes(search))
      : sourceArray;

    // 2. Filter berdasarkan Status
    if (statusFilter) {
      filteredArray = filteredArray.filter((doc) => doc.status === statusFilter);
    }

    // 3. Sort berdasarkan Date (menggunakan submissionDate)
    filteredArray.sort((a, b) => {
      const dateA = new Date(a.submissionDate || 0).getTime();
      const dateB = new Date(b.submissionDate || 0).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    const totalItems = filteredArray.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const currentPage = Math.min(page, totalPages);

    const start = (currentPage - 1) * limit;
    const end = start + limit;

    // Gunakan fungsi Map untuk melewatkan array melalui DocumentListResponseDTO (Optional, untuk membersihkan data)
    const items = DocumentListResponseDTO.parse(filteredArray.slice(start, end));

    const res = {
      limit,
      currentPage,
      totalItems,
      totalPages,
      hasPrev: currentPage > 1,
      hasNext: currentPage < totalPages,
      items,
    };

    return { status: true, message: "Success", data: res, error: null };
  } catch (err: any) {
    const message =
      err?.data?.responseMessage ||
      err?.response?._data?.responseMessage ||
      err?.message ||
      "Upstream error";
    setResponseStatus(event, 400);
    return {
      status: false,
      message,
      data: {},
      error: err?.data ?? err?.response?._data ?? null,
    };
  }
});
