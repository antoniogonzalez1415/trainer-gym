// A Fit Trainer customer account.
// The real password is never stored: only its bcrypt hash (added on the auth step).

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must have at least 2 characters'],
      maxlength: [60, 'Name must have at most 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [254, 'Email is too long'],
      match: [/^\S+@\S+\.\S+$/, 'Email is not valid'],
      // Supports login lookups and blocks duplicate accounts
      unique: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      // Left out of normal queries; login asks for it explicitly
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      // Never send the hash to the frontend, even if it was selected
      transform(doc, ret) {
        delete ret.passwordHash
        return ret
      },
    },
  },
)

export const User = mongoose.model('User', userSchema)
