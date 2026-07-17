import { Router } from 'express'
import { createOrder, verify } from '../controllers/paymentController'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/roles'
import { UserRole } from '../entities/User'

const router = Router()

router.post('/create-order', authenticate, authorize(UserRole.CUSTOMER), createOrder)
router.post('/verify', authenticate, verify)

export default router
