import { api } from './api'
import type { 
  LoginResponse, 
  SignupResponse, 
  LoginCredentials, 
  SignupCredentials,
  ForgotPasswordRequest,
  ForgotPasswordResponse
} from '../types'

export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<LoginResponse>('/auth/login', credentials),

  signup: (data: SignupCredentials) =>
    api.post<SignupResponse>('/auth/signup', data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<ForgotPasswordResponse>('/auth/forgot-password', data),

  resetPassword: (token: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/reset-password', {
      token,
      new_password: newPassword,
    }),
} 