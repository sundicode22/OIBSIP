# Getting started

This guide takes you from a fresh clone to both apps running locally, with an admin account and some menu data to test against.

**Time needed:** about 15 minutes.

---

## 1. Prerequisites

| Tool | Version | Check with |
| ---- | ------- | ---------- |
| Node.js | 20 or newer (developed on 22) | `node -v` |
| npm | 9 or newer | `npm -v` |
| MongoDB | Atlas cluster, or a local replica set | – |
| An SMTP account | Optional – needed only to actually receive emails | – |

**Why a replica set?** Prisma uses MongoDB transactions (order creation and payment confirmation run inside one), and MongoDB only supports transactions on replica sets. A free MongoDB Atlas cluster is already a replica set, so it is the easiest option.

---

## 2. Clone the repository

```bash
git clone https://github.com/sundicode22/OIBSIP.git
cd OIBSIP/WebDev-L2-Task1-Pizza-Delivery-Full-Stack-Application
```

---

## 3. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in at least:

- `DATABASE_URL` – your MongoDB connection string.
- `JWT_SECRET` – a long random string. The file shows a one-line command to generate one.

All variables are described below in [Environment variables](#environment-variables).

Then generate the database client and create the collections:

```bash
npx prisma generate     # writes the typed client to src/generated/prisma (git-ignored)
npx prisma db push      # syncs prisma/schema.prisma to MongoDB
npm run dev             # starts the API with auto-reload
```

Check it is alive:

```bash
curl http://localhost:4000/api/health
# {"status":"ok","timestamp":"..."}
```

> MongoDB does not use migration files, so this project uses `prisma db push` instead of `prisma migrate`. Re-run it whenever `schema.prisma` changes, followed by `npx prisma generate`.

---

## 4. Set up the frontend

In a second terminal:

```bash
cd frontend
npm install             # a bun.lock is also committed, so `bun install` works too
cp .env.example .env
```

Edit `.env` so the frontend talks to your local backend instead of the placeholder API:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Start it:

```bash
npm run dev             # http://localhost:5173
```

---

## 5. Create your first admin

There is deliberately no way to register as an admin through the API. To create one:

1. Register a normal account, either through the UI at `/register` or with curl:

   ```bash
   curl -X POST http://localhost:4000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Admin","email":"admin@example.com","password":"secret123"}'
   ```

2. Open Prisma Studio, a browser-based database editor:

   ```bash
   cd backend && npx prisma studio
   ```

3. In the `User` table, change that user's `role` from `USER` to `ADMIN` (and set `isEmailVerified` to `true` if you skipped email), then save.

4. Log in at `/admin-login`, or call `POST /api/auth/admin-login`, to get an admin token.

---

## 6. Add menu data

The database starts empty and there is no seed script yet. Using the admin token from step 5:

```bash
TOKEN="<paste admin token>"
API=http://localhost:4000/api

# Ingredient types. The names matter: the admin dashboard groups items by
# whether the type name contains "base", "sauce", "cheese" or "veg".
curl -X POST $API/ingredients/types -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"name":"Base"}'
# repeat for Sauce, Cheese, Vegetable

# An ingredient (use a typeId returned above)
curl -X POST $API/ingredients -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Thin Crust","typeId":"<baseTypeId>","stock":50,"description":"Crispy thin base"}'
```

The request bodies for all endpoints are in the [API reference](api-reference.md).

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Required | Default | Purpose |
| -------- | :------: | ------- | ------- |
| `DATABASE_URL` | Yes | – | MongoDB connection string, read by Prisma |
| `JWT_SECRET` | Yes | an insecure built-in string | Signs and verifies login tokens |
| `JWT_EXPIRES_IN` | No | `7d` | How long a login token stays valid |
| `PORT` | No | `4000` | HTTP port of the API |
| `CLIENT_URL` | No | `http://localhost:5173` | Base URL used in email links |
| `EMAIL_HOST` | No | `smtp.gmail.com` | SMTP server |
| `EMAIL_PORT` | No | `587` | SMTP port |
| `EMAIL_USER` | No | `admin@pizzadelivery.com` | SMTP login, **and** the address that receives low-stock alerts |
| `EMAIL_PASSWORD` | No | empty | SMTP password (for Gmail, an App Password) |
| `EMAIL_FROM` | No | `noreply@pizzadelivery.com` | Sender address on outgoing mail |
| `RAZORPAY_KEY_ID` | No | `rzp_test_sample_key` | Razorpay key; the default switches on offline simulation |
| `RAZORPAY_KEY_SECRET` | No | `rzp_test_sample_secret` | Used to verify payment signatures |
| `CLOUDINARY_*` | No | empty | Image upload credentials (not used by any route yet) |
| `LOW_STOCK_THRESHOLD` | No | `20` | Stock level below which an ingredient counts as low |

`JWT_SECRET` falls back to a hard-coded value if unset. That keeps local development simple, but **always set it** anywhere other than your own machine.

### Frontend (`frontend/.env`)

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `VITE_API_BASE_URL` | `https://jsonplaceholder.typicode.com` | Base URL of the API, including `/api` |

Vite only exposes variables that start with `VITE_` to browser code. Anything in this file ends up in the public JavaScript bundle, so never put secrets here.

---

## Available scripts

### Backend

| Command | What it does |
| ------- | ------------ |
| `npm run dev` | Runs `src/index.ts` with `tsx`, restarting on file changes |
| `npm run build` | Compiles TypeScript to `dist/` (currently fails, see [known issues](known-issues.md)) |
| `npm start` | Runs the compiled `dist/index.js` |
| `npm run prisma:generate` | Same as `npx prisma generate` |

### Frontend

| Command | What it does |
| ------- | ------------ |
| `npm run dev` | Vite dev server with hot reload on port 5173 |
| `npm run build` | Type-checks then bundles to `dist/` (currently fails, see [known issues](known-issues.md)) |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run lint` | Runs ESLint |

---

## Troubleshooting

| Symptom | Likely cause and fix |
| ------- | -------------------- |
| `Cannot find module '../generated/prisma/client'` | You skipped `npx prisma generate`. |
| `Transactions are not supported by this deployment` | MongoDB is not a replica set. Use Atlas, or start local `mongod` with `--replSet`. |
| Registration works but no email arrives | SMTP is not configured. The error is logged to the backend console and the request still succeeds. Mark the user verified in Prisma Studio instead. |
| Frontend shows data that has nothing to do with pizza | `VITE_API_BASE_URL` still points at `jsonplaceholder.typicode.com`. |
| Every request redirects to `/login` | The API returned 401: your token is missing or expired. Log in again. |
