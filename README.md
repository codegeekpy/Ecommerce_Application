# AURA — Next-Gen Full-Stack E-Commerce Platform

A production-grade, luxury full-stack e-commerce web application engineered with **React**, **Tailwind CSS (v3)**, **Node.js / Express**, and **MongoDB (Mongoose)**.

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Interactive Product Catalog**: Real-time search, category filtering (Electronics, Smart Wearables, Home & Studio, Accessories), price range slider, and multi-criteria sorting (Price, Rating, Popularity, Newest).
- **Product Details Showcase**: Multi-image galleries, live stock alerts, technical specifications matrix, and related item recommendations.
- **Dynamic Shopping Bag Drawer**: Slide-over drawer with item quantity steppers, subtotal computation, estimated 18% GST, and a dynamic progress indicator for free global express shipping (₹9,999 threshold).
- **Streamlined Checkout**: Complete multi-section checkout capturing delivery addresses, shipping speeds (Standard vs Priority Overnight), and payment simulation.
- **Live Order Tracking**: Visual 4-step progress stepper (`Order Confirmed` ➔ `Processing in Hub` ➔ `In Transit` ➔ `Delivered`) with tracking numbers, courier data, and milestone logs.

### 🛡️ Authentication & Role-Based Access Control (RBAC)
- **JWT & bcryptjs Authentication**: Secure password hashing and token validation.
- **Role Guards**: Strict differentiation between `user` and `admin` roles on both frontend routes and backend APIs.
- **1-Click Demo Switcher**: Instant switching between Admin (`admin@store.com`) and Customer (`user@store.com`) accounts directly in the UI.

### 📊 Administrative Operations Console
- **Executive KPIs**: Real-time metrics for Gross Revenue (₹ INR), Total Orders, Total Catalog SKUs, Registered Customers, and Pending Orders.
- **Order Lifecycle Management**: Filter orders by status, inspect customer details, and update statuses (`Processing` ➔ `Shipped` ➔ `Delivered` ➔ `Cancelled`) with custom milestone notes and tracking numbers.
- **Product Catalog CRUD**: Modal for adding new products, editing existing specs/prices, and deleting discontinued items.
- **Customer Accounts Directory**: Inspection of registered user profiles.
- **System Diagnostics**: Live database connectivity monitor.

### 🗄️ Database Architecture
- **Mongoose / MongoDB Native**: Designed with schemas for `User`, `Product`, and `Order`.
- **Hybrid Local Fallback Engine**: If a local or MongoDB Atlas instance is not currently running, the server automatically activates a resilient embedded store (`server/data/db.json`), ensuring zero-friction onboarding with complete CRUD parity!
- **Zero-Setup MongoDB Atlas Support**: Simply provide `MONGODB_URI` in `server/.env` to connect to MongoDB Atlas anytime.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+)

### 2. Running Frontend & Backend Concurrently
From the project root:
```bash
npm run dev
```
Or start them individually:
```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm start

# Terminal 2: Vite React Frontend (Port 5173)
cd client
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Accounts

Use these pre-seeded accounts or use the **1-Click Demo Buttons** in the navigation bar and login screen:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@store.com` | `admin123` | Full Admin Dashboard, Catalog CRUD, Order Lifecycle & Status Control |
| **Customer** | `user@store.com` | `user123` | Browsing, Cart, Checkout, Personal Order Tracking & History |

---

## 📡 Backend API Endpoints

### Authentication & Users (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Login & receive JWT bearer token
- `GET /api/auth/profile` — Retrieve authenticated user profile
- `GET /api/auth/users` — List all registered users (Admin only)

### Product Catalog (`/api/products`)
- `GET /api/products` — Filter, search, and sort products
- `GET /api/products/categories` — Distinct list of categories
- `GET /api/products/:id` — Single product details
- `POST /api/products` — Create new equipment item (Admin only)
- `PUT /api/products/:id` — Update product details (Admin only)
- `DELETE /api/products/:id` — Delete product (Admin only)

### Orders & Tracking (`/api/orders`)
- `POST /api/orders` — Place order and generate tracking code
- `GET /api/orders/myorders` — Retrieve logged-in user orders
- `GET /api/orders/:id` — Retrieve single order tracking invoice
- `GET /api/orders` — List all orders across store (Admin only)
- `PUT /api/orders/:id/status` — Update order status, courier, and tracking (Admin only)

### Analytics & System Metrics (`/api/stats`)
- `GET /api/stats/dashboard` — Live revenue, order counts, and system metrics (Admin only)
- `GET /api/health` — Database health check and server uptime

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v3, React Router DOM v7, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Mongoose, JSON Web Tokens (JWT), bcryptjs, CORS, Dotenv.
- **Database**: MongoDB (via Mongoose) with automated local JSON persistence fallback.
