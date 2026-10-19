import { Link, useParams } from 'react-router'
import { getServiceById } from '../data/services.js'

export default function ServiceDetail() {
  const { id } = useParams()
  const service = getServiceById(id)

  if (!service) {
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

  return (
    <section className="section container detail">
      <Link to="/services" className="back-link">
        Back to sessions
      </Link>

      <div className="detail-layout">
        <div>
          <p className="service-category">{service.category}</p>
          <h1>{service.name}</h1>
          <p className="lead">{service.description}</p>

          <h2>What the session includes</h2>
          <ul className="check-list">
            {service.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <aside className="booking-panel" aria-label="Session summary">
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
            <div>
              <dt>Price</dt>
              <dd>${service.price}</dd>
            </div>
          </dl>
          <Link to={`/book/${service.id}`} className="button button-primary button-block">
            Book this session
          </Link>
        </aside>
      </div>
    </section>
  )
}
