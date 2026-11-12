# Known issues

Problems found while documenting the code, grouped by severity. Each entry says where the problem is and how to fix it. Remove entries as they are resolved.

_Last reviewed: 2026-11-12_

**Severity key:**
- **High** – a security hole, data loss, or something that blocks a build
- **Medium** – incorrect behaviour a user or admin would notice
- **Low** – cleanup that makes the code easier to work with

---

## Build blockers

| Severity | Issue | Location | Fix |
| -------- | ----- | -------- | --- |
| High | `npm run build` fails: the file is an unfinished stub (`export const generateAuthToken =` with nothing after it). `npm run dev` still works because `tsx` only loads imported files. | `backend/src/services/jwt.service.ts` | Delete the file (token logic already lives in `utils/token.ts`) or finish it. |
| High | `npm run build` fails with ~10 type errors. | frontend | See below. |

The frontend type errors have four causes:

1. **No `src/vite-env.d.ts`.** Without it TypeScript does not know `import.meta.env` or `*.css` imports. Add a file containing `/// <reference types="vite/client" />`.
2. **`@types/node` not installed.** `vite.config.ts` uses `path` and `__dirname`. Run `npm i -D @types/node`.
3. **`Button` has no `asChild` prop.** `HomePage.tsx` and `NotFoundPage.tsx` use `<Button asChild>`, but the local `button.tsx` does not support it. Either add `@radix-ui/react-slot` and support `asChild` as stock shadcn does, or style the `<Link>` with `buttonVariants()` instead.
4. **Unused `React` import** in `UserFormDialog.tsx`.

---

## Security

| Severity | Issue | Location | Fix |
| -------- | ----- | -------- | --- |
| High | **Payment signature bypass.** The signatures `test_signature` and `simulated_success` are always accepted, even with real Razorpay keys, so anyone can confirm an order without paying. | `utils/razorpay.ts` → `verifyRazorpaySignature` | Only accept them when simulation mode is on (placeholder key) or `NODE_ENV !== "production"`. |
| High | **Password reset token returned in the API response.** `forgotPassword` returns `{ token }` and the controller sends it to the client, so anyone who knows an email can reset that account's password. | `services/users.service.ts`, `controller/auth.controller.ts` | Return only a message. The token must travel by email only. |
| High | **Verification and reset tokens are interchangeable.** Both live in `VerificationToken` with no type, so an email-verification link also works as a password-reset token. | `prisma/schema.prisma`, `users.service.ts` | Add a `type` field (`EMAIL_VERIFY` / `PASSWORD_RESET`) and check it. |
| Medium | Tokens never expire. | `VerificationToken` | Add `expiresAt` and reject expired tokens (e.g. 1 hour for reset, 24 hours for verification). Store a SHA-256 hash of the token rather than the token itself (`hashToken` already exists in `utils/token.ts`). |
| Medium | Any logged-in user can read any order, including the customer's phone and email, via `GET /orders/:id`. | `controller/order.controller.ts` → `getOrderById` | Return 404 unless `order.userId === req.user.id` or the caller is an admin. |
| Medium | Any logged-in user can confirm someone else's order through `/orders/verify`. | `verifyPayment` | Check order ownership; also check the Razorpay order id matches the one created for this order. |
| Medium | `JWT_SECRET` silently falls back to a hard-coded value. | `configs/constants.ts` | Refuse to start when it is missing outside development. |
| Medium | Unverified accounts can log in. | `login` | Reject with 403 when `isEmailVerified` is false, if the brief's verification step is meant to be enforced. |
| Low | `forgot-password` returns 404 for unknown emails, revealing which emails have accounts. | `forgotPassword` | Always return 200 with the same message. |
| Low | CORS allows every origin. | `app.ts` | `cors({ origin: constants.CLIENT_URL })`. |
| Low | No rate limiting on login and password-reset endpoints. | `routes/auth.routes.ts` | Add `express-rate-limit`. |
| Low | JWT stored in `localStorage` is readable by any injected script. | `frontend/src/lib/axios.ts` | Acceptable for this project; an httpOnly cookie is the stronger option. |

---

## Correctness

| Severity | Issue | Location | Fix |
| -------- | ----- | -------- | --- |
| High | Ingredient↔pizza and pizza/ingredient↔order are modelled as one-to-many, so ingredients get stolen between pizzas and past orders lose their contents. | `prisma/schema.prisma` | Make them many-to-many; see [data model](data-model.md#design-issue-ingredient-and-pizza-relations). |
| Medium | Stock is decremented when the order is created, before payment, and never restored if payment fails or is abandoned. | `createOrder` | Decrement on successful `verifyPayment`, or restore stock when an order is cancelled / expires. |
| Medium | Stock check races: two simultaneous orders can both pass the `stock >= 1` check and push stock negative. | `createOrder` | Do the check inside the transaction with a conditional update (`updateMany` where `stock >= 1`, then verify the count). |
| Medium | Unknown ingredient ids in a custom pizza are silently ignored, and nothing checks that `baseId` is actually a base. | `createOrder` | Verify every id was found and has the expected type. |
| Medium | Ordering the same menu pizza twice counts it once (`pizzaIds` is passed to `findMany` with `in`). | `createOrder` | Accept `{ pizzaId, quantity }` items. |
| Medium | A new `Address` is created even if the order then fails validation, leaving orphan addresses. | `createOrder` | Create the address inside the transaction, after validation. |
| Low | Custom pizza price is hard-coded (₹250 + ₹30 per vegetable). | `createOrder` | Store a price on each ingredient. |
| Low | The low-stock email is re-sent every hour while stock stays low. | `jobs/inventory.job.ts` | Remember when an alert was last sent per ingredient. |
| Low | `GET /admin/orders?status=FOO` returns a 500 instead of a 422. | `getAllOrders` | Validate the query with Zod. |
| Low | `orders.service.ts` → `getOrders` passes `skip`/`take`/`orderBy` to `count`, which is invalid. The function is not used. | `services/orders.service.ts` | Fix or delete. |

---

## Frontend gaps

| Severity | Issue | Location | Fix |
| -------- | ----- | -------- | --- |
| Medium | `.env.example` and the axios fallback point at `jsonplaceholder.typicode.com`, not this backend. | `frontend/.env.example`, `lib/axios.ts` | Default to `http://localhost:4000/api`. |
| Medium | The `users` feature calls `/users`, which this backend does not have. | `features/users` | Treat it as a template; build `pizzas`, `orders`, `inventory` features against the real API. |
| Medium | No route guards: sidebar pages are reachable while logged out, and admin pages will need a role check. | `App.tsx` | Add a `<ProtectedRoute roles={[...]}>` wrapper. |
---

## Maintainability

| Severity | Issue | Fix |
| -------- | ----- | --- |
| Low | Controllers mostly call Prisma directly while the services layer goes unused. | Move queries into services so controllers only orchestrate. |
| Low | `utils/validation.ts` → `validateRequest` middleware exists but no route uses it. | Use it in routes, or remove it and keep parsing inside controllers. Pick one style. |
| Low | No automated tests. | Start with integration tests for auth and order creation (e.g. Vitest + Supertest). |
| Low | No seed script. | Add `prisma/seed.ts` that creates an admin, 5 bases, 5 sauces, cheeses and vegetables. |
| Low | The empty `backend/.env.template` duplicates the new `.env.example`. | Delete `.env.template`. |
