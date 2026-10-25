// The only place the frontend talks to the backend.
// VITE_API_BASE_URL is public configuration (it ends up in the built files),
// so it must never hold a secret. Secrets live only on the backend.

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api').replace(
  /\/$/,
  '',
)
const TOKEN_KEY = 'fit-trainer-token'

let handleUnauthorized = null

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details ?? []
  }
}

// Storage can be blocked (private windows), so every access is guarded
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    // The session then lasts only until the page reloads
  }
}

// AuthContext registers a function that logs the user out when a token expires
export function setUnauthorizedHandler(handler) {
  handleUnauthorized = handler
}

// Turns an error from the API into one readable sentence
export function errorText(error) {
  if (error?.details?.length) {
    return error.details.map((detail) => detail.message).join('. ')
  }
  return error?.message ?? 'Something went wrong. Try again.'
}

export async function apiRequest(path, { method = 'GET', body, signal } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0)
  }

  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    if (response.status === 401 && token && handleUnauthorized) {
      handleUnauthorized()
    }
    throw new ApiError(
      data?.error ?? `Request failed (${response.status})`,
      response.status,
      data?.details,
    )
  }

  return data
}
