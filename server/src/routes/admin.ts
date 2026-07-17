import { Router } from 'express'
import {
  getDashboard, getUsers, banUser, getRestaurants, approveRestaurant,
  getDeliveryAgents, createDeliveryAgent, getAgentEarnings,
} from '../controllers/adminController'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/roles'
import { UserRole } from '../entities/User'

const router = Router()

router.use(authenticate, authorize(UserRole.ADMIN))

router.get('/dashboard', getDashboard)
router.get('/users', getUsers)
router.put('/users/:id/ban', banUser)
router.get('/restaurants', getRestaurants)
router.put('/restaurants/:id/approve', approveRestaurant)
router.get('/delivery-agents', getDeliveryAgents)
router.post('/delivery-agents', createDeliveryAgent)
router.get('/delivery-agents/:id/earnings', getAgentEarnings)

export default router
