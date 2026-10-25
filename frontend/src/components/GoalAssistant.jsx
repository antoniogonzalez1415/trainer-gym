// The "coach's board": the visitor writes a goal and gets up to three sessions.
// Calls POST /api/ai/recommend-service. The backend asks the AI provider,
// checks every suggestion against real sessions, and falls back to keyword
// matching if the AI is unavailable. Suggestions never book anything.

import { useState } from 'react'
import { Link } from 'react-router'
import { apiRequest, errorText } from '../api/client.js'

const GOAL_MIN_LENGTH = 5
const GOAL_MAX_LENGTH = 300

export default function GoalAssistant() {
  const [goal, setGoal] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function requestSuggestions() {
    setStatus('loading')
    setError('')
    try {
      const data = await apiRequest('/ai/recommend-service', {
        method: 'POST',
        body: { goal: goal.trim() },
      })
      setResult(data)
      setStatus('done')
    } catch (requestError) {
      setError(errorText(requestError))
      setResult(null)
      setStatus('error')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (goal.trim().length < GOAL_MIN_LENGTH) {
      setError('Write a few words about your goal, for example "get stronger for hiking".')
      setResult(null)
      setStatus('error')
      return
    }
    requestSuggestions()
  }

  const loading = status === 'loading'

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
          aria-describedby="goal-count goal-help goal-error"
        />
        <p id="goal-help" className="board-help">
          Describe your goal, not personal or medical details.
        </p>
        <div className="board-actions">
          <span id="goal-count" className="muted">
            {goal.length}/{GOAL_MAX_LENGTH}
          </span>
          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Thinking…' : 'Suggest sessions'}
          </button>
        </div>
        <div id="goal-error" className="form-error" role="alert">
          {status === 'error' && error && (
            <>
              {error}{' '}
              {goal.trim().length >= GOAL_MIN_LENGTH && (
                <button type="button" className="link-button" onClick={requestSuggestions}>
                  Try again
                </button>
              )}
            </>
          )}
        </div>
      </form>

      <div aria-live="polite">
        {loading && <p className="muted">Finding sessions that fit your goal…</p>}

        {status === 'done' && result && (
          <div className="board-results">
            <p className="board-summary">
              {result.summary}{' '}
              <span className="source-tag">
                {result.source === 'ai' ? 'Suggested by AI' : 'Matched by keywords'}
              </span>
            </p>

            {result.recommendations.length === 0 ? (
              <p>
                Try describing it differently, or start with a{' '}
                <Link to="/services/fitness-assessment">Fitness Assessment</Link>.
              </p>
            ) : (
              <ol className="suggestions">
                {result.recommendations.map((recommendation) => (
                  <li key={recommendation.serviceId}>
                    <Link to={`/services/${recommendation.serviceId}`}>{recommendation.name}</Link>
                    <span className="muted">
                      {' '}
                      {recommendation.durationMinutes} min, ${recommendation.price}
                    </span>
                    <p>{recommendation.reason}</p>
                  </li>
                ))}
              </ol>
            )}
            <p className="board-note">{result.disclaimer}</p>
          </div>
        )}
      </div>
    </section>
  )
}
