// A training session customers can book, such as Yoga Flow.

import mongoose from 'mongoose'

export const SERVICE_CATEGORIES = [
  'Strength',
  'Cardio',
  'Mobility',
  'Flexibility',
  'Running',
  'Assessment',
]

export const SERVICE_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

const serviceSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug may only use lowercase letters, numbers and dashes'],
      // Supports GET /api/services/:slug
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name must have at most 80 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: SERVICE_CATEGORIES, message: 'Category {VALUE} is not allowed' },
    },
    level: {
      type: String,
      required: [true, 'Level is required'],
      enum: { values: SERVICE_LEVELS, message: 'Level {VALUE} is not allowed' },
    },
    coach: {
      type: String,
      required: [true, 'Coach is required'],
      trim: true,
      maxlength: [60, 'Coach must have at most 60 characters'],
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [15, 'Duration must be at least 15 minutes'],
      max: [180, 'Duration must be at most 180 minutes'],
      validate: { validator: Number.isInteger, message: 'Duration must be a whole number' },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
      maxlength: [140, 'Summary must have at most 140 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description must have at most 1000 characters'],
    },
    includes: { type: [String], default: [] },
    // Words the recommendation assistant matches against a customer's goal
    keywords: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
)

// Supports the session list: active sessions, optionally filtered by category
serviceSchema.index({ isActive: 1, category: 1 })

export const Service = mongoose.model('Service', serviceSchema)
