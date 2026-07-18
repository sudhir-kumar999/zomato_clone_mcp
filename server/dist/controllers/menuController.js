"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleAvailability = exports.deleteItem = exports.updateItem = exports.createItem = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getByRestaurant = void 0;
const data_source_1 = require("../data-source");
const MenuCategory_1 = require("../entities/MenuCategory");
const MenuItem_1 = require("../entities/MenuItem");
const Restaurant_1 = require("../entities/Restaurant");
const catRepo = () => data_source_1.AppDataSource.getRepository(MenuCategory_1.MenuCategory);
const itemRepo = () => data_source_1.AppDataSource.getRepository(MenuItem_1.MenuItem);
const restRepo = () => data_source_1.AppDataSource.getRepository(Restaurant_1.Restaurant);
const verifyOwner = async (restaurantId, userId) => {
    const restaurant = await restRepo().findOne({ where: { id: restaurantId, owner_id: userId } });
    return !!restaurant;
};
const getByRestaurant = async (req, res) => {
    const categories = await catRepo().find({
        where: { restaurant_id: req.params.restaurantId },
        relations: ['items'],
        order: { sort_order: 'ASC' },
    });
    return res.json(categories);
};
exports.getByRestaurant = getByRestaurant;
const createCategory = async (req, res) => {
    const { restaurant_id, name } = req.body;
    if (!(await verifyOwner(restaurant_id, req.user.id))) {
        return res.status(403).json({ message: 'Not your restaurant' });
    }
    const category = catRepo().create({ name, restaurant_id, sort_order: req.body.sort_order || 0 });
    await catRepo().save(category);
    return res.status(201).json(category);
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    const category = await catRepo().findOne({ where: { id: req.params.id }, relations: ['restaurant'] });
    if (!category || category.restaurant.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    Object.assign(category, req.body);
    await catRepo().save(category);
    return res.json(category);
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    const category = await catRepo().findOne({ where: { id: req.params.id }, relations: ['restaurant'] });
    if (!category || category.restaurant.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    await catRepo().remove(category);
    return res.json({ message: 'Category deleted' });
};
exports.deleteCategory = deleteCategory;
const createItem = async (req, res) => {
    const { restaurant_id } = req.body;
    if (!(await verifyOwner(restaurant_id, req.user.id))) {
        return res.status(403).json({ message: 'Not your restaurant' });
    }
    const item = itemRepo().create(req.body);
    await itemRepo().save(item);
    return res.status(201).json(item);
};
exports.createItem = createItem;
const updateItem = async (req, res) => {
    const item = await itemRepo().findOne({ where: { id: req.params.id }, relations: ['restaurant'] });
    if (!item || item.restaurant.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    Object.assign(item, req.body);
    await itemRepo().save(item);
    return res.json(item);
};
exports.updateItem = updateItem;
const deleteItem = async (req, res) => {
    const item = await itemRepo().findOne({ where: { id: req.params.id }, relations: ['restaurant'] });
    if (!item || item.restaurant.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    await itemRepo().remove(item);
    return res.json({ message: 'Item deleted' });
};
exports.deleteItem = deleteItem;
const toggleAvailability = async (req, res) => {
    const item = await itemRepo().findOne({ where: { id: req.params.id }, relations: ['restaurant'] });
    if (!item || item.restaurant.owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
    }
    item.is_available = !item.is_available;
    await itemRepo().save(item);
    return res.json(item);
};
exports.toggleAvailability = toggleAvailability;
