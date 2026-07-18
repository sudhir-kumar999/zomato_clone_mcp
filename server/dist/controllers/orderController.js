"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignDelivery = exports.updateStatus = exports.getById = exports.getAll = exports.create = void 0;
const typeorm_1 = require("typeorm");
const data_source_1 = require("../data-source");
const Order_1 = require("../entities/Order");
const OrderItem_1 = require("../entities/OrderItem");
const MenuItem_1 = require("../entities/MenuItem");
const Restaurant_1 = require("../entities/Restaurant");
const User_1 = require("../entities/User");
const orderRepo = () => data_source_1.AppDataSource.getRepository(Order_1.Order);
const orderItemRepo = () => data_source_1.AppDataSource.getRepository(OrderItem_1.OrderItem);
const menuItemRepo = () => data_source_1.AppDataSource.getRepository(MenuItem_1.MenuItem);
const restRepo = () => data_source_1.AppDataSource.getRepository(Restaurant_1.Restaurant);
const create = async (req, res) => {
    const { restaurant_id, items, delivery_address, delivery_lat, delivery_lng } = req.body;
    const restaurant = await restRepo().findOne({ where: { id: restaurant_id, is_active: true } });
    if (!restaurant)
        return res.status(400).json({ message: 'Restaurant not available' });
    let total = 0;
    const orderItems = [];
    for (const item of items) {
        const menuItem = await menuItemRepo().findOne({ where: { id: item.menu_item_id, is_available: true } });
        if (!menuItem)
            return res.status(400).json({ message: `Item ${item.menu_item_id} not available` });
        total += Number(menuItem.price) * item.quantity;
        orderItems.push(orderItemRepo().create({
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            unit_price: menuItem.price,
        }));
    }
    const order = orderRepo().create({
        customer_id: req.user.id,
        restaurant_id,
        total_amount: total,
        delivery_address,
        delivery_lat,
        delivery_lng,
        items: orderItems,
    });
    await orderRepo().save(order);
    return res.status(201).json(order);
};
exports.create = create;
const getAll = async (req, res) => {
    const user = req.user;
    let orders;
    if (user.role === User_1.UserRole.ADMIN) {
        orders = await orderRepo().find({ relations: ['customer', 'restaurant', 'delivery_agent', 'items', 'items.menu_item'], order: { created_at: 'DESC' } });
    }
    else if (user.role === User_1.UserRole.RESTAURANT_OWNER) {
        const restaurants = await restRepo().find({ where: { owner_id: user.id } });
        const ids = restaurants.map((r) => r.id);
        orders = await orderRepo().find({
            where: ids.map((id) => ({ restaurant_id: id })),
            relations: ['customer', 'delivery_agent', 'items', 'items.menu_item'],
            order: { created_at: 'DESC' },
        });
    }
    else if (user.role === User_1.UserRole.DELIVERY_AGENT) {
        orders = await orderRepo().find({
            where: [
                { delivery_agent_id: user.id },
                { delivery_agent_id: (0, typeorm_1.IsNull)(), status: Order_1.OrderStatus.READY_FOR_PICKUP },
            ],
            relations: ['customer', 'restaurant', 'items', 'items.menu_item'],
            order: { created_at: 'DESC' },
        });
    }
    else {
        orders = await orderRepo().find({
            where: { customer_id: user.id },
            relations: ['restaurant', 'delivery_agent', 'items', 'items.menu_item'],
            order: { created_at: 'DESC' },
        });
    }
    return res.json(orders);
};
exports.getAll = getAll;
const getById = async (req, res) => {
    const order = await orderRepo().findOne({
        where: { id: req.params.id },
        relations: ['customer', 'restaurant', 'delivery_agent', 'items', 'items.menu_item', 'tracking'],
    });
    if (!order)
        return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
};
exports.getById = getById;
const updateStatus = async (req, res) => {
    const { status } = req.body;
    const order = await orderRepo().findOne({ where: { id: req.params.id }, relations: ['restaurant'] });
    if (!order)
        return res.status(404).json({ message: 'Order not found' });
    const user = req.user;
    if (user.role === User_1.UserRole.RESTAURANT_OWNER && order.restaurant.owner_id !== user.id) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    if (user.role === User_1.UserRole.DELIVERY_AGENT && order.delivery_agent_id !== user.id) {
        return res.status(403).json({ message: 'Not your delivery' });
    }
    order.status = status;
    await orderRepo().save(order);
    return res.json(order);
};
exports.updateStatus = updateStatus;
const assignDelivery = async (req, res) => {
    const { delivery_agent_id } = req.body;
    const user = req.user;
    if (user.role === User_1.UserRole.DELIVERY_AGENT && delivery_agent_id !== user.id) {
        return res.status(403).json({ message: 'Agents can only assign themselves' });
    }
    const order = await orderRepo().findOne({ where: { id: req.params.id } });
    if (!order)
        return res.status(404).json({ message: 'Order not found' });
    if (user.role === User_1.UserRole.DELIVERY_AGENT && order.status !== Order_1.OrderStatus.READY_FOR_PICKUP) {
        return res.status(400).json({ message: 'Order is not ready for pickup' });
    }
    order.delivery_agent_id = delivery_agent_id;
    await orderRepo().save(order);
    return res.json(order);
};
exports.assignDelivery = assignDelivery;
