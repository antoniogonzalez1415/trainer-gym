// The "coach's board": the visitor writes a goal and gets up to three sessions.
// Today it uses keyword matching. On day 4 it calls POST /api/ai/recommend-service.

import { useState } from 'react'
import { Link } from 'react-router'
import { getServiceById } from '../data/services.js'
import { GOAL_MAX_LENGTH, recommendByKeywords } from '../utils/recommend.js'

export default function GoalAssistant() {
  const [goal, setGoal] = useState('')
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = goal.trim()

    if (trimmed.length < 5) {
      setError('Write a few words about your goal, for example "get stronger for hiking".')
      setResults(null)
      return
    }

    setError('')
    setResults(recommendByKeywords(trimmed))
  }

  return (
    <section className="board" aria-labelledby="board-title">
      <h2 id="board-title" className="board-title">
        What are you training for?
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="goal" className="visually-hidden">
          Your training goal
        </label>
        <textarea
          id="goal"
          rows="3"
          maxLength={GOAL_MAX_LENGTH}
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          placeholder="I sit at a desk all day and want to feel less stiff"
          aria-describedby="goal-count goal-error"
        />
        <div className="board-actions">
          <span id="goal-count" className="muted">
            {goal.length}/{GOAL_MAX_LENGTH}
          </span>
          <button type="submit" className="button button-primary">
            Suggest sessions
          </button>
        </div>
        <p id="goal-error" className="form-error" role="alert">
          {error}
        </p>
      </form>

      {results && (
        <div className="board-results" aria-live="polite">
          {results.length === 0 ? (
            <p>
              No session matches that goal yet. Try describing it differently, or start with a{' '}
              <Link to="/services/fitness-assessment">Fitness Assessment</Link>.
            </p>
          ) : (
            <ol className="suggestions">
              {results.map((result) => {
                const service = getServiceById(result.serviceId)
                return (
                  <li key={result.serviceId}>
                    <Link to={`/services/${service.id}`}>{service.name}</Link>
                    <span className="muted">
                      {' '}
                      {service.durationMinutes} min, ${service.price}
                    </span>
                    <p>{result.reason}</p>
                  </li>
                )
              })}
            </ol>
          )}
          <p className="board-note">
            Suggestions are a starting point. Check the session details before booking, and talk
            to a doctor first if you have an injury or health condition.
          </p>
        </div>
      )}
    </section>
  )
}
