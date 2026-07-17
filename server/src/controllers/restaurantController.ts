import { Response } from 'express'
import { AppDataSource } from '../data-source'
import { Restaurant } from '../entities/Restaurant'
import { AuthRequest } from '../middleware/auth'

const repo = () => AppDataSource.getRepository(Restaurant)

export const getAll = async (_req: AuthRequest, res: Response) => {
  const restaurants = await repo().find({
    where: { is_active: true, is_approved: true },
    relations: ['owner'],
  })
  return res.json(restaurants)
}

export const getById = async (req: AuthRequest, res: Response) => {
  const restaurant = await repo().findOne({
    where: { id: req.params.id },
    relations: ['categories', 'categories.items', 'owner'],
  })
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' })
  return res.json(restaurant)
}

export const create = async (req: AuthRequest, res: Response) => {
  const restaurant = repo().create({ ...req.body, owner_id: req.user!.id })
  await repo().save(restaurant)
  return res.status(201).json(restaurant)
}

export const update = async (req: AuthRequest, res: Response) => {
  const restaurant = await repo().findOne({ where: { id: req.params.id, owner_id: req.user!.id } })
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' })
  Object.assign(restaurant, req.body)
  await repo().save(restaurant)
  return res.json(restaurant)
}

export const toggleActive = async (req: AuthRequest, res: Response) => {
  const restaurant = await repo().findOne({ where: { id: req.params.id } })
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' })
  restaurant.is_active = !restaurant.is_active
  await repo().save(restaurant)
  return res.json(restaurant)
}
