import { Router } from 'express'
import { getAll, getById, create, update, toggleActive } from '../controllers/restaurantController'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/roles'
import { UserRole } from '../entities/User'

const router = Router()

router.get('/', getAll)
router.get('/:id', getById)
router.post('/', authenticate, authorize(UserRole.RESTAURANT_OWNER), create)
router.put('/:id', authenticate, authorize(UserRole.RESTAURANT_OWNER), update)
router.put('/:id/toggle-active', authenticate, authorize(UserRole.RESTAURANT_OWNER, UserRole.ADMIN), toggleActive)

export default router
