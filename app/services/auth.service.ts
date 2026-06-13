import { ApiService } from './api.service'
import { API_ROUTES } from '~/constants/api'

class AuthService extends ApiService {
  async login(payload: Record<string, string>) {
    return this.fetch(API_ROUTES.AUTH.LOGIN, { method: 'POST', data: payload })
  }
}

export const authService = new AuthService()
