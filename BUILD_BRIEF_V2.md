# Build brief: SanShuzz & Ma-Shirts — multi-brand fashion platform

## Overview
This is not a single store — it's a platform with three connected brand
identities under one roof, plus editorial/service content and an admin
panel. Despite the scope, navigation must stay simple: a visitor should
always be able to tell which brand section they're in and get back to the
main site in one click.

## Brand structure

### 1. SanShuzz & Ma-Shirts (parent site / homepage)
The main entry point. Introduces the overall house and links out to the two
sub-brands, the services, and the guide/blog.

### 2. Santus Sabaoth (sub-brand)
His own personally made/designed goods — a single-designer line. Own
landing page, own product grid, own "about the maker" feel. Products here
are exclusively his own work.

### 3. Sartorial Executive (sub-brand)
High-end luxury multi-brand storefront — sells both his own pieces and
other luxury brands, targeting a broader luxury shopper (not just his
existing audience). Own landing page, own product grid, needs a "brand"
field on each product so multiple brands can be shown here.

**Shared infrastructure:** one cart, one checkout, one Paystack
integration, one customer flow — used across all three storefronts.
Each storefront is a distinct look/landing/catalog, not a separate app.

## Site map (each item is its own page)
- `/` — SanShuzz & Ma-Shirts homepage (links to both sub-brands, guide,
  services)
- `/santus-sabaoth` — Santus Sabaoth storefront (all his own goods)
- `/sartorial-executive` — Sartorial Executive storefront (his + other
  luxury brands)
- `/guide` — Fashion tips / "Management Guide": articles on how to care
  for and manage clothing, shoes, bags, etc.
- `/guide/chat` or an embedded chat widget available site-wide — a chatbot
  that helps users navigate the guide and answer fashion-care questions
  (see Chatbot section below)
- `/services` — overview page linking to each service below
- `/services/wardrobe-building` — helps a client build out a wardrobe to
  whatever extent they need
- `/services/custom-pieces` — personalized/custom clothes, shoes, and bags
- `/services/wedding-attire` — wedding attire planning service
- `/services/cloth-of-the-day` — daily featured outfit pick
- `/services/color-of-the-day` — daily featured color pick
- `/services/body-type-styling` — find what suits you based on body type
  (likely a short questionnaire → recommendation)
- `/cart`, `/checkout`, `/order-confirmation` — shared across all brands
- `/admin` — password-protected inventory management (see Admin section)

Keep the top nav simple despite this many pages: group as **Shop
(dropdown: Santus Sabaoth / Sartorial Executive) · Guide · Services ·
About**. No nesting deeper than 2 clicks from the homepage for anything a
customer needs.

## Chatbot
An integrated chatbot, available across the site (floating widget is
fine), primarily scoped to help users navigate the Guide/management-tips
content and answer fashion-care questions. Keep it simple to start:
a chat UI wired to an LLM API (e.g. the Anthropic API) with a system
prompt describing the brand and guide content — not a full custom NLU
build.

## Design direction (carries over from earlier spec — do not lose this)
- Mood: luxury, minimal, confident. Fashion photography is the focus, not
  busy UI.
- Palette: charcoal black (#161513, #1C1B18), warm gold accent (#D4AF5A),
  off-white/cream text (#E9E4D8, #F2EAD6). No bright colors, no flat
  everywhere — use soft, realistic box-shadows for depth on cards and
  buttons, subtle hover lift/scale, smooth transitions.
- Typography: elegant serif for headings (Fraunces or Cormorant Garamond),
  clean sans for body (Inter).
- Avoid the generic "AI-made" look: vary section layouts (full-bleed hero
  moments, asymmetric feature blocks, a large single spotlight product),
  don't repeat identical centered grids top to bottom.
- "Jaw-dropping" feel: tasteful scroll-triggered reveals, smooth image
  transitions/crossfades in hero and featured sections, subtle
  parallax on hero imagery — polished, not gimmicky. Prioritize
  performance; don't let animation slow the site down.

## Admin panel (`/admin`)
- Authenticated (simple username/password to start; note in the README
  that this should be hardened before real-world use).
- Manage inventory **separately per storefront section**: add/edit/delete
  products under Santus Sabaoth and under Sartorial Executive
  independently (Sartorial Executive products also need a "brand" field
  since it carries other labels besides his own).
  Include this on each: name, price (₦), images, description, sizes,
  stock quantity, category, brand (for Sartorial Executive).
- Manage Guide articles (add/edit/delete posts).
- Manage the "cloth of the day" / "color of the day" featured picks.

## Tech stack recommendation
Given the database needs (admin-managed inventory across two storefronts,
guide posts, daily picks), a static-file approach won't hold up — use:
- **Framework:** Next.js (React) — handles multiple storefront routes,
  server-side rendering for product pages, and API routes in one project.
- **Database:** Postgres via Prisma (or SQLite locally to start, easy to
  upgrade to Postgres for production).
- **Auth (admin only):** simple session-based auth to start (e.g.
  NextAuth credentials provider); doesn't need to be public-facing
  accounts for customers yet.
- **Payments:** Paystack, integrated server-side via Next.js API routes.
  Secret key in `.env`, never exposed client-side. Server recomputes
  order totals from the database — never trusts client-submitted prices.
- **Chatbot:** a chat API route calling the Anthropic API (or similar),
  with the brand/guide content in the system prompt.

## Build order (so nothing gets lost, but it ships incrementally)
1. Project scaffold (Next.js + Prisma + database schema for products,
   brands/sections, guide posts, daily picks, orders).
2. Homepage + both sub-brand storefront pages + shared cart/checkout +
   Paystack flow.
3. Admin panel: CRUD for inventory (both sections) and guide posts.
4. Guide pages + chatbot widget.
5. Services pages (wardrobe building, custom pieces, wedding attire,
   cloth/color of the day, body-type styling).
6. Visual polish pass: transitions, scroll reveals, imagery, final
   luxury detailing.

## Scope notes
- Seed each storefront with 6–8 placeholder products so nothing launches
  empty.
- Everything above should exist as its own page/route — don't collapse
  services into one long scrolling page.
- Keep every page easy to navigate — this is a large site, but no visitor
  should ever feel lost or need more than 2 clicks to reach any section
  from the homepage.
