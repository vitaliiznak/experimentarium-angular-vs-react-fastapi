import { Navigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useApp()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
} 