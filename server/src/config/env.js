// Reads environment variables in one place and stops early if a required one is missing.
// In development, Node loads them from the .env file (see "dev" in package.json).
// In production, the hosting platform provides them.
// Values are never printed, only variable names.

const REQUIRED = ['MONGODB_URI', 'JWT_SECRET']

const missing = REQUIRED.filter((name) => !process.env[name])
if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(', ')}`)
  console.error('Create server/.env from server/.env.example and fill them in.')
  process.exit(1)
}

if (process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters long.')
  process.exit(1)
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  mongodbDbName: process.env.MONGODB_DB_NAME ?? 'fit_trainer',
  clientOrigins: (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  studio: {
    timeZone: process.env.STUDIO_TIMEZONE ?? 'America/Chicago',
    firstStartHour: 6,
    lastStartHour: 19,
    maxDaysAhead: 180,
  },
  ai: {
    provider: process.env.AI_PROVIDER ?? 'gemini',
    model: process.env.AI_MODEL ?? 'gemini-3.5-flash-lite',
    // Optional: without a key, the assistant uses keyword matching only
    apiKey: process.env.AI_API_KEY ?? '',
        timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 15000,
  },
}

export const isProduction = env.nodeEnv === 'production'
