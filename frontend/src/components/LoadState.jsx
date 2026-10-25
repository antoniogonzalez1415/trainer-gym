import { errorText } from '../api/client.js'

export function Loading({ label = 'Loading…' }) {
  return (
    <p className="loading" role="status">
      {label}
    </p>
  )
}

export function ErrorMessage({ error, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <p>{errorText(error)}</p>
      {onRetry && (
        <button type="button" className="button button-ghost" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
