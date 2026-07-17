import { Response } from 'express'
import { AppDataSource } from '../data-source'
import { User, UserRole } from '../entities/User'
import { Restaurant } from '../entities/Restaurant'
import { Order } from '../entities/Order'
import { AuthRequest } from '../middleware/auth'
import { MoreThanOrEqual } from 'typeorm'

const userRepo = () => AppDataSource.getRepository(User)
const restRepo = () => AppDataSource.getRepository(Restaurant)
const orderRepo = () => AppDataSource.getRepository(Order)

export const getDashboard = async (_req: AuthRequest, res: Response) => {
  const totalUsers = await userRepo().count()
  const totalRestaurants = await restRepo().count()
  const activeRestaurants = await restRepo().count({ where: { is_active: true } })
  const totalOrders = await orderRepo().count()
  const totalRevenue = await orderRepo()
    .createQueryBuilder('order')
    .select('SUM(order.total_amount)', 'total')
    .where('order.payment_status = :status', { status: 'paid' })
    .getRawOne()

  return res.json({
    totalUsers,
    totalRestaurants,
    activeRestaurants,
    totalOrders,
    totalRevenue: totalRevenue?.total || 0,
  })
}

export const getUsers = async (_req: AuthRequest, res: Response) => {
  const users = await userRepo().find({ order: { created_at: 'DESC' } })
  const sanitized = users.map(({ password, ...u }) => u)
  return res.json(sanitized)
}

export const banUser = async (req: AuthRequest, res: Response) => {
  const user = await userRepo().findOne({ where: { id: req.params.id } })
  if (!user) return res.status(404).json({ message: 'User not found' })
  user.is_active = !user.is_active
  await userRepo().save(user)
  return res.json({ message: `User ${user.is_active ? 'unbanned' : 'banned'}` })
}

export const getRestaurants = async (_req: AuthRequest, res: Response) => {
  const restaurants = await restRepo().find({ relations: ['owner'], order: { created_at: 'DESC' } })
  return res.json(restaurants)
}

export const approveRestaurant = async (req: AuthRequest, res: Response) => {
  const restaurant = await restRepo().findOne({ where: { id: req.params.id } })
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' })
  restaurant.is_approved = !restaurant.is_approved
  await restRepo().save(restaurant)
  return res.json(restaurant)
}

export const getDeliveryAgents = async (_req: AuthRequest, res: Response) => {
  const agents = await userRepo().find({ where: { role: UserRole.DELIVERY_AGENT }, order: { created_at: 'DESC' } })
  const sanitized = agents.map(({ password, ...u }) => u)
  return res.json(sanitized)
}

export const createDeliveryAgent = async (req: AuthRequest, res: Response) => {
  const { name, email, password, phone } = req.body
  const existing = await userRepo().findOne({ where: { email } })
  if (existing) return res.status(400).json({ message: 'Email already exists' })

  const bcrypt = require('bcryptjs')
  const hashedPassword = await bcrypt.hash(password, 10)
  const agent = userRepo().create({
    name, email, password: hashedPassword, phone,
    role: UserRole.DELIVERY_AGENT,
  })
  await userRepo().save(agent)
  const { password: _, ...agentData } = agent
  return res.status(201).json(agentData)
}

export const getAgentEarnings = async (req: AuthRequest, res: Response) => {
  const orders = await orderRepo().find({
    where: { delivery_agent_id: req.params.id, payment_status: 'paid' as any },
  })
  const total = orders.reduce((sum, o) => sum + Number(o.total_amount), 0)
  return res.json({ totalEarnings: total, totalDeliveries: orders.length, orders })
}
