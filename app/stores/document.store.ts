import { defineStore } from 'pinia'
import { ref } from 'vue'
import { documentService } from '~/services/document.service'

export const useDocumentStore = defineStore('document', () => {
  // State
  const documents = ref<any[]>([])
  const totalItems = ref(0)
  const summary = ref({
    totalDocuments: 0,
    underReview: 0,
    approved: 0,
    rejected: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions (menggunakan Arrow Functions)
  const fetchSummary = async () => {
    loading.value = true
    error.value = null
    try {
      await delay(500) // Simulasi loading state
      const res: any = await documentService.getSummary()
      if (res.status) {
        summary.value = res.data
      } else {
        error.value = res.message
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Gagal mengambil summary dokumen'
    } finally {
      loading.value = false
    }
  }

  const fetchDocuments = async (params: Record<string, any> = {}) => {
    loading.value = true
    error.value = null
    try {
      await delay(500) // Simulasi loading state
      const res: any = await documentService.getList(params)
      if (res.status) {
        documents.value = res.data.items
        totalItems.value = res.data.totalItems || 0
      } else {
        error.value = res.message
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Gagal mengambil list dokumen'
    } finally {
      loading.value = false
    }
  }

  const createDocument = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      await delay(800) // Simulasi loading state untuk proses create
      const res: any = await documentService.create(data)
      if (res.status) {
        // Segarkan data setelah berhasil buat
        await fetchDocuments()
        await fetchSummary()
        return true
      } else {
        error.value = res.message
        return false
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Gagal membuat dokumen'
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteDocument = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await delay(800) // Simulasi loading state untuk proses hapus
      const res: any = await documentService.delete(id)
      if (res.status) {
        await fetchDocuments()
        await fetchSummary()
        return true
      } else {
        error.value = res.message
        return false
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Gagal menghapus dokumen'
      return false
    } finally {
      loading.value = false
    }
  }
  const updateDocument = async (id: string, payload: any) => {
    loading.value = true
    error.value = null
    try {
      await delay(800) // Simulasi loading state
      const res: any = await documentService.update(id, payload)
      if (res.status) {
        await fetchDocuments()
        await fetchSummary()
        return true
      } else {
        error.value = res.message
        return false
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Gagal mengubah dokumen'
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchDetail = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await delay(600) // Simulasi loading state
      const res: any = await documentService.getById(id)
      if (res.status) {
        return res.data
      }
      return null
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Gagal mengambil detail dokumen'
      return null
    } finally {
      loading.value = false
    }
  }

  // Return state and actions
  return {
    documents,
    totalItems,
    summary,
    loading,
    error,
    fetchSummary,
    fetchDocuments,
    fetchDetail,
    createDocument,
    updateDocument,
    deleteDocument
  }
})
