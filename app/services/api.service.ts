import axios, { type AxiosRequestConfig } from 'axios'
import { useCookie } from '#app'

// Instance axios dasar
const axiosInstance = axios.create({
  timeout: 15000,
})

// Gunakan interceptor request untuk menyuntikkan token otomatis dan konfigurasi env
axiosInstance.interceptors.request.use((config) => {
  try {
    // Menyuntikkan base URL dari public runtime config (jika tersedia dari env)
    const runtimeConfig = useRuntimeConfig()
    if (runtimeConfig?.public?.apiBase && !config.baseURL && !config.url?.startsWith('http')) {
      config.baseURL = runtimeConfig.public.apiBase as string
    }
  } catch (e) {
    // Jika dipanggil di luar Nuxt Context, abaikan error (fallback ke URL relatif)
  }

  const token = useCookie('auth_token')
  if (token.value && config.headers) {
    config.headers.Authorization = `Bearer ${token.value}`
  }
  return config
})

/**
 * Base API Service class for all frontend API calls (Axios version).
 */
export class ApiService {
  protected async fetch<T>(url: string, options: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await axiosInstance({ url, ...options })
      // Axios membungkus balikan dari server di dalam `response.data`
      return response.data as T
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn("Sesi berakhir atau token tidak valid.")
      }
      throw error
    }
  }
}

export { axiosInstance }
