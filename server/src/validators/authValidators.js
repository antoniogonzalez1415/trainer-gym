import { EMAIL_PATTERN, getBody, onlyAllow, throwIfErrors } from './common.js'

// bcrypt only uses the first 72 bytes of a password
const PASSWORD_MIN = 8
const PASSWORD_MAX = 72

export function validateRegister(req) {
  const body = getBody(req)
  onlyAllow(body, ['name', 'email', 'password'])
  const details = []

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (name.length < 2 || name.length > 60) {
    details.push({ field: 'name', message: 'Name must have 2 to 60 characters' })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    details.push({ field: 'email', message: 'Enter a valid email, like name@example.com' })
  }

  const password = typeof body.password === 'string' ? body.password : ''
  if (password.length < PASSWORD_MIN || Buffer.byteLength(password) > PASSWORD_MAX) {
    details.push({
      field: 'password',
      message: `Password must have ${PASSWORD_MIN} to ${PASSWORD_MAX} characters`,
    })
  }

  throwIfErrors(details)
  return { name, email, password }
}

export function validateLogin(req) {
  const body = getBody(req)
  onlyAllow(body, ['email', 'password'])
  const details = []

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email) details.push({ field: 'email', message: 'Email is required' })

  const password = typeof body.password === 'string' ? body.password : ''
  if (!password) details.push({ field: 'password', message: 'Password is required' })

  throwIfErrors(details)
  return { email, password }
}
