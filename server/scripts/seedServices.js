// Loads the Fit Trainer sessions into MongoDB.
// Run on purpose with: npm run seed
//
// Safe to run more than once: each session is matched by its slug and
// added if missing or updated if it exists. Nothing is deleted, so
// bookings that point to a session keep working.
// It never runs on its own when the server starts.

import { connectDB, disconnectDB } from '../src/config/db.js'
import { env } from '../src/config/env.js'
import { Booking } from '../src/models/Booking.js'
import { Service } from '../src/models/Service.js'
import { User } from '../src/models/User.js'
import { services } from './data/services.js'

if (env.nodeEnv === 'production' && !process.argv.includes('--allow-production')) {
  console.error('NODE_ENV is production. Re-run with --allow-production if you really mean it.')
  process.exit(1)
}

// Check every session against the schema before touching the database
for (const service of services) {
  try {
    await new Service(service).validate()
  } catch (error) {
    console.error(`Seed data for "${service.slug}" is not valid: ${error.message}`)
    process.exit(1)
  }
}

console.log(`Seeding ${services.length} services into "${env.mongodbDbName}".`)
console.log('Sessions with the same slug are updated. Nothing is deleted.')

try {
  await connectDB()

  // Create the three collections and their indexes if they do not exist yet
  await Promise.all([User.init(), Service.init(), Booking.init()])

  const result = await Service.bulkWrite(
    services.map((service) => ({
      updateOne: {
        filter: { slug: service.slug },
        update: { $set: service },
        upsert: true,
      },
    })),
  )

  const unchanged = services.length - result.upsertedCount - result.modifiedCount
  console.log(
    `Done: ${result.upsertedCount} added, ${result.modifiedCount} updated, ${unchanged} unchanged.`,
  )
} catch (error) {
  console.error(`Seed failed: ${error.message}`)
  process.exitCode = 1
} finally {
  await disconnectDB()
}
