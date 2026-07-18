"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleActive = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const data_source_1 = require("../data-source");
const Restaurant_1 = require("../entities/Restaurant");
const repo = () => data_source_1.AppDataSource.getRepository(Restaurant_1.Restaurant);
const getAll = async (_req, res) => {
    const restaurants = await repo().find({
        where: { is_active: true, is_approved: true },
        relations: ['owner'],
    });
    return res.json(restaurants);
};
exports.getAll = getAll;
const getById = async (req, res) => {
    const restaurant = await repo().findOne({
        where: { id: req.params.id },
        relations: ['categories', 'categories.items', 'owner'],
    });
    if (!restaurant)
        return res.status(404).json({ message: 'Restaurant not found' });
    return res.json(restaurant);
};
exports.getById = getById;
const create = async (req, res) => {
    const restaurant = repo().create({ ...req.body, owner_id: req.user.id });
    await repo().save(restaurant);
    return res.status(201).json(restaurant);
};
exports.create = create;
const update = async (req, res) => {
    const restaurant = await repo().findOne({ where: { id: req.params.id, owner_id: req.user.id } });
    if (!restaurant)
        return res.status(404).json({ message: 'Restaurant not found' });
    Object.assign(restaurant, req.body);
    await repo().save(restaurant);
    return res.json(restaurant);
};
exports.update = update;
const toggleActive = async (req, res) => {
    const restaurant = await repo().findOne({ where: { id: req.params.id } });
    if (!restaurant)
        return res.status(404).json({ message: 'Restaurant not found' });
    restaurant.is_active = !restaurant.is_active;
    await repo().save(restaurant);
    return res.json(restaurant);
};
exports.toggleActive = toggleActive;
