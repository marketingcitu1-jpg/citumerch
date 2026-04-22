# CIT-U Inventory System — Full-Stack Walkthrough

## What Was Built

A complete **React + Spring Boot + MySQL** full-stack application migrated from the original 4 HTML pages.

---

## Pages Created (10 total)

| Route | Page | Type |
|---|---|---|
| `/` | Landing Page | Public |
| `/login` | Staff Login | Public |
| `/register` | Staff Registration (2-step) | Public |
| `/student/preorder` | Student Pre-order Portal | Public |
| `/dashboard` | Inventory Dashboard | Protected |
| `/inventory` | Student Pre-orders Management | Protected |
| `/orders` | Inventory Items CRUD | Protected |
| `/reports` | Reports & Analytics | Protected |
| `/settings` | System Settings | Protected |
| `/profile` | User Profile & Password | Protected |

---

## Project Structure

```
d:\CITUMERCH\
├── frontend/               ← React (Vite + Tailwind CSS v4)
│   ├── index.html          ← Lexend + Material Symbols fonts
│   ├── vite.config.js      ← Proxy to :8080
│   └── src/
│       ├── api/axios.js            ← JWT-authenticated HTTP client
│       ├── context/AuthContext.jsx ← Login/register/logout state
│       ├── components/
│       │   ├── Sidebar.jsx         ← Navigation with active links
│       │   ├── Topbar.jsx          ← Page header with user info
│       │   └── ProtectedRoute.jsx  ← Auth guard
│       └── pages/ (10 pages)
│
└── backend/                ← Spring Boot 3.4 + Maven
    ├── pom.xml
    ├── database/schema.sql ← XAMPP setup script
    └── src/main/java/com/citu/inventory/
        ├── model/          ← User, InventoryItem, Order
        ├── repository/     ← JPA repositories
        ├── controller/     ← Auth, Inventory, Order, Dashboard
        └── security/       ← JwtUtil, JwtFilter, SecurityConfig
```

---

## How to Run

### 1. Setup Database (XAMPP)
1. Start **XAMPP** → Start **Apache** and **MySQL**
2. Open **phpMyAdmin** → `http://localhost/phpmyadmin`
3. Go to **SQL** tab and paste contents of `backend/database/schema.sql`
4. Click **Go** to execute

### 2. Start Spring Boot Backend
```bash
cd d:\CITUMERCH\backend
mvn spring-boot:run
```
Backend runs at: **http://localhost:8080**

### 3. Start React Frontend
```bash
cd d:\CITUMERCH\frontend
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## Default Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@cit.edu` | `Admin@123` |
| Staff | `j.delacruz@cit.edu` | `Staff@123` |

---

## REST API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | No | Login → returns JWT |
| POST | `/api/auth/register` | No | Register new staff |
| PUT | `/api/auth/profile` | Yes | Update profile |
| PUT | `/api/auth/change-password` | Yes | Change password |
| GET | `/api/dashboard/stats` | Yes | KPI counts |
| GET/POST | `/api/inventory` | Yes | List / Add items |
| PUT/DELETE | `/api/inventory/{id}` | Yes | Update / Delete item |
| GET | `/api/orders` | Yes | List all orders |
| PUT | `/api/orders/{id}/claim` | Yes | Mark as claimed |
| POST | `/api/orders/student` | No | Student submits pre-order |
