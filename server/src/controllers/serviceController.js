// GET /api/services and GET /api/services/:id
// The public id of a service is its slug, so URLs read /services/yoga-flow.

import { SERVICE_CATEGORIES, Service } from '../models/Service.js'
import { HttpError } from '../utils/HttpError.js'
import { SLUG_PATTERN } from '../validators/common.js'

export function toServiceResponse(service) {
  return {
    id: service.slug,
    name: service.name,
    category: service.category,
    level: service.level,
    coach: service.coach,
    durationMinutes: service.durationMinutes,
    price: service.price,
    summary: service.summary,
    description: service.description,
    includes: service.includes,
  }
}

export async function listServices(req, res) {
  const filter = { isActive: true }

  const { category } = req.query
  if (category !== undefined) {
    if (typeof category !== 'string' || !SERVICE_CATEGORIES.includes(category)) {
      throw new HttpError(400, 'Validation failed', [
        { field: 'category', message: `Category must be one of: ${SERVICE_CATEGORIES.join(', ')}` },
      ])
    }
    filter.category = category
  }

  const services = await Service.find(filter).sort({ name: 1 })
  res.json(services.map(toServiceResponse))
}

export async function getService(req, res) {
  const { id } = req.params
  const service = SLUG_PATTERN.test(id) ? await Service.findOne({ slug: id, isActive: true }) : null

  if (!service) {
    throw new HttpError(404, 'Session not found')
  }
  res.json(toServiceResponse(service))
}
