import { ApiError, ApiRequestConfig } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    // Create an error object that includes the API error details
    const error = new Error(data.detail || data.message || 'An error occurred') as Error & {
      detail?: string
      status?: number
    }
    error.detail = data.detail
    error.status = response.status
    throw error
  }

  return data
}

export const api = {
  get: <T>(endpoint: string, config?: ApiRequestConfig) =>
    request<T>(endpoint, {
      method: 'GET',
      headers: config?.headers,
      signal: config?.signal,
    }),

  post: <T>(endpoint: string, data: unknown, config?: ApiRequestConfig) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: config?.headers,
      signal: config?.signal,
    }),

  put: <T>(endpoint: string, data: unknown, config?: ApiRequestConfig) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: config?.headers,
      signal: config?.signal,
    }),

  delete: <T>(endpoint: string, config?: ApiRequestConfig) =>
    request<T>(endpoint, {
      method: 'DELETE',
      headers: config?.headers,
      signal: config?.signal,
    }),
} 