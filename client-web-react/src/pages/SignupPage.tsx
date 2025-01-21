import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import type { SignupCredentials } from '../types'

// TODO: Move to shared package
export const TEST_IDS = {
  // Auth
  LOGIN_FORM: 'login-form',
  LOGIN_EMAIL: 'login-email',
  LOGIN_PASSWORD: 'login-password',
  LOGIN_SUBMIT: 'login-submit',
  LOGIN_ERROR: 'login-error',

  // Dashboard
  DASHBOARD: 'dashboard',
  DASHBOARD_HEADER: 'dashboard-header',
  USER_PROFILE: 'user-profile',
  LOGOUT_BUTTON: 'logout-button',

  // Navigation
  MAIN_NAV: 'main-nav',
  NAV_HOME: 'nav-home',
  NAV_SETTINGS: 'nav-settings',

  // Common
  ERROR_MESSAGE: 'error-message',
  LOADING_SPINNER: 'loading-spinner',

  // Signup
  SIGNUP_FORM: 'signup-form',
  SIGNUP_NAME: 'signup-name',
  SIGNUP_EMAIL: 'signup-email',
  SIGNUP_PASSWORD: 'signup-password',
  SIGNUP_CONFIRM_PASSWORD: 'signup-confirm-password',
  SIGNUP_SUBMIT: 'signup-submit',
  SIGNUP_ERROR: 'signup-error'
}; 
export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useApp()
  const [formData, setFormData] = useState<SignupCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      await signup(formData)
      navigate('/')
    } catch (err) {
      // Handle specific error messages
      if (err instanceof Error) {
        // Check if it's an API error with detail property
        const apiError = err as { detail?: string }
        if (apiError.detail === 'Email already registered') {
          setError('This email is already registered. Please use a different email or try logging in.')
        } else {
          setError(err.message || 'Failed to create account. Please try again.')
        }
      } else {
        setError('Failed to create account. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="form-control"
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="form-control"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="form-control"
            placeholder="Enter your password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="form-control"
            placeholder="Confirm your password"
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  )
} 