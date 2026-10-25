// POST /api/ai/recommend-service
// Open to visitors (the assistant is on the home page), protected by a rate limit.

import { recommendServices } from '../services/ai/recommendationService.js'
import { getBody, onlyAllow, throwIfErrors } from '../validators/common.js'

export const GOAL_MIN_LENGTH = 5
export const GOAL_MAX_LENGTH = 300

const DISCLAIMER =
  'Suggestions are informational. Check the session details before booking, and talk to a doctor first if you have an injury or health condition. Please do not include personal or medical details.'

export async function recommendService(req, res) {
  const body = getBody(req)
  onlyAllow(body, ['goal'])

  const goal = typeof body.goal === 'string' ? body.goal.trim() : ''
  if (goal.length < GOAL_MIN_LENGTH || goal.length > GOAL_MAX_LENGTH) {
    throwIfErrors([
      {
        field: 'goal',
        message: `Describe your goal in ${GOAL_MIN_LENGTH} to ${GOAL_MAX_LENGTH} characters`,
      },
    ])
  }

  const result = await recommendServices(goal)
  res.json({ ...result, disclaimer: DISCLAIMER })
}
