// Reads environment variables in one place and stops early if a required one is missing.
// In development, Node loads them from the .env file (see "dev" in package.json).
// In production, the hosting platform provides them.

const REQUIRED = ['MONGODB_URI']

const missing = REQUIRED.filter((name) => !process.env[name])
if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(', ')}`)
  console.error('Create server/.env from server/.env.example and fill them in.')
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
}

export const isProduction = env.nodeEnv === 'production'
