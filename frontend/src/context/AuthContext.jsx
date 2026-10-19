// Keeps track of who is logged in so any page can read it.
// TEMPORARY: login and register only check the form here.
// On day 4 they call the backend (POST /api/auth/login and /api/auth/register),
// which checks the password against MongoDB.

import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'fit-trainer-user'

function readStoredUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function storeUser(user) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Storage can be blocked (private windows). The app still works for this visit.
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  function saveUser(nextUser) {
    setUser(nextUser)
    storeUser(nextUser)
  }

  function login(email) {
    const normalizedEmail = email.trim().toLowerCase()
    const name = normalizedEmail.split('@')[0]
    saveUser({ name, email: normalizedEmail })
  }

  function register(name, email) {
    saveUser({ name: name.trim(), email: email.trim().toLowerCase() })
  }

  function logout() {
    saveUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
