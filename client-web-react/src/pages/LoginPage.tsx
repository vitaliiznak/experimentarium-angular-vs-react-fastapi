import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        
        {error && (
          <div className="error-message">
            {error}
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
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        <button 
          type="submit" 
          className="login-button"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <div className="form-footer">
          <Link to="/forgot-password">Forgot Password?</Link>
          <span className="separator"> | </span>
          <span>Don't have an account? </span>
          <Link to="/signup">Sign Up</Link>
        </div>
      </form>
    </div>
  )
}