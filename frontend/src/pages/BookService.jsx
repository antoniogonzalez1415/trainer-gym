import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import TimeFields from '../components/TimeFields.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useBookings } from '../context/BookingsContext.jsx'
import { getServiceById } from '../data/services.js'
import { isInFuture, toIsoString } from '../utils/dates.js'

const NOTES_MAX_LENGTH = 200

export default function BookService() {
  const { id } = useParams()
  const service = getServiceById(id)
  const { user } = useAuth()
  const { createBooking } = useBookings()
  const navigate = useNavigate()

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  if (!service) {
    return (
      <section className="section container narrow">
        <h1>Session not found</h1>
        <p>Choose a session from the list to book it.</p>
        <Link to="/services" className="button button-primary">
          Browse sessions
        </Link>
      </section>
    )
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!date || !time) {
      setError('Choose a date and a start time.')
      return
    }

    const startsAt = toIsoString(date, time)
    if (!isInFuture(startsAt)) {
      setError('That time has already passed. Choose a later time.')
      return
    }

    const bookingError = createBooking({
      service,
      userEmail: user.email,
      startsAt,
      notes: notes.trim(),
    })

    if (bookingError) {
      setError(bookingError)
      return
    }

    navigate('/dashboard', { state: { booked: service.name } })
  }

  return (
    <section className="section container narrow">
      <Link to={`/services/${service.id}`} className="back-link">
        Back to {service.name}
      </Link>
      <h1>Book {service.name}</h1>
      <p className="lead">
        {service.durationMinutes} minutes with {service.coach}, ${service.price}. Pay at the
        studio.
      </p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <TimeFields
          idPrefix="book"
          date={date}
          time={time}
          onDateChange={setDate}
          onTimeChange={setTime}
        />

        <div className="field">
          <label htmlFor="book-notes">Notes for your coach (optional)</label>
          <textarea
            id="book-notes"
            rows="3"
            maxLength={NOTES_MAX_LENGTH}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Anything your coach should know before the session"
          />
          <p className="field-hint">
            {notes.length}/{NOTES_MAX_LENGTH}
          </p>
        </div>

        <p className="form-error" role="alert">
          {error}
        </p>

        <button type="submit" className="button button-primary button-block">
          Confirm booking
        </button>
      </form>
    </section>
  )
}
