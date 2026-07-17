import { Router } from 'express'
import { updateLocation, getTracking } from '../controllers/trackingController'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/roles'
import { UserRole } from '../entities/User'

const router = Router()

router.post('/location', authenticate, authorize(UserRole.DELIVERY_AGENT), updateLocation)
router.get('/:orderId', authenticate, getTracking)

export default router
