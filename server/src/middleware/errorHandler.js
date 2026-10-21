// The single place where errors become JSON responses.
// Users get a clear message; stack traces and internal details stay in the server log.

import { isProduction } from '../config/env.js'

// Express recognizes error middleware by its four parameters, so "next" must stay.
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, next) {
  // Body sent with Content-Type: application/json but not valid JSON
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' })
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body is too large' })
  }

  const statusCode = error.statusCode ?? 500

  if (statusCode >= 500) {
    console.error(`${req.method} ${req.originalUrl} failed:`, isProduction ? error.message : error)
    return res.status(500).json({ error: 'Something went wrong. Try again later.' })
  }

  const body = { error: error.message }
  if (error.details) {
    body.details = error.details
  }
  return res.status(statusCode).json(body)
}
