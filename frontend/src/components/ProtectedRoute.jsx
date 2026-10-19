// Sends visitors who are not logged in to the login page,
// and remembers where they were going so login can send them back.
// This only improves the experience. Real protection happens in the backend.

import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
