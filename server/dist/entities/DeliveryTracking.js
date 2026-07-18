"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryTracking = void 0;
const typeorm_1 = require("typeorm");
const Order_1 = require("./Order");
const User_1 = require("./User");
let DeliveryTracking = class DeliveryTracking {
    id;
    latitude;
    longitude;
    timestamp;
    order_id;
    delivery_agent_id;
    order;
    delivery_agent;
};
exports.DeliveryTracking = DeliveryTracking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DeliveryTracking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 7 }),
    __metadata("design:type", Number)
], DeliveryTracking.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 7 }),
    __metadata("design:type", Number)
], DeliveryTracking.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DeliveryTracking.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], DeliveryTracking.prototype, "order_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], DeliveryTracking.prototype, "delivery_agent_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order_1.Order, (o) => o.tracking, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", Order_1.Order)
], DeliveryTracking.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (u) => u.tracking_updates),
    (0, typeorm_1.JoinColumn)({ name: 'delivery_agent_id' }),
    __metadata("design:type", User_1.User)
], DeliveryTracking.prototype, "delivery_agent", void 0);
exports.DeliveryTracking = DeliveryTracking = __decorate([
    (0, typeorm_1.Entity)('delivery_tracking')
], DeliveryTracking);
