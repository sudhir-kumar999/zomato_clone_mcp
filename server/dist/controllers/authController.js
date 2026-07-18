"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const userRepo = () => data_source_1.AppDataSource.getRepository(User_1.User);
const setTokenCookie = (res, userId) => {
    const token = jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
    });
};
const register = async (req, res) => {
    const { name, email, password, role, phone } = req.body;
    const existing = await userRepo().findOne({ where: { email } });
    if (existing) {
        return res.status(400).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = userRepo().create({
        name, email, password: hashedPassword,
        role: role || User_1.UserRole.CUSTOMER, phone,
    });
    await userRepo().save(user);
    setTokenCookie(res, user.id);
    const { password: _, ...userData } = user;
    return res.status(201).json({ user: userData });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await userRepo().findOne({ where: { email } });
    if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });
    const isValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isValid)
        return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.is_active)
        return res.status(403).json({ message: 'Account is deactivated' });
    setTokenCookie(res, user.id);
    const { password: _, ...userData } = user;
    return res.json({ user: userData });
};
exports.login = login;
const logout = async (_req, res) => {
    res.clearCookie('token', { path: '/' });
    return res.json({ message: 'Logged out' });
};
exports.logout = logout;
const getMe = async (req, res) => {
    if (!req.user)
        return res.json(null);
    const { password: _, ...userData } = req.user;
    return res.json(userData);
};
exports.getMe = getMe;
