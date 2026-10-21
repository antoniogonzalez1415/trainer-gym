// Checks the schema rules without connecting to MongoDB.
// Run with: npm run check:models
// Each case says whether the document should pass or fail validation.

import mongoose from 'mongoose'
import { Booking } from '../src/models/Booking.js'
import { Service } from '../src/models/Service.js'
import { User } from '../src/models/User.js'
import { services } from './data/services.js'

const validUser = { name: 'Test Customer', email: 'Test@Example.com', passwordHash: 'fake-hash' }
const start = new Date('2030-01-15T15:00:00.000Z')
const validBooking = {
  user: new mongoose.Types.ObjectId(),
  service: new mongoose.Types.ObjectId(),
  serviceName: 'Yoga Flow',
  coach: 'Priya Nair',
  durationMinutes: 60,
  price: 40,
  startsAt: start,
  endsAt: new Date(start.getTime() + 60 * 60 * 1000),
}

const cases = [
  { name: 'User: valid user', model: User, data: validUser, shouldPass: true },
  { name: 'User: invalid email', model: User, data: { ...validUser, email: 'not-an-email' }, shouldPass: false },
  { name: 'User: missing password hash', model: User, data: { ...validUser, passwordHash: undefined }, shouldPass: false },
  { name: 'User: one-letter name', model: User, data: { ...validUser, name: 'A' }, shouldPass: false },
  { name: 'Service: valid seed session', model: Service, data: services[0], shouldPass: true },
  { name: 'Service: old level "All levels"', model: Service, data: { ...services[0], level: 'All levels' }, shouldPass: false },
  { name: 'Service: slug with spaces', model: Service, data: { ...services[0], slug: 'Yoga Flow' }, shouldPass: false },
  { name: 'Service: negative price', model: Service, data: { ...services[0], price: -5 }, shouldPass: false },
  { name: 'Booking: valid booking', model: Booking, data: validBooking, shouldPass: true },
  { name: 'Booking: status "pending"', model: Booking, data: { ...validBooking, status: 'pending' }, shouldPass: false },
  { name: 'Booking: ends before it starts', model: Booking, data: { ...validBooking, endsAt: new Date(start.getTime() - 1000) }, shouldPass: false },
  { name: 'Booking: notes over 200 characters', model: Booking, data: { ...validBooking, notes: 'x'.repeat(201) }, shouldPass: false },
]

let failures = 0

for (const testCase of cases) {
  let error = null
  try {
    await new testCase.model(testCase.data).validate()
  } catch (validationError) {
    error = validationError
  }
  const passed = !error
  const ok = passed === testCase.shouldPass
  if (!ok) failures++
  const detail = error ? ` (${Object.values(error.errors ?? {})[0]?.message ?? error.message})` : ''
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${testCase.name}${detail}`)
}

// Extra checks on normalization and hidden fields
const user = new User(validUser)
const emailOk = user.email === 'test@example.com'
const hashHidden = !('passwordHash' in user.toJSON())
const defaultsOk = new Booking(validBooking).status === 'confirmed'
for (const [name, ok] of [
  ['User: email saved in lowercase', emailOk],
  ['User: password hash hidden from JSON', hashHidden],
  ['Booking: status defaults to confirmed', defaultsOk],
]) {
  if (!ok) failures++
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}`)
}

console.log(failures === 0 ? '\nAll model checks passed.' : `\n${failures} check(s) failed.`)
process.exitCode = failures === 0 ? 0 : 1
