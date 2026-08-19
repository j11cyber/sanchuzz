import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAllProducts, serializeProduct } from "@/lib/products";
import { getActiveServices } from "@/lib/services";
import { getActiveCaseFiles } from "@/lib/case-files";
import { getSectionToggles, getSartorialExecutiveContent } from "@/lib/site-settings";
import { formatNaira } from "@/lib/money";
import ScrollReveal from "@/components/ScrollReveal";
import ParallaxImage from "@/components/ParallaxImage";
import CaseFileCard from "@/components/CaseFileCard";
import ServicesCatalogue from "@/components/ServicesCatalogue";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const [
    toggles,
    sartorialContent,
    services,
    caseFiles,
    allProducts,
    guideArticles,
  ] = await Promise.all([
    getSectionToggles(),
    getSartorialExecutiveContent(),
    getActiveServices(),
    getActiveCaseFiles(),
    getAllProducts(),
    prisma.guideArticle.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const spotlightProducts = allProducts.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      {toggles.section_hero && (
        <section className="relative flex min-h-[90vh] items-end overflow-hidden">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=85"
            alt="The Fashion Clinic"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/65 to-charcoal-950/20" />
          
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-charcoal-950/80 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                THE FASHION CLINIC &middot; SARTORIAL MEDICINE
              </div>

              <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.08] text-cream sm:text-6xl md:text-7xl">
                You don&rsquo;t need more clothes.{" "}
                <span className="italic text-gold">You need a diagnosis.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-dim/85 sm:text-lg">
                Most men don&rsquo;t have a fashion problem. They have a diagnosis problem. We identify what&rsquo;s wrong with your style, prescribe the exact solution, and help you become the Sartorial Executive.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/executive-checkup"
                  className="rounded-full bg-gold px-8 py-4 text-sm font-semibold tracking-wide text-charcoal-950 shadow-gold transition hover:scale-[1.02] hover:bg-gold-soft"
                >
                  Book Executive Checkup
                </Link>

                <Link
                  href="/shop"
                  className="rounded-full border border-cream-dim/30 bg-charcoal-950/40 px-8 py-4 text-sm font-medium text-cream backdrop-blur-sm transition hover:border-gold hover:text-gold"
                >
                  Shop the Collection
                </Link>
              </div>

              {/* Clinic Key Metrics */}
              <div className="mt-12 grid grid-cols-2 gap-4 border-t border-charcoal-800/80 pt-6 sm:grid-cols-4">
                <div>
                  <div className="text-xl font-display text-gold">₦50,000</div>
                  <div className="text-[11px] text-cream-dim/60">Executive Checkup</div>
                </div>
                <div>
                  <div className="text-xl font-display text-cream">5 Core</div>
                  <div className="text-[11px] text-cream-dim/60">Clinical Services</div>
                </div>
                <div>
                  <div className="text-xl font-display text-cream">7 Outfits</div>
                  <div className="text-[11px] text-cream-dim/60">Sartorial Prescription</div>
                </div>
                <div>
                  <div className="text-xl font-display text-emerald-400">100%</div>
                  <div className="text-[11px] text-cream-dim/60">Executive Transformation</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 2. BRAND POSITIONING & PHILOSOPHY */}
      {toggles.section_brand_positioning && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal variant="left">
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
                Clinical Philosophy
              </span>
              <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">
                We don&rsquo;t guess. <br />
                <span className="text-gold italic">We diagnose.</span>
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-cream-dim/80">
                Most menswear stores sell you items in isolation — hoping they somehow combine into a functional personal presence. The Fashion Clinic operates on diagnostic precision. We evaluate your anatomical proportions, executive environment, and personal brand before prescribing a single garment.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-cream-dim/80">
                The result is not merely being well-dressed. It is stepping into rooms with undeniable visual authority as the Sartorial Executive.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 border-b border-gold pb-1 text-sm font-medium text-gold transition hover:text-gold-soft"
                >
                  Our Clinical Methodology &rarr;
                </Link>
                <Link
                  href="/prescription-pad"
                  className="inline-flex items-center gap-1.5 border-b border-charcoal-700 pb-1 text-sm text-cream-dim transition hover:border-gold hover:text-gold"
                >
                  View Prescription Pad &rarr;
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="3d" delay={120} className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lift sm:aspect-[16/11]">
              <Image
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80"
                alt="Atelier Tailoring & Prescription"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-charcoal-700/80 bg-charcoal-950/85 p-4 backdrop-blur-md">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gold">The Fashion Clinic Formula</div>
                <div className="mt-1 text-xs text-cream font-medium">Diagnose Flaws &rarr; Prescribe Blueprint &rarr; Transform Authority</div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 3. 5-STEP CLINICAL PROCESS */}
      {toggles.section_clinical_process && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rounded-3xl border border-charcoal-800 bg-navy-950/70 p-6 sm:p-12 shadow-soft">
            <ScrollReveal>
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
                The 5-Step Process
              </span>
              <h2 className="mt-2 font-display text-2xl text-cream sm:text-3xl">
                From Style Ailment to Executive Presence
              </h2>
            </ScrollReveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { step: "01", name: "DIAGNOSE", desc: "Identify fit discrepancies, color undertone mismatches, and wardrobe friction points." },
                { step: "02", name: "PRESCRIBE", desc: "Formulate a personalized Sartorial Prescription with targeted pieces, cuts, and silhouettes." },
                { step: "03", name: "TREAT", desc: "Execute wardrobe audits, bespoke tailoring corrections, and personal shopping curation." },
                { step: "04", name: "TRANSFORM", desc: "Master outfit coordination, grooming protocols, and non-verbal executive presence." },
                { step: "05", name: "SARTORIAL EXECUTIVE", desc: "Emerge with an engineered personal image that commands authority effortlessly." },
              ].map((p, idx) => (
                <ScrollReveal key={p.step} delay={idx * 80} className="rounded-xl border border-charcoal-800 bg-charcoal-900/70 p-4">
                  <div className="font-display text-2xl font-semibold text-gold">{p.step}</div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-wider text-cream">{p.name}</div>
                  <p className="mt-2 text-[11px] leading-relaxed text-cream-dim/70">{p.desc}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. THE SARTORIAL EXECUTIVE SPOTLIGHT */}
      {toggles.section_sartorial_executive && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 rounded-3xl border border-gold/40 bg-gradient-to-br from-charcoal-900 via-navy-950 to-charcoal-900 p-8 sm:p-12 lg:grid-cols-2 lg:items-center shadow-lift">
            <ScrollReveal>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold">
                {sartorialContent.eyebrow}
              </div>
              <h2 className="mt-4 font-display text-3xl text-cream sm:text-5xl">
                {sartorialContent.heading}
              </h2>
              <p className="mt-3 text-base text-gold font-medium">
                {sartorialContent.subheading}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-cream-dim/80">
                {sartorialContent.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-cream-dim/85">
                <div className="flex items-center gap-2">
                  <span className="text-gold">✦</span> Proportional Tailoring
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gold">✦</span> Intentional Wardrobe
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gold">✦</span> Stylistic Consistency
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gold">✦</span> Visual Authority
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/sartorial-executive"
                  className="rounded-full bg-gold px-7 py-3.5 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
                >
                  Explore Transformation Blueprint
                </Link>
                <Link
                  href="/executive-checkup"
                  className="rounded-full border border-charcoal-700 px-6 py-3.5 text-xs font-medium text-cream transition hover:border-gold hover:text-gold"
                >
                  Book Diagnosis
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="3d" delay={120} className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lift">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80"
                alt="The Sartorial Executive"
                fill
                strength={15}
                className="object-cover"
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 5. SERVICES CATALOGUE */}
      {toggles.section_services && (
        <section className="py-6">
          <ServicesCatalogue services={services} />
        </section>
      )}

      {/* 6. CASE FILES */}
      {toggles.section_case_files && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <ScrollReveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Clinical Dossiers</p>
              <h2 className="mt-2 font-display text-3xl text-cream sm:text-4xl">
                Case Files Archive
              </h2>
              <p className="mt-2 max-w-lg text-xs text-cream-dim/70">
                Explore real style diagnoses, before/after symptom records, tailored prescriptions, and resolved executive outcomes.
              </p>
            </div>
            <Link
              href="/case-files"
              className="text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-soft"
            >
              View All Case Files &rarr;
            </Link>
          </ScrollReveal>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {caseFiles.slice(0, 3).map((cf) => (
              <CaseFileCard key={cf.id} caseFile={cf} />
            ))}
          </div>
        </section>
      )}

      {/* 7. EXECUTIVE CHECKUP QUICK LAUNCHER */}
      {toggles.section_checkup && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-navy-950 via-charcoal-900 to-navy-950 p-8 sm:p-12 text-center shadow-lift relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Online Diagnostic Assessment
              </span>
              <h2 className="mt-4 font-display text-3xl text-cream sm:text-4xl">
                Begin Your Executive Style Checkup
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-cream-dim/80">
                Answer 5 clinical styling questions regarding your profession, environment, and current fashion flaws to receive a structured Patient File (#TFC-XXXX) and immediate Rx recommendations.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <Link
                  href="/executive-checkup"
                  className="rounded-full bg-emerald-500 px-8 py-3.5 text-xs font-bold tracking-wide text-charcoal-950 shadow-rx transition hover:bg-emerald-400 hover:scale-105"
                >
                  Start Diagnosis Now (Free Online Preview)
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. SHOP & PRESCRIPTION PIECES */}
      {toggles.section_shop && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <ScrollReveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Prescription Catalogue</p>
              <h2 className="mt-2 font-display text-3xl text-cream sm:text-4xl">
                Featured Menswear &amp; Tailoring
              </h2>
              <p className="mt-2 max-w-lg text-xs text-cream-dim/70">
                Every garment is engineered to solve a specific aesthetic ailment — from soft-canvassed blazers to hand-lasted leather loafers.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-soft"
            >
              Explore Full Shop &rarr;
            </Link>
          </ScrollReveal>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-6">
            {spotlightProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                basePath={product.section === "SANTUS_SABAOTH" ? "/santus-sabaoth" : "/sartorial-executive"}
              />
            ))}
          </div>
        </section>
      )}

      {/* 9. PRESCRIPTION PAD CONCEPT */}
      {toggles.section_prescription_pad && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center rounded-3xl border border-charcoal-800 bg-charcoal-900 p-8 sm:p-12">
            <ScrollReveal>
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
                Clinical Artifact
              </span>
              <h2 className="mt-3 font-display text-3xl text-cream">
                The Fashion Clinic Prescription Pad
              </h2>
              <p className="mt-4 text-xs leading-relaxed text-cream-dim/80">
                At The Fashion Clinic, every client consultation culminates in a formal, individualized Sartorial Prescription Pad — detailing exact garment measurements, recommended fabrics, outfit schedules, and aftercare protocols.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-cream-dim/70">
                No guessing. No impulse buying. Just a clear clinical blueprint for your wardrobe.
              </p>

              <div className="mt-6">
                <Link
                  href="/prescription-pad"
                  className="rounded-full bg-gold px-7 py-3 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
                >
                  Generate Prescription Pad
                </Link>
              </div>
            </ScrollReveal>

            {/* Visual Prescription Card Mockup */}
            <ScrollReveal variant="3d" delay={100} className="rounded-2xl border border-gold/40 bg-navy-950 p-6 shadow-lift font-mono text-xs text-cream-dim/90 relative">
              <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
                <div className="font-display text-base text-cream tracking-wide">THE FASHION CLINIC</div>
                <div className="rounded bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold">Rx #7829</div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div>PATIENT: <span className="text-cream font-bold">Executive Client</span></div>
                <div>DATE: <span className="text-cream font-bold">Current Cycle</span></div>
                <div className="col-span-2 text-gold">CHIEF COMPLAINT: Ill-proportioned off-the-rack suiting</div>
              </div>
              <div className="mt-3 border-t border-charcoal-800 pt-2 text-[11px] space-y-1">
                <div className="text-emerald-400 font-bold">Rx PRESCRIPTION:</div>
                <div>1. Obsidian Tailored Blazer (Soft-Shoulder Canvassed)</div>
                <div>2. Charcoal Wool Trousers (Single-Break Taper)</div>
                <div>3. Handcrafted Leather Loafers (Hand-Lasted)</div>
              </div>
              <div className="mt-3 flex justify-between items-center border-t border-charcoal-800 pt-2 text-[10px] text-cream-dim/50">
                <span>CONFIDENTIAL PATIENT FILE</span>
                <span className="text-gold">SIGNED: Lead Consultant</span>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 10. AFTERCARE & GUIDE TEASER */}
      {toggles.section_aftercare && guideArticles.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <ScrollReveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">Aftercare Protocols</p>
              <h2 className="mt-2 font-display text-3xl text-cream sm:text-4xl">
                Garment Care &amp; Longevity
              </h2>
            </div>
            <Link
              href="/aftercare"
              className="text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-soft"
            >
              All Aftercare Guides &rarr;
            </Link>
          </ScrollReveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {guideArticles.map((article) => (
              <Link
                key={article.id}
                href={`/guide/${article.slug}`}
                className="group overflow-hidden rounded-2xl border border-charcoal-800 bg-charcoal-900 shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
              >
                {article.coverImage && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                    {article.category}
                  </span>
                  <h3 className="mt-2 font-display text-base text-cream group-hover:text-gold transition">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-xs text-cream-dim/70 line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 11. FINAL CONCIERGE CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <div className="rounded-3xl border border-charcoal-800 bg-gradient-to-t from-charcoal-950 via-charcoal-900 to-charcoal-950 p-8 sm:p-16 text-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
              The Transformation Awaits
            </p>
            <h2 className="mt-4 font-display text-3xl text-cream sm:text-5xl">
              Become the Sartorial Executive.
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm text-cream-dim/75">
              Stop guessing with random clothing purchases. Schedule your Executive Checkup or consult with our lead styling team at our Lagos Atelier.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/executive-checkup"
                className="rounded-full bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-wider text-charcoal-950 shadow-gold transition hover:scale-105 hover:bg-gold-soft"
              >
                Book Executive Checkup (₦50,000)
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-charcoal-700 bg-charcoal-900 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-cream transition hover:border-gold hover:text-gold"
              >
                View 5 Clinical Services
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
