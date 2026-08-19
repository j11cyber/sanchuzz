import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Aftercare Protocols · Garment Care & Longevity",
  description:
    "The Fashion Clinic Aftercare Protocol: maintaining fine tailoring, wool resting cycles, natural bristle brushing, steaming, and seasonal wardrobe audits.",
};

const PROTOCOLS = [
  {
    step: "01",
    title: "Wool Resting & Fiber Recovery",
    desc: "Never wear the same tailored suit on consecutive days. Natural wool fibers need at least 24–48 hours of rest on a contoured wooden hanger to release tension and naturally drop wrinkles.",
    tag: "Suit Longevity",
  },
  {
    step: "02",
    title: "Natural-Bristle Brushing",
    desc: "Brush your jacket and trousers with a natural horsehair or boar-bristle brush after every wear. This lifts micro-dust and surface oils before they become embedded in the weave.",
    tag: "Daily Ritual",
  },
  {
    step: "03",
    title: "Steaming Over Dry Cleaning",
    desc: "Dry-clean no more than twice a year. Harsh chemical solvents strip natural lanolin from wool, causing fiber brittleness. Use a vertical garment steamer to refresh and sanitize between wears.",
    tag: "Fabric Health",
  },
  {
    step: "04",
    title: "Contoured Wide-Shoulder Hangers",
    desc: "Wire and thin plastic hangers collapse tailored shoulder padding. Always hang jackets on contoured, wide wooden hangers (minimum 2-inch shoulder flare) to preserve collar and shoulder posture.",
    tag: "Storage Standard",
  },
  {
    step: "05",
    title: "Leather Conditioning & Cedar Trees",
    desc: "Insert aromatic cedar shoe trees into fine leather shoes immediately after taking them off. Condition leather uppers every 6–8 weeks to prevent cracking and maintain rich patina.",
    tag: "Footwear Care",
  },
  {
    step: "06",
    title: "Seasonal Wardrobe Audits",
    desc: "Every 90 days, conduct a 15-minute rotation review. Inspect buttons, trouser hems, and pocket linings. Align your capsule with the upcoming quarterly executive calendar.",
    tag: "Consistency",
  },
];

export default async function AftercarePage() {
  const articles = await prisma.guideArticle.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-16 py-12 sm:space-y-20 sm:py-16">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <ScrollReveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-charcoal-900 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            POST-TRANSFORMATION AFTERCARE PROTOCOL
          </span>
          <h1 className="mt-4 font-display text-4xl text-cream sm:text-6xl">
            Sartorial Aftercare
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream-dim/80 sm:text-base">
            Preserving your executive wardrobe is as critical as acquiring it. Follow our clinical maintenance protocols to ensure your tailoring, footwear, and accessories maintain their commanding presence indefinitely.
          </p>
        </ScrollReveal>
      </section>

      {/* Protocols Grid */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROTOCOLS.map((p, idx) => (
            <ScrollReveal
              key={p.title}
              delay={idx * 60}
              className="rounded-2xl border border-charcoal-800 bg-charcoal-900/80 p-6 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl text-gold font-semibold">{p.step}</span>
                  <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-gold">
                    {p.tag}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-lg text-cream">{p.title}</h2>
                <p className="mt-3 text-xs leading-relaxed text-cream-dim/75">{p.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Deep-Dive Articles */}
      {articles.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="border-t border-charcoal-800 pt-12">
            <ScrollReveal>
              <h2 className="font-display text-2xl text-cream sm:text-3xl">
                Clinical Care Notes from the Atelier
              </h2>
              <p className="mt-2 text-xs text-cream-dim/70">
                Detailed guides on fabric science, shoe construction grades, and bag preservation.
              </p>
            </ScrollReveal>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <Link
                  key={a.id}
                  href={`/guide/${a.slug}`}
                  className="group rounded-2xl border border-charcoal-800 bg-charcoal-900 p-5 shadow-soft transition hover:-translate-y-1 hover:border-gold/50"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">
                    {a.category}
                  </span>
                  <h3 className="mt-2 font-display text-base text-cream group-hover:text-gold transition">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-xs text-cream-dim/70 line-clamp-2">{a.excerpt}</p>
                  <span className="mt-4 inline-block text-xs text-gold">Read Full Protocol &rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ongoing Concierge Support */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-navy-950 to-charcoal-900 p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              WhatsApp Concierge Support
            </span>
            <h2 className="mt-1 font-display text-2xl text-cream">Need Quick Style Triage on the Move?</h2>
            <p className="mt-2 max-w-lg text-xs text-cream-dim/75">
              Active clients with Sartorial Prescriptions receive direct WhatsApp advisory for emergency outfit approval, travel packing verification, and accessory coordination.
            </p>
          </div>
          <Link
            href="/services#the-sartorial-prescription"
            className="rounded-full bg-emerald-500 px-8 py-3.5 text-xs font-bold text-charcoal-950 shadow-rx transition hover:bg-emerald-400 text-center"
          >
            Explore Sartorial Prescription (₦250k)
          </Link>
        </div>
      </section>
    </div>
  );
}
