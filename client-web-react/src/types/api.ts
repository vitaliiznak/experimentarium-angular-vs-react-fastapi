export interface ApiError {
  message: string
  status: number
  code?: string
  details?: Record<string, unknown>
}

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiRequestConfig {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  signal?: AbortSignal
} 