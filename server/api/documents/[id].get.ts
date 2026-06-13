import { defineEventHandler, getRouterParam, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const storage = useStorage("assets:");
    const key = "server:documents.json";

    if (!(await storage.hasItem(key))) {
      throw new Error("File mock documents tidak ditemukan");
    }

    const raw = await storage.getItem<any>(key);
    const text = typeof raw === "string" ? raw : Buffer.isBuffer(raw) ? raw.toString("utf8") : JSON.stringify(raw);
    const parsed: any[] = JSON.parse(text);

    const document = parsed.find((doc) => doc.id === id);

    if (!document) {
      setResponseStatus(event, 404);
      return { status: false, message: "Dokumen tidak ditemukan", data: null };
    }

    return { status: true, message: "Success", data: document };
  } catch (err: any) {
    setResponseStatus(event, 500);
    return { status: false, message: "Server error", data: null, error: err.message };
  }
});
