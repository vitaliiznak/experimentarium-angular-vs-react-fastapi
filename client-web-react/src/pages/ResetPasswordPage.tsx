import { useState, FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { resetPassword } = useApp()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!token) {
      setError('Invalid reset token')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      await resetPassword(token, formData.password)
      navigate('/login', { state: { message: 'Password successfully reset. Please login with your new password.' } })
    } catch (err) {
      setError('Failed to reset password. Please try again.')
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

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-form">
          <div className="error-message">Invalid or missing reset token</div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="form-control"
            placeholder="Enter new password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="form-control"
            placeholder="Confirm new password"
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
} 