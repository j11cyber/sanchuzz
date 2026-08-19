import Link from "next/link";
import type { Metadata } from "next";
import { getProductsBySection } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import ScrollReveal from "@/components/ScrollReveal";
import ParallaxImage from "@/components/ParallaxImage";

export const metadata: Metadata = {
  title: "The Sartorial Executive · The Transformation",
  description:
    "The Sartorial Executive is the definitive transformation. Not just well dressed. Authoritative, intentional, and undeniable. Explore the transformation pillars and curated luxury edit.",
};

const PILLARS = [
  {
    title: "Proportional Tailoring",
    desc: "Shoulder lines calibrated exactly to your acromion point, waist suppression without pulling, and sleeve pitches that frame your hands with precision.",
  },
  {
    title: "Intentional Wardrobe",
    desc: "Every garment in your closet has a distinct strategic objective. Zero accidental impulse purchases. Zero morning decision fatigue.",
  },
  {
    title: "Stylistic Consistency",
    desc: "Seamless visual continuity from boardroom negotiations and investor pitches to black-tie galas and private smart-casual summits.",
  },
  {
    title: "Visual Authority",
    desc: "Color palettes, textures, and silhouettes engineered to establish gravitas and executive presence the moment you enter the room.",
  },
  {
    title: "Heightened Presence",
    desc: "Alignment of tailoring, grooming protocols, and posture that elevates your non-verbal communication and leadership stature.",
  },
  {
    title: "Goal-Aligned Image",
    desc: "An executive aesthetic purposefully constructed to support your upcoming milestones, promotions, and strategic career objectives.",
  },
];

const ROADMAP = [
  {
    phase: "PHASE 01",
    title: "Clinical Style Diagnosis",
    desc: "We perform the 30-minute Executive Checkup to identify structural fashion flaws, posture traits, and wardrobe friction points.",
  },
  {
    phase: "PHASE 02",
    title: "The Sartorial Prescription",
    desc: "We formulate a definitive 12-piece wardrobe blueprint and 7-day outfit matrix tailored to your executive calendar.",
  },
  {
    phase: "PHASE 03",
    title: "Atelier Execution & Detox",
    desc: "We audit your existing closet, manage bespoke alterations, and curate new luxury pieces from our atelier and curated houses.",
  },
  {
    phase: "PHASE 04",
    title: "Executive Presence Mastery",
    desc: "You step into every boardroom, keynote, and media appearance with complete confidence as the Sartorial Executive.",
  },
];

export default async function SartorialExecutivePage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}) {
  const { brand } = await searchParams;
  const products = await getProductsBySection("SARTORIAL_EXECUTIVE");
  const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[];
  const filtered = brand ? products.filter((p) => p.brand === brand) : products;

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative flex min-h-[75vh] items-end overflow-hidden">
        <ParallaxImage
          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1800&q=85"
          alt="The Sartorial Executive"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
        
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
          <ScrollReveal variant="3d">
            <span className="rounded-full bg-gold/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
              THE ULTIMATE TRANSFORMATION
            </span>
            <h1 className="mt-4 font-display text-4xl text-cream sm:text-6xl md:text-7xl">
              The Sartorial Executive
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream-dim/85 sm:text-lg">
              Not just well-dressed. A man whose clothing fits with mathematical precision, whose wardrobe is intentional, and whose presence communicates authority before a word is spoken.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/executive-checkup"
                className="rounded-full bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-950 shadow-gold transition hover:scale-105 hover:bg-gold-soft"
              >
                Book Executive Checkup (₦50,000)
              </Link>
              <Link
                href="#catalogue"
                className="rounded-full border border-cream-dim/30 bg-charcoal-950/50 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-cream transition hover:border-gold hover:text-gold"
              >
                Shop the Luxury Edit
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* The 6 Transformation Pillars */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <ScrollReveal>
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
            Core Standards
          </span>
          <h2 className="mt-2 font-display text-3xl text-cream sm:text-4xl">
            What It Means to Be the Sartorial Executive
          </h2>
          <p className="mt-3 max-w-xl text-xs text-cream-dim/75">
            The Sartorial Executive is defined by 6 non-negotiable principles of visual mastery.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, idx) => (
            <ScrollReveal
              key={pillar.title}
              delay={idx * 70}
              className="rounded-2xl border border-charcoal-800 bg-charcoal-900/80 p-6 shadow-soft"
            >
              <div className="flex items-center gap-2">
                <span className="font-display text-lg text-gold font-semibold">0{idx + 1}</span>
                <h3 className="font-display text-lg text-cream">{pillar.title}</h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-cream-dim/75">{pillar.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Transformation Roadmap */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="rounded-3xl border border-charcoal-800 bg-navy-950/70 p-8 sm:p-12 shadow-lift">
          <ScrollReveal>
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
              The Journey
            </span>
            <h2 className="mt-2 font-display text-3xl text-cream sm:text-4xl">
              The Transformation Roadmap
            </h2>
            <p className="mt-3 max-w-xl text-xs text-cream-dim/75">
              How we guide you systematically from your current fashion baseline to complete executive image dominance.
            </p>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {ROADMAP.map((item, i) => (
              <div key={item.phase} className="rounded-2xl border border-charcoal-800 bg-charcoal-900/90 p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                    {item.phase}
                  </span>
                  <h3 className="mt-2 font-display text-base text-cream">{item.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-cream-dim/70">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-charcoal-800/80 text-right">
                  <span className="text-xs text-gold">Step 0{i + 1} &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Edit Storefront */}
      <section id="catalogue" className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Curated Collection</span>
              <h2 className="mt-2 font-display text-3xl text-cream sm:text-4xl">The Sartorial Executive Edit</h2>
              <p className="mt-2 text-xs text-cream-dim/75">
                Tailored blazers, whole-cut footwear, structured overcoats, and power accessories curated for executive command.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Brand Filter Pills */}
        <div className="snap-row no-scrollbar mt-6 sm:flex-wrap sm:overflow-visible">
          <Link
            href="/sartorial-executive#catalogue"
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition ${
              !brand
                ? "border-gold bg-gold text-charcoal-950 font-semibold"
                : "border-charcoal-700 text-cream-dim hover:border-gold/60 hover:text-gold"
            }`}
          >
            All Brands
          </Link>
          {brands.map((b) => (
            <Link
              key={b}
              href={`/sartorial-executive?brand=${encodeURIComponent(b)}#catalogue`}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition ${
                brand === b
                  ? "border-gold bg-gold text-charcoal-950 font-semibold"
                  : "border-charcoal-700 text-cream-dim hover:border-gold/60 hover:text-gold"
              }`}
            >
              {b}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        <div className="mt-8 sm:mt-10">
          <ProductGrid products={filtered} basePath="/sartorial-executive" />
        </div>
      </section>

      {/* Direct Booking Callout */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="rounded-3xl border border-gold/40 bg-charcoal-900 p-8 sm:p-12 text-center">
          <h2 className="font-display text-3xl text-cream">
            Ready to Begin Your Executive Transformation?
          </h2>
          <p className="mt-3 max-w-lg mx-auto text-xs text-cream-dim/75">
            Book a 30-minute style diagnosis or full executive presence consultation with our lead sartorial team.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/executive-checkup"
              className="rounded-full bg-gold px-8 py-3.5 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
            >
              Book Executive Checkup (₦50,000)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
