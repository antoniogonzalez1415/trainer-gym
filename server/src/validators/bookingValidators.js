import { SLUG_PATTERN, getBody, onlyAllow, throwIfErrors } from './common.js'

const NOTES_MAX = 200

export function validateCreateBooking(req) {
  const body = getBody(req)
  // user, status, price, etc. are set by the server, never by the client
  onlyAllow(body, ['serviceId', 'startsAt', 'notes'])
  const details = []

  const serviceId = typeof body.serviceId === 'string' ? body.serviceId.trim() : ''
  if (!SLUG_PATTERN.test(serviceId)) {
    details.push({ field: 'serviceId', message: 'Choose a session to book' })
  }

  if (typeof body.startsAt !== 'string' || !body.startsAt) {
    details.push({ field: 'startsAt', message: 'Choose a date and a start time' })
  }

  let notes = ''
  if (body.notes !== undefined) {
    if (typeof body.notes !== 'string' || body.notes.trim().length > NOTES_MAX) {
      details.push({ field: 'notes', message: `Notes must have at most ${NOTES_MAX} characters` })
    } else {
      notes = body.notes.trim()
    }
  }

  throwIfErrors(details)
  return { serviceId, startsAt: body.startsAt, notes }
}

export function validateReschedule(req) {
  const body = getBody(req)
  // Only the time can change. Status changes go through DELETE (cancel).
  onlyAllow(body, ['startsAt'])
  if (typeof body.startsAt !== 'string' || !body.startsAt) {
    throwIfErrors([{ field: 'startsAt', message: 'Choose a new date and start time' }])
  }
  return { startsAt: body.startsAt }
}
