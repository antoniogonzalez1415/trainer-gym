// Booking business rules that need the current time or other bookings.
// Kept out of the controller so they are easy to read and explain.

import { env } from '../config/env.js'
import { Booking } from '../models/Booking.js'
import { HttpError } from '../utils/HttpError.js'

const { timeZone, firstStartHour, lastStartHour, maxDaysAhead } = env.studio

const studioClock = new Intl.DateTimeFormat('en-US', {
  timeZone,
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
})

function studioHourAndMinute(date) {
  const parts = studioClock.formatToParts(date)
  return {
    hour: Number(parts.find((part) => part.type === 'hour').value),
    minute: Number(parts.find((part) => part.type === 'minute').value),
  }
}

function invalidTime(message) {
  return new HttpError(400, 'Validation failed', [{ field: 'startsAt', message }])
}

// Turns the ISO 8601 string from the client into a Date and checks the rules
export function parseStartTime(value) {
  const startsAt = new Date(value)
  if (Number.isNaN(startsAt.getTime())) {
    throw invalidTime('Start time must be an ISO 8601 date, like 2026-10-30T15:00:00.000Z')
  }

  const now = Date.now()
  if (startsAt.getTime() <= now) {
    throw invalidTime('That time has already passed. Choose a later time')
  }

  if (startsAt.getTime() > now + maxDaysAhead * 24 * 60 * 60 * 1000) {
    throw invalidTime(`Book at most ${maxDaysAhead} days ahead`)
  }

  const { hour, minute } = studioHourAndMinute(startsAt)
  if (minute !== 0 || startsAt.getUTCSeconds() !== 0 || startsAt.getUTCMilliseconds() !== 0) {
    throw invalidTime('Sessions start on the hour, like 9:00')
  }

  if (hour < firstStartHour || hour > lastStartHour) {
    throw invalidTime(
      `Sessions start between ${firstStartHour}:00 and ${lastStartHour}:00 (${timeZone} time)`,
    )
  }

  return startsAt
}

export function endTime(startsAt, durationMinutes) {
  return new Date(startsAt.getTime() + durationMinutes * 60 * 1000)
}

// A coach cannot teach two overlapping sessions, and a customer cannot
// attend two. Two time ranges overlap when each starts before the other ends.
// Note: two requests at the exact same moment could both pass this check.
// A production system would add a transaction or unique time-slot index.
export async function assertNoConflicts({ userId, coach, startsAt, endsAt, excludeId }) {
  const overlap = {
    status: 'confirmed',
    startsAt: { $lt: endsAt },
    endsAt: { $gt: startsAt },
  }
  if (excludeId) {
    overlap._id = { $ne: excludeId }
  }

  const [coachBusy, customerBusy] = await Promise.all([
    Booking.exists({ ...overlap, coach }),
    Booking.exists({ ...overlap, user: userId }),
  ])

  if (coachBusy) {
    throw new HttpError(409, 'That time is already booked. Choose another time')
  }
  if (customerBusy) {
    throw new HttpError(409, 'You already have a session at that time')
  }
}

// Only upcoming, confirmed bookings can be rescheduled or cancelled
export function assertChangeable(booking) {
  if (booking.status !== 'confirmed') {
    throw new HttpError(409, 'This booking is cancelled and cannot be changed')
  }
  if (booking.startsAt.getTime() <= Date.now()) {
    throw new HttpError(409, 'This session has already started or finished')
  }
}
