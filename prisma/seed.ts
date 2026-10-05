/**
 * Seed for the SanShuzz & Ma-Shirts house.
 *
 *   npm run db:seed
 *
 * Safe to re-run. Products, guide articles, picks and the admin user are
 * created only if missing (admin edits are never overwritten). Services and
 * the three canonical case files are kept in step with BUILD_BRIEF_V3.md on
 * every run, since the brief defines them. Settings are created if missing,
 * except for one targeted fix of a stale link left by the earlier build.
 */
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { DEFAULT_CONTACT } from "../src/lib/contact";
import { DEFAULT_PRESCRIPTION_PAD, DEFAULT_SARTORIAL_CONTENT, SECTION_KEYS } from "../src/lib/site-settings";
import { DAILY_CLOTH, FEATURED_PRODUCTS, GUIDE_COVERS, PRODUCT_PLACEHOLDERS } from "../src/lib/photos";

const FEATURED = new Set(FEATURED_PRODUCTS);

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error("Set DIRECT_URL or DATABASE_URL");

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// TODO: real photo. Placeholder imagery until product photography arrives.
const IMG = (seed: string) => `https://picsum.photos/seed/${seed}/900/1100`;

/* ------------------------------------------------------------- products */

const santusProducts = [
  { name: "Obsidian Tailored Blazer", slug: "obsidian-tailored-blazer", category: "Blazers", price: 185000, description: "Hand-cut from a heavyweight Italian wool blend on Santus Sabaoth's soft-shoulder block. Fully canvassed, horn buttons, hand-stitched lapel roll.", images: [IMG("santus-blazer-1"), IMG("santus-blazer-2")], sizes: ["46", "48", "50", "52"], stock: 6, featured: true },
  { name: "Sabaoth Signature Kaftan", slug: "sabaoth-signature-kaftan", category: "Kaftans", price: 96000, description: "A modern kaftan in raw silk, finished with hand-embroidered trim along the neckline and cuffs.", images: [IMG("santus-kaftan-1"), IMG("santus-kaftan-2")], sizes: ["S", "M", "L", "XL"], stock: 10, featured: false },
  { name: "Ivory Linen Agbada Set", slug: "ivory-linen-agbada-set", category: "Agbada", price: 240000, description: "Three-piece agbada in breathable ivory linen: inner shirt, trousers and flowing outer robe with understated gold-thread detail.", images: [IMG("santus-agbada-1"), IMG("santus-agbada-2")], sizes: ["M", "L", "XL", "XXL"], stock: 4, featured: false },
  { name: "Charcoal Wool Trousers", slug: "charcoal-wool-trousers", category: "Trousers", price: 68000, description: "Slim-tapered trousers in brushed charcoal wool with a clean waistband and hidden hook closure. Built to pair with any Santus jacket.", images: [IMG("santus-trousers-1")], sizes: ["30", "32", "34", "36", "38"], stock: 14, featured: false },
  { name: "Gold-Stitched Oxford Shirt", slug: "gold-stitched-oxford-shirt", category: "Shirts", price: 52000, description: "A crisp cotton Oxford with a subtle gold-thread monogram at the cuff. The everyday piece of the line.", images: [IMG("santus-shirt-1"), IMG("santus-shirt-2")], sizes: ["S", "M", "L", "XL"], stock: 20, featured: false },
  { name: "Handcrafted Leather Loafers", slug: "handcrafted-leather-loafers", category: "Shoes", price: 145000, description: "Full-grain leather loafers on a hand-lasted last from the workshop. Aged brass buckle, leather sole.", images: [IMG("santus-loafers-1"), IMG("santus-loafers-2")], sizes: ["40", "41", "42", "43", "44", "45"], stock: 8, featured: false },
  { name: "Woven Raffia Tote", slug: "woven-raffia-tote", category: "Bags", price: 74000, description: "A structured tote in hand-woven raffia with leather trim and suede lining, made in the same atelier as the clothing.", images: [IMG("santus-bag-1")], sizes: ["One Size"], stock: 9, featured: false },
];

const sartorialProducts = [
  { name: "Sartorial Signature Overcoat", slug: "sartorial-signature-overcoat", brand: "Santus Sabaoth", category: "Outerwear", price: 320000, description: "A double-breasted overcoat in midnight cashmere-wool, cut for the man who moves between boardrooms and black tie.", images: [IMG("sart-coat-1"), IMG("sart-coat-2")], sizes: ["48", "50", "52", "54"], stock: 5, featured: true },
  { name: "Milano Two-Piece Suit", slug: "milano-two-piece-suit", brand: "Corsetti & Vale", category: "Suits", price: 410000, description: "A slim two-piece from Corsetti & Vale in Super 120s wool, half-canvassed with a soft Neapolitan shoulder.", images: [IMG("sart-suit-1"), IMG("sart-suit-2")], sizes: ["46", "48", "50", "52"], stock: 3, featured: false },
  { name: "Onyx Crocodile-Embossed Belt", slug: "onyx-crocodile-embossed-belt", brand: "Rousel Maison", category: "Accessories", price: 98000, description: "Crocodile-embossed calfskin with a solid brass buckle in gunmetal. A Rousel Maison staple.", images: [IMG("sart-belt-1")], sizes: ["32", "34", "36", "38"], stock: 12, featured: false },
  { name: "Sartorial Silk Evening Shirt", slug: "sartorial-silk-evening-shirt", brand: "Santus Sabaoth", category: "Shirts", price: 132000, description: "Mulberry silk evening shirt with a hidden placket and mother-of-pearl buttons.", images: [IMG("sart-shirt-1"), IMG("sart-shirt-2")], sizes: ["S", "M", "L", "XL"], stock: 7, featured: false },
  { name: "Whole-Cut Oxford Shoe", slug: "whole-cut-oxford-shoe", brand: "Ferrante Calzoleria", category: "Shoes", price: 265000, description: "A single-piece whole-cut Oxford, hand-polished patina over a Goodyear-welted sole.", images: [IMG("sart-shoe-1"), IMG("sart-shoe-2")], sizes: ["40", "41", "42", "43", "44"], stock: 4, featured: false },
  { name: "Cufflink Set, Onyx and Gold", slug: "cufflink-set-onyx-gold", brand: "Rousel Maison", category: "Accessories", price: 87000, description: "18k gold-plated cufflinks set with polished onyx, in a signed leather case.", images: [IMG("sart-cufflinks-1")], sizes: ["One Size"], stock: 15, featured: false },
  { name: "Executive Attaché Briefcase", slug: "executive-attache-briefcase", brand: "Santus Sabaoth", category: "Bags", price: 210000, description: "Structured full-grain leather attaché with brushed brass hardware and a hand-stitched gusset.", images: [IMG("sart-bag-1"), IMG("sart-bag-2")], sizes: ["One Size"], stock: 6, featured: false },
];

/* ---------------------------------------------------------------- guide */

const guideArticles = [
  { title: "The Five-Minute Suit Care Routine", slug: "five-minute-suit-care-routine", category: "Clothing Care", excerpt: "Keep a tailored suit sharp between cleanings with a daily routine.", content: "A well-tailored suit is an investment, and most of what damages it happens between wears, not during them. Brush the jacket and trousers with a natural-bristle clothes brush after every wear to lift dust before it settles into the fibres. Hang the suit on a curved wooden hanger, never wire, to keep the shoulder line. Rest it at least 24 hours between wears so the wool recovers. Steam rather than iron where you can, and dry-clean sparingly, no more than two or three times a season, because the solvents break down natural fibres over time." },
  { title: "Reading Leather: How to Judge a Shoe Before You Buy", slug: "reading-leather-before-you-buy", category: "Shoe Care", excerpt: "Full-grain, top-grain, corrected. What the grade actually tells you.", content: "Full-grain leather keeps the outermost layer of the hide with its natural markings and develops a rich patina with age. Top-grain has that layer sanded away for a uniform look but ages less interestingly. Corrected-grain is heavily processed and coated, trading character for consistency. Look at the grain under raised light: natural, irregular texture signals full-grain; a perfectly uniform surface usually means corrected. Press a thumb into the leather. Full-grain shows a faint impression that slowly fades, a sign the fibres are intact." },
  { title: "Storing Bags So They Keep Their Shape", slug: "storing-bags-so-they-keep-their-shape", category: "Bag Care", excerpt: "Stuffing, humidity and the shelf position that saves a structured bag.", content: "Structured bags lose their shape fastest from poor storage, not use. Stuff the body loosely with acid-free tissue or a cotton insert, never plastic bags, which trap moisture and transfer colour. Store bags upright rather than stacked, out of direct sunlight, which dries and cracks leather. In humid climates add a small silica packet inside the dust bag. Rotate bags in regular use so no single piece sits under constant strap tension." },
  { title: "Building a Ten-Piece Capsule Wardrobe", slug: "building-a-ten-piece-capsule-wardrobe", category: "Wardrobe Building", excerpt: "Ten pieces, engineered to combine into more than twenty outfits.", content: "A capsule wardrobe works by maximising combinations, not by minimising pieces for its own sake. Start with a neutral base: one navy suit, one charcoal trouser, two dress shirts in white and pale blue, and a blazer that is not part of the suit. Add one knit layer, one pair of dark denim, one overcoat and two pairs of shoes, a derby and a loafer. Every piece should pair with at least three others in the set. Build outward only once you have worn the core ten enough to know what is actually missing." },
  { title: "Matching Colour Temperature to Skin Undertone", slug: "matching-color-temperature-to-skin-undertone", category: "Color & Styling", excerpt: "Why the same navy flatters one man and washes out another.", content: "Every colour has a temperature, warm or cool, and matching it to your skin's undertone is what makes an outfit look intentional. Check the veins on your wrist in daylight: green suggests warm, blue or purple suggests cool, and if it is hard to tell you likely lean neutral. Warm undertones are flattered by camel, olive and warm burgundy; cool undertones by charcoal, true navy and icy blue. Neutral undertones can borrow from both. A starting point, not a rule. Fit and cut matter more than any colour chart." },
  { title: "Dressing for Your Build: Proportion Over Size", slug: "dressing-for-your-build-proportion-over-size", category: "Body Type Styling", excerpt: "The tailoring adjustments that matter more than the number on the tag.", content: "Fit is proportion, not size. Shoulder seams should sit exactly at the edge of your natural shoulder. That is the one measurement tailoring cannot easily fix, so get it right at purchase. Jacket length should cover the seat but show most of the leg. Trouser break should be minimal to none for a cleaner, longer line. Taller, leaner builds carry more pattern and layering; broader builds benefit from single-breasted cuts and vertical lines. None of this hides a body type. It directs the eye deliberately." },
];

/* ------------------------------------------------------------- services */

const services = [
  { slug: "the-executive-checkup", name: "The Executive Checkup", price: 50000, depositPercent: 50, duration: "30 minutes", description: "A thirty-minute style diagnosis. We read your proportions, your rooms and your position, name the three flaws costing you the most, and give you a verbal prescription on the spot.", features: ["30-minute style diagnosis", "Three major flaws identified", "Verbal prescription"], bestFor: "First-time clients who want an objective, clinical read on how they dress.", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80", order: 1 },
  { slug: "the-wardrobe-detox", name: "The Wardrobe Detox", price: 120000, depositPercent: 50, duration: "Half day, in your home or office", description: "An audit of everything you own. Each garment is sorted into keep, tailor or donate, you leave with a list of the ten essentials you are missing, and we finish with an hour of styling from what remains.", features: ["In-home or office wardrobe audit", "Keep, tailor, donate system", "List of 10 missing essentials", "1-hour styling session"], bestFor: "Men with full wardrobes and nothing to wear.", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80", order: 2 },
  { slug: "the-sartorial-prescription", name: "The Sartorial Prescription", price: 250000, depositPercent: 50, duration: "7 outfits for 7 days", description: "A complete wardrobe blueprint: twelve core pieces sourced for you, seven outfits for seven days, a digital lookbook you can open on your phone, and two weeks of WhatsApp support while you wear it in.", features: ["7 outfits for 7 days", "12 core pieces sourced", "Digital lookbook", "2 weeks WhatsApp support"], bestFor: "Professionals ready for a wardrobe that works without thought every morning.", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80", order: 3 },
  { slug: "the-boardroom-cure", name: "The Boardroom Cure", price: 400000, depositPercent: 50, duration: "30 days", description: "Thirty days to executive presence. We manage the tailoring of five pieces, build four event outfits for the dates that matter, and coach grooming and posture so the whole picture holds.", features: ["30-day executive presence transformation", "Tailoring management for 5 pieces", "4 event outfits", "Grooming and posture coaching"], bestFor: "C-suite leaders, founders and partners approaching a high-stakes inflection point.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80", order: 4 },
  { slug: "emergency-consultation", name: "Emergency Consultation", price: 75000, depositPercent: 50, duration: "24-hour turnaround", description: "Rapid styling for a wedding, interview or pitch that is almost here. Dress code read, outfit formulated from what you have or can be sourced fast, accessories coordinated, a final inspection before you walk in.", features: ["24-hour turnaround", "Wedding, interview or pitch", "Outfit from current or rapid-sourced pieces", "Pre-event inspection"], bestFor: "Anyone with a date that cannot move.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80", order: 5 },
];

/* ----------------------------------------------------------- case files */

const caseFiles = [
  { caseNumber: "07", slug: "the-baggy-suit-syndrome", title: "The Baggy Suit Syndrome", symptoms: ["Swimming in excess fabric", "Shoulder seams collapsing past the natural shoulder", "Trousers pooling over the shoe", "Reads shorter and less certain than he is"], diagnosis: "Off-the-rack sizing with no shoulder structure and a drape that fights his proportions.", prescription: ["Shoulder line restructured to the natural shoulder point", "Trousers tapered to a clean single break", "Jacket sleeve shortened to show half an inch of cuff", "An Italian wool-blend jacket with soft canvassing introduced"], result: "A sharp, commanding silhouette that adds visual height, removes the bulk and reads as authority the moment he sits down.", tags: ["Tailoring", "Proportions", "Suits", "C-Suite"], beforeImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80", afterImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80", order: 1 },
  { caseNumber: "12", slug: "boardroom-invisibility", title: "Boardroom Invisibility", symptoms: ["Ideas overlooked in executive meetings", "No distinct visual identity", "Dressed identically to junior staff", "No visual weight during key presentations"], diagnosis: "Defensive safe dressing that blended him into the room and erased his seniority.", prescription: ["A disciplined monochrome palette of midnight navy and charcoal", "Textural contrast through brushed wool and silk knit", "One signature accessory: a gunmetal belt or onyx cufflinks"], result: "Unmistakable presence that commands the room before a word is spoken.", tags: ["Executive Presence", "Power Dressing", "Boardroom", "Leadership"], beforeImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80", afterImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80", order: 2 },
  { caseNumber: "03", slug: "weekend-to-workwear-whiplash", title: "Weekend to Workwear Whiplash", symptoms: ["A wardrobe overflowing with impulse purchases", "Daily morning paralysis: full closet, nothing to wear", "Chaotic switching between smart casual and formal"], diagnosis: "No modular system and a high share of single-use pieces that refuse to combine.", prescription: ["A rigorous ten-piece capsule foundation", "Colour temperature standardised across core pieces", "Tailored kaftans and unstructured blazers for smart-casual fluidity"], result: "Zero morning decision fatigue and more than twenty interchangeable, high-impact outfits.", tags: ["Capsule Wardrobe", "Smart Casual", "Wardrobe System", "Efficiency"], beforeImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80", afterImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", order: 3 },
];

/* ----------------------------------------------------------------- main */

async function main() {
  console.log("Products (create if missing)");
  for (const p of santusProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        section: "SANTUS_SABAOTH",
        brand: "Santus Sabaoth",
        ...p,
        images: JSON.stringify(PRODUCT_PLACEHOLDERS[p.slug] ?? p.images),
        sizes: JSON.stringify(p.sizes),
        featured: FEATURED.has(p.slug),
      },
    });
  }
  for (const p of sartorialProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        section: "SARTORIAL_EXECUTIVE",
        ...p,
        images: JSON.stringify(PRODUCT_PLACEHOLDERS[p.slug] ?? p.images),
        sizes: JSON.stringify(p.sizes),
        featured: FEATURED.has(p.slug),
      },
    });
  }

  console.log("Guide articles (create if missing)");
  for (const a of guideArticles) {
    await prisma.guideArticle.upsert({ where: { slug: a.slug }, update: {}, create: { ...a, coverImage: GUIDE_COVERS[a.slug] ?? null, published: true } });
  }

  console.log("Daily picks (create if none)");
  if ((await prisma.dailyPick.count({ where: { type: "CLOTH" } })) === 0) {
    const blazer = await prisma.product.findUnique({ where: { slug: "obsidian-tailored-blazer" } });
    await prisma.dailyPick.create({
      data: { type: "CLOTH", title: "Obsidian Tailored Blazer", description: "Today's pick pairs the Obsidian Blazer with charcoal trousers and a pale-blue Oxford for a boardroom-to-dinner day.", imageUrl: DAILY_CLOTH, productId: blazer?.id },
    });
  }
  if ((await prisma.dailyPick.count({ where: { type: "COLOR" } })) === 0) {
    await prisma.dailyPick.create({
      data: { type: "COLOR", title: "Burnt Umber", description: "A warm, grounded brown that flatters most undertones. Wear it as a knit layer under charcoal or navy.", colorHex: "#7A4B2A" },
    });
  }

  console.log("Admin user (create if missing)");
  const username = process.env.ADMIN_SEED_USERNAME || "admin";
  const password = process.env.ADMIN_SEED_PASSWORD || "ChangeMe123!";
  await prisma.adminUser.upsert({ where: { username }, update: {}, create: { username, passwordHash: await bcrypt.hash(password, 10) } });

  console.log("Services (kept in step with the brief)");
  for (const s of services) {
    const data = { ...s, features: JSON.stringify(s.features), active: true };
    await prisma.serviceItem.upsert({ where: { slug: s.slug }, update: data, create: data });
  }

  console.log("Case files #07, #12, #03 (kept in step with the brief)");
  for (const c of caseFiles) {
    const data = { ...c, symptoms: JSON.stringify(c.symptoms), prescription: JSON.stringify(c.prescription), tags: JSON.stringify(c.tags), published: true };
    await prisma.caseFile.upsert({ where: { caseNumber: c.caseNumber }, update: data, create: data });
  }

  console.log("Settings (create if missing)");
  for (const key of SECTION_KEYS) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value: JSON.stringify({ isEnabled: true }) } });
  }
  // Toggles for sections that no longer exist.
  await prisma.siteSetting.deleteMany({ where: { key: { in: ["section_story", "section_prescription_pad"] } } });

  await prisma.siteSetting.upsert({ where: { key: "contact" }, update: {}, create: { key: "contact", value: JSON.stringify(DEFAULT_CONTACT) } });
  await prisma.siteSetting.upsert({ where: { key: "prescription_pad_settings" }, update: {}, create: { key: "prescription_pad_settings", value: JSON.stringify(DEFAULT_PRESCRIPTION_PAD) } });

  const spotlight = await prisma.siteSetting.findUnique({ where: { key: "sartorial_executive_content" } });
  if (!spotlight) {
    await prisma.siteSetting.create({ data: { key: "sartorial_executive_content", value: JSON.stringify(DEFAULT_SARTORIAL_CONTENT) } });
  } else {
    // Targeted fix: the earlier build seeded a link to a URL that no longer exists.
    try {
      const parsed = JSON.parse(spotlight.value);
      if (parsed.ctaLink === "/executive-checkup") {
        parsed.ctaLink = DEFAULT_SARTORIAL_CONTENT.ctaLink;
        await prisma.siteSetting.update({ where: { key: "sartorial_executive_content" }, data: { value: JSON.stringify(parsed) } });
        console.log("  fixed stale ctaLink on sartorial_executive_content");
      }
    } catch {
      // leave malformed value alone
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
