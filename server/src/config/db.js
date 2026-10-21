// Connects to MongoDB Atlas with Mongoose.
// The connection string is never printed, because it contains the password.

import mongoose from 'mongoose'
import { env } from './env.js'

const STATES = ['disconnected', 'connected', 'connecting', 'disconnecting']

export async function connectDB() {
  // Only allow queries on fields that exist in the schema.
  mongoose.set('strictQuery', true)

  await mongoose.connect(env.mongodbUri, {
    dbName: env.mongodbDbName,
    serverSelectionTimeoutMS: 10000,
  })

  console.log(`MongoDB connected (database: ${mongoose.connection.name})`)
}

export async function disconnectDB() {
  await mongoose.disconnect()
  console.log('MongoDB disconnected')
}

export function getDbStatus() {
  return STATES[mongoose.connection.readyState] ?? 'unknown'
}
