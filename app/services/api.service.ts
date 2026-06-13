import axios, { type AxiosRequestConfig } from 'axios'
import { useCookie } from '#app'

// Instance axios dasar
const axiosInstance = axios.create({
  timeout: 15000,
})

// Gunakan interceptor request untuk menyuntikkan token otomatis
axiosInstance.interceptors.request.use((config) => {
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
