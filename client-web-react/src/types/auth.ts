export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
  roles?: string[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshSession: () => Promise<void>
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface SignupResponse {
  user: User
  token: string
  refreshToken?: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  success: boolean
} 