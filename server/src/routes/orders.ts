import { Router } from 'express'
import { create, getAll, getById, updateStatus, assignDelivery } from '../controllers/orderController'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/roles'
import { UserRole } from '../entities/User'

const router = Router()

router.post('/', authenticate, authorize(UserRole.CUSTOMER), create)
router.get('/', authenticate, getAll)
router.get('/:id', authenticate, getById)
router.put('/:id/status', authenticate, authorize(UserRole.RESTAURANT_OWNER, UserRole.DELIVERY_AGENT, UserRole.ADMIN), updateStatus)
router.put('/:id/assign-delivery', authenticate, authorize(UserRole.ADMIN, UserRole.DELIVERY_AGENT), assignDelivery)

export default router
