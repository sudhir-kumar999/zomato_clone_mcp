import { Response } from 'express'
import { AppDataSource } from '../data-source'
import { MenuCategory } from '../entities/MenuCategory'
import { MenuItem } from '../entities/MenuItem'
import { Restaurant } from '../entities/Restaurant'
import { AuthRequest } from '../middleware/auth'

const catRepo = () => AppDataSource.getRepository(MenuCategory)
const itemRepo = () => AppDataSource.getRepository(MenuItem)
const restRepo = () => AppDataSource.getRepository(Restaurant)

const verifyOwner = async (restaurantId: string, userId: string) => {
  const restaurant = await restRepo().findOne({ where: { id: restaurantId, owner_id: userId } })
  return !!restaurant
}

export const getByRestaurant = async (req: AuthRequest, res: Response) => {
  const categories = await catRepo().find({
    where: { restaurant_id: req.params.restaurantId },
    relations: ['items'],
    order: { sort_order: 'ASC' },
  })
  return res.json(categories)
}

export const createCategory = async (req: AuthRequest, res: Response) => {
  const { restaurant_id, name } = req.body
  if (!(await verifyOwner(restaurant_id, req.user!.id))) {
    return res.status(403).json({ message: 'Not your restaurant' })
  }
  const category = catRepo().create({ name, restaurant_id, sort_order: req.body.sort_order || 0 })
  await catRepo().save(category)
  return res.status(201).json(category)
}

export const updateCategory = async (req: AuthRequest, res: Response) => {
  const category = await catRepo().findOne({ where: { id: req.params.id }, relations: ['restaurant'] })
  if (!category || category.restaurant.owner_id !== req.user!.id) {
    return res.status(403).json({ message: 'Not authorized' })
  }
  Object.assign(category, req.body)
  await catRepo().save(category)
  return res.json(category)
}

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  const category = await catRepo().findOne({ where: { id: req.params.id }, relations: ['restaurant'] })
  if (!category || category.restaurant.owner_id !== req.user!.id) {
    return res.status(403).json({ message: 'Not authorized' })
  }
  await catRepo().remove(category)
  return res.json({ message: 'Category deleted' })
}

export const createItem = async (req: AuthRequest, res: Response) => {
  const { restaurant_id } = req.body
  if (!(await verifyOwner(restaurant_id, req.user!.id))) {
    return res.status(403).json({ message: 'Not your restaurant' })
  }
  const item = itemRepo().create(req.body)
  await itemRepo().save(item)
  return res.status(201).json(item)
}

export const updateItem = async (req: AuthRequest, res: Response) => {
  const item = await itemRepo().findOne({ where: { id: req.params.id }, relations: ['restaurant'] })
  if (!item || item.restaurant.owner_id !== req.user!.id) {
    return res.status(403).json({ message: 'Not authorized' })
  }
  Object.assign(item, req.body)
  await itemRepo().save(item)
  return res.json(item)
}

export const deleteItem = async (req: AuthRequest, res: Response) => {
  const item = await itemRepo().findOne({ where: { id: req.params.id }, relations: ['restaurant'] })
  if (!item || item.restaurant.owner_id !== req.user!.id) {
    return res.status(403).json({ message: 'Not authorized' })
  }
  await itemRepo().remove(item)
  return res.json({ message: 'Item deleted' })
}

export const toggleAvailability = async (req: AuthRequest, res: Response) => {
  const item = await itemRepo().findOne({ where: { id: req.params.id }, relations: ['restaurant'] })
  if (!item || item.restaurant.owner_id !== req.user!.id) {
    return res.status(403).json({ message: 'Not authorized' })
  }
  item.is_available = !item.is_available
  await itemRepo().save(item)
  return res.json(item)
}
