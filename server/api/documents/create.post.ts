import { defineEventHandler, readBody, setResponseStatus } from "h3";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const rawBody = await readBody(event);

    // Mengeksekusi Validasi DTO dari server/utils/dto/document.request.ts
    // (Otomatis di-import oleh Nuxt Nitro dari folder utils)
    const validation = CreateDocumentDTO.safeParse(rawBody);

    if (!validation.success) {
      setResponseStatus(event, 400);
      return errorResponse("Validasi DTO Gagal: Format data tidak sesuai", validation.error.format());
    }

    // Jika sukses lolos DTO, kita ambil data murninya yang sudah bersih
    const body = validation.data;

    const storage = useStorage("assets:");
    const key = "server:documents.json";

    let parsed: any[] = [];
    if (await storage.hasItem(key)) {
      const raw = await storage.getItem<any>(key);
      const text = typeof raw === "string" ? raw : Buffer.isBuffer(raw) ? raw.toString("utf8") : JSON.stringify(raw);
      parsed = JSON.parse(text);
    }

    // Buat data baru
    const newDoc = {
      id: randomUUID(),
      projectName: body.projectName,
      documentTitle: body.documentTitle,
      // Mengambil nama pembuat langsung dari payload JWT user yang sedang login
      submittedBy: event.context.user?.name || "Unknown User",
      submissionDate: body.submissionDate || new Date().toISOString(),
      status: body.status || "UNDER_REVIEW",
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString()
    };

    // Tambahkan ke urutan paling atas
    parsed.unshift(newDoc);

    // Simpan ke storage sementara (Cache Nuxt Nitro)
    await storage.setItem(key, JSON.stringify(parsed));

    // Validasi Response DTO: Menjamin data yang dikirim murni sesuai kontrak DocumentResponseDTO
    // (Jika newDoc ternyata menyimpan data rahasia seperti "password", Zod akan otomatis membuangnya / strip)
    const safeResponseData = DocumentResponseDTO.parse(newDoc);

    // Menggunakan fungsi standar Response DTO dari folder utils
    return successResponse("Dokumen berhasil ditambahkan", safeResponseData);
  } catch (err: any) {
    setResponseStatus(event, 500);
    return errorResponse("Server error", err.message);
  }
});
