// GET /api/health
// Lets us (and later the hosting platform) check that the API and database are up.

import { getDbStatus } from '../config/db.js'

export function getHealth(req, res) {
  const database = getDbStatus()
  const healthy = database === 'connected'

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'unavailable',
    database,
    uptimeSeconds: Math.round(process.uptime()),
  })
}
