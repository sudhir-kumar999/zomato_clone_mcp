"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgentEarnings = exports.createDeliveryAgent = exports.getDeliveryAgents = exports.approveRestaurant = exports.getRestaurants = exports.banUser = exports.getUsers = exports.getDashboard = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const Restaurant_1 = require("../entities/Restaurant");
const Order_1 = require("../entities/Order");
const userRepo = () => data_source_1.AppDataSource.getRepository(User_1.User);
const restRepo = () => data_source_1.AppDataSource.getRepository(Restaurant_1.Restaurant);
const orderRepo = () => data_source_1.AppDataSource.getRepository(Order_1.Order);
const getDashboard = async (_req, res) => {
    const totalUsers = await userRepo().count();
    const totalRestaurants = await restRepo().count();
    const activeRestaurants = await restRepo().count({ where: { is_active: true } });
    const totalOrders = await orderRepo().count();
    const totalRevenue = await orderRepo()
        .createQueryBuilder('order')
        .select('SUM(order.total_amount)', 'total')
        .where('order.payment_status = :status', { status: 'paid' })
        .getRawOne();
    return res.json({
        totalUsers,
        totalRestaurants,
        activeRestaurants,
        totalOrders,
        totalRevenue: totalRevenue?.total || 0,
    });
};
exports.getDashboard = getDashboard;
const getUsers = async (_req, res) => {
    const users = await userRepo().find({ order: { created_at: 'DESC' } });
    const sanitized = users.map(({ password, ...u }) => u);
    return res.json(sanitized);
};
exports.getUsers = getUsers;
const banUser = async (req, res) => {
    const user = await userRepo().findOne({ where: { id: req.params.id } });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    user.is_active = !user.is_active;
    await userRepo().save(user);
    return res.json({ message: `User ${user.is_active ? 'unbanned' : 'banned'}` });
};
exports.banUser = banUser;
const getRestaurants = async (_req, res) => {
    const restaurants = await restRepo().find({ relations: ['owner'], order: { created_at: 'DESC' } });
    return res.json(restaurants);
};
exports.getRestaurants = getRestaurants;
const approveRestaurant = async (req, res) => {
    const restaurant = await restRepo().findOne({ where: { id: req.params.id } });
    if (!restaurant)
        return res.status(404).json({ message: 'Restaurant not found' });
    restaurant.is_approved = !restaurant.is_approved;
    await restRepo().save(restaurant);
    return res.json(restaurant);
};
exports.approveRestaurant = approveRestaurant;
const getDeliveryAgents = async (_req, res) => {
    const agents = await userRepo().find({ where: { role: User_1.UserRole.DELIVERY_AGENT }, order: { created_at: 'DESC' } });
    const sanitized = agents.map(({ password, ...u }) => u);
    return res.json(sanitized);
};
exports.getDeliveryAgents = getDeliveryAgents;
const createDeliveryAgent = async (req, res) => {
    const { name, email, password, phone } = req.body;
    const existing = await userRepo().findOne({ where: { email } });
    if (existing)
        return res.status(400).json({ message: 'Email already exists' });
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const agent = userRepo().create({
        name, email, password: hashedPassword, phone,
        role: User_1.UserRole.DELIVERY_AGENT,
    });
    await userRepo().save(agent);
    const { password: _, ...agentData } = agent;
    return res.status(201).json(agentData);
};
exports.createDeliveryAgent = createDeliveryAgent;
const getAgentEarnings = async (req, res) => {
    const orders = await orderRepo().find({
        where: { delivery_agent_id: req.params.id, payment_status: Order_1.PaymentStatus.PAID },
    });
    const total = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    return res.json({ totalEarnings: total, totalDeliveries: orders.length, orders });
};
exports.getAgentEarnings = getAgentEarnings;
