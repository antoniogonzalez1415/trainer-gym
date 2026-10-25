import { Router } from 'express'
import {
  cancelBooking,
  createBooking,
  getBooking,
  listMyBookings,
  rescheduleBooking,
} from '../controllers/bookingController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

// Every booking route needs a logged-in customer
router.use(requireAuth)

router.post('/', createBooking)
router.get('/mine', listMyBookings)
router.get('/:id', getBooking)
router.patch('/:id', rescheduleBooking)
router.delete('/:id', cancelBooking)

export default router
