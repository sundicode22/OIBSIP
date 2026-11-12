# API reference

Base URL (local): `http://localhost:4000/api`

All request and response bodies are JSON. Send `Content-Type: application/json` on requests with a body.

---

## Conventions

### Authentication

Protected endpoints need a JWT from `POST /auth/login` or `POST /auth/admin-login`:

```http
Authorization: Bearer <token>
```

The token payload is `{ id, role, email }` and expires after `JWT_EXPIRES_IN` (default 7 days).

The **Access** column below uses:

- **Public** – no token needed
- **User** – any logged-in account
- **Admin** – logged-in account with role `ADMIN`

### Response envelope

Success:

```json
{
  "success": true,
  "message": "Optional human-readable message",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email address" }]
}
```

### Status codes

| Code | Meaning in this API |
| ---- | ------------------- |
| 200 | OK |
| 201 | Resource created |
| 400 | Request understood but not allowed (e.g. out of stock, bad token) |
| 401 | Missing, invalid or expired token; wrong credentials |
| 403 | Logged in, but the role is not allowed |
| 404 | Resource or route not found |
| 409 | Unique field already in use (e.g. email) |
| 422 | Body failed Zod validation; see `errors` |
| 500 | Unexpected server error |

---

## Endpoint summary

| Method | Path | Access | Description |
| ------ | ---- | ------ | ----------- |
| GET | `/health` | Public | Liveness check |
| POST | `/auth/register` | Public | Create a user account |
| GET | `/auth/verify-email/:token` | Public | Verify email (token in path) |
| GET | `/auth/verify-email?token=` | Public | Verify email (token in query) |
| POST | `/auth/login` | Public | User login |
| POST | `/auth/admin-login` | Public | Admin-only login |
| POST | `/auth/forgot-password` | Public | Email a password reset link |
| POST | `/auth/reset-password` | Public | Set a new password with a reset token |
| GET | `/pizzas` | Public | List menu pizzas |
| GET | `/pizzas/:id` | Public | Get one pizza |
| POST | `/pizzas` | Admin | Create a pizza |
| PUT | `/pizzas/:id` | Admin | Update a pizza (partial) |
| DELETE | `/pizzas/:id` | Admin | Delete a pizza |
| GET | `/ingredients` | Public | List ingredients, flat and grouped by type |
| GET | `/ingredients/types` | Public | List ingredient types with their ingredients |
| POST | `/ingredients/types` | Admin | Create an ingredient type |
| POST | `/ingredients` | Admin | Create an ingredient |
| PATCH | `/ingredients/:id/stock` | Admin | Set an ingredient's stock |
| POST | `/orders` | User | Create an order and a Razorpay checkout |
| POST | `/orders/verify` | User | Confirm payment for an order |
| GET | `/orders/my-orders` | User | List the caller's orders |
| GET | `/orders/:id` | User | Get one order |
| GET | `/admin/inventory` | Admin | Inventory dashboard |
| PATCH | `/admin/inventory/:id` | Admin | Set an ingredient's stock |
| GET | `/admin/orders` | Admin | List all orders, paginated |
| PATCH | `/admin/orders/:id/status` | Admin | Change an order's status |

---

## Health

### `GET /health`

```json
{ "status": "ok", "timestamp": "2026-11-12T15:20:00.000Z" }
```

This is the only endpoint that does not use the response envelope.

---

## Auth

### `POST /auth/register`

| Field | Type | Rules |
| ----- | ---- | ----- |
| `email` | string | valid email, unique |
| `password` | string | at least 6 characters |
| `name` | string | at least 2 characters |
| `phone` | string | optional, unique |

**201** – returns `{ id, name, email, role, isEmailVerified }` and sends a verification email.
**409** – email already registered.

### `GET /auth/verify-email/:token` (or `?token=`)

**200** – returns `{ id, email, isEmailVerified: true }`.
**400** – token not found.

### `POST /auth/login`

```json
{ "email": "jane@example.com", "password": "secret123" }
```

**200**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": "…", "name": "Jane", "email": "jane@example.com", "role": "USER", "isEmailVerified": true }
  }
}
```

**401** – wrong email or password (the same message for both, so attackers cannot tell which one was wrong).

Login does not currently require a verified email.

### `POST /auth/admin-login`

Same body and response as `/auth/login`.
**403** – the account exists but is not an `ADMIN`.

### `POST /auth/forgot-password`

```json
{ "email": "jane@example.com" }
```

**200** – emails a link to `CLIENT_URL/reset-password?token=…`.
**404** – no account with that email.

### `POST /auth/reset-password`

```json
{ "token": "<token from the email>", "password": "newSecret123" }
```

**200** – returns `{ id, email }`.
**400** – token not found.

---

## Pizzas

A pizza object:

```json
{
  "id": "665f…",
  "name": "Margherita",
  "description": "Tomato, mozzarella, basil",
  "price": 299,
  "imageUrl": "",
  "ingredients": [{ "id": "…", "name": "Mozzarella", "stock": 40, "type": { "name": "Cheese" } }],
  "createdAt": "…",
  "updatedAt": "…"
}
```

### `GET /pizzas` · `GET /pizzas/:id`

Return one pizza or an array of them, each with ingredients and their types. **404** if the id does not exist.

### `POST /pizzas` (Admin)

| Field | Type | Rules |
| ----- | ---- | ----- |
| `name` | string | at least 2 characters |
| `description` | string | at least 5 characters |
| `price` | number | positive, in rupees |
| `imageUrl` | string | optional |
| `ingredientIds` | string[] | optional, ingredient ids to attach |

**201** – the created pizza.

### `PUT /pizzas/:id` (Admin)

Any subset of the fields above. If `ingredientIds` is sent, it **replaces** the pizza's ingredient list.

### `DELETE /pizzas/:id` (Admin)

**200** with `data: null`.

---

## Ingredients

### `GET /ingredients`

```json
{
  "success": true,
  "data": {
    "all": [ /* every ingredient, sorted by name */ ],
    "grouped": {
      "base": [ /* … */ ],
      "sauce": [ /* … */ ],
      "cheese": [ /* … */ ],
      "vegetable": [ /* … */ ]
    }
  }
}
```

The keys in `grouped` are the lower-cased ingredient type names. This is the data source for the custom pizza builder.

### `GET /ingredients/types`

Array of types, each with its `ingredients`.

### `POST /ingredients/types` (Admin)

```json
{ "name": "Sauce" }
```

`name` is unique (409 if it already exists).

### `POST /ingredients` (Admin)

| Field | Type | Rules |
| ----- | ---- | ----- |
| `name` | string | at least 2 characters |
| `typeId` | string | id of an ingredient type |
| `stock` | integer | 0 or more |
| `description` | string | optional, defaults to `""` |
| `imageUrl` | string | optional |

### `PATCH /ingredients/:id/stock` (Admin)

```json
{ "stock": 75 }
```

Sets (does not add to) the stock level. Identical to `PATCH /admin/inventory/:id`.

---

## Orders

### `POST /orders` (User)

Send **either** menu pizzas **or** a custom pizza.

Menu order:

```json
{
  "address": { "address": "12 Baker Street", "city": "Pune", "zip": "411001", "country": "India" },
  "pizzaIds": ["665f…", "6660…"]
}
```

Custom pizza:

```json
{
  "address": { "address": "12 Baker Street" },
  "isCustomOrder": true,
  "customPizza": {
    "baseId": "…",
    "sauceId": "…",
    "cheeseId": "…",
    "vegetableIds": ["…", "…"]
  }
}
```

| Field | Type | Rules |
| ----- | ---- | ----- |
| `address.address` | string | at least 5 characters |
| `address.city/state/zip/country` | string | optional |
| `isCustomOrder` | boolean | defaults to `false`; must be `true` to use `customPizza` |
| `pizzaIds` | string[] | menu pizza ids |
| `customPizza.baseId/sauceId/cheeseId` | string | required inside `customPizza` |
| `customPizza.vegetableIds` | string[] | defaults to `[]` |

What happens:

1. A new address is saved for the user.
2. Every ingredient involved must have stock of at least 1, otherwise **400**.
3. In one transaction, each ingredient's stock is reduced by 1 and the order is created with status `PENDING`.
4. A Razorpay order is created for the total.

**201**

```json
{
  "success": true,
  "message": "Order created. Please proceed to payment.",
  "data": {
    "order": { "id": "…", "status": "PENDING", "totalPrice": 310, "...": "…" },
    "summary": { "orderId": "…", "totalPrice": 310, "itemsCount": 1, "isCustomOrder": true, "address": { } },
    "razorpay": { "keyId": "rzp_test_…", "orderId": "order_…", "amount": 31000, "currency": "INR" }
  }
}
```

`razorpay.amount` is in **paise** (1 rupee = 100 paise), which is what Razorpay Checkout expects. Pass the `razorpay` object to Razorpay Checkout on the frontend.

### `POST /orders/verify` (User)

Call this from Razorpay Checkout's success handler.

```json
{
  "orderId": "<our order id>",
  "razorpayOrderId": "order_…",
  "razorpayPaymentId": "pay_…",
  "razorpaySignature": "<signature from Razorpay>"
}
```

In offline simulation mode, use `"razorpaySignature": "simulated_success"`.

**200** – records a `COMPLETED` payment and sets the order to `CONFIRMED`.
**400** – the signature does not match.

### `GET /orders/my-orders` (User)

The caller's orders, newest first, with address, pizzas, ingredients and payments. Poll this endpoint to show live status updates.

### `GET /orders/:id` (User)

One order including the customer's name, email and phone. Any logged-in user can currently fetch any order by id.

---

## Admin

All routes require an admin token.

### `GET /admin/inventory`

```json
{
  "success": true,
  "data": {
    "totalItems": 18,
    "threshold": 20,
    "lowStockCount": 2,
    "lowStockItems": [ /* ingredients with stock < threshold */ ],
    "categories": {
      "bases": [], "sauces": [], "cheeses": [], "vegetables": [], "other": []
    },
    "items": [ /* all ingredients, lowest stock first */ ]
  }
}
```

An ingredient goes into a category when its type name contains `base`, `sauce`, `cheese` or `veg` (case-insensitive); anything else goes into `other`.

### `PATCH /admin/inventory/:id`

```json
{ "stock": 100 }
```

### `GET /admin/orders`

| Query param | Default | Description |
| ----------- | ------- | ----------- |
| `status` | – | Filter by an order status, e.g. `CONFIRMED` |
| `page` | `1` | Page number |
| `limit` | `20` | Page size |

Returns `{ orders, pagination: { total, page, limit, totalPages } }`, newest first, each order with its customer, address, pizzas, ingredients and payments.

### `PATCH /admin/orders/:id/status`

```json
{ "status": "SENT_TO_KITCHEN" }
```

`status` must be one of: `PENDING`, `CONFIRMED`, `IN_PROGRESS`, `SENT_TO_KITCHEN`, `READY_FOR_DELIVERY`, `SENT_TO_DELIVERY`, `DELIVERED_TO_CUSTOMER`, `CANCELLED`.
