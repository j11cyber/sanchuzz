import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  try {
    if (typeof process.loadEnvFile === "function") {
      process.loadEnvFile(".env");
    }
  } catch {
    // Ignore error if already loaded or file missing
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const IMG = (seed: string) => `https://picsum.photos/seed/${seed}/900/1100`;

const santusProducts = [
  {
    name: "Obsidian Tailored Blazer",
    slug: "obsidian-tailored-blazer",
    category: "Blazers",
    price: 185000,
    description:
      "Hand-cut from a heavyweight Italian wool blend, the Obsidian Blazer is built on Santus Sabaoth's signature soft-shoulder silhouette. Fully canvassed, horn buttons, and a hand-stitched lapel roll.",
    images: [IMG("santus-blazer-1"), IMG("santus-blazer-2")],
    sizes: ["46", "48", "50", "52"],
    stock: 6,
    featured: true,
  },
  {
    name: "Sabaoth Signature Kaftan",
    slug: "sabaoth-signature-kaftan",
    category: "Kaftans",
    price: 96000,
    description:
      "A modern reinterpretation of the classic kaftan in raw silk, finished with hand-embroidered trim along the neckline and cuffs.",
    images: [IMG("santus-kaftan-1"), IMG("santus-kaftan-2")],
    sizes: ["S", "M", "L", "XL"],
    stock: 10,
    featured: false,
  },
  {
    name: "Ivory Linen Agbada Set",
    slug: "ivory-linen-agbada-set",
    category: "Agbada",
    price: 240000,
    description:
      "Three-piece agbada in breathable ivory linen — inner shirt, trousers, and flowing outer robe with understated gold-thread detailing.",
    images: [IMG("santus-agbada-1"), IMG("santus-agbada-2")],
    sizes: ["M", "L", "XL", "XXL"],
    stock: 4,
    featured: false,
  },
  {
    name: "Charcoal Wool Trousers",
    slug: "charcoal-wool-trousers",
    category: "Trousers",
    price: 68000,
    description:
      "Slim-tapered trousers in brushed charcoal wool with a clean waistband and hidden hook closure — built to pair with any Santus jacket.",
    images: [IMG("santus-trousers-1")],
    sizes: ["30", "32", "34", "36", "38"],
    stock: 14,
    featured: false,
  },
  {
    name: "Gold-Stitched Oxford Shirt",
    slug: "gold-stitched-oxford-shirt",
    category: "Shirts",
    price: 52000,
    description:
      "A crisp cotton Oxford shirt with a subtle gold-thread monogram at the cuff — the everyday piece of the Santus Sabaoth line.",
    images: [IMG("santus-shirt-1"), IMG("santus-shirt-2")],
    sizes: ["S", "M", "L", "XL"],
    stock: 20,
    featured: false,
  },
  {
    name: "Handcrafted Leather Loafers",
    slug: "handcrafted-leather-loafers",
    category: "Shoes",
    price: 145000,
    description:
      "Full-grain leather loafers built on a hand-lasted last in Santus Sabaoth's own workshop. Aged brass buckle, leather sole.",
    images: [IMG("santus-loafers-1"), IMG("santus-loafers-2")],
    sizes: ["40", "41", "42", "43", "44", "45"],
    stock: 8,
    featured: false,
  },
  {
    name: "Woven Raffia Tote",
    slug: "woven-raffia-tote",
    category: "Bags",
    price: 74000,
    description:
      "A structured tote in hand-woven raffia with leather trim and interior suede lining — made in the same atelier as the ready-to-wear line.",
    images: [IMG("santus-bag-1")],
    sizes: ["One Size"],
    stock: 9,
    featured: false,
  },
];

const sartorialProducts = [
  {
    name: "Sartorial Signature Overcoat",
    slug: "sartorial-signature-overcoat",
    brand: "Santus Sabaoth",
    category: "Outerwear",
    price: 320000,
    description:
      "A double-breasted overcoat in midnight cashmere-wool, cut for the Sartorial Executive man who moves between boardrooms and black-tie.",
    images: [IMG("sart-coat-1"), IMG("sart-coat-2")],
    sizes: ["48", "50", "52", "54"],
    stock: 5,
    featured: true,
  },
  {
    name: "Milano Two-Piece Suit",
    brand: "Corsetti & Vale",
    slug: "milano-two-piece-suit",
    category: "Suits",
    price: 410000,
    description:
      "A slim two-piece suit from Corsetti & Vale in super-120s wool, half-canvassed with a soft Neapolitan shoulder.",
    images: [IMG("sart-suit-1"), IMG("sart-suit-2")],
    sizes: ["46", "48", "50", "52"],
    stock: 3,
    featured: false,
  },
  {
    name: "Onyx Crocodile-Embossed Belt",
    brand: "Rousel Maison",
    slug: "onyx-crocodile-embossed-belt",
    category: "Accessories",
    price: 98000,
    description:
      "Crocodile-embossed calfskin belt with a solid brass buckle finished in gunmetal — a Rousel Maison house staple.",
    images: [IMG("sart-belt-1")],
    sizes: ["32", "34", "36", "38"],
    stock: 12,
    featured: false,
  },
  {
    name: "Sartorial Silk Evening Shirt",
    brand: "Santus Sabaoth",
    slug: "sartorial-silk-evening-shirt",
    category: "Shirts",
    price: 132000,
    description:
      "Mulberry silk evening shirt with a hidden placket and mother-of-pearl buttons, made for the Sartorial Executive edit.",
    images: [IMG("sart-shirt-1"), IMG("sart-shirt-2")],
    sizes: ["S", "M", "L", "XL"],
    stock: 7,
    featured: false,
  },
  {
    name: "Whole-Cut Oxford Shoe",
    brand: "Ferrante Calzoleria",
    slug: "whole-cut-oxford-shoe",
    category: "Shoes",
    price: 265000,
    description:
      "A single-piece whole-cut Oxford from Ferrante Calzoleria, hand-polished patina finish over a Goodyear-welted sole.",
    images: [IMG("sart-shoe-1"), IMG("sart-shoe-2")],
    sizes: ["40", "41", "42", "43", "44"],
    stock: 4,
    featured: false,
  },
  {
    name: "Cufflink Set — Onyx & Gold",
    brand: "Rousel Maison",
    slug: "cufflink-set-onyx-gold",
    category: "Accessories",
    price: 87000,
    description:
      "18k gold-plated cufflinks set with polished onyx stone, presented in a signed leather case.",
    images: [IMG("sart-cufflinks-1")],
    sizes: ["One Size"],
    stock: 15,
    featured: false,
  },
  {
    name: "Executive Attaché Briefcase",
    brand: "Santus Sabaoth",
    slug: "executive-attache-briefcase",
    category: "Bags",
    price: 210000,
    description:
      "Structured full-grain leather attaché with brushed brass hardware and a hand-stitched gusset — built for the Sartorial Executive desk-to-boardroom day.",
    images: [IMG("sart-bag-1"), IMG("sart-bag-2")],
    sizes: ["One Size"],
    stock: 6,
    featured: false,
  },
];

const guideArticles = [
  {
    title: "The Five-Minute Suit Care Routine",
    slug: "five-minute-suit-care-routine",
    category: "Clothing Care",
    excerpt: "Keep a tailored suit looking sharp between cleanings with this daily routine.",
    content:
      "A well-tailored suit is an investment, and most of what damages it happens between wears — not during them. Brush your jacket and trousers with a natural-bristle clothes brush after every wear to lift dust and surface grime before it settles into the fibers. Hang the suit on a curved wooden hanger, never a wire one, to keep the shoulder line intact. Let it rest for at least 24 hours between wears so the wool fibers can recover. Steam rather than iron whenever possible, and always dry-clean sparingly — no more than two or three times a season — since the solvents used break down natural fibers over time.",
    coverImage: IMG("guide-suit-care"),
  },
  {
    title: "Reading Leather: How to Judge a Shoe Before You Buy",
    slug: "reading-leather-before-you-buy",
    category: "Shoe Care",
    excerpt: "Full-grain, top-grain, corrected — what the leather grade actually tells you.",
    content:
      "Full-grain leather retains the outermost layer of the hide, including its natural markings, and develops a rich patina with age. Top-grain leather has that layer sanded away for a more uniform look but ages less interestingly. Corrected-grain leather is heavily processed and coated, trading character for consistency. When shopping, look at the grain under raised light: natural, irregular texture signals full-grain; a perfectly uniform surface usually means it's been corrected. Press a thumb into the leather — full-grain will show a faint impression that slowly fades, a sign the fibers are intact.",
    coverImage: IMG("guide-leather"),
  },
  {
    title: "Storing Bags So They Keep Their Shape",
    slug: "storing-bags-so-they-keep-their-shape",
    category: "Bag Care",
    excerpt: "Stuffing, humidity, and the shelf position that saves a structured bag's silhouette.",
    content:
      "Structured bags lose their shape fastest from improper storage, not use. Stuff the body loosely with acid-free tissue paper or a cotton pillow insert — never with plastic bags, which trap moisture and can transfer color. Store bags upright on a shelf rather than stacked, and keep them out of direct sunlight, which dries and cracks leather over time. In humid climates, add a small silica packet inside the dust bag. Rotate bags in regular use so no single piece sits under constant strap tension.",
    coverImage: IMG("guide-bags"),
  },
  {
    title: "Building a Ten-Piece Capsule Wardrobe",
    slug: "building-a-ten-piece-capsule-wardrobe",
    category: "Wardrobe Building",
    excerpt: "Ten pieces, engineered to combine into more than twenty complete outfits.",
    content:
      "A capsule wardrobe works by maximizing combinations, not minimizing pieces for its own sake. Start with a neutral base: one navy suit, one charcoal trouser, two dress shirts in white and pale blue, and a versatile blazer that isn't part of the suit. Add one knit layer, one pair of dark denim for off-duty days, one overcoat, and two pairs of shoes — one derby, one loafer. Every piece should be able to pair with at least three others in the set. Build outward from there only once you've worn the core ten enough to know what's actually missing.",
    coverImage: IMG("guide-capsule"),
  },
  {
    title: "Matching Color Temperature to Skin Undertone",
    slug: "matching-color-temperature-to-skin-undertone",
    category: "Color & Styling",
    excerpt: "Why the same navy can flatter one man and wash out another.",
    content:
      "Every color has a temperature — warm or cool — and matching it to your skin's undertone is what makes an outfit look intentional rather than accidental. Check the veins on your wrist in natural light: green suggests a warm undertone, blue or purple suggests cool, and if it's hard to tell, you likely lean neutral. Warm undertones are flattered by camel, olive, and warm burgundy; cool undertones by charcoal, true navy, and icy blue. Neutral undertones have the most flexibility and can borrow from both directions. This is a starting point, not a rule — confidence in fit and cut matters more than any color chart.",
    coverImage: IMG("guide-color"),
  },
  {
    title: "Dressing for Your Build: Proportion Over Size",
    slug: "dressing-for-your-build-proportion-over-size",
    category: "Body Type Styling",
    excerpt: "The tailoring adjustments that matter more than the number on the tag.",
    content:
      "Fit is about proportion, not size. Shoulder seams should sit exactly at the edge of your natural shoulder — this is the one measurement tailoring can't easily fix, so get it right at purchase. Jacket length should cover the seat but expose the majority of the leg for the illusion of height. Trouser break should be minimal to none for a cleaner, longer line. Taller, leaner builds can carry more pattern and layering; broader builds benefit from single-breasted cuts and vertical lines like a subtle pinstripe. None of this is about hiding a body type — it's about directing the eye deliberately.",
    coverImage: IMG("guide-fit"),
  },
];

const santusAdmin = { username: process.env.ADMIN_SEED_USERNAME || "admin", password: process.env.ADMIN_SEED_PASSWORD || "ChangeMe123!" };

async function main() {
  console.log("Seeding Santus Sabaoth products...");
  for (const p of santusProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        section: "SANTUS_SABAOTH",
        name: p.name,
        slug: p.slug,
        brand: "Santus Sabaoth",
        category: p.category,
        price: p.price,
        description: p.description,
        images: JSON.stringify(p.images),
        sizes: JSON.stringify(p.sizes),
        stock: p.stock,
        featured: p.featured,
      },
    });
  }

  console.log("Seeding Sartorial Executive products...");
  for (const p of sartorialProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        section: "SARTORIAL_EXECUTIVE",
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        category: p.category,
        price: p.price,
        description: p.description,
        images: JSON.stringify(p.images),
        sizes: JSON.stringify(p.sizes),
        stock: p.stock,
        featured: p.featured,
      },
    });
  }

  console.log("Seeding guide articles...");
  for (const a of guideArticles) {
    await prisma.guideArticle.upsert({
      where: { slug: a.slug },
      update: {},
      create: { ...a, published: true },
    });
  }

  console.log("Seeding daily picks...");
  const clothProduct = await prisma.product.findUnique({
    where: { slug: "obsidian-tailored-blazer" },
  });
  const existingClothPick = await prisma.dailyPick.findFirst({
    where: { type: "CLOTH", title: "Obsidian Tailored Blazer" },
  });
  if (!existingClothPick) {
    await prisma.dailyPick.create({
      data: {
        type: "CLOTH",
        title: "Obsidian Tailored Blazer",
        description:
          "Today's pick pairs the Obsidian Blazer with charcoal trousers and a pale-blue Oxford shirt for a boardroom-to-dinner transition.",
        imageUrl: IMG("santus-blazer-1"),
        productId: clothProduct?.id,
      },
    });
  }
  const existingColorPick = await prisma.dailyPick.findFirst({
    where: { type: "COLOR", title: "Burnt Umber" },
  });
  if (!existingColorPick) {
    await prisma.dailyPick.create({
      data: {
        type: "COLOR",
        title: "Burnt Umber",
        description:
          "A warm, grounded brown that flatters most undertones — wear it as a knit layer under charcoal or navy for depth without shouting.",
        colorHex: "#7A4B2A",
      },
    });
  }

  console.log("Seeding admin user...");
  const passwordHash = await bcrypt.hash(santusAdmin.password, 10);
  await prisma.adminUser.upsert({
    where: { username: santusAdmin.username },
    update: {},
    create: { username: santusAdmin.username, passwordHash },
  });

  console.log("Seeding Fashion Clinic Services...");
  const servicesList = [
    {
      name: "The Executive Checkup",
      slug: "the-executive-checkup",
      price: 50000,
      duration: "30 Minutes",
      description: "A comprehensive 30-minute style diagnosis. We assess your physical proportions, lifestyle demands, and executive personal brand to identify major fashion flaws and deliver a precise verbal prescription.",
      features: JSON.stringify([
        "Full body proportion assessment",
        "Lifestyle & executive environment audit",
        "Personal brand alignment check",
        "Identification of major fashion flaws",
        "Immediate verbal prescription"
      ]),
      bestFor: "First-time clients seeking an objective, clinical assessment of their personal style.",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
      order: 1,
      active: true,
    },
    {
      name: "The Wardrobe Detox",
      slug: "the-wardrobe-detox",
      price: 120000,
      duration: "Half-Day Session",
      description: "An exhaustive audit of your current wardrobe. We categorize every garment into Keep, Tailor, Donate, or Remove, followed by a targeted shopping list and cohesive styling session.",
      features: JSON.stringify([
        "Complete wardrobe audit & inventory",
        "Keep, Tailor, Donate, and Remove classification",
        "Proportion and fit diagnosis for each piece",
        "Targeted acquisition shopping list",
        "In-person or virtual styling session"
      ]),
      bestFor: "Executives with overflowing wardrobes who still experience morning decision fatigue.",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80",
      order: 2,
      active: true,
    },
    {
      name: "The Sartorial Prescription",
      slug: "the-sartorial-prescription",
      price: 250000,
      duration: "7 Outfits for 7 Days",
      description: "A definitive style blueprint engineered around 12 core pieces producing 7 tailored outfits for 7 days. Includes personalized shopping curation, digital lookbook, mix-and-match guide, and 2 weeks WhatsApp concierge support.",
      features: JSON.stringify([
        "Complete style blueprint & body assessment",
        "Curated personal shopping of 12 core pieces",
        "7 complete outfits for 7 days",
        "High-resolution digital lookbook",
        "Mix-and-match matrix",
        "2 weeks dedicated WhatsApp concierge support"
      ]),
      bestFor: "Professionals ready for an intentional, versatile capsule wardrobe that works seamlessly.",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80",
      order: 3,
      active: true,
    },
    {
      name: "The Boardroom Cure",
      slug: "the-boardroom-cure",
      price: 400000,
      duration: "30-Day Executive Presence Transformation",
      description: "The ultimate 30-day executive transformation. Everything in the Sartorial Prescription plus end-to-end bespoke tailoring management, grooming protocols, posture and presentation guidance, and 1-on-1 executive presence coaching.",
      features: JSON.stringify([
        "Everything in The Sartorial Prescription",
        "Full bespoke tailoring & alterations management",
        "Executive outfit curation for key milestones",
        "Grooming & personal care protocol",
        "Posture and boardroom presentation coaching",
        "30 days of private executive advisory"
      ]),
      bestFor: "C-Suite leaders, founders, and executives preparing for high-stakes career inflection points.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
      order: 4,
      active: true,
    },
    {
      name: "Emergency Consultation",
      slug: "emergency-consultation",
      price: 75000,
      duration: "24-Hour Turnaround",
      description: "Rapid 24-hour style triage for urgent, high-stakes events — weddings, keynote speeches, investor pitches, executive interviews, and media appearances.",
      features: JSON.stringify([
        "Rapid 24-hour turnaround",
        "Event-specific dress code analysis",
        "Outfit formulation from current or rapid-sourced items",
        "Grooming and accessory coordination",
        "Pre-event visual inspection"
      ]),
      bestFor: "Urgent, time-critical styling emergencies requiring instant professional resolution.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
      order: 5,
      active: true,
    },
  ];

  for (const s of servicesList) {
    await prisma.serviceItem.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }

  console.log("Seeding Fashion Clinic Case Files...");
  const caseFilesList = [
    {
      caseNumber: "07",
      slug: "the-baggy-suit-syndrome",
      title: "The Baggy Suit Syndrome",
      symptoms: JSON.stringify([
        "Swimming in excess fabric",
        "Shoulder seams collapsing past natural shoulder point",
        "Trouser pooling over shoes with triple break",
        "Illusion of diminished height and authority"
      ]),
      diagnosis: "Incorrect off-the-rack sizing, lack of shoulder structure, and non-proportional drape diminishing physical stature.",
      prescription: JSON.stringify([
        "Restructure shoulder line to match natural acromion point",
        "Taper trousers to clean single/no break",
        "Shorten jacket sleeve to reveal 1/2-inch of shirt cuff",
        "Introduce Italian wool-blend jacket with soft canvassing"
      ]),
      result: "A sharp, commanding silhouette that adds visual height, eliminates excess bulk, and conveys immediate executive authority.",
      tags: JSON.stringify(["Tailoring", "Proportions", "Suits", "C-Suite"]),
      beforeImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      order: 1,
      active: true,
    },
    {
      caseNumber: "12",
      slug: "boardroom-invisibility",
      title: "Boardroom Invisibility",
      symptoms: JSON.stringify([
        "Ideas overlooked in executive meetings",
        "Zero distinct visual identity",
        "Dressed identically to junior staff",
        "Lacking visual weight during key presentations"
      ]),
      diagnosis: "Overly defensive 'safe dressing' resulting in complete visual blending and absent executive presence.",
      prescription: JSON.stringify([
        "Deploy a rich, disciplined monochromatic palette (Midnight Navy & Charcoal)",
        "Incorporate subtle textural contrast (brushed wool, silk knit)",
        "Add one signature power accessory (solid brass gunmetal belt or onyx cufflinks)"
      ]),
      result: "Unmistakable boardroom authority and visual gravitas that commands attention before a single word is spoken.",
      tags: JSON.stringify(["Executive Presence", "Power Dressing", "Boardroom", "Leadership"]),
      beforeImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      order: 2,
      active: true,
    },
    {
      caseNumber: "03",
      slug: "weekend-to-workwear-whiplash",
      title: "Weekend-to-Workwear Whiplash",
      symptoms: JSON.stringify([
        "Wardrobe overflowing with disparate impulse purchases",
        "Daily morning paralysis ('Full closet, nothing to wear')",
        "Chaotic transition between smart casual and formal meetings"
      ]),
      diagnosis: "Absence of a modular wardrobe system and high proportion of incompatible single-use items.",
      prescription: JSON.stringify([
        "Build a rigorous 10-piece capsule wardrobe foundation",
        "Standardize color temperatures across core pieces",
        "Integrate tailored kaftans and unstructured blazers for effortless smart-casual fluidity"
      ]),
      result: "Zero morning decision fatigue with over 20 interchangeable, high-impact outfit combinations.",
      tags: JSON.stringify(["Capsule Wardrobe", "Smart Casual", "Wardrobe System", "Efficiency"]),
      beforeImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      order: 3,
      active: true,
    },
    {
      caseNumber: "19",
      slug: "the-mismatched-executive",
      title: "The Mismatched Executive",
      symptoms: JSON.stringify([
        "High spend on premium individual items with zero outfit cohesion",
        "Clashing leather tones (brown shoes with black belt)",
        "Uncoordinated accessories and noisy patterns"
      ]),
      diagnosis: "High acquisition budget without a governing stylistic blueprint or color temperature discipline.",
      prescription: JSON.stringify([
        "Establish consistent leather finish guidelines (matching metals & patina)",
        "Enforce tone-on-tone color harmonies",
        "Anchor outfits with the Obsidian Tailored Blazer and crisp Oxford foundation"
      ]),
      result: "Polished, cohesive luxury presence reflecting true sophistication rather than indiscriminate brand accumulation.",
      tags: JSON.stringify(["Luxury Styling", "Color Harmony", "Leather Alignment", "C-Suite"]),
      beforeImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=80",
      order: 4,
      active: true,
    },
    {
      caseNumber: "05",
      slug: "the-monotone-dilemma",
      title: "The Monotone Dilemma",
      symptoms: JSON.stringify([
        "15 identical flat black suits",
        "Washed-out skin tone under fluorescent office lighting",
        "Flat, lifeless aesthetic devoid of personality"
      ]),
      diagnosis: "Color paralysis and severe lack of fabric depth/dimension.",
      prescription: JSON.stringify([
        "Introduce rich Midnight Navy, Deep Forest Green, and Charcoal Melange",
        "Integrate tactile fabrics: cashmere blends, hopsack wool, and raw silk trims",
        "Add warm burgundy and gold-stitched accents"
      ]),
      result: "A vibrant, multi-dimensional aesthetic that complements natural undertones and projects vitality and confidence.",
      tags: JSON.stringify(["Fabrics", "Color Strategy", "Modern Tailoring", "Vitality"]),
      beforeImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
      afterImage: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80",
      order: 5,
      active: true,
    },
  ];

  for (const c of caseFilesList) {
    await prisma.caseFile.upsert({
      where: { caseNumber: c.caseNumber },
      update: {},
      create: c,
    });
  }

  console.log("Seeding Site Settings...");
  const defaultSettings = [
    { key: "section_hero", value: JSON.stringify({ isEnabled: true }) },
    { key: "section_brand_positioning", value: JSON.stringify({ isEnabled: true }) },
    { key: "section_clinical_process", value: JSON.stringify({ isEnabled: true }) },
    { key: "section_sartorial_executive", value: JSON.stringify({ isEnabled: true }) },
    { key: "section_services", value: JSON.stringify({ isEnabled: true }) },
    { key: "section_case_files", value: JSON.stringify({ isEnabled: true }) },
    { key: "section_checkup", value: JSON.stringify({ isEnabled: true }) },
    { key: "section_prescription_pad", value: JSON.stringify({ isEnabled: true }) },
    { key: "section_shop", value: JSON.stringify({ isEnabled: true }) },
    { key: "section_story", value: JSON.stringify({ isEnabled: true }) },
    { key: "section_aftercare", value: JSON.stringify({ isEnabled: true }) },
    {
      key: "sartorial_executive_content",
      value: JSON.stringify({
        eyebrow: "THE ULTIMATE OUTCOME",
        heading: "The Sartorial Executive",
        subheading: "Not just well dressed. Authoritative, intentional, and undeniable.",
        description: "The Sartorial Executive is the definitive transformation. It is the transition from accidental clothing choices to an engineered visual identity that communicates leadership before you say a single word.",
        ctaText: "Book Your Executive Checkup",
        ctaLink: "/executive-checkup",
      }),
    },
    {
      key: "prescription_pad_settings",
      value: JSON.stringify({
        clinicName: "THE FASHION CLINIC",
        tagline: "DIAGNOSE. PRESCRIBE. TRANSFORM.",
        consultantName: "Lead Sartorial Consultant",
        consultantTitle: "Executive Image Director",
        disclaimer: "CONFIDENTIAL SARTORIAL DOSSIER · STRICTLY FOR EXECUTIVE WARDROBE TRANSFORMATION",
      }),
    },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
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
  });

