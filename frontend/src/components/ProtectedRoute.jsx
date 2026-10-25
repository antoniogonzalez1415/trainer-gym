// Sends visitors who are not logged in to the login page,
// and remembers where they were going so login can send them back.
// This only improves the experience. Real protection happens in the backend.

import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'
import { Loading } from './LoadState.jsx'

export default function ProtectedRoute({ children }) {
  const { user, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <section className="section container">
        <Loading label="Checking your session…" />
      </section>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
