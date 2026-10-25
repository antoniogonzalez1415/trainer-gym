import { Link } from 'react-router'
import GoalAssistant from '../components/GoalAssistant.jsx'
import { ErrorMessage, Loading } from '../components/LoadState.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { useApi } from '../hooks/useApi.js'
import { CATEGORIES, plateClass } from '../utils/categories.js'

export default function Home() {
  const { data: services, loading, error, reload } = useApi('/services')

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>Train with a plan, not a guess.</h1>
            <p className="hero-lead">
              One-on-one sessions with coaches who write down what you did and what comes next. Tell
              us your goal and we will point you to the right session.
            </p>
            <div className="hero-actions">
              <Link to="/services" className="button button-primary button-large">
                Browse sessions
              </Link>
              <Link to="/register" className="button button-on-dark button-large">
                Create account
              </Link>
            </div>
            <ul className="plate-legend" aria-label="Session types">
              {CATEGORIES.map((category) => (
                <li key={category} className={plateClass(category)}>
                  <span className="plate-dot" aria-hidden="true" />
                  {category}
                </li>
              ))}
            </ul>
          </div>
          <GoalAssistant />
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <h2>Popular sessions</h2>
          <Link to="/services" className="text-link">
            See all sessions
          </Link>
        </div>
        {loading && <Loading label="Loading sessions…" />}
        {error && <ErrorMessage error={error} onRetry={reload} />}
        {services && (
          <div className="service-grid">
            {services.slice(0, 3).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>

      <section className="steps-band">
        <div className="container">
          <h2>How booking works</h2>
          <ol className="steps">
            <li>
              <h3>Pick a session</h3>
              <p>Compare length, level and price, or describe your goal and get a suggestion.</p>
            </li>
            <li>
              <h3>Choose a time</h3>
              <p>Sessions start on the hour between 6:00 and 19:00, Chicago time.</p>
            </li>
            <li>
              <h3>Manage it anytime</h3>
              <p>Reschedule or cancel from My bookings until the session starts.</p>
            </li>
          </ol>
        </div>
      </section>
    </>
  )
}
