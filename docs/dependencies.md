# Dependencies

This page lists every package the project installs, what it does, and where it is used. Versions are the ranges declared in each `package.json`; the exact installed versions are pinned in `backend/package-lock.json` and `frontend/bun.lock`.

**`dependencies` vs `devDependencies`:** `dependencies` are needed when the app runs. `devDependencies` are needed only to develop or build it (compilers, type definitions, linters), and are not installed in a production image built with `npm ci --omit=dev`.

---

## Backend

### Runtime dependencies

| Package | Version | Purpose | Used in |
| ------- | ------- | ------- | ------- |
| [express](https://expressjs.com/) | ^5.3.0 | Web framework: routing, middleware, request/response handling | `app.ts`, `routes/` |
| [cors](https://github.com/expressjs/cors) | ^2.8.6 | Allows the frontend (another origin) to call the API. Currently allows **every** origin. | `app.ts` |
| [morgan](https://github.com/expressjs/morgan) | ^1.12.1 | Logs each HTTP request to the console (`dev` format) | `app.ts` |
| [dotenv](https://github.com/motdotla/dotenv) | ^18.0.9 | Loads `.env` into `process.env` | `configs/`, `prisma.config.ts` |
| [@prisma/client](https://www.prisma.io/docs/orm/prisma-client) | ^6.19.3 | Type-safe database client generated from `schema.prisma` | `configs/prisma.ts`, controllers, services |
| [zod](https://zod.dev/) | ^4.6.7 | Validates request bodies and infers TypeScript types from the schemas | `schema/`, `utils/validation.ts` |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | ^9.0.3 | Creates and verifies login tokens (JWT) | `utils/token.ts` |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | ^6.0.0 | Hashes passwords (10 salt rounds). Native module: needs build tools on some systems. | `utils/crypto.ts`, `services/users.service.ts` |
| [express-async-handler](https://github.com/Abazhenov/express-async-handler) | ^1.2.0 | Wraps async controllers so thrown errors reach the error middleware | every controller |
| [nodemailer](https://nodemailer.com/) | ^10.3.1 | Sends email over SMTP (verification, password reset, stock alerts) | `configs/email.ts`, `services/email.service.ts` |
| [node-cron](https://github.com/node-cron/node-cron) | ^4.6.0 | Runs the hourly low-stock check | `jobs/inventory.job.ts` |
| [razorpay](https://razorpay.com/docs/payments/server-integration/nodejs/) | ^2.9.8 | Official Razorpay SDK, used to create payment orders | `utils/razorpay.ts` |
| [cloudinary](https://cloudinary.com/documentation/node_integration) | ^2.11.0 | Image hosting SDK. Configured, but no route uses it yet. | `configs/cloudinary.ts`, `services/cloudinary.service.ts` |
| [multer](https://github.com/expressjs/multer) | ^2.5.0 | Handles `multipart/form-data` file uploads. Installed for image uploads, but not wired into any route yet. | type import only |

### Development dependencies

| Package | Version | Purpose |
| ------- | ------- | ------- |
| [typescript](https://www.typescriptlang.org/) | ^7.0.2 | Type checker and compiler (`npm run build`) |
| [tsx](https://tsx.is/) | ^4.23.15 | Runs TypeScript directly with file watching (`npm run dev`) |
| [prisma](https://www.prisma.io/docs/orm/tools/prisma-cli) | ^6.19.3 | Prisma CLI: `generate`, `db push`, `studio` |
| `@types/*` | various | Type definitions for packages written in plain JavaScript: `bcrypt`, `cors`, `express`, `jsonwebtoken`, `morgan`, `multer`, `node`, `node-cron` |

### Notes

- **Express 5 handles async errors natively.** A rejected promise in a route handler is passed to the error middleware automatically, so `express-async-handler` is no longer required. It is harmless, but could be removed to simplify the controllers.
- **Two password-hashing call sites.** `utils/crypto.ts` exposes `hashPassword`, but `users.service.ts` calls `bcrypt.hash` directly. Using the helper everywhere keeps the salt rounds in one place.

---

## Frontend

### Runtime dependencies

| Package | Version | Purpose | Used in |
| ------- | ------- | ------- | ------- |
| [react](https://react.dev/), react-dom | ^18.3.1 | UI library and its browser renderer | everywhere |
| [react-router-dom](https://reactrouter.com/) | ^7.0.2 | Client-side routing | `main.tsx`, `App.tsx` |
| [@tanstack/react-query](https://tanstack.com/query) | ^5.62.3 | Fetching, caching and syncing server data; mutations | `features/*/hooks` |
| [@tanstack/react-query-devtools](https://tanstack.com/query/latest/docs/framework/react/devtools) | ^5.62.3 | In-browser panel to inspect the query cache (dev only) | `main.tsx` |
| [axios](https://axios-http.com/) | ^1.7.9 | HTTP client with interceptors for the auth header and 401 handling | `lib/axios.ts` |
| [react-hook-form](https://react-hook-form.com/) | ^7.54.2 | Form state with minimal re-renders | auth pages, `UserFormDialog` |
| [zod](https://zod.dev/) | ^3.24.1 | Form validation schemas | `features/*/schemas` |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | ^3.9.1 | Connects Zod schemas to React Hook Form | auth pages |
| [sonner](https://sonner.emilkowal.ski/) | ^1.7.1 | Toast notifications | `components/ui/sonner.tsx`, hooks |
| [class-variance-authority](https://cva.style/) | ^0.7.1 | Declares component style variants (e.g. button `variant`/`size`) | `components/ui/button.tsx` |
| [clsx](https://github.com/lukeed/clsx) | ^2.1.1 | Builds class strings conditionally | `lib/utils.ts` |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | ^2.5.5 | Resolves conflicting Tailwind classes (`p-2 p-4` → `p-4`) | `lib/utils.ts` |
| [@heroicons/react](https://heroicons.com/) | ^2.2.0 | Icon set, used on almost every page | pages, sidebar |
| [lucide-react](https://lucide.dev/) | ^0.468.0 | Second icon set, used in one component | `UserCard.tsx` |

### Development dependencies

| Package | Version | Purpose |
| ------- | ------- | ------- |
| [vite](https://vite.dev/) | ^6.0.3 | Dev server and production bundler |
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | ^4.3.4 | JSX transform and React Fast Refresh for Vite |
| [typescript](https://www.typescriptlang.org/) | ^5.6.3 | Type checking (`tsc -b` in `npm run build`) |
| [tailwindcss](https://tailwindcss.com/) | ^3.4.16 | Utility-first CSS framework |
| [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) | ^1.0.7 | Animation utilities used by shadcn/ui |
| [postcss](https://postcss.org/), [autoprefixer](https://github.com/postcss/autoprefixer) | ^8.4.49, ^10.4.20 | CSS pipeline that runs Tailwind and adds vendor prefixes |
| [eslint](https://eslint.org/), @eslint/js, typescript-eslint, globals | ^9.15.0 etc. | Linting |
| eslint-plugin-react-hooks, eslint-plugin-react-refresh | ^5.0.0, ^0.4.14 | Lint rules for hooks and Fast Refresh |
| @types/react, @types/react-dom | ^18.3 | React type definitions |

### Not an npm package: shadcn/ui

[shadcn/ui](https://ui.shadcn.com/) is not installed as a dependency. Its components are **copied into** `src/components/ui/` and owned by this project, which is why there is a `components.json` (the shadcn CLI's config) but no `shadcn` entry in `package.json`. Edit those files freely.

### Notes

- **Two icon libraries.** `lucide-react` is used in one file. Switching that file to Heroicons and removing the package would shrink the dependency list.
- **Different Zod major versions.** The backend uses Zod 4 and the frontend Zod 3. They are separate installs so nothing breaks, but the APIs differ slightly; if you ever share schemas between the two, align the versions first.
- **Missing `@types/node`.** `vite.config.ts` uses `path` and `__dirname`, which need `@types/node` to type-check. See [known issues](known-issues.md).
