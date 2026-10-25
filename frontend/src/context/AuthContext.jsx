// Keeps track of who is logged in so any page can read it.
// The backend checks the password and returns a token; the token is kept in
// localStorage and sent with every request. Logging out deletes it.
// Note: hiding a page in React only improves the experience; the backend
// is what actually protects the data.

import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest, getToken, setToken, setUnauthorizedHandler } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // "loading" while we check a saved token with the backend
  const [auth, setAuth] = useState(() => ({
    status: getToken() ? 'loading' : 'ready',
    user: null,
  }))

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null)
      setAuth({ status: 'ready', user: null })
    })

    if (!getToken()) return undefined

    const controller = new AbortController()
    apiRequest('/auth/me', { signal: controller.signal })
      .then((data) => setAuth({ status: 'ready', user: data.user }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        if (error.status === 401) setToken(null)
        setAuth({ status: 'ready', user: null })
      })

    return () => controller.abort()
  }, [])

  function startSession(data) {
    setToken(data.token)
    setAuth({ status: 'ready', user: data.user })
  }

  async function login(email, password) {
    const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } })
    startSession(data)
  }

  async function register(name, email, password) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    })
    startSession(data)
  }

  function logout() {
    setToken(null)
    setAuth({ status: 'ready', user: null })
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
