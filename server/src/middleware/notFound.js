// Runs when no route matched the request.

import { HttpError } from '../utils/HttpError.js'

export function notFound(req, res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}
