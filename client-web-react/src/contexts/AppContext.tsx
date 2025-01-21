import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SignupCredentials, User } from '../types'
import { api } from '../services/api'

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (credentials: SignupCredentials) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface LoginResponse {
  user: User
  token: string
}

interface LoginError {
  message: string
  status: number
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage on app load
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  // Update localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const navigate = useNavigate()

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      })
      
      setUser(response.user)
      localStorage.setItem('token', response.access_token)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    navigate('/login')
  }

  const signup = async (credentials: SignupCredentials): Promise<void> => {
    try {
      const response = await api.post<SignupResponse>('/auth/signup', credentials)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      navigate('/')
    } catch (error) {
      throw error
    }
  }

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await api.post<{ message: string }>('/auth/forgot-password', { email })
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          new_password: newPassword 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Password reset failed')
      }
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    setUser,
    isAuthenticated: user !== null,
    login,
    logout,
    signup,
    forgotPassword,
    resetPassword,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}