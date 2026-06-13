import { defineEventHandler, readBody, getRouterParam, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    const storage = useStorage("assets:");
    const key = "server:documents.json";
    
    if (!(await storage.hasItem(key))) {
      throw new Error("File mock documents tidak ditemukan");
    }

    const raw = await storage.getItem<any>(key);
    const text = typeof raw === "string" ? raw : Buffer.isBuffer(raw) ? raw.toString("utf8") : JSON.stringify(raw);
    const parsed: any[] = JSON.parse(text);

    const index = parsed.findIndex((doc) => doc.id === id);

    if (index === -1) {
      setResponseStatus(event, 404);
      return { status: false, message: "Dokumen tidak ditemukan", data: null };
    }

    // Merge data lama dengan data baru yang dikirim
    const updatedDoc = {
      ...parsed[index],
      ...body,
      id: id, // Mengamankan agar ID utama tidak bisa ditimpa
      updateAt: new Date().toISOString() // Otomatis perbarui waktu update
    };

    parsed[index] = updatedDoc;

    // Simpan ke storage sementara (Cache Nuxt Nitro)
    await storage.setItem(key, JSON.stringify(parsed));

    return { status: true, message: "Dokumen berhasil diperbarui", data: updatedDoc };
  } catch (err: any) {
    setResponseStatus(event, 500);
    return { status: false, message: "Server error", data: null, error: err.message };
  }
});
