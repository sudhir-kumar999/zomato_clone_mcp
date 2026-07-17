import { Response } from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { AppDataSource } from '../data-source'
import { Order } from '../entities/Order'
import { AuthRequest } from '../middleware/auth'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

const orderRepo = () => AppDataSource.getRepository(Order)

export const createOrder = async (req: AuthRequest, res: Response) => {
  const { order_id } = req.body
  const order = await orderRepo().findOne({ where: { id: order_id, customer_id: req.user!.id } })
  if (!order) return res.status(404).json({ message: 'Order not found' })

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(Number(order.total_amount) * 100),
    currency: 'INR',
    receipt: order_id,
  })

  order.razorpay_order_id = razorpayOrder.id
  await orderRepo().save(order)
  return res.json(razorpayOrder)
}

export const verify = async (req: AuthRequest, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Invalid signature' })
  }

  const order = await orderRepo().findOne({ where: { razorpay_order_id } })
  if (order) {
    order.payment_status = 'paid' as any
    order.razorpay_payment_id = razorpay_payment_id
    await orderRepo().save(order)
  }
  return res.json({ message: 'Payment verified' })
}
