// Limits how often one IP address can call sensitive routes.
// Slows down password guessing and protects the AI budget.

import rateLimit from 'express-rate-limit'

function limiter(limit, windowMinutes, message) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message },
  })
}

export const authLimiter = limiter(30, 15, 'Too many login attempts. Wait a few minutes and try again.')

export const aiLimiter = limiter(15, 15, 'Too many suggestions requested. Wait a few minutes and try again.')
