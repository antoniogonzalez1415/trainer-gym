import { useState } from 'react'
import { ErrorMessage, Loading } from '../components/LoadState.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { useApi } from '../hooks/useApi.js'
import { CATEGORIES, plateClass } from '../utils/categories.js'

const ALL = 'All'

export default function Services() {
  const [category, setCategory] = useState(ALL)
  const path = category === ALL ? '/services' : `/services?category=${encodeURIComponent(category)}`
  const { data: services, loading, error, reload } = useApi(path)

  return (
    <>
      <section className="page-band">
        <div className="container">
          <h1>Sessions</h1>
          <p>Every session is one-on-one with a coach. The color shows the type of training.</p>
        </div>
      </section>

      <section className="section container">
        <div className="filters" role="group" aria-label="Filter by category">
          {[ALL, ...CATEGORIES].map((name) => (
            <button
              key={name}
              type="button"
              className={`chip ${name === ALL ? '' : plateClass(name)} ${name === category ? 'chip-active' : ''}`}
              aria-pressed={name === category}
              onClick={() => setCategory(name)}
            >
              {name !== ALL && <span className="plate-dot" aria-hidden="true" />}
              {name}
            </button>
          ))}
        </div>

        {loading && <Loading label="Loading sessions…" />}
        {error && <ErrorMessage error={error} onRetry={reload} />}
        {services && services.length === 0 && (
          <p className="empty">No sessions in this category yet. Try another type.</p>
        )}
        {services && services.length > 0 && (
          <div className="service-grid">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
