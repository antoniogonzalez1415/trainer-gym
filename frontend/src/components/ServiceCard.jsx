import { Link } from 'react-router'
import CategoryTag from './CategoryTag.jsx'
import ServiceImage from './ServiceImage.jsx'

export default function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <div className="service-card-media">
        <ServiceImage service={service} />
        <CategoryTag category={service.category} />
      </div>
      <div className="service-card-body">
        <h3>
          {/* The link covers the whole card, so the card is one click target */}
          <Link to={`/services/${service.id}`} className="card-link">
            {service.name}
          </Link>
        </h3>
        <p className="service-coach">with {service.coach}</p>
        <p className="service-summary">{service.summary}</p>
        <dl className="service-facts">
          <div>
            <dt>Length</dt>
            <dd>{service.durationMinutes} min</dd>
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
      </div>
    </article>
  )
}
