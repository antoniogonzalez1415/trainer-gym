import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { apiRequest, errorText } from '../api/client.js'
import { ErrorMessage, Loading } from '../components/LoadState.jsx'
import ServiceImage from '../components/ServiceImage.jsx'
import TimeFields from '../components/TimeFields.jsx'
import { useApi } from '../hooks/useApi.js'
import { isInFuture, toIsoString } from '../utils/dates.js'
import { SessionNotFound } from './ServiceDetail.jsx'

const NOTES_MAX_LENGTH = 200

export default function BookService() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    data: service,
    loading,
    error: loadError,
    reload,
  } = useApi(`/services/${encodeURIComponent(id)}`)

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loadError?.status === 404) return <SessionNotFound />

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return

    // Quick checks for a better experience; the backend repeats all of them
    if (!date || !time) {
      setError('Choose a date and a start time.')
      return
    }
    const startsAt = toIsoString(date, time)
    if (!isInFuture(startsAt)) {
      setError('That time has already passed. Choose a later time.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      // Only the fields the customer controls. The server adds user, price and status.
      await apiRequest('/bookings', {
        method: 'POST',
        body: { serviceId: service.id, startsAt, notes: notes.trim() },
      })
      navigate('/dashboard', { state: { booked: service.name } })
    } catch (requestError) {
      setError(errorText(requestError))
      setSubmitting(false)
    }
  }

  return (
    <section className="section container narrow">
      {loading && <Loading label="Loading session…" />}
      {loadError && <ErrorMessage error={loadError} onRetry={reload} />}

      {service && (
        <>
          <Link to={`/services/${service.id}`} className="back-link">
            Back to {service.name}
          </Link>
          <div className="book-header">
            <ServiceImage service={service} className="book-thumb" />
            <div>
              <h1>Book {service.name}</h1>
              <p className="lead">
                {service.durationMinutes} minutes with {service.coach}, ${service.price}. Pay at the
                studio. Times are Chicago time.
              </p>
            </div>
          </div>

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

            <button
              type="submit"
              className="button button-primary button-block"
              disabled={submitting}
            >
              {submitting ? 'Booking…' : 'Confirm booking'}
            </button>
          </form>
        </>
      )}
    </section>
  )
}
