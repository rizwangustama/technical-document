import { defineEventHandler, getRouterParam, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // 1. Ekstrak parameter [id] dari URL (misal: /api/documents/b1f4a3d2-...)
    const id = getRouterParam(event, "id");

    if (!id) {
      setResponseStatus(event, 400);
      return errorResponse("ID Dokumen wajib disertakan di URL");
    }

    const storage = useStorage("assets:");
    const key = "server:documents.json";

    if (!(await storage.hasItem(key))) {
      setResponseStatus(event, 404);
      return errorResponse("Database dokumen tidak ditemukan");
    }

    const raw = await storage.getItem<any>(key);
    const text = typeof raw === "string" ? raw : Buffer.isBuffer(raw) ? raw.toString("utf8") : JSON.stringify(raw);
    let parsed: any[] = JSON.parse(text);

    // 2. Cari posisi dokumen di dalam array
    const docIndex = parsed.findIndex((doc) => doc.id === id);

    if (docIndex === -1) {
      setResponseStatus(event, 404);
      return errorResponse("Dokumen tidak ditemukan, mungkin sudah dihapus");
    }

    // Ambil info dokumen yang akan dihapus (opsional, untuk info respon)
    const deletedDoc = parsed[docIndex];

    // 3. Hapus dokumen dari array secara permanen
    parsed.splice(docIndex, 1);

    // 4. Timpa database dengan array yang baru (tanpa dokumen tersebut)
    await storage.setItem(key, JSON.stringify(parsed));

    // 5. Kembalikan respons standar menggunakan util kita
    return successResponse("Dokumen berhasil dihapus", {
      id: deletedDoc.id,
      documentTitle: deletedDoc.documentTitle
    });

  } catch (err: any) {
    setResponseStatus(event, 500);
    return errorResponse("Terjadi kesalahan sistem saat menghapus dokumen", err.message);
  }
});
