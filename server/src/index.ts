import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import { AppDataSource } from './data-source'

dotenv.config()

import authRoutes from './routes/auth'
import restaurantRoutes from './routes/restaurants'
import menuRoutes from './routes/menu'
import orderRoutes from './routes/orders'
import paymentRoutes from './routes/payments'
import trackingRoutes from './routes/tracking'
import adminRoutes from './routes/admin'
import { setupSocket } from './sockets'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
})

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/restaurants', restaurantRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/tracking', trackingRoutes)
app.use('/api/admin', adminRoutes)

setupSocket(io)

const PORT = process.env.PORT || 5000

AppDataSource.initialize()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Database connection failed:', err)
  })
