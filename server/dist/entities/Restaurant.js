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
exports.Restaurant = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const MenuCategory_1 = require("./MenuCategory");
const MenuItem_1 = require("./MenuItem");
const Order_1 = require("./Order");
let Restaurant = class Restaurant {
    id;
    name;
    description;
    cuisine;
    address;
    latitude;
    longitude;
    cover_image;
    is_active;
    is_approved;
    commission_rate;
    created_at;
    owner_id;
    owner;
    categories;
    menu_items;
    orders;
};
exports.Restaurant = Restaurant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Restaurant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Restaurant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "cuisine", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Restaurant.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Number)
], Restaurant.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "cover_image", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { default: true }),
    __metadata("design:type", Boolean)
], Restaurant.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { default: false }),
    __metadata("design:type", Boolean)
], Restaurant.prototype, "is_approved", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Restaurant.prototype, "commission_rate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Restaurant.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Restaurant.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (u) => u.restaurants),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", User_1.User)
], Restaurant.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => MenuCategory_1.MenuCategory, (c) => c.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => MenuItem_1.MenuItem, (i) => i.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "menu_items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Order_1.Order, (o) => o.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "orders", void 0);
exports.Restaurant = Restaurant = __decorate([
    (0, typeorm_1.Entity)('restaurants')
], Restaurant);
