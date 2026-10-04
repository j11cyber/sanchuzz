import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getProductsBySection } from "@/lib/products";
import { getActiveServices } from "@/lib/services";
import { getActiveCaseFiles } from "@/lib/case-files";
import { getSectionToggles, getSartorialExecutiveContent } from "@/lib/site-settings";
import { BRANDS, brandHref } from "@/lib/brands";
import { ATELIER_LOCATION } from "@/lib/contact";
import ScrollReveal from "@/components/ScrollReveal";
import ParallaxImage from "@/components/ParallaxImage";
import CaseFileCard from "@/components/CaseFileCard";
import ServicesCatalogue from "@/components/ServicesCatalogue";
import ProductCard from "@/components/ProductCard";

const S = BRANDS.sartorial;
const CHECKUP = brandHref(S, "/checkup");
const SHOP = brandHref(S, "/shop");
const SERVICES = brandHref(S, "/services");
const CASE_FILES = brandHref(S, "/case-files");
const BOOK = brandHref(S, "/book");

const PILLARS = [
  { title: "Proportional tailoring", desc: "Shoulder lines set to your frame, waist suppression without pulling, sleeve pitch that frames the hand." },
  { title: "Intentional wardrobe", desc: "Every garment has a job. No accidental purchases. No morning decision fatigue." },
  { title: "Stylistic consistency", desc: "One visual line from investor pitch to black-tie gala to a smart-casual summit." },
  { title: "Visual authority", desc: "Colour, texture and silhouette chosen to establish presence the moment you enter." },
  { title: "Heightened presence", desc: "Tailoring, grooming and posture aligned so your non-verbal signal matches your position." },
  { title: "Goal-aligned image", desc: "An image built for the promotion, the deal or the appointment you are working towards." },
];

/**
 * Sartorial Executive landing: The Fashion Clinic. Sections are toggled from
 * admin (Homepage Section Toggles). Facelift in Phase 7.
 */
export default async function SartorialExecutiveLanding() {
  const [toggles, sartorialContent, services, caseFiles, products, guideArticles] = await Promise.all([
    getSectionToggles(),
    getSartorialExecutiveContent(),
    getActiveServices(),
    getActiveCaseFiles(),
    getProductsBySection("SARTORIAL_EXECUTIVE"),
    prisma.guideArticle.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const spotlightProducts = products.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24">
      {toggles.section_hero && (
        <section className="relative flex min-h-[90vh] items-end overflow-hidden">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=85"
            alt="The Fashion Clinic"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/65 to-bg/20" />

          <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 sm:pb-24">
            <ScrollReveal>
              <p className="text-sm text-accent">The Fashion Clinic</p>
              <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.08] text-fg sm:text-6xl md:text-7xl">
                You don&rsquo;t need more clothes. You need a diagnosis.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted/85 sm:text-lg">
                Most men don&rsquo;t have a fashion problem. They have a diagnosis problem. We identify what is wrong with how you dress,
                prescribe the exact fix, and help you become the Sartorial Executive.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href={CHECKUP} className="rounded-full bg-accent px-8 py-4 text-sm font-semibold text-bg transition hover:bg-accent-soft">
                  Start your checkup
                </Link>
                <Link href={SERVICES} className="rounded-full border border-fg-muted/30 px-8 py-4 text-sm text-fg transition hover:border-accent hover:text-accent">
                  See the treatments
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {toggles.section_brand_positioning && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal variant="left">
              <h2 className="font-display text-3xl text-fg sm:text-4xl">We don&rsquo;t guess. We diagnose.</h2>
              <p className="mt-6 text-sm leading-relaxed text-fg-muted/80">
                Most menswear stores sell you items in isolation and hope they add up to a presence. The Fashion Clinic works the other
                way round. We read your proportions, your rooms and your position before prescribing a single garment.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-fg-muted/80">
                The result is not merely being well dressed. It is walking into a room already taken seriously.
              </p>
              <div className="mt-8 flex items-center gap-6">
                <Link href={SERVICES} className="border-b border-accent pb-1 text-sm text-accent transition hover:text-accent-soft">
                  The treatments
                </Link>
                <Link href={CASE_FILES} className="border-b border-line pb-1 text-sm text-fg-muted transition hover:border-accent hover:text-accent">
                  Case files
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="3d" delay={120} className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lift sm:aspect-[16/11]">
              <Image
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80"
                alt="Tailoring at the atelier"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      {toggles.section_clinical_process && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rounded-3xl border border-line bg-deep/70 p-6 sm:p-12">
            <ScrollReveal>
              <h2 className="font-display text-2xl text-fg sm:text-3xl">From style ailment to executive presence</h2>
              <p className="mt-2 text-sm text-fg-muted/70">The protocol, in order.</p>
            </ScrollReveal>

            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { step: "01", name: "Diagnose", desc: "Fit discrepancies, colour mismatches and wardrobe friction, identified." },
                { step: "02", name: "Prescribe", desc: "A written prescription: pieces, cuts and silhouettes for you." },
                { step: "03", name: "Treat", desc: "Wardrobe audit, tailoring corrections and sourcing." },
                { step: "04", name: "Transform", desc: "Outfit systems, grooming and presence coaching." },
                { step: "05", name: "Sartorial Executive", desc: "An engineered image that carries authority without effort." },
              ].map((p, idx) => (
                <ScrollReveal key={p.step} delay={idx * 80} className="rounded-xl border border-line bg-surface/70 p-4">
                  <li>
                    <div className="font-mono text-sm text-mark">{p.step}</div>
                    <div className="mt-2 font-display text-lg text-fg">{p.name}</div>
                    <p className="mt-2 text-xs leading-relaxed text-fg-muted/70">{p.desc}</p>
                  </li>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {toggles.section_sartorial_executive && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 rounded-3xl border border-accent/40 bg-surface p-8 sm:p-12 lg:grid-cols-2 lg:items-start">
            <ScrollReveal>
              <p className="text-sm text-accent">{sartorialContent.eyebrow}</p>
              <h2 className="mt-4 font-display text-3xl text-fg sm:text-5xl">{sartorialContent.heading}</h2>
              <p className="mt-3 text-base text-fg-muted">{sartorialContent.subheading}</p>
              <p className="mt-5 text-sm leading-relaxed text-fg-muted/80">{sartorialContent.description}</p>

              <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                {PILLARS.map((p) => (
                  <div key={p.title}>
                    <dt className="font-display text-lg text-fg">{p.title}</dt>
                    <dd className="mt-1 text-xs leading-relaxed text-fg-muted/70">{p.desc}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={sartorialContent.ctaLink.startsWith("/sartorial-executive") ? sartorialContent.ctaLink : CHECKUP} className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition hover:bg-accent-soft">
                  {sartorialContent.ctaText}
                </Link>
                <Link href={BOOK} className="rounded-full border border-line px-6 py-3.5 text-sm text-fg transition hover:border-accent hover:text-accent">
                  Book a consultation
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="3d" delay={120} className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lift">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80"
                alt="The Sartorial Executive"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                strength={15}
                className="object-cover"
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      {toggles.section_services && (
        <section className="py-6">
          <ServicesCatalogue services={services} />
        </section>
      )}

      {toggles.section_case_files && caseFiles.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <ScrollReveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-3xl text-fg sm:text-4xl">Case files</h2>
              <p className="mt-2 max-w-lg text-sm text-fg-muted/70">Symptoms, diagnosis, prescription and the result. Real cases, names withheld.</p>
            </div>
            <Link href={CASE_FILES} className="text-sm text-accent hover:text-accent-soft">
              All case files
            </Link>
          </ScrollReveal>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {caseFiles.slice(0, 3).map((cf) => (
              <CaseFileCard key={cf.id} caseFile={cf} />
            ))}
          </div>
        </section>
      )}

      {toggles.section_checkup && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rounded-3xl border border-mark/30 bg-deep p-8 text-center sm:p-12">
            <div className="mx-auto max-w-2xl">
              <h2 className="font-display text-3xl text-fg sm:text-4xl">Begin your Executive Checkup</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted/80">
                Five questions about your profession, your rooms and what frustrates you about your wardrobe. You leave with a Patient File
                and a recommended treatment. Free, online, three minutes.
              </p>
              <Link href={CHECKUP} className="mt-8 inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-bg transition hover:bg-accent-soft">
                Start your checkup
              </Link>
            </div>
          </div>
        </section>
      )}

      {toggles.section_shop && spotlightProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <ScrollReveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-3xl text-fg sm:text-4xl">Pieces</h2>
              <p className="mt-2 max-w-lg text-sm text-fg-muted/70">
                A curated edit from the atelier and other luxury houses. Each one is chosen to solve a specific problem.
              </p>
            </div>
            <Link href={SHOP} className="text-sm text-accent hover:text-accent-soft">
              The full edit
            </Link>
          </ScrollReveal>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 sm:gap-6">
            {spotlightProducts.map((product) => (
              <ProductCard key={product.id} product={product} basePath={S.prefix} />
            ))}
          </div>
        </section>
      )}

      {toggles.section_aftercare && guideArticles.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <ScrollReveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-3xl text-fg sm:text-4xl">Aftercare</h2>
              <p className="mt-2 text-sm text-fg-muted/70">Every treatment includes aftercare. The house Guide has the protocols.</p>
            </div>
            <Link href="/guide" className="text-sm text-accent hover:text-accent-soft">
              The Guide
            </Link>
          </ScrollReveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {guideArticles.map((article) => (
              <Link key={article.id} href={`/guide/${article.slug}`} className="group overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-accent/50">
                {article.coverImage && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={article.coverImage} alt={article.title} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  <span className="text-xs text-accent">{article.category}</span>
                  <h3 className="mt-2 font-display text-lg text-fg transition group-hover:text-accent">{article.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-fg-muted/70">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        <div className="rounded-3xl border border-line bg-surface p-8 text-center sm:p-16">
          <ScrollReveal>
            <h2 className="font-display text-3xl text-fg sm:text-5xl">Become the Sartorial Executive.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-fg-muted/75">
              Stop guessing with random purchases. Start with a checkup, or book a consultation at the atelier in {ATELIER_LOCATION}. House
              calls available.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={CHECKUP} className="rounded-full bg-accent px-8 py-4 text-sm font-semibold text-bg transition hover:bg-accent-soft">
                Start your checkup
              </Link>
              <Link href={BOOK} className="rounded-full border border-line px-8 py-4 text-sm text-fg transition hover:border-accent hover:text-accent">
                Book a consultation
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
