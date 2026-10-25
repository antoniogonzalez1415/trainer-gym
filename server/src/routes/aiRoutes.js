import { Router } from 'express'
import { recommendService } from '../controllers/aiController.js'
import { aiLimiter } from '../middleware/rateLimits.js'

const router = Router()

router.post('/recommend-service', aiLimiter, recommendService)

export default router
