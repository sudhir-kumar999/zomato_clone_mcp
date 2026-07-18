import 'reflect-metadata'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { AppDataSource } from './data-source'
import { User, UserRole } from './entities/User'
import { Restaurant } from './entities/Restaurant'
import { MenuCategory } from './entities/MenuCategory'
import { MenuItem } from './entities/MenuItem'

dotenv.config()

async function seed() {
  await AppDataSource.initialize()
  console.log('Database connected')

  const userRepo = AppDataSource.getRepository(User)
  const restRepo = AppDataSource.getRepository(Restaurant)
  const catRepo = AppDataSource.getRepository(MenuCategory)
  const itemRepo = AppDataSource.getRepository(MenuItem)

  const hash = await bcrypt.hash('844502', 10)

  const admin = userRepo.create({ name: 'Admin', email: 'sks@gmail.com', password: hash, role: UserRole.ADMIN })
  await userRepo.save(admin)

  const owner1 = userRepo.create({ name: 'Pizza Palace Owner', email: 'owner@example.com', password: hash, role: UserRole.RESTAURANT_OWNER })
  await userRepo.save(owner1)

  const agent = userRepo.create({ name: 'John Delivery', email: 'agent@example.com', password: hash, role: UserRole.DELIVERY_AGENT })
  await userRepo.save(agent)

  const customer = userRepo.create({ name: 'Jane Doe', email: 'customer@example.com', password: hash, role: UserRole.CUSTOMER })
  await userRepo.save(customer)

  const pizzaPlace = restRepo.create({
    name: 'Pizza Palace', description: 'Best pizzas in town', cuisine: 'Italian',
    address: '123 Main St, New York', latitude: 40.7128, longitude: -74.006,
    is_approved: true, owner_id: owner1.id, commission_rate: 10,
  })
  await restRepo.save(pizzaPlace)

  const burgerJoint = restRepo.create({
    name: 'Burger Joint', description: 'Juicy burgers and fries', cuisine: 'American',
    address: '456 Oak Ave, New York', latitude: 40.7282, longitude: -73.7949,
    is_approved: true, owner_id: owner1.id, commission_rate: 10,
  })
  await restRepo.save(burgerJoint)

  const cat1 = catRepo.create({ name: 'Pizzas', restaurant_id: pizzaPlace.id, sort_order: 1 })
  const cat2 = catRepo.create({ name: 'Sides', restaurant_id: pizzaPlace.id, sort_order: 2 })
  const cat3 = catRepo.create({ name: 'Beverages', restaurant_id: pizzaPlace.id, sort_order: 3 })
  await catRepo.save([cat1, cat2, cat3])

  const items = [
    { name: 'Margherita', description: 'Classic cheese pizza', price: 12.99, category_id: cat1.id, restaurant_id: pizzaPlace.id, is_vegetarian: true },
    { name: 'Pepperoni', description: 'Pepperoni with mozzarella', price: 14.99, category_id: cat1.id, restaurant_id: pizzaPlace.id },
    { name: 'BBQ Chicken', description: 'Grilled chicken with BBQ sauce', price: 16.99, category_id: cat1.id, restaurant_id: pizzaPlace.id },
    { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 5.99, category_id: cat2.id, restaurant_id: pizzaPlace.id, is_vegetarian: true },
    { name: 'French Fries', description: 'Crispy golden fries', price: 4.99, category_id: cat2.id, restaurant_id: pizzaPlace.id, is_vegetarian: true },
    { name: 'Coke', description: 'Chilled Coca-Cola', price: 2.99, category_id: cat3.id, restaurant_id: pizzaPlace.id, is_vegetarian: true },
    { name: 'Water', description: 'Mineral water 500ml', price: 1.99, category_id: cat3.id, restaurant_id: pizzaPlace.id, is_vegetarian: true },
  ]
  await itemRepo.save(items.map((i) => itemRepo.create(i)))

  console.log('Seed data created successfully!')
  console.log('---')
  console.log('Admin: sks@gmail.com / 844502')
  console.log('Owner: owner@example.com / 844502')
  console.log('Agent: agent@example.com / 844502')
  console.log('Customer: customer@example.com / 844502')

  await AppDataSource.destroy()
}

seed().catch(console.error)
