import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { apiRequest, errorText } from '../api/client.js'
import { ErrorMessage, Loading } from '../components/LoadState.jsx'
import ServiceImage from '../components/ServiceImage.jsx'
import TimeFields from '../components/TimeFields.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useApi } from '../hooks/useApi.js'
import { formatDateTime, isInFuture, toInputValues, toIsoString } from '../utils/dates.js'

function BookingRow({ booking, onChanged }) {
  const [editing, setEditing] = useState(false)
  const [values, setValues] = useState(() => toInputValues(booking.startsAt))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSave(event) {
    event.preventDefault()
    if (busy) return
    const startsAt = toIsoString(values.date, values.time)
    if (!isInFuture(startsAt)) {
      setError('Choose a time in the future.')
      return
    }

    setBusy(true)
    setError('')
    try {
      await apiRequest(`/bookings/${booking.id}`, { method: 'PATCH', body: { startsAt } })
      setEditing(false)
      onChanged()
    } catch (requestError) {
      setError(errorText(requestError))
    } finally {
      setBusy(false)
    }
  }

  async function handleCancel() {
    if (busy) return
    if (!window.confirm(`Cancel ${booking.serviceName} on ${formatDateTime(booking.startsAt)}?`))
      return

    setBusy(true)
    setError('')
    try {
      await apiRequest(`/bookings/${booking.id}`, { method: 'DELETE' })
      onChanged()
    } catch (requestError) {
      setError(errorText(requestError))
      setBusy(false)
    }
  }

  return (
    <li className="booking-row">
      <ServiceImage
        service={{ id: booking.serviceId, name: booking.serviceName, category: '' }}
        className="booking-thumb"
      />
      <div className="booking-main">
        <h3>{booking.serviceName}</h3>
        <p>
          {formatDateTime(booking.startsAt)}, {booking.durationMinutes} min with {booking.coach}
        </p>
        {booking.notes && <p className="muted">Notes: {booking.notes}</p>}
      </div>

      <div className="booking-actions">
        <button
          type="button"
          className="button button-ghost"
          onClick={() => setEditing(!editing)}
          disabled={busy}
        >
          {editing ? 'Keep current time' : 'Reschedule'}
        </button>
        <button
          type="button"
          className="button button-danger"
          onClick={handleCancel}
          disabled={busy}
        >
          Cancel booking
        </button>
      </div>

      {!editing && error && (
        <p className="form-error booking-error" role="alert">
          {error}
        </p>
      )}

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
          <button type="submit" className="button button-primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save new time'}
          </button>
        </form>
      )}
    </li>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const justBooked = location.state?.booked
  const { data: bookings, loading, error, reload } = useApi('/bookings/mine')

  const all = bookings ?? []
  const upcoming = all.filter(
    (booking) => booking.status === 'confirmed' && isInFuture(booking.startsAt),
  )
  const history = all
    .filter((booking) => booking.status === 'cancelled' || !isInFuture(booking.startsAt))
    .reverse()
  const next = upcoming[0]

  return (
    <>
      <section className="page-band">
        <div className="container">
          <h1>Hi, {user.name}</h1>
          <p>Your sessions, all in one place.</p>
        </div>
      </section>
      <section className="section container">
        {justBooked && (
          <p className="notice" role="status">
            {justBooked} is booked. You can reschedule or cancel it below.
          </p>
        )}

        {loading && <Loading label="Loading your bookings…" />}
        {error && <ErrorMessage error={error} onRetry={reload} />}

        {bookings && (
          <>
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
                    key={`${booking.id}-${booking.startsAt}`}
                    booking={booking}
                    onChanged={reload}
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
          </>
        )}
      </section>
    </>
  )
}
