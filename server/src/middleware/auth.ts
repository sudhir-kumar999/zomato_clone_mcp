import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../data-source'
import { User } from '../entities/User'

export interface AuthRequest extends Request {
  user?: User
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) throw new Error('JWT_SECRET not configured')
    const decoded = jwt.verify(token, jwtSecret) as { id: string }
    const userRepo = AppDataSource.getRepository(User)
    const user = await userRepo.findOne({ where: { id: decoded.id } })

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'User not found or inactive' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
