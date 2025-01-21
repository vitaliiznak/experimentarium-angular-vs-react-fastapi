import { useState } from 'react'

interface ApiOptions<T> {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: T
  headers?: Record<string, string>
}

export function useApi<TData, TError = unknown>() {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<TError | null>(null)
  const [loading, setLoading] = useState(false)

  const execute: <T>(options: ApiOptions<T>) => Promise<any> = async ({ url, method = 'GET', body, headers = {} }) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      return result
    } catch (e) {
      setError(e as TError)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { data, error, loading, execute }
}