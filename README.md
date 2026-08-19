# SanShuzz & Ma-Shirts

A multi-brand fashion platform: a parent house site, two sub-brand
storefronts (Santus Sabaoth, Sartorial Executive), a shared cart/checkout
with Paystack, a styling-services section, a wardrobe-care Guide with an
AI chat assistant, and an admin panel for managing inventory, guide posts,
and daily picks. See [BUILD_BRIEF_V2.md](./BUILD_BRIEF_V2.md) for the
original spec.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4)
- **Prisma 7** + **SQLite** locally (via `@prisma/adapter-better-sqlite3`) —
  swap to Postgres for production by changing `DATABASE_URL` and the
  Prisma datasource/adapter
- **Paystack** for payments, integrated server-side only
- **Anthropic API** for the Guide chat widget
- Custom lightweight session auth for `/admin` (see **Admin auth** below —
  harden before real-world use)

## Getting started

```bash
npm install
npm run db:seed     # creates dev.db, seeds products/guide/admin user
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The seed script creates the SQLite database (`dev.db` in the project root)
and populates:

- 7 Santus Sabaoth products, 7 Sartorial Executive products
- 6 Guide articles
- A "cloth of the day" and "color of the day" pick
- One admin user (see `.env`: `ADMIN_SEED_USERNAME` / `ADMIN_SEED_PASSWORD`,
  defaults to `admin` / `ChangeMe123!`)

Re-running `npm run db:seed` is safe — products, articles, and the admin
user are upserted by slug/username.

## Environment variables

Copy `.env.example` if you need a clean template; `.env` already has working
local defaults for everything except the three integrations below.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLite file path locally; a Postgres connection string in production |
| `ADMIN_SESSION_SECRET` | Signs the admin session cookie — replace with a long random value in production |
| `ADMIN_SEED_USERNAME` / `ADMIN_SEED_PASSWORD` | Used only by `npm run db:seed` to create the first admin user |
| `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | From your Paystack dashboard — checkout and the webhook are no-ops without the secret key |
| `ANTHROPIC_API_KEY` | Powers the Guide chat widget — the widget degrades gracefully (shows an "unavailable" message) without it |
| `NEXT_PUBLIC_SITE_URL` | Used to build the Paystack callback URL |

## Admin panel

`/admin` is gated by `src/proxy.ts` (Next's middleware equivalent), which
checks for a signed session cookie. Sign in at `/admin/login` with the
seeded admin credentials.

From there:

- **Dashboard** (`/admin`) — quick stats + recent orders
- **Inventory** (`/admin/products/santus-sabaoth`,
  `/admin/products/sartorial-executive`) — add/edit/delete products per
  storefront; Sartorial Executive products carry a `brand` field, Santus
  Sabaoth products default to "Santus Sabaoth"
- **Guide** (`/admin/guide`) — add/edit/delete articles
- **Daily Picks** (`/admin/daily-picks`) — set the cloth-of-the-day and
  color-of-the-day; the most recently created pick of each type is what
  shows live on `/services/cloth-of-the-day` and `/services/color-of-the-day`

### Hardening before real-world use

The current admin auth is intentionally simple — a single shared
username/password checked against a `bcrypt` hash, with a JWT session
cookie. Before this goes live, at minimum:

- Rotate `ADMIN_SESSION_SECRET` to a long random value and keep it out of
  version control
- Add rate limiting / lockout on `/admin/login`
- Move to per-admin accounts if more than one person needs access
- Put the app behind HTTPS in production (`secure` cookies are already
  conditional on `NODE_ENV=production`)
- Consider 2FA if the admin panel will hold real customer/order data

## Payments

Checkout (`/api/checkout`) always recomputes prices and stock from the
database — it never trusts client-submitted totals. It creates a `PENDING`
order, initializes a Paystack transaction, and redirects to Paystack's
hosted checkout. Two paths confirm payment (either can run first, they
share an idempotent claim so stock is only decremented once):

- `/order-confirmation` — reads the `reference` query param on return from
  Paystack and verifies it directly
- `/api/paystack/webhook` — verifies the Paystack signature and updates
  the order from `charge.success` events (register this URL in your
  Paystack dashboard for production)

## Chat assistant

`/api/chat` calls the Anthropic API with a system prompt describing the
brand, storefronts, and current Guide categories. It's a plain
request/response endpoint (no streaming) — see `src/components/ChatWidget.tsx`
for the floating widget wired to it site-wide.

## Project structure

```
prisma/schema.prisma       Product, GuideArticle, DailyPick, Order, AdminUser
prisma/seed.ts             Seed script
src/app/                   Routes (storefronts, services, guide, cart/checkout, admin, api)
src/components/            Shared UI (Nav, Footer, ProductGrid, ChatWidget, ...)
src/lib/                   Prisma client, auth, cart store, Paystack helper, actions
src/proxy.ts               Route guard for /admin/*
```

## Known limitations

- No customer accounts/order history — orders are tracked by Paystack
  reference only
- Shipping cost is not calculated at checkout
- Product images are placeholder URLs (picsum.photos) — swap for real
  product photography before launch
- Admin image/size input is plain-text (one URL per line / comma-separated
  sizes) rather than a file uploader
