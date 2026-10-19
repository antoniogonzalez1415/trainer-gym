import { useState } from 'react'
import ServiceCard from '../components/ServiceCard.jsx'
import { services } from '../data/services.js'

const ALL = 'All'

export default function Services() {
  const [category, setCategory] = useState(ALL)
  const categories = [ALL, ...new Set(services.map((service) => service.category))]

  const visible =
    category === ALL ? services : services.filter((service) => service.category === category)

  return (
    <section className="section container">
      <h1>Sessions</h1>
      <p className="lead">Every session is one-on-one with a coach. Pick a category to narrow the list.</p>

      <div className="filters" role="group" aria-label="Filter by category">
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            className={name === category ? 'chip chip-active' : 'chip'}
            aria-pressed={name === category}
            onClick={() => setCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="empty">No sessions in this category yet.</p>
      ) : (
        <div className="service-grid">
          {visible.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </section>
  )
}
