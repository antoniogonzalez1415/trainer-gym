// Bookings for the logged-in customer.
// Every query includes { user: req.user.id }, so a customer can only ever
// reach their own bookings. Someone else's booking answers 404.

import { Booking } from '../models/Booking.js'
import { Service } from '../models/Service.js'
import {
  assertChangeable,
  assertNoConflicts,
  endTime,
  parseStartTime,
} from '../services/bookingRules.js'
import { HttpError } from '../utils/HttpError.js'
import { validateCreateBooking, validateReschedule } from '../validators/bookingValidators.js'
import { assertObjectId } from '../validators/common.js'

function toBookingResponse(booking) {
  return {
    id: booking.id,
    serviceId: booking.serviceSlug,
    serviceName: booking.serviceName,
    coach: booking.coach,
    durationMinutes: booking.durationMinutes,
    price: booking.price,
    startsAt: booking.startsAt.toISOString(),
    endsAt: booking.endsAt.toISOString(),
    notes: booking.notes,
    status: booking.status,
    createdAt: booking.createdAt.toISOString(),
  }
}

async function findOwnBooking(req) {
  assertObjectId(req.params.id, 'Booking')
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id })
  if (!booking) {
    throw new HttpError(404, 'Booking not found')
  }
  return booking
}

// POST /api/bookings
export async function createBooking(req, res) {
  const input = validateCreateBooking(req)

  const service = await Service.findOne({ slug: input.serviceId, isActive: true })
  if (!service) {
    throw new HttpError(404, 'Session not found')
  }

  const startsAt = parseStartTime(input.startsAt)
  const endsAt = endTime(startsAt, service.durationMinutes)

  await assertNoConflicts({ userId: req.user.id, coach: service.coach, startsAt, endsAt })

  const booking = await Booking.create({
    user: req.user.id,
    service: service._id,
    serviceSlug: service.slug,
    serviceName: service.name,
    coach: service.coach,
    durationMinutes: service.durationMinutes,
    price: service.price,
    startsAt,
    endsAt,
    notes: input.notes,
  })

  res.status(201).json(toBookingResponse(booking))
}

// GET /api/bookings/mine
export async function listMyBookings(req, res) {
  const bookings = await Booking.find({ user: req.user.id }).sort({ startsAt: 1 }).limit(200)
  res.json(bookings.map(toBookingResponse))
}

// GET /api/bookings/:id
export async function getBooking(req, res) {
  const booking = await findOwnBooking(req)
  res.json(toBookingResponse(booking))
}

// PATCH /api/bookings/:id  (reschedule)
export async function rescheduleBooking(req, res) {
  const input = validateReschedule(req)
  const booking = await findOwnBooking(req)
  assertChangeable(booking)

  const startsAt = parseStartTime(input.startsAt)
  const endsAt = endTime(startsAt, booking.durationMinutes)

  await assertNoConflicts({
    userId: req.user.id,
    coach: booking.coach,
    startsAt,
    endsAt,
    excludeId: booking._id,
  })

  booking.startsAt = startsAt
  booking.endsAt = endsAt
  await booking.save()

  res.json(toBookingResponse(booking))
}

// DELETE /api/bookings/:id  (cancel: keeps the record, changes its status)
export async function cancelBooking(req, res) {
  const booking = await findOwnBooking(req)
  assertChangeable(booking)

  booking.status = 'cancelled'
  booking.cancelledAt = new Date()
  await booking.save()

  res.json(toBookingResponse(booking))
}
