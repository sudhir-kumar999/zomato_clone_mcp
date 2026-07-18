"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Restaurant_1 = require("./entities/Restaurant");
const MenuCategory_1 = require("./entities/MenuCategory");
const MenuItem_1 = require("./entities/MenuItem");
const Order_1 = require("./entities/Order");
const OrderItem_1 = require("./entities/OrderItem");
const DeliveryTracking_1 = require("./entities/DeliveryTracking");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [User_1.User, Restaurant_1.Restaurant, MenuCategory_1.MenuCategory, MenuItem_1.MenuItem, Order_1.Order, OrderItem_1.OrderItem, DeliveryTracking_1.DeliveryTracking],
});
