# The Fashion Clinic

> *Diagnose. Prescribe. Transform.*

A Next.js platform for a Lagos-based luxury menswear styling house. It sells
high-ticket personal styling services to male executives, wraps those services
in a medical metaphor, and runs two small e-commerce storefronts alongside
them. An admin panel controls inventory, editorial content and which parts of
the homepage are visible.

This README describes what the site is, what the builder was trying to
achieve with it, where that vision is fully realised, and where it is still
half-finished. The practical setup, environment and deployment notes follow
at the end.

---

## 1. The idea behind the site

### Where it started

The original spec is in [BUILD_BRIEF_V2.md](./BUILD_BRIEF_V2.md). It describes
**"SanShuzz & Ma-Shirts"**, a fashion house with three connected identities:

| Brand | Role in the brief |
|---|---|
| SanShuzz & Ma-Shirts | Parent site and homepage |
| Santus Sabaoth | A single designer's own line. Everything is made by him. |
| Sartorial Executive | A luxury multi-brand storefront that sells his pieces alongside other labels |

Around those storefronts the brief asked for a wardrobe-care "Management
Guide" with an AI chat helper, six styling services on their own pages
(wardrobe building, custom pieces, wedding attire, cloth of the day, colour of
the day, body-type styling), shared cart and Paystack checkout, and a
password-protected admin.

### Where it ended up

Somewhere between the brief and the last commit the builder had a sharper
idea. The commit is literally titled *"Build Sanchuzz Fashion Clinic
platform"*. The site was re-skinned as **The Fashion Clinic**, and every page
now speaks the language of medicine:

- The customer is a **patient**. Their style problem is a **chief
  complaint**. The stylist produces a **diagnosis** and writes a
  **prescription**. The follow-up guide is **aftercare**.
- The hero line is *"You don't need more clothes. You need a diagnosis."*
- Past clients become **Case Files** with case numbers, symptoms, diagnosis,
  prescription and a before/after result.
- The free lead magnet is an **Executive Checkup**, a five-step online
  questionnaire that generates a printable **Patient File** with a reference
  like `#TFC-8492`.
- A **Prescription Pad** page is an editable, printable document styled like a
  doctor's Rx pad.
- The ultimate promised outcome has a name: becoming **The Sartorial
  Executive**. What was a storefront in the brief is now also the brand's
  aspirational identity.

The reasoning behind this is visible in the copy. The builder is not trying to
sell clothes one item at a time. The pitch is that men buy expensive garments
in isolation and still look wrong, so the valuable thing is the judgement, not
the garment. Framing styling as a clinical process gives that judgement
authority, justifies consultancy pricing, and gives every page a reason to end
with the same call to action.

### The business model the code implies

Reading the pages and the data model together, the intended revenue is clear.

1. **Services are the product.** Five fixed-price interventions are seeded in
   the database and repeated in the nav, footer, chat prompt and booking form:

   | Service | Price | Duration |
   |---|---|---|
   | The Executive Checkup | ₦50,000 | 30 minutes |
   | Emergency Consultation | ₦75,000 | 24-hour turnaround |
   | The Wardrobe Detox | ₦120,000 | Half-day |
   | The Sartorial Prescription | ₦250,000 | 7 outfits for 7 days |
   | The Boardroom Cure | ₦400,000 | 30-day transformation |

2. **Everything funnels to the Checkup.** The hero, the nav, the footer, the
   shop page, the about page, the case files and the chat assistant all push
   the visitor to `/executive-checkup`. The online quiz is free and maps each
   answer to one of the paid services as its "recommended treatment".

3. **Bookings close on WhatsApp, not online.** The booking modal and the
   contact form do not take payment and do not write to the database. They
   show a confirmation and hand off to a `wa.me` link with the details
   pre-filled. The number is still a placeholder (`2348000000000`). This is a
   deliberate choice for a concierge business where every sale is a
   conversation.

4. **Products are "prescription pieces".** The two storefronts survive from
   the brief but are now positioned as the things you buy after a diagnosis.
   Product e-commerce has a real Paystack checkout, but it is secondary in the
   page hierarchy.

### Who it is for

The copy, the quiz options and the seed data all describe the same person: a
Lagos-based male executive, founder, partner or senior manager in finance,
tech, law or energy, who dresses for boardrooms, keynotes, galas and
international travel. Prices are in naira, the atelier is in Victoria
Island/Ikoyi, hours are given in West Africa Time, and the product line mixes
Italian tailoring vocabulary with kaftans and agbada.

---

## 2. What is actually on the site

### Public pages

| Route | What it does |
|---|---|
| `/` | Eleven-section homepage. Each section can be toggled on or off from the admin. Hero, philosophy, five-step process, Sartorial Executive spotlight, services, case files, checkup launcher, featured products, prescription pad teaser, aftercare teaser, final CTA. |
| `/executive-checkup` | Five-step quiz. Rule-based logic in `src/lib/checkup.ts` turns the answers into a diagnosis, symptom list, five Rx lines and a recommended paid service. Printable. Opens the booking modal. |
| `/prescription-pad` | An editable mock prescription with pre-filled sample patient data. Every field is an input so a consultant can type over it and print. |
| `/case-files` | Grid of past "cases" filterable by tag, each with symptoms, diagnosis, prescription, result and before/after images. Five are seeded. |
| `/services` | The five clinical services with features, "indicated for" copy and a Book button that opens the booking modal. |
| `/sartorial-executive` | Part manifesto, part storefront. Six "pillars", a four-phase roadmap, then the luxury multi-brand product grid with a brand filter. |
| `/santus-sabaoth` | The single-designer storefront. Category filter and product grid. Still uses the brief's plainer tone. |
| `/shop` | Combined catalogue across both houses with section, category and price-sort filters. |
| `/{storefront}/{slug}` | Product detail with size picker and add-to-cart. |
| `/cart`, `/checkout`, `/order-confirmation` | Shared cart (persisted in the browser), customer details form, Paystack redirect and verification. |
| `/aftercare` | Six hard-coded care protocols plus every published guide article, reframed as "clinical care notes". |
| `/guide`, `/guide/{slug}` | The original Management Guide. Still works, still seeded, but only reachable via aftercare and homepage article cards. |
| `/about` | Philosophy page. Five "tenets of sartorial medicine". |
| `/contact` | Inquiry form that hands off to WhatsApp, plus atelier location and hours. |

Site-wide there is a floating **chat widget** backed by the Anthropic API, a
**⌘K search** that queries products, services, case files and guide articles,
and a **cart drawer**.

### Admin panel (`/admin`)

Branded the "Admin Command Center". Gated by a signed cookie. Sections:

- **Overview**: counts for each content type and the eight most recent orders
- **Homepage Section Toggles**: show or hide each homepage section
- **Services Catalogue**: create, edit, delete the clinical services
- **Case Files Manager**: create, edit, delete case files
- **Sartorial Executive Content**: edit the eyebrow, heading, subheading,
  description and CTA of the homepage spotlight block
- **Prescription Pad Settings**: clinic name, tagline, consultant name and
  title, disclaimer
- **Santus Sabaoth Inventory** and **Sartorial Executive Inventory**: product
  CRUD per storefront, with a brand field on the Sartorial side
- **Guide Articles**: article CRUD
- **Daily Picks**: set the cloth of the day and colour of the day

### Data model

Prisma 7 against PostgreSQL (Supabase in production). Models:

```
Product            section, name, slug, brand, category, price, images[], sizes[], stock, featured
GuideArticle       title, slug, excerpt, content, coverImage, category, published
DailyPick          type (CLOTH | COLOR), title, description, imageUrl, colorHex, product?
Order / OrderItem  Paystack reference, customer details, status, totals, line items
AdminUser          username, bcrypt password hash
ServiceItem        slug, name, price, duration, description, features[], bestFor, image, order, active
CaseFile           caseNumber, slug, title, symptoms[], diagnosis, prescription[], result, before/after images, tags[]
SiteSetting        key/value JSON store (section toggles, spotlight copy, prescription pad settings)
CheckupSubmission  name, contact, occupation, chiefComplaint, diagnosis, prescription, recommendedService
```

Arrays are stored as JSON-encoded strings and parsed in `src/lib/*`.

---

## 3. Where the builder was heading, and what is unfinished

The clinic concept is complete on the surface. Underneath, several things
show the direction of travel but have not been wired through.

**Checkup results are never saved.** A `CheckupSubmission` table exists in
the schema with exactly the fields the quiz produces, but nothing in `src/`
writes to it. The quiz runs entirely in the browser. The obvious intent was to
capture every completed checkup as a lead for follow-up. That is the single
most valuable missing piece given the funnel described above.

**Bookings and contact inquiries are not persisted either.** Both forms set a
"submitted" flag and show a WhatsApp link. No email, no database row, no
notification. If the visitor does not tap through to WhatsApp, the lead is
lost.

**Prescription Pad settings in admin do not reach the public page.** The
admin form saves clinic name, consultant title and disclaimer to
`SiteSetting`, and `getPrescriptionPadSettings()` reads them back, but the
public `/prescription-pad` and `/executive-checkup` pages hard-code those
strings instead of calling it.

**A homepage toggle has no section.** `section_story` ("Philosophy & Atelier
Craft") appears in the admin toggles and the seed but no homepage block checks
it.

**Six brief-era pages are orphaned.** `/services/wardrobe-building`,
`/services/custom-pieces`, `/services/wedding-attire`,
`/services/cloth-of-the-day`, `/services/color-of-the-day` and
`/services/body-type-styling` still exist and render, but nothing in the nav,
footer or services page links to them. Their copy still says "SanShuzz" and
their CTA emails `concierge@sanshuzzmashirts.com`. The daily picks admin
screen only feeds two of these orphaned pages. Either fold them into the
clinic (the body-type quiz is a natural warm-up to the checkup, the daily
picks could be a "Daily Rx") or delete them.

**Old names leak through.** The package is `sanshuzz-app`, the cart's
browser-storage key is `sanshuzz-cart`, order references start with `SNZ-`,
and the Santus Sabaoth storefront copy is untouched from the brief. Harmless,
but a tell that the rebrand was done top-down from the homepage.

**Remote image hosts.** `next.config.ts` only allows `picsum.photos`, but
five pages load hero and card images from `images.unsplash.com` through
`next/image`. Next.js refuses unconfigured hosts at runtime, so those images
will fail until `images.unsplash.com` is added to `remotePatterns`. All
imagery is stock placeholder regardless and needs replacing with real
photography.

**Payments are gated.** Checkout creates a `PENDING` order, then returns a
503 with the order reference and a "contact concierge" message if
`PAYSTACK_SECRET_KEY` is not set. Stock is only decremented after Paystack
verifies the transaction. The flow is correct but has only ever run without
live keys as far as the repository shows.

**The diagnosis engine is a decision tree, not AI.** `evaluateCheckupDiagnosis`
is a handful of `if` branches keyed on chief complaint and role level. The
Anthropic API is used only for the chat widget. A likely next step is to let
the model write the diagnosis prose from the structured answers, which the
data shape already supports.

---

## 4. Stack

- **Next.js 16** App Router, React 19, TypeScript, Tailwind CSS v4
- **Prisma 7** with the `@prisma/adapter-pg` driver adapter and `pg` pool,
  against **PostgreSQL** (Supabase). Generated client lives in
  `src/generated/prisma` and is rebuilt on `npm run build`.
- **Paystack** server-side only: initialise, verify on return, and a webhook
- **Anthropic SDK** for the chat widget
- **Zustand** with `persist` for the cart
- **jose** JWT in an `httpOnly` cookie for admin sessions, **bcryptjs** for
  the admin password
- `src/proxy.ts` is the route guard for `/admin/*` (Next 16's equivalent of
  middleware)
- Deployed on **Vercel**

> Note from `AGENTS.md`: this Next.js version has breaking changes from older
> releases. Read `node_modules/next/dist/docs/` before changing framework-level
> code.

---

## 5. Running it locally

```bash
npm install
cp .env.example .env     # then fill in DATABASE_URL at minimum
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open http://localhost:3000. Admin is at http://localhost:3000/admin/login.

The seed is idempotent. It upserts by slug, case number, setting key or
username, so re-running it is safe. It creates:

- 7 Santus Sabaoth products and 7 Sartorial Executive products
- 6 guide articles
- 5 clinical services and 5 case files
- 1 cloth-of-the-day and 1 colour-of-the-day pick
- 11 homepage section toggles plus the spotlight and prescription pad settings
- 1 admin user from `ADMIN_SEED_USERNAME` / `ADMIN_SEED_PASSWORD`

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string. The example points at a Supabase pooler. |
| `ADMIN_SESSION_SECRET` | Signs the admin JWT. A hard-coded fallback exists in code; replace it in production. |
| `ADMIN_SEED_USERNAME`, `ADMIN_SEED_PASSWORD` | Used only by the seed to create the first admin. |
| `PAYSTACK_SECRET_KEY` | Enables checkout and webhook verification. Without it checkout returns a 503 with the order reference. |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | From the Paystack dashboard. |
| `ANTHROPIC_API_KEY` | Enables the chat widget. Without it the widget replies with a static redirect to the checkup. |
| `NEXT_PUBLIC_SITE_URL` | Base URL for the Paystack callback. Falls back to Vercel URLs, then the request origin. |

---

## 6. Payments and orders

`POST /api/checkout` recomputes every price and stock level from the database
and ignores client totals. It creates a `PENDING` order with a reference of
the form `SNZ-{timestamp}-{uuid8}`, initialises a Paystack transaction and
returns the hosted checkout URL.

Two paths confirm payment and either may run first:

- `/order-confirmation` reads the `reference` query param on return and
  verifies it directly with Paystack
- `POST /api/paystack/webhook` verifies the Paystack signature and handles
  `charge.success`

Both call `confirmOrderPayment`, which uses an atomic `updateMany` claim so
stock is decremented exactly once even if both fire at the same time.
Register the webhook URL in the Paystack dashboard for production.

---

## 7. Admin security

Admin auth is intentionally minimal: one shared username and password checked
against a bcrypt hash, then an eight-hour HS256 JWT in an `httpOnly` cookie.
Before holding real customer data:

- Set a long random `ADMIN_SESSION_SECRET` and remove the fallback in
  `src/lib/auth.ts` and `src/proxy.ts`
- Add rate limiting or lockout on `/admin/login`
- Move to per-person accounts if more than one admin
- Consider 2FA
- Remove the "Admin Portal" link from the public footer

---

## 8. Project layout

```
prisma/schema.prisma            Data model
prisma/seed.ts                  Seed content, including all clinic copy
src/app/                        Routes (see table above)
src/app/api/                    chat, checkout, paystack/webhook, search
src/app/admin/                  Admin pages
src/components/                 Nav, Footer, ChatWidget, SearchModal, CartDrawer,
                                BookingModal, CaseFileCard, ServicesCatalogue, ...
src/components/admin/           ProductForm, GuideForm
src/lib/checkup.ts              Diagnosis decision tree for the Executive Checkup
src/lib/site-settings.ts        Section toggles, spotlight copy, prescription pad settings
src/lib/actions/                Server actions for every admin screen
src/lib/{products,services,case-files,search,orders,paystack,auth,cart-store}.ts
src/proxy.ts                    Route guard for /admin/*
BUILD_BRIEF_V2.md               The original pre-clinic spec
```
