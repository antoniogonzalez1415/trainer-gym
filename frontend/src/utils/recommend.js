// Simple keyword matching.
// Today it powers the goal assistant on the home page.
// On day 4 the AI recommendations come from the backend, and this stays as the
// fallback when the AI provider is unavailable.

import { services } from '../data/services.js'

export const GOAL_MAX_LENGTH = 300

export function recommendByKeywords(goalText) {
  const words = goalText.toLowerCase().match(/[a-z0-9]+/g) ?? []

  const scored = services
    .map((service) => {
      const matches = service.keywords.filter((keyword) => words.includes(keyword))
      return { service, matches }
    })
    .filter((entry) => entry.matches.length > 0)
    .sort((a, b) => b.matches.length - a.matches.length)
    .slice(0, 3)

  return scored.map(({ service, matches }) => ({
    serviceId: service.id,
    reason: `Matches what you said about ${matches.slice(0, 2).join(' and ')}.`,
  }))
}
