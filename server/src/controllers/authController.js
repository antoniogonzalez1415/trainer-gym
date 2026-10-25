// POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
// Logout: tokens are stateless, so the frontend logs out by deleting its token.

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { HttpError } from '../utils/HttpError.js'
import { validateLogin, validateRegister } from '../validators/authValidators.js'

const SALT_ROUNDS = 12

// Compared against when the email does not exist, so a wrong email takes
// as long as a wrong password and response time does not reveal accounts.
const dummyHashPromise = bcrypt.hash('not-a-real-password', SALT_ROUNDS)

function toUserResponse(user) {
  return { id: user.id, name: user.name, email: user.email }
}

function signToken(user) {
  return jwt.sign({ sub: user.id }, env.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: env.jwtExpiresIn,
  })
}

export async function register(req, res) {
  const { name, email, password } = validateRegister(req)

  if (await User.exists({ email })) {
    throw new HttpError(409, 'An account with this email already exists. Log in instead.')
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  let user
  try {
    user = await User.create({ name, email, passwordHash })
  } catch (error) {
    // Two sign-ups with the same email at the same moment
    if (error.code === 11000) {
      throw new HttpError(409, 'An account with this email already exists. Log in instead.')
    }
    throw error
  }

  res.status(201).json({ token: signToken(user), user: toUserResponse(user) })
}

export async function login(req, res) {
  const { email, password } = validateLogin(req)

  const user = await User.findOne({ email }).select('+passwordHash')
  const hash = user ? user.passwordHash : await dummyHashPromise
  const matches = await bcrypt.compare(password, hash)

  if (!user || !matches) {
    // Same message for both cases, so it does not reveal which emails exist
    throw new HttpError(401, 'Email or password is incorrect')
  }

  res.json({ token: signToken(user), user: toUserResponse(user) })
}

export function getMe(req, res) {
  res.json({ user: req.user })
}
