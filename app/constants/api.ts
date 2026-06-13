export const API_ROUTES = {
  AUTH: {
    LOGIN: 'auth/login',
  },
  DOCUMENTS: {
    SUMMARY: 'documents/summary',
    LIST: 'documents/list',
    CREATE: 'documents/create',
    // Menggunakan fungsi (arrow function) untuk path yang membutuhkan parameter ID dinamis
    DETAIL: (id: string) => `documents/${id}`,
    UPDATE: (id: string) => `documents/${id}`,
    DELETE: (id: string) => `documents/${id}`,
  }
}
