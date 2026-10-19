import { Link } from 'react-router'

export default function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <p className="service-category">{service.category}</p>
      <h3>
        <Link to={`/services/${service.id}`}>{service.name}</Link>
      </h3>
      <p>{service.summary}</p>
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
    </article>
  )
}
