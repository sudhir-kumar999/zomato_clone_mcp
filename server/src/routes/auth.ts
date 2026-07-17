import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../data-source'
import { User } from '../entities/User'
import { register, login, logout } from '../controllers/authController'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.token
    if (!token) return res.json(null)

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string }
    const userRepo = AppDataSource.getRepository(User)
    const user = await userRepo.findOne({ where: { id: decoded.id } })

    if (!user || !user.is_active) return res.json(null)

    const { password: _, ...userData } = user
    return res.json(userData)
  } catch {
    return res.json(null)
  }
})

export default router
