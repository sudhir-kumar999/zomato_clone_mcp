"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const data_source_1 = require("./data-source");
const User_1 = require("./entities/User");
const Restaurant_1 = require("./entities/Restaurant");
const MenuCategory_1 = require("./entities/MenuCategory");
const MenuItem_1 = require("./entities/MenuItem");
dotenv_1.default.config();
async function seed() {
    await data_source_1.AppDataSource.initialize();
    console.log('Database connected');
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const restRepo = data_source_1.AppDataSource.getRepository(Restaurant_1.Restaurant);
    const catRepo = data_source_1.AppDataSource.getRepository(MenuCategory_1.MenuCategory);
    const itemRepo = data_source_1.AppDataSource.getRepository(MenuItem_1.MenuItem);
    const hash = await bcryptjs_1.default.hash('844502', 10);
    const admin = userRepo.create({ name: 'Admin', email: 'sks@gmail.com', password: hash, role: User_1.UserRole.ADMIN });
    await userRepo.save(admin);
    const owner1 = userRepo.create({ name: 'Pizza Palace Owner', email: 'owner@example.com', password: hash, role: User_1.UserRole.RESTAURANT_OWNER });
    await userRepo.save(owner1);
    const agent = userRepo.create({ name: 'John Delivery', email: 'agent@example.com', password: hash, role: User_1.UserRole.DELIVERY_AGENT });
    await userRepo.save(agent);
    const customer = userRepo.create({ name: 'Jane Doe', email: 'customer@example.com', password: hash, role: User_1.UserRole.CUSTOMER });
    await userRepo.save(customer);
    const pizzaPlace = restRepo.create({
        name: 'Pizza Palace', description: 'Best pizzas in town', cuisine: 'Italian',
        address: '123 Main St, New York', latitude: 40.7128, longitude: -74.006,
        is_approved: true, owner_id: owner1.id, commission_rate: 10,
    });
    await restRepo.save(pizzaPlace);
    const burgerJoint = restRepo.create({
        name: 'Burger Joint', description: 'Juicy burgers and fries', cuisine: 'American',
        address: '456 Oak Ave, New York', latitude: 40.7282, longitude: -73.7949,
        is_approved: true, owner_id: owner1.id, commission_rate: 10,
    });
    await restRepo.save(burgerJoint);
    const cat1 = catRepo.create({ name: 'Pizzas', restaurant_id: pizzaPlace.id, sort_order: 1 });
    const cat2 = catRepo.create({ name: 'Sides', restaurant_id: pizzaPlace.id, sort_order: 2 });
    const cat3 = catRepo.create({ name: 'Beverages', restaurant_id: pizzaPlace.id, sort_order: 3 });
    await catRepo.save([cat1, cat2, cat3]);
    const items = [
        { name: 'Margherita', description: 'Classic cheese pizza', price: 12.99, category_id: cat1.id, restaurant_id: pizzaPlace.id, is_vegetarian: true },
        { name: 'Pepperoni', description: 'Pepperoni with mozzarella', price: 14.99, category_id: cat1.id, restaurant_id: pizzaPlace.id },
        { name: 'BBQ Chicken', description: 'Grilled chicken with BBQ sauce', price: 16.99, category_id: cat1.id, restaurant_id: pizzaPlace.id },
        { name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 5.99, category_id: cat2.id, restaurant_id: pizzaPlace.id, is_vegetarian: true },
        { name: 'French Fries', description: 'Crispy golden fries', price: 4.99, category_id: cat2.id, restaurant_id: pizzaPlace.id, is_vegetarian: true },
        { name: 'Coke', description: 'Chilled Coca-Cola', price: 2.99, category_id: cat3.id, restaurant_id: pizzaPlace.id, is_vegetarian: true },
        { name: 'Water', description: 'Mineral water 500ml', price: 1.99, category_id: cat3.id, restaurant_id: pizzaPlace.id, is_vegetarian: true },
    ];
    await itemRepo.save(items.map((i) => itemRepo.create(i)));
    console.log('Seed data created successfully!');
    console.log('---');
    console.log('Admin: sks@gmail.com / 844502');
    console.log('Owner: owner@example.com / 844502');
    console.log('Agent: agent@example.com / 844502');
    console.log('Customer: customer@example.com / 844502');
    await data_source_1.AppDataSource.destroy();
}
seed().catch(console.error);
