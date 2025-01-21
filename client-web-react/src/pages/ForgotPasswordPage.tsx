import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

export default function ForgotPasswordPage() {
  const { forgotPassword } = useApp()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      await forgotPassword(email)
      setSuccess(true)
      setEmail('')
    } catch (err) {
      setError('Failed to process forgot password request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="forgot-password-page">
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Password reset instructions have been sent to your email.
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Enter your email"
            className="form-control"
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Reset Password'}
        </button>

        <div className="form-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </form>
    </div>
  )
} 