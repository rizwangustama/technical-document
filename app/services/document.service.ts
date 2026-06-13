import { ApiService } from './api.service'
import { API_ROUTES } from '~/constants/api'

class DocumentService extends ApiService {
  async getSummary() {
    return this.fetch(API_ROUTES.DOCUMENTS.SUMMARY)
  }

  async getList(params: Record<string, any> = {}) {
    return this.fetch(API_ROUTES.DOCUMENTS.LIST, { params })
  }

  async getById(id: string) {
    return this.fetch(API_ROUTES.DOCUMENTS.DETAIL(id))
  }

  async create(payload: any) {
    return this.fetch(API_ROUTES.DOCUMENTS.CREATE, { method: 'POST', data: payload })
  }

  async update(id: string, payload: any) {
    return this.fetch(API_ROUTES.DOCUMENTS.UPDATE(id), { method: 'PUT', data: payload })
  }

  async delete(id: string) {
    return this.fetch(API_ROUTES.DOCUMENTS.DELETE(id), { method: 'DELETE' })
  }
}

export const documentService = new DocumentService()
