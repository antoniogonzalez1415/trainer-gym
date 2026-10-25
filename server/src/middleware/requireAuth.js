// Protects routes: requires "Authorization: Bearer <token>".
// The user id comes from the verified token, never from the request body.

import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { HttpError } from '../utils/HttpError.js'

export async function requireAuth(req, res, next) {
  const header = req.get('authorization') ?? ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'Log in to continue')
  }

  let payload
  try {
    payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] })
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Your session has expired. Log in again'
        : 'Log in to continue'
    throw new HttpError(401, message)
  }

  // The account must still exist
  const user = await User.findById(payload.sub)
  if (!user) {
    throw new HttpError(401, 'Log in to continue')
  }

  req.user = { id: user.id, name: user.name, email: user.email }
  next()
}
