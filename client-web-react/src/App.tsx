import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

export default function App() {
  return (
    <Router>
      <AppProvider>
        <div className="app">
          <main className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            </Routes>
          </main>
        </div>
      </AppProvider>
    </Router>
  )
}