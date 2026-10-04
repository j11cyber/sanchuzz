# Build brief V3: SanShuzz & Ma-Shirts house, full facelift and restructure

Read this whole file before writing any code. It replaces BUILD_BRIEF_V2.md as the source of truth. Where V2 and V3 disagree, V3 wins.

This project uses Next.js 16. Its APIs and conventions differ from older versions (for example, middleware is now `src/proxy.ts`). Before touching routing, data fetching or config, read the relevant guide in `node_modules/next/dist/docs/` as AGENTS.md instructs.

## 1. What went wrong, and what we are doing now

A previous AI agent rebranded the entire site into "The Fashion Clinic" and buried the original structure. The Fashion Clinic concept itself is wanted. It just belongs to one brand only, not the whole house. The visual result also looks generic and is not acceptable.

The job now has two parts:

1. **Restructure** the site into the correct three-brand house.
2. **Facelift** every page so the result is genuinely jaw dropping: luxury, distinctive, fast, and clearly not AI-template work.

Do not delete the Fashion Clinic work. Move and refine it into the Sartorial Executive brand.

## 2. Before you change anything

1. Run `git status` and `git log --oneline -30` and report what you see.
2. Commit or stash anything uncommitted, then create a safety tag and a working branch:
   ```bash
   git tag pre-facelift-backup
   git checkout -b facelift
   ```
3. Keep the Supabase Postgres database (`@prisma/adapter-pg`). Do not switch back to SQLite.
4. Read `prisma/schema.prisma`, `prisma/seed.ts`, `src/proxy.ts`, every route under `src/app/`, and `src/components/`. Summarise the current structure in a short list before proposing changes.
5. Propose a plan for Phase 1 and wait for approval before executing it.

## 3. The house structure

There are three brands. They are separate brand experiences with their own look, but they share one codebase, one database, one admin panel and one Paystack account.

| Brand | Role | Who it is for | How it sells |
|---|---|---|---|
| **SanShuzz & Ma-Shirts** | The parent house and business name (the name printed on the bags). Think of the house that owns the labels. | Everyone, first impression | Introduces the house, sends visitors to the two brands, hosts the Guide and About |
| **Santus Sabaoth** | A regular e-commerce store of the founder's own designs | Shoppers who want his pieces | Browse, add to cart, pay with Paystack |
| **Sartorial Executive** | The luxury, expensive side. This is where The Fashion Clinic lives: diagnose, prescribe, transform. | Executives, founders, lawyers, public figures | Consultation services (paid deposit plus WhatsApp follow up) and luxury pieces from him and other luxury brands |

### Domains

The brands must work as three separate websites that are still linked.

* Build everything in one Next.js app with route groups: `src/app/(house)/`, `src/app/(santus)/`, `src/app/(sartorial)/`.
* Until custom domains exist, they live at paths: `/`, `/santus-sabaoth`, `/sartorial-executive`.
* Prepare host-based routing in `src/proxy.ts` so that when domains are added later (for example `sanshuzz.com`, `santussabaoth.com`, `sartorialexecutive.com`), each host rewrites to its route group. Drive this from an env variable map, for example `BRAND_HOSTS`, so no code change is needed when domains arrive.
* Every brand shows a small, quiet "A SanShuzz & Ma-Shirts house" link in its footer and a way back to the house in its navigation. Each brand links to its sibling once, tastefully, not as a banner.

### Cart

Each brand has its own cart (Santus Sabaoth and Sartorial Executive should not mix in one bag, and separate domains cannot share browser storage anyway). Use the existing zustand store, keyed by brand. Checkout logic is shared.

## 4. Brand identities

Each brand gets its own token set, defined as CSS variables scoped to its route group layout. Gold runs through all three so they read as one family.

### SanShuzz & Ma-Shirts (house)

* Feel: the entrance hall of a fashion house. Confident, quiet, expensive.
* Colors: charcoal `#161513`, deep charcoal `#1C1B18`, cream text `#E9E4D8`, warm cream `#F2EAD6`, house gold `#D4AF5A`.
* Type: Cormorant Garamond for display, Inter for body.
* **Signature moment:** the homepage hero is a full-viewport threshold split into two halves, Santus Sabaoth on one side and Sartorial Executive on the other, each with its own imagery. Hovering (or tapping on mobile) one half smoothly widens it, crossfades its imagery and reveals its one-line description, while the other half recedes. Clicking enters that brand. This is the single most memorable thing on the house site. Everything else around it stays calm.

### Santus Sabaoth (the maker's store)

* Feel: a designer's atelier. Warmer, more personal, approachable but still premium.
* Colors: espresso `#1C1B18`, warm cream `#F2EAD6`, bronze `#8C6A43`, house gold `#D4AF5A`, soft stone `#CFC6B4`.
* Type: Cormorant Garamond for display, Inter for body.
* **Signature moment:** a large horizontal lookbook on the landing page that scrolls sideways as the visitor scrolls down, with oversized product photography and the piece name set large beside each image. Product pages use big imagery first, details second.
* Pages: landing, shop (filter by category and size), product detail, about the maker, cart, checkout.

### Sartorial Executive (The Fashion Clinic)

* Feel: a private Harley Street consultation room crossed with a bespoke tailor. Clinical precision, boardroom authority, unmistakably expensive. The medical metaphor should feel witty and refined, never cartoonish. No stethoscope clip art, no red crosses.
* Colors: surgical navy `#0A2342`, ink `#0E1A2B`, ivory `#F7F4EC`, executive gold `#C9A24B`, Rx green `#2A9D8F` used only for small clinical marks (Rx stamps, case file numbers, completion ticks), never as a large fill.
* Type: Playfair Display for display, Montserrat for body. A typewriter face (Courier Prime) is allowed only for case file numbers and prescription stamps.
* Tagline: *Diagnose. Prescribe. Transform.* Promise: *Become the Sartorial Executive.*
* **Signature moment:** the Executive Checkup. An elegant, one-question-at-a-time consultation (occupation, the rooms they need to command, body shape, current wardrobe frustrations, budget band). At the end, a Patient File assembles on screen like a real document: ivory paper texture, their name typed in, the diagnosis checkboxes filling, an Rx green "PRESCRIBED" stamp pressing in, and a recommended treatment plan. It is printable and downloadable, saved to the database, and ends with two actions: pay the deposit for the recommended service, or continue on WhatsApp.
* Pages: landing, treatment menu (services), each service detail page, Executive Checkup, Case Files (before and after gallery), luxury pieces shop with brand field, book a consultation, cart, checkout.

### Services and prices (seed these, editable in admin)

| Service | Price | Notes |
|---|---|---|
| The Executive Checkup | ₦50,000 | 30 minute style diagnosis, three major flaws identified, verbal prescription |
| The Wardrobe Detox | ₦120,000 | In-home or office wardrobe audit, keep / tailor / donate system, list of 10 missing essentials, 1 hour styling session |
| The Sartorial Prescription | ₦250,000 | 7 outfits for 7 days, 12 core pieces sourced, digital lookbook, 2 weeks WhatsApp support |
| The Boardroom Cure | ₦400,000 | 30 day executive presence transformation, tailoring management for 5 pieces, 4 event outfits, grooming and posture coaching |
| Emergency Consultation | ₦75,000 | 24 hour turnaround for a wedding, interview or pitch |

Booking terms shown on every service: 50% deposit to book, balance before delivery, aftercare included. Location: Abuja, FCT, house calls available. (Any "Lagos" wording from the previous agent must become Abuja.)

## 5. The Guide and services from V2

* The **Guide** (garment, shoe and bag care articles) and the chat assistant belong to the house site, linked from both brands.
* The V2 styling services map like this: wardrobe building becomes The Wardrobe Detox and The Sartorial Prescription; wedding attire becomes part of Emergency Consultation plus a "wedding" option on the booking form; body type styling becomes part of the Executive Checkup; custom pieces moves to Santus Sabaoth as a "Commission a piece" page; cloth of the day and color of the day stay on the house site as a small daily feature.
* Delete any orphaned V2 pages that still say "SanShuzz" in the wrong context or that nothing links to. Every page must be reachable within two clicks from its brand's landing page.

## 6. Payments

One Paystack integration, two flows. The server always computes amounts from the database and never trusts client prices.

| What is being bought | Flow |
|---|---|
| Santus Sabaoth products | Full payment via Paystack checkout |
| Sartorial Executive luxury pieces | Full payment via Paystack checkout |
| Sartorial Executive services | Paystack payment for the deposit (`depositPercent`, default 50, stored per service). After payment, the confirmation page shows the booking reference and a prefilled WhatsApp button to arrange the session. A "Prefer to talk first? Message us on WhatsApp" option is always available instead of paying. |

Keep the existing idempotent confirmation logic (return URL plus webhook). Extend `Order` with a `type` field (`PRODUCT` or `SERVICE_DEPOSIT`) and a `brand` field, and link service deposit orders to a `Booking`.

WhatsApp number comes from a `SiteSetting` editable in admin, never hard coded.

## 7. Data model changes

Adjust the Prisma schema (create a proper migration against Supabase):

* `Product`: add `storefront` enum (`SANTUS_SABAOTH`, `SARTORIAL_EXECUTIVE`), keep `brand` (required for Sartorial Executive, defaults to "Santus Sabaoth" otherwise).
* `ServiceItem`: name, slug, price, `depositPercent`, summary, inclusions, best for, sort order, active.
* `Booking`: customer name, phone, email, service, preferred date, notes, status (`ENQUIRY`, `DEPOSIT_PAID`, `SCHEDULED`, `COMPLETED`, `CANCELLED`), linked order.
* `CheckupSubmission`: actually save every completed checkup (answers JSON, diagnosis, recommended service, contact details).
* `CaseFile`: number, title, symptoms, diagnosis, prescription, result, before image, after image, published.
* `SiteSetting`: make sure every setting shown in admin is actually read by the public pages. The previous agent saved settings that the pages ignored. Fix all of them.

Reseed with 7 placeholder products per storefront, the five services, 3 case files based on the copy below, and the existing Guide articles.

Case file seed copy: "Case File #07: The Baggy Suit Syndrome", "Case File #12: Boardroom Invisibility", "Case File #03: Weekend to Workwear Whiplash", each with symptoms, diagnosis, prescription and result.

## 8. Admin panel

One admin at `/admin` (on the house domain), with a brand switcher at the top.

* Products per storefront (add, edit, delete, stock, sizes, images, brand field for Sartorial Executive).
* Services and prices, including deposit percent.
* Bookings list with status updates.
* Checkup submissions list with a printable view of each Patient File.
* Case Files.
* Guide articles, daily picks.
* Site settings (WhatsApp number, contact email, social links, homepage toggles).
* Replace plain text image URL fields with an image uploader to Supabase Storage.

Keep the hardening notes from the old README.

## 9. Design rules for the facelift

The goal is jaw dropping, which here means restraint, craft and one unforgettable moment per brand, not effects everywhere.

**Do:**
* Let photography dominate. Large, full-bleed images with generous negative space.
* Vary layouts deliberately: full-bleed hero, asymmetric image and text pairings, one large spotlight product, editorial spreads. Never stack identical centred grids down the page.
* Use one orchestrated motion moment per page (the signature moment) plus motion that responds to the visitor (opening a product, adding to cart, a menu expanding). Smooth image crossfades and subtle parallax on hero imagery are welcome.
* Use soft, realistic shadows only where they show depth (a lifted product card, a document on a desk), and vary corner radius by hierarchy.
* Treat headlines as design: large display type with careful spacing, set as part of the composition.
* Mobile first. Most customers will be on phones in Nigeria. Every signature moment must have a beautiful mobile version, not a degraded one.
* Respect `prefers-reduced-motion`, keep keyboard focus visible, keep text contrast accessible.
* Performance budget: Largest Contentful Paint under 2.5 seconds on a mid-range Android on 4G. Use `next/image` with proper sizes, lazy load below the fold, avoid heavy animation libraries unless clearly needed (CSS and small IntersectionObserver hooks first).

**Do not:**
* Fade-and-slide-up every section on scroll, or hover-lift every card.
* Use tracked-out all caps labels above every heading.
* Italicise or recolour a single word in a headline for emphasis.
* Add numbered markers (01, 02, 03) unless the content is a real sequence (the Diagnose, Prescribe, Transform protocol is a real sequence, so numbering is fine there).
* Use gradient washes, generic SaaS cards, emoji, or stock medical icons.
* Append arrows to every button label.

**Copy:** write like a top tailor talks: short, confident, specific. Buttons say exactly what happens ("Start your checkup", "Pay deposit", "Add to bag"). Errors explain what to fix.

## 10. Images

* Update `next.config.ts` `images.remotePatterns` to include every host actually used (the previous build loads Unsplash images that the config blocks, so they fail). Prefer Supabase Storage for all real images.
* Use high quality placeholder photography that matches each brand's mood until real product photos arrive. Leave a clear `TODO: real photo` marker in admin for each placeholder.

## 11. Phases

Work in phases. After each phase: run `npm run build` and `npm run lint`, fix all errors, commit with a clear message, then stop and summarise what changed with screenshots or a list of routes to check.

1. **Audit and plan.** Section 2. No code changes yet.
2. **Structure.** Route groups, brand layouts with scoped tokens, proxy host routing, navigation and footers, moving Fashion Clinic pages into Sartorial Executive, deleting orphans.
3. **Data.** Schema changes, migration, seed, wiring every setting to the public pages.
4. **Commerce.** Per-brand carts, product and service checkout flows, deposit logic, booking records, WhatsApp handoff.
5. **House facelift.** Homepage threshold, Guide, About, daily picks.
6. **Santus Sabaoth facelift.** Landing, lookbook, shop, product pages, commission page.
7. **Sartorial Executive facelift.** Landing, treatment menu, service pages, Executive Checkup with Patient File, Case Files, luxury shop.
8. **Admin.** Brand switcher, bookings, checkup submissions, uploader.
9. **Polish and performance.** Lighthouse on mobile for every key page, image sizing, motion review, accessibility check, final copy pass.
10. **README.** Rewrite it to describe the final three-brand structure, env variables (including `BRAND_HOSTS` and Supabase), and how to add custom domains on Vercel.

## 12. Open items to confirm with the owner

Use clearly marked placeholders for these until confirmed:

* Real WhatsApp number and contact email
* Custom domains for each brand (if any yet)
* Logos for all three brands
* Real product photos and the actual Santus Sabaoth product list
* Which outside luxury brands Sartorial Executive will carry
* Whether the launch offer (first 10 clients get 20% off) should appear on the site
