export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
  },
  DOCUMENTS: {
    SUMMARY: '/api/documents/summary',
    LIST: '/api/documents/list',
    CREATE: '/api/documents/create',
    // Menggunakan fungsi (arrow function) untuk path yang membutuhkan parameter ID dinamis
    DETAIL: (id: string) => `/api/documents/${id}`,
    UPDATE: (id: string) => `/api/documents/${id}`,
    DELETE: (id: string) => `/api/documents/${id}`,
  }
}
