import { ApiService } from './api.service'
import { API_ROUTES } from '~/constants/api'

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

export interface LoginPayload {
  email: string;
  password?: string;
  [key: string]: any;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

class AuthService extends ApiService {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    return this.fetch<LoginResponse>(API_ROUTES.AUTH.LOGIN, { method: 'POST', data: payload })
  }
}

export const authService = new AuthService()
