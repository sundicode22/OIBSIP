# Pizza Delivery – Backend

REST API for the pizza delivery platform: authentication, menu, inventory, orders, Razorpay payments and low-stock email alerts.

**Stack:** Node.js · Express 5 · TypeScript · Prisma (MongoDB) · Zod · JWT · Nodemailer · node-cron · Razorpay

---

## Run it

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL and JWT_SECRET at minimum
npx prisma generate
npx prisma db push
npm run dev                 # http://localhost:4000/api/health
```

Full setup, including creating an admin and adding menu data: [docs/getting-started.md](../../docs/getting-started.md).

## Scripts

| Command | What it does |
| ------- | ------------ |
| `npm run dev` | Run with auto-reload (`tsx watch`) |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run the compiled build |
| `npm run prisma:generate` | Regenerate the Prisma client after schema changes |
| `npx prisma studio` | Browse and edit the database in the browser |

## Code layout

```text
src/
├── index.ts        # starts the server and cron jobs
├── app.ts          # Express app: middleware → /api routes → error handlers
├── routes/         # URL → guards → controller
├── middleware/     # requireAuth, requireRoles, 404 + error handler
├── controller/     # request handlers
├── schema/         # Zod request schemas
├── services/       # data access and side effects
├── utils/          # errors, responses, tokens, hashing, Razorpay
├── jobs/           # scheduled tasks
└── configs/        # env constants, Prisma, Nodemailer, Cloudinary clients
```

## Further reading

- [Architecture](../../docs/architecture.md) – layers, request flow, business flows
- [API reference](../../docs/api-reference.md) – every endpoint
- [Data model](../../docs/data-model.md) – collections and relations
- [Dependencies](../../docs/dependencies.md) – what each package is for
- [Known issues](../../docs/known-issues.md) – current bugs and risks
