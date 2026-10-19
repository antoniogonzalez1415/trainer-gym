import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'

const MIN_PASSWORD_LENGTH = 8

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  // Quick checks for a better experience. The backend will repeat them,
  // because anything sent from a browser can be changed.
  function validate() {
    const nextErrors = {}
    if (form.name.trim().length < 2) {
      nextErrors.name = 'Enter your name.'
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      nextErrors.email = 'Enter a valid email, like name@example.com.'
    }
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`
    }
    return nextErrors
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    register(form.name, form.email)
    navigate('/dashboard', { replace: true })
  }

  return (
    <section className="section container narrow">
      <h1>Create your account</h1>
      <p className="lead">You need an account to book and manage sessions.</p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="register-name">Name</label>
          <input
            id="register-name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby="register-name-error"
          />
          <p id="register-name-error" className="field-error">
            {errors.name}
          </p>
        </div>
        <div className="field">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby="register-email-error"
          />
          <p id="register-email-error" className="field-error">
            {errors.email}
          </p>
        </div>
        <div className="field">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby="register-password-error"
          />
          <p id="register-password-error" className="field-error">
            {errors.password || `At least ${MIN_PASSWORD_LENGTH} characters.`}
          </p>
        </div>

        <button type="submit" className="button button-primary button-block">
          Create account
        </button>
      </form>

      <p className="form-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </section>
  )
}
