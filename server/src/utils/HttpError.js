// An error that carries the HTTP status code to send back.
// Example: throw new HttpError(404, 'Service not found')

export class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.details = details
  }
}
