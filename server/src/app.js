// Builds the Express application: security headers, CORS, JSON parsing,
// routes, and error handling. Starting the server happens in server.js.

import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import aiRoutes from './routes/aiRoutes.js'
import authRoutes from './routes/authRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'

const app = express()

// Hosting platforms like Render sit behind one proxy. This lets rate limits
// see the visitor's real IP address instead of the proxy's.
app.set('trust proxy', 1)

// Safe default HTTP headers (also hides the "X-Powered-By: Express" header)
app.use(helmet())

// Only our React frontend may call this API from a browser
app.use(cors({ origin: env.clientOrigins }))

// Read JSON request bodies, with a small size limit
app.use(express.json({ limit: '10kb' }))

// Routes
app.use('/api/health', healthRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/ai', aiRoutes)

// Must be last: unknown routes, then errors
app.use(notFound)
app.use(errorHandler)

export default app
