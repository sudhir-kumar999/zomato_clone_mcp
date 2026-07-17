import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entities/User'
import { Restaurant } from './entities/Restaurant'
import { MenuCategory } from './entities/MenuCategory'
import { MenuItem } from './entities/MenuItem'
import { Order } from './entities/Order'
import { OrderItem } from './entities/OrderItem'
import { DeliveryTracking } from './entities/DeliveryTracking'
import dotenv from 'dotenv'
dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User, Restaurant, MenuCategory, MenuItem, Order, OrderItem, DeliveryTracking],
})
