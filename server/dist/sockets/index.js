"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);
        socket.on('join-order', (orderId) => {
            socket.join(`order-${orderId}`);
        });
        socket.on('leave-order', (orderId) => {
            socket.leave(`order-${orderId}`);
        });
        socket.on('location-update', (data) => {
            io.to(`order-${data.orderId}`).emit('delivery-location', {
                latitude: data.latitude,
                longitude: data.longitude,
                timestamp: new Date(),
            });
        });
        socket.on('order-status-update', (data) => {
            io.to(`order-${data.orderId}`).emit('order-status-changed', {
                orderId: data.orderId,
                status: data.status,
                timestamp: new Date(),
            });
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
exports.setupSocket = setupSocket;
