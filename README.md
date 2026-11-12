# OIBSIP – Pizza Delivery Full-Stack Application

A full-stack pizza ordering and inventory management platform, built as **Task 1 (Web Development, Level 2)** of the Oasis Infobyte internship (OIBSIP).

Customers can register, browse pizzas, build a custom pizza, pay with Razorpay (test mode) and follow their order status. Admins log in through a separate portal, manage ingredient stock, update order statuses, and receive an email when stock runs low.

> **Status: work in progress.** The backend API covers authentication, menu, inventory, orders and payments. The frontend currently covers the authentication screens and an app shell; the ordering, pizza builder and admin screens are not built yet. See [Project status](#project-status).

---

## Table of contents

- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Quick start](#quick-start)
- [Documentation](#documentation)
- [Project status](#project-status)
- [License](#license)

---

## Tech stack

| Layer    | Technology                                                        |
| -------- | ----------------------------------------------------------------- |
| Frontend | React 18, Vite 6, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query |
| Backend  | Node.js, Express 5, TypeScript, Zod                               |
| Database | MongoDB, accessed through the Prisma ORM                          |
| Payments | Razorpay (test mode, with an offline simulation fallback)         |
| Email    | Nodemailer over SMTP                                              |
| Jobs     | node-cron (hourly low-stock check)                                |

Every package and the reason it is used is listed in [docs/dependencies.md](docs/dependencies.md).

---

## Repository layout

```text
OIBSIP/
├── README.md                     ← you are here
├── docs/                         ← project-wide documentation
└── WebDev-L2-Task1-Pizza-Delivery-Full-Stack-Application/
    ├── backend/                  ← Express + Prisma REST API (port 4000)
    └── frontend/                 ← React + Vite single-page app (port 5173)
```

---

## Quick start

You need **Node.js 20+** and a **MongoDB** database (MongoDB Atlas free tier works; Prisma requires MongoDB to run as a replica set, which Atlas does by default).

```bash
# 1. Backend
cd WebDev-L2-Task1-Pizza-Delivery-Full-Stack-Application/backend
cp .env.example .env              # then fill in DATABASE_URL and JWT_SECRET at minimum
npm install
npx prisma generate               # generates the typed database client
npx prisma db push                # creates collections and indexes in MongoDB
npm run dev                       # http://localhost:4000/api/health

# 2. Frontend (in a second terminal)
cd WebDev-L2-Task1-Pizza-Delivery-Full-Stack-Application/frontend
cp .env.example .env              # set VITE_API_BASE_URL=http://localhost:4000/api
npm install                       # or: bun install (a bun.lock is committed)
npm run dev                       # http://localhost:5173
```

The full walkthrough, including how to create the first admin account, is in [docs/getting-started.md](docs/getting-started.md).

---

## Documentation

| Document | What it answers |
| -------- | --------------- |
| [Getting started](docs/getting-started.md) | How do I run this on my machine? |
| [Architecture](docs/architecture.md) | How is the code organised, and how does a request flow through it? |
| [API reference](docs/api-reference.md) | Which endpoints exist, what do they accept and return? |
| [Data model](docs/data-model.md) | What is stored in the database, and how is it related? |
| [Dependencies](docs/dependencies.md) | Which packages are used, and why? |
| [Requirements & progress](docs/requirements.md) | What was asked for, and what is done? |
| [Known issues](docs/known-issues.md) | What is broken or risky right now? |
| [Writing documentation](docs/writing-documentation.md) | How these docs are structured, and how to keep them good |

Package-level notes live next to the code in [`backend/README.md`](WebDev-L2-Task1-Pizza-Delivery-Full-Stack-Application/backend/README.md) and [`frontend/README.md`](WebDev-L2-Task1-Pizza-Delivery-Full-Stack-Application/frontend/README.md).

---

## Project status

| Area | Backend | Frontend |
| ---- | :-----: | :------: |
| Registration, email verification, login, password reset | Done | Done |
| Separate admin login | Done | Done |
| Pizza menu | Done | Not started |
| Custom pizza builder | Done | Not started |
| Orders and Razorpay checkout | Done (test mode) | Not started |
| Order status tracking | Done | Not started |
| Inventory dashboard and stock updates | Done | Not started |
| Low-stock email alerts | Done | n/a |

Neither package currently passes a production build (`npm run build`); the reasons are listed in [docs/known-issues.md](docs/known-issues.md).

---

## License

No license has been chosen yet. Until one is added, all rights are reserved by the author.
