import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";
import ParallaxImage from "@/components/ParallaxImage";

export const metadata: Metadata = {
  title: "About · The Fashion Clinic",
  description:
    "The story and philosophy of The Fashion Clinic: Diagnose. Prescribe. Transform. We help men dress with intention and become the Sartorial Executive.",
};

export default function AboutPage() {
  return (
    <div className="space-y-16 py-8 sm:space-y-24 sm:py-12">
      {/* Hero Header */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden">
        <ParallaxImage
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=85"
          alt="The Fashion Clinic Atelier"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
          <ScrollReveal variant="3d">
            <span className="rounded-full bg-gold/20 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
              OUR PHILOSOPHY
            </span>
            <h1 className="mt-4 font-display text-4xl text-cream sm:text-6xl">
              We Don&rsquo;t Guess. <br />
              <span className="italic text-gold">We Diagnose.</span>
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Philosophy Narrative */}
      <section className="mx-auto max-w-3xl px-5 sm:px-8">
        <ScrollReveal>
          <div className="space-y-6 text-sm leading-relaxed text-cream-dim/85 sm:text-base">
            <p className="font-display text-xl text-cream sm:text-2xl leading-snug">
              &ldquo;Most men don&rsquo;t need more clothes. They need better decisions.&rdquo;
            </p>

            <p>
              The modern executive is inundated with options but starved of clarity. Too many men spend fortunes accumulating isolated, expensive garments that fail to produce a coherent personal presence. The result is decision fatigue in the morning and invisibility in the boardroom.
            </p>

            <p>
              <strong className="text-gold">The Fashion Clinic</strong> was created to solve this problem through systematic, clinical rigor. We view personal styling not as arbitrary decoration, but as an engineered discipline of proportions, color temperatures, and non-verbal authority.
            </p>

            <p>
              From our Lagos Atelier, we operate across two distinct storefronts:{" "}
              <Link href="/santus-sabaoth" className="text-gold underline underline-offset-4 hover:text-gold-soft">
                Santus Sabaoth
              </Link>
              , home to our single-designer bespoke tailoring and artisan leather craft, and{" "}
              <Link href="/sartorial-executive" className="text-gold underline underline-offset-4 hover:text-gold-soft">
                The Sartorial Executive
              </Link>
              , our curated edit of the world&rsquo;s leading luxury menswear houses.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 5 Pillars Grid */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="rounded-3xl border border-charcoal-800 bg-navy-950/70 p-8 sm:p-12 shadow-lift">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
              The Five Tenets
            </span>
            <h2 className="mt-2 font-display text-3xl text-cream">
              The Tenets of Sartorial Medicine
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { title: "Precision Fit", desc: "No off-the-rack compromises. Every shoulder line, collar roll, and trouser break is calibrated to your anatomy." },
              { title: "Intentionality", desc: "Every single garment serves a strategic purpose within a governing 7-day capsule matrix." },
              { title: "Visual Authority", desc: "Silhouettes and monochromatic disciplines designed to project leadership in C-Suite negotiations." },
              { title: "Material Integrity", desc: "Pure wools, raw silks, cashmere blends, and full-grain leathers that patina with distinction." },
              { title: "Lasting Aftercare", desc: "Rigorous fiber recovery protocols that preserve garment longevity and aesthetic vitality." },
            ].map((tenet, idx) => (
              <div key={tenet.title} className="rounded-2xl border border-charcoal-800 bg-charcoal-900/80 p-5">
                <div className="font-display text-lg text-gold font-semibold">0{idx + 1}</div>
                <h3 className="mt-2 font-display text-sm text-cream">{tenet.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-cream-dim/70">{tenet.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atelier Imagery */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <ScrollReveal variant="left">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
              <Image
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
                alt="Bespoke tailoring craft"
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal variant="right" delay={100}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
              <Image
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80"
                alt="Executive presence outcome"
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final Callout */}
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <div className="rounded-3xl border border-gold/40 bg-charcoal-900 p-8 sm:p-12 text-center">
          <h2 className="font-display text-3xl text-cream sm:text-4xl">
            Become the Sartorial Executive.
          </h2>
          <p className="mt-3 max-w-lg mx-auto text-xs text-cream-dim/75">
            Take the first step with an Executive Checkup or book a full 30-day Boardroom Cure transformation.
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
