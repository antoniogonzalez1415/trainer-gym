import { Link, NavLink, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" aria-label="Fit Trainer home">
          <span className="brand-mark" aria-hidden="true">F</span>
          Fit Trainer
        </Link>

        <nav className="nav-links" aria-label="Main">
          <NavLink to="/services">Sessions</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard">My bookings</NavLink>
              <button type="button" className="button button-ghost" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <Link to="/register" className="button button-primary">
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
