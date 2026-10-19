import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import TimeFields from '../components/TimeFields.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useBookings } from '../context/BookingsContext.jsx'
import { formatDateTime, isInFuture, toInputValues, toIsoString } from '../utils/dates.js'

function BookingRow({ booking, onCancel, onReschedule }) {
  const [editing, setEditing] = useState(false)
  const [values, setValues] = useState(() => toInputValues(booking.startsAt))
  const [error, setError] = useState('')

  function handleSave(event) {
    event.preventDefault()
    const startsAt = toIsoString(values.date, values.time)

    if (!isInFuture(startsAt)) {
      setError('Choose a time in the future.')
      return
    }

    const rescheduleError = onReschedule(booking.id, startsAt)
    if (rescheduleError) {
      setError(rescheduleError)
      return
    }

    setError('')
    setEditing(false)
  }

  function handleCancel() {
    if (window.confirm(`Cancel ${booking.serviceName} on ${formatDateTime(booking.startsAt)}?`)) {
      onCancel(booking.id)
    }
  }

  return (
    <li className="booking-row">
      <div className="booking-main">
        <h3>{booking.serviceName}</h3>
        <p>
          {formatDateTime(booking.startsAt)}, {booking.durationMinutes} min
        </p>
        {booking.notes && <p className="muted">Notes: {booking.notes}</p>}
      </div>

      <div className="booking-actions">
        <button type="button" className="button button-ghost" onClick={() => setEditing(!editing)}>
          {editing ? 'Keep current time' : 'Reschedule'}
        </button>
        <button type="button" className="button button-danger" onClick={handleCancel}>
          Cancel booking
        </button>
      </div>

      {editing && (
        <form className="reschedule-form" onSubmit={handleSave} noValidate>
          <TimeFields
            idPrefix={`reschedule-${booking.id}`}
            date={values.date}
            time={values.time}
            onDateChange={(date) => setValues((current) => ({ ...current, date }))}
            onTimeChange={(time) => setValues((current) => ({ ...current, time }))}
          />
          <p className="form-error" role="alert">
            {error}
          </p>
          <button type="submit" className="button button-primary">
            Save new time
          </button>
        </form>
      )}
    </li>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { bookings, cancelBooking, rescheduleBooking } = useBookings()
  const location = useLocation()
  const justBooked = location.state?.booked

  const mine = bookings
    .filter((booking) => booking.userEmail === user.email)
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt))

  const upcoming = mine.filter(
    (booking) => booking.status === 'confirmed' && isInFuture(booking.startsAt),
  )
  const history = mine.filter(
    (booking) => booking.status === 'cancelled' || !isInFuture(booking.startsAt),
  )
  const next = upcoming[0]

  return (
    <section className="section container">
      <h1>Hi, {user.name}</h1>

      {justBooked && (
        <p className="notice" role="status">
          {justBooked} is booked. You can reschedule or cancel it below.
        </p>
      )}

      <div className="summary">
        <div className="summary-next">
          <h2>Next session</h2>
          {next ? (
            <p className="summary-value">
              {next.serviceName}
              <span>{formatDateTime(next.startsAt)}</span>
            </p>
          ) : (
            <p>Nothing booked yet.</p>
          )}
        </div>
        <div>
          <h2>Upcoming</h2>
          <p className="summary-number">{upcoming.length}</p>
        </div>
        <div>
          <h2>Minutes planned</h2>
          <p className="summary-number">
            {upcoming.reduce((total, booking) => total + booking.durationMinutes, 0)}
          </p>
        </div>
      </div>

      <h2>Upcoming bookings</h2>
      {upcoming.length === 0 ? (
        <div className="empty">
          <p>You have no upcoming sessions.</p>
          <Link to="/services" className="button button-primary">
            Book a session
          </Link>
        </div>
      ) : (
        <ul className="booking-list">
          {upcoming.map((booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
              onCancel={cancelBooking}
              onReschedule={rescheduleBooking}
            />
          ))}
        </ul>
      )}

      {history.length > 0 && (
        <>
          <h2>Past and cancelled</h2>
          <ul className="booking-list booking-list-history">
            {history.map((booking) => (
              <li key={booking.id} className="booking-row">
                <div className="booking-main">
                  <h3>{booking.serviceName}</h3>
                  <p>{formatDateTime(booking.startsAt)}</p>
                </div>
                <span className={`status status-${booking.status}`}>
                  {booking.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
