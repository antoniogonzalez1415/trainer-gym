import { Router } from 'express'
import { getMe, login, register } from '../controllers/authController.js'
import { authLimiter } from '../middleware/rateLimits.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.get('/me', requireAuth, getMe)

export default router
