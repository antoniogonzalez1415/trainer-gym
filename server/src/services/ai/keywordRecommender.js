// Non-AI fallback: matches words in the goal against each session's keywords.
// Used when no AI key is set, or when the AI provider fails or times out.

export function recommendByKeywords(goal, services) {
  const words = new Set(goal.toLowerCase().match(/[a-z0-9]+/g) ?? [])

  return services
    .map((service) => ({
      service,
      matches: service.keywords.filter((keyword) => words.has(keyword)),
    }))
    .filter((entry) => entry.matches.length > 0)
    .sort((a, b) => b.matches.length - a.matches.length)
    .slice(0, 3)
    .map(({ service, matches }) => ({
      serviceId: service.slug,
      reason: `Matches what you said about ${matches.slice(0, 2).join(' and ')}.`,
    }))
}
