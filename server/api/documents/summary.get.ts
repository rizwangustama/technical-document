import { defineEventHandler, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const storage = useStorage("assets:");
    const key = "server:documents.json";

    if (!(await storage.hasItem(key))) {
      // Jika kosong, kembalikan summary dengan nilai 0
      return successResponse("Berhasil mengambil summary", {
        totalDocuments: 0,
        underReview: 0,
        approved: 0,
        rejected: 0
      });
    }

    const raw = await storage.getItem<any>(key);
    const text = typeof raw === "string" ? raw : Buffer.isBuffer(raw) ? raw.toString("utf8") : JSON.stringify(raw);
    const parsed = JSON.parse(text);

    const sourceArray: any[] = Array.isArray(parsed) ? parsed : Object.values(parsed ?? {});

    let totalDocuments = sourceArray.length;
    let underReview = 0;
    let approved = 0;
    let rejected = 0;

    // Lakukan loop untuk menghitung frekuensi tiap status
    sourceArray.forEach(doc => {
      if (doc.status === "UNDER_REVIEW") underReview++;
      else if (doc.status === "APPROVED") approved++;
      else if (doc.status === "REJECTED") rejected++;
    });

    const summaryData = {
      totalDocuments,
      underReview,
      approved,
      rejected
    };

    return successResponse("Berhasil mengambil summary", summaryData);

  } catch (err: any) {
    setResponseStatus(event, 500);
    return errorResponse("Terjadi kesalahan sistem saat mengambil summary", err.message);
  }
});
