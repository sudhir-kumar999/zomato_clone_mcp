# FoodExpress — Zomato Clone

A full-stack food delivery web application built with **React + TypeScript**, **Node.js + Express**, **PostgreSQL + TypeORM**, and **Socket.IO** for real-time tracking.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Material UI (MUI), Leaflet.js |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL + TypeORM |
| Auth | JWT (email/password) |
| Payments | Razorpay |
| Real-time | Socket.IO |
| Maps | Leaflet.js (OpenStreetMap) |
| Deployment | Render.com |

## Features

### Customer
- Browse restaurants and menus
- Add items to cart and place orders
- Razorpay payment integration
- Real-time order status tracking on map
- Order history

### Restaurant Owner
- Manage restaurant profile
- CRUD menu categories and items
- View and update order statuses
- Toggle restaurant active/inactive

### Delivery Agent
- View assigned deliveries
- Update delivery status (picked up → out for delivery → delivered)
- Share GPS location via browser geolocation

### Admin
- Dashboard with stats (users, restaurants, orders, revenue)
- Manage users (ban/unban)
- Manage restaurants (approve/reject, enable/disable)
- Manage orders (assign delivery agents)
- Manage delivery agents (add/verify)

## Architecture

```
zomato_clone/
├── client/                 # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── api/            # Axios HTTP client
│   │   ├── components/     # Layout, MapView, ProtectedRoute
│   │   ├── context/        # AuthContext, CartContext
│   │   ├── pages/          # All page components
│   │   │   ├── admin/      # Admin panel pages
│   │   │   ├── owner/      # Restaurant owner pages
│   │   │   └── agent/      # Delivery agent pages
│   │   └── types/          # TypeScript interfaces
│   └── index.html
├── server/                 # Express backend (TypeScript)
│   ├── src/
│   │   ├── controllers/    # Business logic layer
│   │   ├── entities/       # TypeORM entities
│   │   ├── middleware/     # Auth & role guards
│   │   ├── routes/         # Express route handlers
│   │   └── sockets/        # Socket.IO event handlers
│   └── seed.ts            # Database seeder
└── README.md
```

## Database Schema

- **users** — User accounts with roles (customer, restaurant_owner, delivery_agent, admin)
- **restaurants** — Restaurant profiles with location, approval status, commission
- **menu_categories** — Category groupings (e.g., Pizzas, Sides)
- **menu_items** — Individual food items with price, availability, dietary tags
- **orders** — Order records with status tracking and payment info
- **order_items** — Line items within each order
- **delivery_tracking** — GPS coordinates logged during delivery

## API Routes

### Auth `/api/auth`
| Method | Route | Access |
|---|---|---|
| POST | /register | Public |
| POST | /login | Public |
| GET | /me | Authenticated |

### Restaurants `/api/restaurants`
| Method | Route | Access |
|---|---|---|
| GET | / | Public |
| GET | /:id | Public |
| POST | / | Restaurant Owner |
| PUT | /:id | Restaurant Owner |
| PUT | /:id/toggle-active | Owner / Admin |

### Menu `/api/menu`
| Method | Route | Access |
|---|---|---|
| GET | /restaurant/:id | Public |
| POST | /category | Restaurant Owner |
| PUT | /category/:id | Restaurant Owner |
| DELETE | /category/:id | Restaurant Owner |
| POST | /item | Restaurant Owner |
| PUT | /item/:id | Restaurant Owner |
| DELETE | /item/:id | Restaurant Owner |
| PUT | /item/:id/toggle-availability | Restaurant Owner |

### Orders `/api/orders`
| Method | Route | Access |
|---|---|---|
| POST | / | Customer |
| GET | / | Authenticated (scoped) |
| GET | /:id | Authenticated |
| PUT | /:id/status | Owner / Agent / Admin |
| PUT | /:id/assign-delivery | Admin |

### Payments `/api/payments`
| Method | Route | Access |
|---|---|---|
| POST | /create-order | Customer |
| POST | /verify | Authenticated |

### Tracking `/api/tracking`
| Method | Route | Access |
|---|---|---|
| POST | /location | Delivery Agent |
| GET | /:orderId | Authenticated |

### Admin `/api/admin`
| Method | Route | Access |
|---|---|---|
| GET | /dashboard | Admin |
| GET | /users | Admin |
| PUT | /users/:id/ban | Admin |
| GET | /restaurants | Admin |
| PUT | /restaurants/:id/approve | Admin |
| GET | /delivery-agents | Admin |
| POST | /delivery-agents | Admin |
| GET | /delivery-agents/:id/earnings | Admin |

## Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Razorpay account (test mode)

### 1. Clone and install
```bash
git clone <repo-url>
cd zomato_clone
npm install       # Root (concurrently)
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Configure environment

**Server** (`server/.env`):
```env
DATABASE_URL=postgres://user:password@localhost:5432/zomato_clone
JWT_SECRET=your-secret-key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
PORT=5000
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
```

### 3. Create database
```bash
createdb zomato_clone
```

### 4. Seed data
```bash
cd server && npm run seed
```

### 5. Run development servers
```bash
# From root — runs both server and client
npm run dev

# Or individually:
npm run dev:server   # http://localhost:5000
npm run dev:client   # http://localhost:3000
```

## Seed Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | password123 |
| Restaurant Owner | owner@example.com | password123 |
| Delivery Agent | agent@example.com | password123 |
| Customer | customer@example.com | password123 |

## Deployment (Render.com)

### Server
1. Create a new **Web Service** on Render
2. Connect your GitHub repo
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - Add environment variables from `server/.env`
4. Create a **PostgreSQL** database on Render and copy the connection URL

### Client
1. Create a new **Static Site** on Render
2. Settings:
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - Add environment variable `VITE_API_URL` pointing to your server URL

## Real-time Tracking (MVP)

The current implementation uses **status-based tracking** with simulated map visualization:
- Delivery agents click status updates (picked up, out for delivery, delivered)
- Each update emits a Socket.IO event to the customer's order view
- Map shows the restaurant, delivery location, and agent position markers
- Delivery agents can share their browser geolocation to ping GPS coordinates

**Phase 2** will introduce real GPS tracking with background location sharing.

## License

MIT
