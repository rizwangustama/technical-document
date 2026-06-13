import { defineEventHandler, readBody, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validasi sederhana (jika email atau password kosong)
    if (!body || !body.email || !body.password) {
      setResponseStatus(event, 400);
      return {
        status: false,
        message: "Email dan password wajib diisi",
        data: null,
      };
    }

    const { email, password } = body;

    // Membaca mock data users dari storage assets Nuxt Nitro
    const storage = useStorage("assets:");
    const key = "server:users.json";
    const exists = await storage.hasItem(key);

    if (!exists) {
      throw new Error("File mock users tidak ditemukan di assets");
    }

    const rawUsers = await storage.getItem<any>(key);
    const text = typeof rawUsers === "string" ? rawUsers : Buffer.isBuffer(rawUsers) ? rawUsers.toString("utf8") : JSON.stringify(rawUsers);
    const parsedUsers: any[] = JSON.parse(text);

    // Cek apakah email terdaftar di database
    const foundUser = parsedUsers.find((u) => u.email === email);

    if (!foundUser) {
      setResponseStatus(event, 401);
      return {
        status: false,
        message: "Email tidak terdaftar",
        data: null,
      };
    }

    // Cek kecocokan password
    if (foundUser.password !== password) {
      setResponseStatus(event, 401);
      return {
        status: false,
        message: "Password yang Anda masukkan salah",
        data: null,
      };
    }

    // Jika sampai baris ini, berarti email ada dan password cocok
    // Hilangkan password dari response untuk keamanan
    const { password: _, token, ...userData } = foundUser;

    // Generate token secara dinamis (Struktur Mock JWT: Header.Payload.Signature)
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sub: userData.id,
      name: userData.name,
      role: userData.role,
      iat: Math.floor(Date.now() / 1000), // Waktu dibuat (detik ini)
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // Expire 24 jam
    };

    const encodeBase64Url = (obj: any) => Buffer.from(JSON.stringify(obj)).toString("base64url");

    // Mengambil JWT_SECRET dari environment variable secara aman
    const config = useRuntimeConfig(event);
    // Tambahkan fallback berjaga-jaga jika server Nuxt belum di-restart setelah .env dibuat
    const secretKey = config.jwtSecret || process.env.JWT_SECRET || "fallback_secret_123";

    // Meng-encode secret menjadi string acak base64url agar tampak persis seperti hash signature JWT sungguhan
    const fakeSignature = Buffer.from(`hashed_${secretKey}_${userData.id}`).toString("base64url");

    const generatedToken = `${encodeBase64Url(header)}.${encodeBase64Url(payload)}.${fakeSignature}`;

    // Login sukses
    return {
      status: true,
      message: "Login berhasil",
      data: {
        user: userData,
        token: generatedToken,
      },
    };
  } catch (err: any) {
    setResponseStatus(event, 500);
    return {
      status: false,
      message: "Terjadi kesalahan pada server",
      data: null,
      error: err.message,
    };
  }
});
