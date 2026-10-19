// Holds the logged-in user's bookings.
// TEMPORARY: bookings live in the browser only.
// On day 3 these functions call the backend (/api/bookings) and MongoDB stores them.

import { createContext, useContext, useState } from 'react'

const BookingsContext = createContext(null)
const STORAGE_KEY = 'fit-trainer-bookings'

function readStoredBookings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function storeBookings(bookings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  } catch {
    // Storage can be blocked (private windows). The app still works for this visit.
  }
}

export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState(readStoredBookings)

  function saveBookings(nextBookings) {
    setBookings(nextBookings)
    storeBookings(nextBookings)
  }

  // Returns an error message, or null when the booking was saved.
  function createBooking({ service, userEmail, startsAt, notes }) {
    const taken = bookings.some(
      (booking) =>
        booking.serviceId === service.id &&
        booking.startsAt === startsAt &&
        booking.status !== 'cancelled',
    )
    if (taken) {
      return 'That time is already booked. Choose another time.'
    }

    const booking = {
      id: crypto.randomUUID(),
      userEmail,
      serviceId: service.id,
      serviceName: service.name,
      durationMinutes: service.durationMinutes,
      price: service.price,
      startsAt,
      notes,
      status: 'confirmed',
    }
    saveBookings([...bookings, booking])
    return null
  }

  function rescheduleBooking(bookingId, startsAt) {
    const current = bookings.find((booking) => booking.id === bookingId)
    const taken = bookings.some(
      (booking) =>
        booking.id !== bookingId &&
        booking.serviceId === current?.serviceId &&
        booking.startsAt === startsAt &&
        booking.status !== 'cancelled',
    )
    if (taken) {
      return 'That time is already booked. Choose another time.'
    }

    saveBookings(
      bookings.map((booking) => (booking.id === bookingId ? { ...booking, startsAt } : booking)),
    )
    return null
  }

  function cancelBooking(bookingId) {
    saveBookings(
      bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking,
      ),
    )
  }

  return (
    <BookingsContext.Provider
      value={{ bookings, createBooking, rescheduleBooking, cancelBooking }}
    >
      {children}
    </BookingsContext.Provider>
  )
}

export function useBookings() {
  return useContext(BookingsContext)
}
