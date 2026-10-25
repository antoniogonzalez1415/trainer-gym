import { Link } from 'react-router'
import BrandMark from './BrandMark.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">
            <BrandMark />
            Fit Trainer
          </p>
          <p>One-on-one personal training, booked online.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/services">Sessions</Link>
          <Link to="/register">Create account</Link>
          <Link to="/dashboard">My bookings</Link>
        </nav>
        <p className="footer-note">
          Open daily 6:00–20:00, Chicago time. Capstone project: coaches and sessions are sample
          data.
        </p>
      </div>
    </footer>
  )
}
