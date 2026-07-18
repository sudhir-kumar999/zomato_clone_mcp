"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTracking = exports.updateLocation = void 0;
const data_source_1 = require("../data-source");
const DeliveryTracking_1 = require("../entities/DeliveryTracking");
const repo = () => data_source_1.AppDataSource.getRepository(DeliveryTracking_1.DeliveryTracking);
const updateLocation = async (req, res) => {
    const { order_id, latitude, longitude } = req.body;
    const tracking = repo().create({
        order_id,
        delivery_agent_id: req.user.id,
        latitude,
        longitude,
    });
    await repo().save(tracking);
    return res.json(tracking);
};
exports.updateLocation = updateLocation;
const getTracking = async (req, res) => {
    const updates = await repo().find({
        where: { order_id: req.params.orderId },
        order: { timestamp: 'ASC' },
    });
    return res.json(updates);
};
exports.getTracking = getTracking;
