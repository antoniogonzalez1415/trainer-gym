import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { errorText } from '../api/client.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // If the user was sent here from a protected page, go back there after login.
  const destination = location.state?.from ?? '/dashboard'

  if (user && !submitting) {
    return <Navigate to={destination} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return

    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await login(email.trim(), password)
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(errorText(requestError))
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-photo" aria-hidden="true">
        <p>Every session ends with a written plan for the next one.</p>
      </div>
      <div className="auth-panel">
        <h1>Log in</h1>
        <p className="lead">Log in to book sessions and manage your bookings.</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <p className="form-error" role="alert">
            {error}
          </p>

          <button
            type="submit"
            className="button button-primary button-block"
            disabled={submitting}
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="form-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  )
}
