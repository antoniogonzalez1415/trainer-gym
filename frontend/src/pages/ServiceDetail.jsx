import { Link, useParams } from 'react-router'
import CategoryTag from '../components/CategoryTag.jsx'
import { ErrorMessage, Loading } from '../components/LoadState.jsx'
import ServiceImage from '../components/ServiceImage.jsx'
import { useApi } from '../hooks/useApi.js'

export function SessionNotFound() {
  return (
    <section className="section container narrow">
      <h1>Session not found</h1>
      <p>This session does not exist or is no longer offered.</p>
      <Link to="/services" className="button button-primary">
        Browse sessions
      </Link>
    </section>
  )
}

export default function ServiceDetail() {
  const { id } = useParams()
  const { data: service, loading, error, reload } = useApi(`/services/${encodeURIComponent(id)}`)

  if (error?.status === 404) return <SessionNotFound />

  if (!service) {
    return (
      <section className="section container">
        {loading && <Loading label="Loading session…" />}
        {error && <ErrorMessage error={error} onRetry={reload} />}
      </section>
    )
  }

  return (
    <>
      <section className="detail-banner">
        <ServiceImage service={service} className="detail-banner-image" />
        <div className="container detail-banner-text">
          <Link to="/services" className="back-link back-link-on-dark">
            Back to sessions
          </Link>
          <CategoryTag category={service.category} />
          <h1>{service.name}</h1>
          <p>{service.summary}</p>
        </div>
      </section>

      <section className="section container detail-layout">
        <div>
          <h2>About this session</h2>
          <p className="lead">{service.description}</p>

          <h2>What the session includes</h2>
          <ul className="check-list">
            {service.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <aside className="booking-panel" aria-label="Session summary">
          <p className="booking-panel-price">
            ${service.price}
            <span> per session</span>
          </p>
          <dl className="service-facts service-facts-stacked">
            <div>
              <dt>Coach</dt>
              <dd>{service.coach}</dd>
            </div>
            <div>
              <dt>Length</dt>
              <dd>{service.durationMinutes} minutes</dd>
            </div>
            <div>
              <dt>Level</dt>
              <dd>{service.level}</dd>
            </div>
          </dl>
          <Link
            to={`/book/${service.id}`}
            className="button button-primary button-block button-large"
          >
            Book this session
          </Link>
          <p className="booking-panel-note">
            Pay at the studio. Reschedule or cancel anytime before it starts.
          </p>
        </aside>
      </section>
    </>
  )
}
