// Entry point: connect to MongoDB first, then start listening for requests.

import app from './app.js'
import { connectDB, disconnectDB } from './config/db.js'
import { env } from './config/env.js'

async function start() {
  try {
    await connectDB()
  } catch (error) {
    // The message explains the problem (wrong password, IP not allowed...)
    // without printing the connection string.
    console.error(`Could not connect to MongoDB: ${error.message}`)
    process.exit(1)
  }

  const server = app.listen(env.port, () => {
    console.log(`API ready on http://localhost:${env.port}/api/health`)
  })

  // Close cleanly when stopped with Ctrl + C or by the hosting platform
  function shutdown(signal) {
    console.log(`${signal} received, shutting down`)
    server.close(async () => {
      await disconnectDB()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

start()
