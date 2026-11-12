# Architecture

This document explains how the system is put together: the big pieces, how a request flows through the backend, and how the frontend is organised. Read it before changing code so you know where new code belongs.

---

## System overview


- The **frontend** is a single-page app. It never talks to the database; everything goes through the REST API.
- The **backend** is a single Express process. It also hosts the scheduled low-stock job, so the job only runs while the API is running.
- **Authentication is stateless.** On login the API returns a JSON Web Token (JWT); the frontend stores it in `localStorage` and sends it on every request as `Authorization: Bearer <token>`. The server keeps no session.

---

## Backend

### Folder structure

```text
backend/
├── prisma/schema.prisma     # database models (single source of truth for data shape)
├── prisma.config.ts         # Prisma CLI configuration
└── src/
    ├── index.ts             # entry point: starts HTTP server + cron jobs
    ├── app.ts               # builds the Express app (middleware, routes, error handlers)
    ├── configs/             # third-party clients and env constants
    ├── routes/              # URL → middleware → controller mapping
    ├── middleware/          # auth guards, 404 and global error handler
    ├── controller/          # request handlers: validate, run logic, send response
    ├── schema/              # Zod schemas describing valid request bodies
    ├── services/            # reusable data-access and side-effect functions
    ├── utils/               # errors, response helpers, tokens, hashing, Razorpay
    ├── jobs/                # scheduled tasks (node-cron)
    └── generated/prisma/    # Prisma client – generated, git-ignored
```

### The layers and their responsibilities

Each layer only calls the one beneath it. This keeps HTTP concerns out of business logic and makes each part testable on its own.

| Layer | Folder | Responsibility | Should **not** |
| ----- | ------ | -------------- | -------------- |
| Routing | `routes/` | Map a method + path to guards and a controller | Contain logic |
| Guards | `middleware/` | Reject unauthenticated or unauthorised requests | Touch the database |
| Controller | `controller/` | Validate input, orchestrate the work, choose the status code | Build raw SQL/queries that are reused elsewhere |
| Validation | `schema/` | Declare what a valid body looks like | Have side effects |
| Service | `services/` | Database access and side effects (email, uploads) | Know about `req`/`res` |
| Utilities | `utils/` | Small pure helpers shared everywhere | Depend on Express routing |

In practice the split is not yet strict: the auth controller goes through `userService`, but the pizza, ingredient, order and admin controllers call `prisma` directly, and most functions in `services/` are currently unused. Moving that logic into services is listed in [known issues](known-issues.md).

### Life of a request

Here is what happens when an admin updates an order's status with `PATCH /api/admin/orders/:id/status`:


### Cross-cutting conventions

**Consistent response shape.** Every response goes through `utils/response.ts`, so the frontend can always rely on:

```json
{ "success": true, "message": "optional", "data": { } }
{ "success": false, "message": "what went wrong", "errors": [ { "field": "email", "message": "Invalid email address" } ] }
```

**Errors are thrown, not returned.** Controllers throw typed errors from `utils/errors.ts` (`BadRequestError` → 400, `UnauthorizedError` → 401, `ForbiddenError` → 403, `NotFoundError` → 404, `ConflictError` → 409, `ValidationError` → 422). `express-async-handler` forwards errors from async functions to `middleware/error.middleware.ts`, which converts them into the JSON shape above. That handler also translates:

- `ZodError` → 422 with a per-field list of problems
- Prisma `P2002` (unique constraint) → 409
- Prisma `P2025` (record not found) → 404
- anything else → 500, logged to the console

**Validation at the edge.** Every controller parses `req.body` with a Zod schema before using it, so the rest of the code can trust its input types.

**Configuration in one place.** All environment variables are read once in `configs/constants.ts`, with defaults. Code imports `constants` instead of touching `process.env`.

**Barrel files.** Each folder has an `index.ts` that re-exports its contents, so imports look like `import { requireAuth } from "../middleware"`.

### Key business flows

#### Ordering and payment

Pricing: a menu order costs the sum of the selected pizzas' prices. A custom pizza costs a fixed ₹250 plus ₹30 per vegetable.

Stock is decremented when the order is **created**, before payment, and is not given back if the payment never happens.

#### Order status lifecycle

The admin can set any status at any time; the API does not enforce an order between them. The intended progression is:
The user's view of the status is real-time only in the sense that the frontend can poll `GET /orders/my-orders`; there are no WebSockets.

#### Account lifecycle

1. `POST /auth/register` hashes the password with bcrypt, creates the user with role `USER`, stores a random 32-byte token in `VerificationToken` and emails `CLIENT_URL/verify-email?token=…`.
2. `GET /auth/verify-email/:token` marks the user verified and deletes their tokens.
3. `POST /auth/forgot-password` creates another token and emails `CLIENT_URL/reset-password?token=…`.
4. `POST /auth/reset-password` sets a new hashed password and deletes the tokens.

Email failures are logged but do not fail the request, so registration works without SMTP configured.

#### Low-stock alerts

`jobs/inventory.job.ts` registers a cron job with the schedule `0 * * * *` (minute 0 of every hour). It finds every ingredient with `stock < LOW_STOCK_THRESHOLD` and, if there are any, emails the list to `EMAIL_USER`. It sends the alert every hour for as long as the stock stays low.

#### Razorpay test mode

`utils/razorpay.ts` has two modes:

- **Real test mode** – when `RAZORPAY_KEY_ID` is set to a real `rzp_test_…` key, orders are created through the Razorpay API and signatures are checked with HMAC-SHA256 of `"<orderId>|<paymentId>"`.
- **Offline simulation** – with the default placeholder key, a fake `order_test_…` id is generated locally, and the signatures `test_signature` or `simulated_success` are accepted. This lets you test the whole flow without a Razorpay account.

---

## Frontend

### Folder structure

The frontend uses a **feature-based** layout: everything that belongs to one business area lives together in `src/features/<name>/`.

```text
frontend/src/
├── main.tsx                 # mounts React; sets up Router, QueryClient, Toaster
├── App.tsx                  # route table
├── index.css                # Tailwind layers + shadcn colour tokens
├── lib/
│   ├── axios.ts             # shared HTTP client with auth + 401 interceptors
│   ├── queryKeys.ts         # central TanStack Query cache keys
│   └── utils.ts             # cn() – merges Tailwind class names
├── components/
│   ├── ui/                  # shadcn/ui primitives (button, card, dialog, table, sidebar…)
│   ├── layouts/             # RootLayout, AppSidebar, Navbar
│   └── shared/              # LoadingSpinner, ErrorMessage
├── features/
│   ├── auth/                # login, admin login, register, verify, forgot/reset password
│   ├── users/               # demo user CRUD screen (see note below)
│   └── home/                # dashboard landing page
└── pages/NotFoundPage.tsx
```

Inside a feature, files are split by role:

| Folder | Contains |
| ------ | -------- |
| `api/` | Plain functions that call the backend through `apiClient` |
| `hooks/` | TanStack Query hooks (`useQuery`/`useMutation`) wrapping the API functions |
| `schemas/` | Zod schemas for form validation (used with React Hook Form) |
| `types/` | TypeScript types for request and response bodies |
| `components/`, `pages/` | UI |
| `index.ts` | The feature's public exports |

### Data flow
- **Server state** (anything that comes from the API) is owned by TanStack Query, configured in `main.tsx` with a 5-minute stale time, one retry and no refetch on window focus.
- **Auth state** is the token and user object in `localStorage`, written by `useLogin` / `useAdminLogin` and removed by `useLogout` or a 401 response.
- **Forms** use React Hook Form with Zod schemas through `@hookform/resolvers`.
- **Notifications** use `sonner` toasts, triggered from the mutation hooks.

### Routes

| Path | Page | Layout |
| ---- | ---- | ------ |
| `/login` | `LoginPage` | Standalone |
| `/admin-login` | `AdminLoginPage` | Standalone |
| `/register` | `RegisterPage` | Standalone |
| `/forgot-password` | `ForgotPasswordPage` | Standalone |
| `/reset-password` | `ResetPasswordPage` | Standalone |
| `/verify-email`, `/verify-email/:token` | `VerifyEmailPage` | Standalone |
| `/` | `HomePage` | Sidebar (`RootLayout`) |
| `/users` | `UsersPage` | Sidebar (`RootLayout`) |
| `*` | `NotFoundPage` | Sidebar (`RootLayout`) |

None of the sidebar routes are protected yet; a logged-out visitor can open them.

> **Note on the `users` feature:** it calls `/users`, an endpoint that exists on the placeholder API `jsonplaceholder.typicode.com` but **not** on this backend. It was built as a template for how a CRUD feature should look. Use it as a pattern for the real `pizzas`, `orders` and `inventory` features.
