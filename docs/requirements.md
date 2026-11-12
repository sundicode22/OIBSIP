# Requirements and progress

This is the original brief for **Task 1 · Pizza Delivery Full-Stack Application**, with the current status of each item.

**Status key:** ✅ done · 🟡 backend done, frontend missing · ⬜ not started

_Last reviewed: 2026-11-12_

---

## Objective

Build a production-grade, full-stack pizza ordering and inventory management platform with separate Admin and User roles, real-time order tracking, payment integration, and automated stock notifications.

**Required stack:** React.js (frontend), Node.js + Express.js (backend), MongoDB (database), Razorpay (payment, test mode).

**Chosen stack:** as required, plus TypeScript on both sides, Prisma as the MongoDB client, Vite, Tailwind CSS with shadcn/ui, and TanStack Query.

---

## User side

| Status | Requirement | Where |
| :----: | ----------- | ----- |
| ✅ | User registration with email verification | `POST /auth/register`, `GET /auth/verify-email`; `RegisterPage`, `VerifyEmailPage` |
| ✅ | User login with JWT-based authorisation | `POST /auth/login`; `LoginPage` |
| ✅ | Forgot password flow (email reset link) | `POST /auth/forgot-password`, `POST /auth/reset-password`; matching pages |
| 🟡 | Dashboard displaying available pizza varieties | `GET /pizzas` |
| 🟡 | Custom pizza builder – step 1: choose a base (5 options) | `GET /ingredients` (grouped), `POST /orders` with `customPizza` |
| 🟡 | Step 2: choose a sauce (5 options) | same |
| 🟡 | Step 3: choose a cheese | same |
| 🟡 | Step 4: choose vegetables (multiple) | same |
| 🟡 | Order summary page before payment | `POST /orders` returns a `summary` |
| 🟡 | Razorpay checkout (test mode) | `POST /orders`, `POST /orders/verify` |
| 🟡 | Real-time order status on the user dashboard | `GET /orders/my-orders` (to be polled) |

## Admin side

| Status | Requirement | Where |
| :----: | ----------- | ----- |
| ✅ | Separate admin login, not reachable from user registration | `POST /auth/admin-login`; `AdminLoginPage` |
| 🟡 | Inventory dashboard: bases, sauces, cheeses, vegetables | `GET /admin/inventory` |
| ✅ | Stock automatically decremented after each order | `POST /orders` (decrements on order creation) |
| 🟡 | Manual stock update for each item | `PATCH /admin/inventory/:id` |
| ✅ | Email to admin when an item falls below a threshold, via a scheduled job | `jobs/inventory.job.ts` (hourly, `LOW_STOCK_THRESHOLD`) |
| 🟡 | Order management panel: view all orders, update status | `GET /admin/orders`, `PATCH /admin/orders/:id/status` |
| 🟡 | Status changes reflected in real time for the user (polling or WebSockets) | Polling-ready endpoint; no frontend yet |

## Not yet covered by any requirement above

- A seed script with the 5 bases, 5 sauces, cheeses and vegetables the brief asks for.
- Route protection in the frontend (logged-out visitors can open sidebar pages).
- Tests.

---

## Suggested learning resources (from the brief)

- "MERN stack full project tutorial 2024" on YouTube, for end-to-end architecture.
- [Razorpay Node.js integration docs](https://razorpay.com/docs/payments/server-integration/nodejs/), for test-mode checkout.
- [Nodemailer docs](https://nodemailer.com/) and [node-cron](https://github.com/node-cron/node-cron), for email and scheduled jobs.
