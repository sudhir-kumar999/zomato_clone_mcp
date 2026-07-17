import { Router } from 'express'
import {
  getByRestaurant, createCategory, updateCategory, deleteCategory,
  createItem, updateItem, deleteItem, toggleAvailability,
} from '../controllers/menuController'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/roles'
import { UserRole } from '../entities/User'

const router = Router()

router.get('/restaurant/:restaurantId', getByRestaurant)
router.post('/category', authenticate, authorize(UserRole.RESTAURANT_OWNER), createCategory)
router.put('/category/:id', authenticate, authorize(UserRole.RESTAURANT_OWNER), updateCategory)
router.delete('/category/:id', authenticate, authorize(UserRole.RESTAURANT_OWNER), deleteCategory)
router.post('/item', authenticate, authorize(UserRole.RESTAURANT_OWNER), createItem)
router.put('/item/:id', authenticate, authorize(UserRole.RESTAURANT_OWNER), updateItem)
router.delete('/item/:id', authenticate, authorize(UserRole.RESTAURANT_OWNER), deleteItem)
router.put('/item/:id/toggle-availability', authenticate, authorize(UserRole.RESTAURANT_OWNER), toggleAvailability)

export default router
