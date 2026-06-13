import { defineEventHandler, getHeader, setResponseStatus } from "h3";

export default defineEventHandler((event) => {
  // Hanya lindungi rute API yang bersifat privat (misalnya /api/documents)
  if (event.path.startsWith("/api/documents")) {
    // 1. Ambil header Authorization
    const authHeader = getHeader(event, "authorization");

    // 2. Cek eksistensi dan format Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      setResponseStatus(event, 401);
      return {
        status: false,
        message: "Akses ditolak: Bearer Token tidak ditemukan atau tidak valid",
        data: null,
      };
    }

    // 3. Ekstrak token
    const token = authHeader.split(" ")[1];

    // 4. Validasi format Token (Mock JWT harus memiliki 3 bagian)
    const parts = token.split(".");
    if (parts.length !== 3) {
      setResponseStatus(event, 401);
      return {
        status: false,
        message: "Akses ditolak: Format token JWT tidak valid",
        data: null,
      };
    }

    // 5. Dekode dan validasi Payload Token
    try {
      // Decode bagian payload (bagian ke-2 dari JWT)
      const payloadString = Buffer.from(parts[1], "base64url").toString("utf8");
      const payload = JSON.parse(payloadString);

      // Cek masa berlaku (Expired) token
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        throw new Error("Token kedaluwarsa");
      }

      const config = useRuntimeConfig(event);
      const secretKey = config.jwtSecret || process.env.JWT_SECRET;

      const expectedSignature = Buffer.from(`hashed_${secretKey}_${payload.sub}`).toString("base64url");

      // Jika signature yang dibawa client BERBEDA dengan hitungan server, berarti token palsu/diedit!
      if (parts[2] !== expectedSignature) {
        throw new Error("Signature token tidak valid (terindikasi dimanipulasi)");
      }
      // =======================================================

      // Jika valid, simpan data user ke dalam context (bisa diakses oleh endpoint API lainnya)
      event.context.user = payload;

    } catch (error: any) {
      setResponseStatus(event, 401);
      return {
        status: false,
        message: `Akses ditolak: Token tidak valid atau telah kedaluwarsa. (${error.message})`,
        data: null,
      };
    }
  }
});
