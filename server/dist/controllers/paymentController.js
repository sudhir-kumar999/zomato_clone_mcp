"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.createOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const data_source_1 = require("../data-source");
const Order_1 = require("../entities/Order");
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});
const orderRepo = () => data_source_1.AppDataSource.getRepository(Order_1.Order);
const createOrder = async (req, res) => {
    const { order_id } = req.body;
    const order = await orderRepo().findOne({ where: { id: order_id, customer_id: req.user.id } });
    if (!order)
        return res.status(404).json({ message: 'Order not found' });
    const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(Number(order.total_amount) * 100),
        currency: 'INR',
        receipt: order_id,
    });
    order.razorpay_order_id = razorpayOrder.id;
    await orderRepo().save(order);
    return res.json(razorpayOrder);
};
exports.createOrder = createOrder;
const verify = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const expectedSignature = crypto_1.default
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: 'Invalid signature' });
    }
    const order = await orderRepo().findOne({ where: { razorpay_order_id } });
    if (order) {
        order.payment_status = Order_1.PaymentStatus.PAID;
        order.razorpay_payment_id = razorpay_payment_id;
        await orderRepo().save(order);
    }
    return res.json({ message: 'Payment verified' });
};
exports.verify = verify;
