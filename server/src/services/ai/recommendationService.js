// The one place the rest of the app calls for recommendations.
// Provider code stays behind this function, so switching providers only
// changes this folder. Goals are never stored or logged.

import { env } from '../../config/env.js'
import { Service } from '../../models/Service.js'
import { askGemini } from './geminiProvider.js'
import { recommendByKeywords } from './keywordRecommender.js'

const MAX_RECOMMENDATIONS = 3
const MAX_REASON_LENGTH = 200
const MAX_SUMMARY_LENGTH = 300

function clean(text, maxLength) {
  return typeof text === 'string' ? text.trim().slice(0, maxLength) : ''
}

// Keeps only well-formed items that point to real, active sessions
function validateRecommendations(items, servicesBySlug) {
  if (!Array.isArray(items)) return []
  const seen = new Set()
  const valid = []

  for (const item of items) {
    const slug = item?.serviceId
    const reason = clean(item?.reason, MAX_REASON_LENGTH)
    if (!servicesBySlug.has(slug) || seen.has(slug) || !reason) continue
    seen.add(slug)
    valid.push({ serviceId: slug, reason })
    if (valid.length === MAX_RECOMMENDATIONS) break
  }
  return valid
}

async function askProvider(goal, services) {
  if (env.ai.provider === 'gemini') {
    return askGemini(goal, services)
  }
  throw new Error(`AI provider "${env.ai.provider}" is not supported`)
}

export async function recommendServices(goal) {
  const services = await Service.find({ isActive: true }).lean()
  const servicesBySlug = new Map(services.map((service) => [service.slug, service]))

  let source = 'fallback'
  let summary = ''
  let recommendations = []

  if (env.ai.apiKey && services.length > 0) {
    const started = Date.now()
    try {
      const answer = await askProvider(goal, services)
      recommendations = validateRecommendations(answer.recommendations, servicesBySlug)
      summary = clean(answer.summary, MAX_SUMMARY_LENGTH)
      source = 'ai'
      console.log(`AI recommendation ok in ${Date.now() - started} ms (${recommendations.length} results)`)
    } catch (error) {
      // Safe log: error name and message only, never the goal or the key
      console.warn(`AI provider unavailable (${error.name}: ${error.message}). Using keyword matching.`)
    }
  }

  if (source === 'fallback') {
    recommendations = recommendByKeywords(goal, services)
  }

  if (!summary) {
    summary =
      recommendations.length > 0
        ? 'These sessions fit what you described.'
        : 'No session matches that goal yet. Try describing it differently, or start with a Fitness Assessment.'
  }

  // Attach real facts from MongoDB, never facts written by the model
  return {
    source,
    summary,
    recommendations: recommendations.map(({ serviceId, reason }) => {
      const service = servicesBySlug.get(serviceId)
      return {
        serviceId,
        name: service.name,
        durationMinutes: service.durationMinutes,
        price: service.price,
        reason,
      }
    }),
  }
}
