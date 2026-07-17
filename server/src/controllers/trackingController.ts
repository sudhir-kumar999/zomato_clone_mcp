import { Response } from 'express'
import { AppDataSource } from '../data-source'
import { DeliveryTracking } from '../entities/DeliveryTracking'
import { AuthRequest } from '../middleware/auth'

const repo = () => AppDataSource.getRepository(DeliveryTracking)

export const updateLocation = async (req: AuthRequest, res: Response) => {
  const { order_id, latitude, longitude } = req.body
  const tracking = repo().create({
    order_id,
    delivery_agent_id: req.user!.id,
    latitude,
    longitude,
  })
  await repo().save(tracking)
  return res.json(tracking)
}

export const getTracking = async (req: AuthRequest, res: Response) => {
  const updates = await repo().find({
    where: { order_id: req.params.orderId },
    order: { timestamp: 'ASC' },
  })
  return res.json(updates)
}
