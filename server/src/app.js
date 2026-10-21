// Builds the Express application: security headers, CORS, JSON parsing,
// routes, and error handling. Starting the server happens in server.js.

import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import healthRoutes from './routes/healthRoutes.js'

const app = express()

// Safe default HTTP headers (also hides the "X-Powered-By: Express" header)
app.use(helmet())

// Only our React frontend may call this API from a browser
app.use(cors({ origin: env.clientOrigins }))

// Read JSON request bodies, with a small size limit
app.use(express.json({ limit: '10kb' }))

// Routes
app.use('/api/health', healthRoutes)

// Must be last: unknown routes, then errors
app.use(notFound)
app.use(errorHandler)

export default app
