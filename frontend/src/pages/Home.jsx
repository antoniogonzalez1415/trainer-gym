import { Link } from 'react-router'
import GoalAssistant from '../components/GoalAssistant.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import { services } from '../data/services.js'

export default function Home() {
  const featured = services.slice(0, 3)

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>Train with a plan, not a guess.</h1>
            <p className="lead">
              One-on-one sessions with coaches who write down what you did and what comes next.
              Tell us your goal and we will point you to the right session.
            </p>
            <div className="hero-actions">
              <Link to="/services" className="button button-primary button-large">
                Browse sessions
              </Link>
              <Link to="/register" className="button button-ghost button-large">
                Create account
              </Link>
            </div>
          </div>
          <GoalAssistant />
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <h2>Popular sessions</h2>
          <Link to="/services">See all sessions</Link>
        </div>
        <div className="service-grid">
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <section className="section container">
        <h2>How booking works</h2>
        <ol className="steps">
          <li>
            <h3>Pick a session</h3>
            <p>Compare length, level and price, or ask the board above for a suggestion.</p>
          </li>
          <li>
            <h3>Choose a time</h3>
            <p>Sessions start on the hour between 6:00 and 19:00.</p>
          </li>
          <li>
            <h3>Manage it anytime</h3>
            <p>Reschedule or cancel from My bookings.</p>
          </li>
        </ol>
      </section>
    </>
  )
}
