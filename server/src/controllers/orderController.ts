import { Response } from 'express'
import { IsNull } from 'typeorm'
import { AppDataSource } from '../data-source'
import { Order, OrderStatus } from '../entities/Order'
import { OrderItem } from '../entities/OrderItem'
import { MenuItem } from '../entities/MenuItem'
import { Restaurant } from '../entities/Restaurant'
import { UserRole } from '../entities/User'
import { AuthRequest } from '../middleware/auth'

const orderRepo = () => AppDataSource.getRepository(Order)
const orderItemRepo = () => AppDataSource.getRepository(OrderItem)
const menuItemRepo = () => AppDataSource.getRepository(MenuItem)
const restRepo = () => AppDataSource.getRepository(Restaurant)

export const create = async (req: AuthRequest, res: Response) => {
  const { restaurant_id, items, delivery_address, delivery_lat, delivery_lng } = req.body

  const restaurant = await restRepo().findOne({ where: { id: restaurant_id, is_active: true } })
  if (!restaurant) return res.status(400).json({ message: 'Restaurant not available' })

  let total = 0
  const orderItems: OrderItem[] = []

  for (const item of items) {
    const menuItem = await menuItemRepo().findOne({ where: { id: item.menu_item_id, is_available: true } })
    if (!menuItem) return res.status(400).json({ message: `Item ${item.menu_item_id} not available` })
    total += Number(menuItem.price) * item.quantity
    orderItems.push(orderItemRepo().create({
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      unit_price: menuItem.price,
    }))
  }

  const order = orderRepo().create({
    customer_id: req.user!.id,
    restaurant_id,
    total_amount: total,
    delivery_address,
    delivery_lat,
    delivery_lng,
    items: orderItems,
  })
  await orderRepo().save(order)
  return res.status(201).json(order)
}

export const getAll = async (req: AuthRequest, res: Response) => {
  const user = req.user!
  let orders

  if (user.role === UserRole.ADMIN) {
    orders = await orderRepo().find({ relations: ['customer', 'restaurant', 'delivery_agent', 'items', 'items.menu_item'], order: { created_at: 'DESC' } })
  } else if (user.role === UserRole.RESTAURANT_OWNER) {
    const restaurants = await restRepo().find({ where: { owner_id: user.id } })
    const ids = restaurants.map((r) => r.id)
    orders = await orderRepo().find({
      where: ids.map((id) => ({ restaurant_id: id })),
      relations: ['customer', 'delivery_agent', 'items', 'items.menu_item'],
      order: { created_at: 'DESC' },
    })
  } else if (user.role === UserRole.DELIVERY_AGENT) {
    orders = await orderRepo().find({
      where: [
        { delivery_agent_id: user.id },
        { delivery_agent_id: IsNull(), status: OrderStatus.READY_FOR_PICKUP },
      ],
      relations: ['customer', 'restaurant', 'items', 'items.menu_item'],
      order: { created_at: 'DESC' },
    })
  } else {
    orders = await orderRepo().find({
      where: { customer_id: user.id },
      relations: ['restaurant', 'delivery_agent', 'items', 'items.menu_item'],
      order: { created_at: 'DESC' },
    })
  }
  return res.json(orders)
}

export const getById = async (req: AuthRequest, res: Response) => {
  const order = await orderRepo().findOne({
    where: { id: req.params.id },
    relations: ['customer', 'restaurant', 'delivery_agent', 'items', 'items.menu_item', 'tracking'],
  })
  if (!order) return res.status(404).json({ message: 'Order not found' })
  return res.json(order)
}

export const updateStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body
  const order = await orderRepo().findOne({ where: { id: req.params.id }, relations: ['restaurant'] })
  if (!order) return res.status(404).json({ message: 'Order not found' })

  const user = req.user!
  if (user.role === UserRole.RESTAURANT_OWNER && order.restaurant.owner_id !== user.id) {
    return res.status(403).json({ message: 'Not authorized' })
  }
  if (user.role === UserRole.DELIVERY_AGENT && order.delivery_agent_id !== user.id) {
    return res.status(403).json({ message: 'Not your delivery' })
  }

  order.status = status as OrderStatus
  await orderRepo().save(order)
  return res.json(order)
}

export const assignDelivery = async (req: AuthRequest, res: Response) => {
  const { delivery_agent_id } = req.body
  const user = req.user!

  if (user.role === UserRole.DELIVERY_AGENT && delivery_agent_id !== user.id) {
    return res.status(403).json({ message: 'Agents can only assign themselves' })
  }

  const order = await orderRepo().findOne({ where: { id: req.params.id } })
  if (!order) return res.status(404).json({ message: 'Order not found' })

  if (user.role === UserRole.DELIVERY_AGENT && order.status !== OrderStatus.READY_FOR_PICKUP) {
    return res.status(400).json({ message: 'Order is not ready for pickup' })
  }

  order.delivery_agent_id = delivery_agent_id
  await orderRepo().save(order)
  return res.json(order)
}
