// Small helpers for checking request input at the API boundary.
// Mongoose schemas check the shape of stored documents; these check what
// a client sent, and only let approved fields through.

import mongoose from 'mongoose'
import { HttpError } from '../utils/HttpError.js'

export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

export function getBody(req) {
  const body = req.body
  if (body === undefined) return {}
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new HttpError(400, 'Request body must be a JSON object')
  }
  return body
}

// Rejects fields the endpoint does not accept (blocks mass assignment)
export function onlyAllow(body, allowed) {
  const extra = Object.keys(body).filter((key) => !allowed.includes(key))
  if (extra.length > 0) {
    throw new HttpError(
      400,
      'Validation failed',
      extra.map((field) => ({ field, message: `${field} cannot be set` })),
    )
  }
}

export function throwIfErrors(details) {
  if (details.length > 0) {
    throw new HttpError(400, 'Validation failed', details)
  }
}

export function assertObjectId(value, label) {
  if (typeof value !== 'string' || !/^[a-f0-9]{24}$/i.test(value) || !mongoose.isValidObjectId(value)) {
    throw new HttpError(400, `${label} id is not valid`)
  }
}
