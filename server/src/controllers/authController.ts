import { Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../data-source'
import { User, UserRole } from '../entities/User'
import { AuthRequest } from '../middleware/auth'

const userRepo = () => AppDataSource.getRepository(User)

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

const setTokenCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' })
  const isProduction = process.env.NODE_ENV === 'production'
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

export const register = async (req: AuthRequest, res: Response) => {
  const { name, email, password, role, phone } = req.body

  const existing = await userRepo().findOne({ where: { email } })
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = userRepo().create({
    name, email, password: hashedPassword,
    role: role || UserRole.CUSTOMER, phone,
  })
  await userRepo().save(user)

  setTokenCookie(res, user.id)
  const { password: _, ...userData } = user
  return res.status(201).json({ user: userData })
}

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body

  const user = await userRepo().findOne({ where: { email } })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' })
  if (!user.is_active) return res.status(403).json({ message: 'Account is deactivated' })

  setTokenCookie(res, user.id)
  const { password: _, ...userData } = user
  return res.json({ user: userData })
}

export const logout = async (_req: AuthRequest, res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production'
  res.clearCookie('token', {
    path: '/',
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  })
  return res.json({ message: 'Logged out' })
}

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.json(null)
  const { password: _, ...userData } = req.user
  return res.json(userData)
}
