// Each category uses the color of a competition weight plate,
// so a session's color tells you its type at a glance.
export const CATEGORY_COLORS = {
  Strength: 'red',
  Cardio: 'blue',
  Flexibility: 'yellow',
  Mobility: 'green',
  Running: 'black',
  Assessment: 'white',
}

export const CATEGORIES = Object.keys(CATEGORY_COLORS)

export function plateClass(category) {
  return `plate-${CATEGORY_COLORS[category] ?? 'black'}`
}
