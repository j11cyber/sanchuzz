/**
 * Every photograph on the site, by named slot.
 *
 * Swap the whole site's imagery by editing this file. Each slot says where it
 * appears. Product photographs live in the database (admin edits them), but
 * their placeholders are defined here too so a reseed uses the same set.
 *
 * Current values are curated Unsplash placeholders (Unsplash License: free
 * for commercial use, no attribution required), each chosen for mood: dark,
 * warm, menswear and tailoring. TODO: real photo. Replace with house
 * photography on Supabase Storage; keep the slot names.
 */

/**
 * Source size is capped at 1600px and quality 75. next/image resizes from
 * this for every device; a 2000px/q80 source produced files over 1 MB that
 * the optimizer passed through unoptimized, which showed up as long image
 * decode tasks on desktop.
 */
function unsplash(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
}

/* The source pool. Add new photographs here, then point slots at them. */
const POOL = {
  /** Man in a checked suit inside a workshop, warm low light. */
  atelierCheckSuit: unsplash("1521341057461-6eb5f40b07ab"),
  /** Grey windowpane suit with black bow tie on a form, warm wood behind. */
  windowpaneBowTie: unsplash("1600091166971-7f9faad6c1e2"),
  /** Dark suit, deep red tie, arms folded, moody evening street. */
  darkSuitRedTie: unsplash("1519085360753-af0119f7cbe7"),
  /** Black suit and tie on a form against a brick wall. */
  blackSuitBrick: unsplash("1598808503746-f34c53b9323e"),
  /** Navy suit, buttoning the jacket, stairway behind. */
  navyButtoning: unsplash("1507679799987-c73779587ccf"),
  /** Man in a navy turtleneck and beret, warm brown backdrop. */
  beretPortrait: unsplash("1531384441138-2736e62e0919"),
  /** Man in a charcoal shawl-collar knit, black background. */
  shawlKnit: unsplash("1506794778202-cad84cf45f1d"),
  /** Man in a burgundy crew-neck knit, grey studio. */
  burgundyKnit: unsplash("1506634572416-48cdfe530110"),
  /** Man adjusting a black suit jacket, pale background. */
  adjustingJacket: unsplash("1544022613-e87ca75a784a"),
  /** Tan leather Oxford shoes, close. */
  tanOxfords: unsplash("1614252235316-8c857d38b5f4"),
  /** Grey double-breasted pinstripe, outdoors in autumn. */
  pinstripeDB: unsplash("1480429370139-e0132c086e2a"),
  /** Flat lay: dark denim, shirt and tie, tan jacket, brogues. */
  flatLay: unsplash("1593030761757-71fae45fa0e7"),
  /** Garments hanging behind glass in warm light. */
  hangingWarm: unsplash("1445205170230-053b83016050"),
  /** Black suit, sunglasses, city street. */
  blackSuitStreet: unsplash("1617127365659-c47fa864d8bc"),
} as const;

/* ------------------------------------------------------------------ slots */

/** House homepage. */
export const HOUSE = {
  /** Full-screen campaign hero (also the poster behind the hero video). */
  hero: POOL.atelierCheckSuit,
  /** Santus Sabaoth chapter photograph. */
  chapterSantus: POOL.windowpaneBowTie,
  /** Sartorial Executive chapter photograph. */
  chapterSartorial: POOL.darkSuitRedTie,
  /** Threshold: Santus door at rest, and the closer shot it crossfades to. */
  doorSantus: POOL.beretPortrait,
  doorSantusActive: POOL.atelierCheckSuit,
  /** Threshold: Sartorial door at rest, and the closer shot it crossfades to. */
  doorSartorial: POOL.blackSuitStreet,
  doorSartorialActive: POOL.blackSuitBrick,
  /** Small photographs beside the three process steps. */
  processDiagnose: POOL.darkSuitRedTie,
  processMake: POOL.windowpaneBowTie,
  processKeep: POOL.tanOxfords,
  /** Closing frame at the foot of the page. */
  closing: POOL.adjustingJacket,
  /** Portrait in the house story on About. */
  aboutPortrait: POOL.beretPortrait,
  aboutAtelier: POOL.atelierCheckSuit,
  aboutKnit: POOL.shawlKnit,
} as const;

/** Santus Sabaoth. */
export const SANTUS = {
  hero: POOL.beretPortrait,
  maker: POOL.atelierCheckSuit,
  commissionInvite: POOL.windowpaneBowTie,
  aboutHero: POOL.beretPortrait,
  aboutStrip: [POOL.atelierCheckSuit, POOL.windowpaneBowTie, POOL.tanOxfords] as const,
  commissionHero: POOL.flatLay,
  commissionClothing: POOL.windowpaneBowTie,
  commissionShoes: POOL.tanOxfords,
  commissionBags: POOL.hangingWarm,
  commissionClosing: POOL.atelierCheckSuit,
} as const;

/** Sartorial Executive, The Fashion Clinic. */
export const SARTORIAL = {
  /** Landing hero. */
  hero: POOL.darkSuitRedTie,
  /** Beside "We don't guess. We diagnose." */
  philosophy: POOL.blackSuitBrick,
  /** The Sartorial Executive statement band. */
  spotlight: POOL.blackSuitStreet,
  /** Small photographs beside the five protocol steps. */
  protocol: [POOL.navyButtoning, POOL.flatLay, POOL.windowpaneBowTie, POOL.adjustingJacket, POOL.darkSuitRedTie] as const,
  /** Checkup launcher band and the checkup page header. */
  checkup: POOL.adjustingJacket,
  /** Treatment menu header and service pages without their own image. */
  treatments: POOL.blackSuitBrick,
  /** Case files page header. */
  caseFiles: POOL.blackSuitStreet,
  /** Booking page. */
  book: POOL.navyButtoning,
  /** Closing frame. */
  closing: POOL.blackSuitStreet,
} as const;

/** Guide article covers by slug, used by the seed. */
export const GUIDE_COVERS: Record<string, string> = {
  "five-minute-suit-care-routine": POOL.navyButtoning,
  "reading-leather-before-you-buy": POOL.tanOxfords,
  "storing-bags-so-they-keep-their-shape": POOL.hangingWarm,
  "building-a-ten-piece-capsule-wardrobe": POOL.flatLay,
  "matching-color-temperature-to-skin-undertone": POOL.burgundyKnit,
  "dressing-for-your-build-proportion-over-size": POOL.adjustingJacket,
};

/** Daily cloth pick image, used by the seed. */
export const DAILY_CLOTH = POOL.windowpaneBowTie;

/** Product placeholder pairs [front, second angle] by slug, used by the seed. Admin can change them per product. */
export const PRODUCT_PLACEHOLDERS: Record<string, string[]> = {
  "obsidian-tailored-blazer": [POOL.navyButtoning, POOL.adjustingJacket],
  "charcoal-wool-trousers": [POOL.pinstripeDB, POOL.flatLay],
  "gold-stitched-oxford-shirt": [POOL.adjustingJacket, POOL.navyButtoning],
  "handcrafted-leather-loafers": [POOL.tanOxfords, POOL.flatLay],
  "sabaoth-signature-kaftan": [POOL.shawlKnit, POOL.burgundyKnit],
  "ivory-linen-agbada-set": [POOL.hangingWarm, POOL.atelierCheckSuit],
  "woven-raffia-tote": [POOL.hangingWarm],
  "sartorial-signature-overcoat": [POOL.darkSuitRedTie, POOL.blackSuitStreet],
  "milano-two-piece-suit": [POOL.windowpaneBowTie, POOL.blackSuitBrick],
  "whole-cut-oxford-shoe": [POOL.tanOxfords, POOL.flatLay],
  "sartorial-silk-evening-shirt": [POOL.blackSuitBrick, POOL.blackSuitStreet],
  "onyx-crocodile-embossed-belt": [POOL.flatLay],
  "cufflink-set-onyx-gold": [POOL.adjustingJacket],
  "executive-attache-briefcase": [POOL.darkSuitRedTie],
};

/** Pieces shown on the house homepage and brand landings. */
export const FEATURED_PRODUCTS = [
  "obsidian-tailored-blazer",
  "charcoal-wool-trousers",
  "handcrafted-leather-loafers",
  "sartorial-signature-overcoat",
  "milano-two-piece-suit",
  "whole-cut-oxford-shoe",
];

/* ------------------------------------------------------------- hero video */

export type HeroVideo = {
  /** Desktop and tablet: 1920x1080, H.264 MP4 (and optional WebM/VP9), 6 to 10 seconds, loop-friendly, no audio, target 2 to 4 MB. */
  desktop: { mp4: string; webm?: string };
  /** Phones: 1080x1920 portrait or 960x540 landscape, H.264 MP4, same cut, target under 1.5 MB. */
  mobile: { mp4: string; webm?: string };
};

/**
 * The house hero video. Set to the public paths once the files are in
 * public/media/, for example:
 *   { desktop: { mp4: "/media/hero-desktop.mp4", webm: "/media/hero-desktop.webm" },
 *     mobile:  { mp4: "/media/hero-mobile.mp4" } }
 * Slow connections and Save-Data get the poster photograph only.
 */
export const HERO_VIDEO: HeroVideo | null = null;

/** Backwards-compatible flat map (older imports). Prefer the slot objects above. */
export const PHOTOS = POOL;
