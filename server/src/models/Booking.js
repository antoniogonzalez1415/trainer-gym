// A customer's booking of one service at one time.
// serviceName, coach, durationMinutes and price are a copy taken when booking,
// so history stays correct if the service changes later.
// Business rules (future time, opening hours, conflicts) live in the booking
// service layer, because they need other documents and the current time.

import mongoose from 'mongoose'

export const BOOKING_STATUSES = ['confirmed', 'cancelled']

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service is required'],
    },

    // Copy of the service at booking time
    serviceName: { type: String, required: true, trim: true },
    coach: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 15, max: 180 },
    price: { type: Number, required: true, min: 0 },

    startsAt: { type: Date, required: [true, 'Start time is required'] },
    endsAt: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return value > this.startsAt
        },
        message: 'End time must be after start time',
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, 'Notes must have at most 200 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: { values: BOOKING_STATUSES, message: 'Status {VALUE} is not allowed' },
      default: 'confirmed',
    },
    cancelledAt: { type: Date },
  },
  { timestamps: true, versionKey: false },
)

// Supports "my bookings" sorted by date, and the customer's own overlap check
bookingSchema.index({ user: 1, startsAt: 1 })

// Supports the coach overlap check
bookingSchema.index({ coach: 1, startsAt: 1 })

export const Booking = mongoose.model('Booking', bookingSchema)
