import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getProductsBySection } from "@/lib/products";
import { getActiveServices } from "@/lib/services";
import { getPublishedCaseFiles } from "@/lib/case-files";
import { getSectionToggles, getSartorialExecutiveContent, getContactSettings } from "@/lib/site-settings";
import { BRANDS, brandHref } from "@/lib/brands";
import { SARTORIAL } from "@/lib/photos";
import { formatNaira } from "@/lib/money";
import HeroCampaign from "@/components/house/HeroCampaign";
import Process from "@/components/house/Process";
import ScrollImage from "@/components/motion/ScrollImage";
import Words from "@/components/motion/Words";
import Rise, { RiseGroup, RiseItem } from "@/components/motion/Rise";
import Ambient from "@/components/motion/Ambient";
import ServicesCatalogue from "@/components/ServicesCatalogue";
import CaseFileDossier from "@/components/clinic/CaseFileDossier";
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

const PROTOCOL = [
  { number: "01", title: "Diagnose", body: "Fit discrepancies, colour mismatches and wardrobe friction, named precisely. Nothing is bought until we know what is wrong.", href: CHECKUP, cta: "Start with the checkup" },
  { number: "02", title: "Prescribe", body: "A written prescription: the pieces, cuts and silhouettes that fit your frame, your rooms and your position." },
  { number: "03", title: "Treat", body: "Wardrobe audit, tailoring corrections and sourcing from the atelier and the houses we trust.", href: SERVICES, cta: "The treatments" },
  { number: "04", title: "Transform", body: "Outfit systems, grooming protocols and presence coaching, so the image holds without daily effort." },
  { number: "05", title: "Sartorial Executive", body: "An engineered image that carries authority before you say a word. Reviewed each season.", href: CASE_FILES, cta: "See the results" },
];

/**
 * Sartorial Executive landing: a private consultation room crossed with a
 * bespoke tailor. Sections are toggled from admin (Homepage Section Toggles).
 */
export default async function SartorialExecutiveLanding() {
  const [toggles, contact, sartorialContent, services, caseFiles, products, guideArticles] = await Promise.all([
    getSectionToggles(),
    getContactSettings(),
    getSartorialExecutiveContent(),
    getActiveServices(),
    getPublishedCaseFiles(),
    getProductsBySection("SARTORIAL_EXECUTIVE"),
    prisma.guideArticle.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);

  const spotlightProducts = [...products.filter((p) => p.featured), ...products.filter((p) => !p.featured)].slice(0, 4);
  const leadCase = caseFiles[0];
  const city = contact.location.split(",")[0];
  const fromPrice = services.length ? Math.min(...services.map((s) => s.price)) : null;

  return (
    <div>
      {toggles.section_hero && (
        <HeroCampaign
          image={SARTORIAL.hero}
          eyebrow={`The Fashion Clinic · ${city}`}
          headline="You don't need more clothes. You need a diagnosis."
          line="Most men don't have a fashion problem. They have a diagnosis problem. We find what is wrong with how you dress, prescribe the exact fix, and see it through."
          links={[
            { href: CHECKUP, label: "Start your checkup" },
            { href: SERVICES, label: "See the treatments" },
          ]}
          card={leadCase?.afterImage ? { href: `${CASE_FILES}#case-${leadCase.caseNumber}`, label: `Case file Nº ${leadCase.caseNumber}`, title: leadCase.title, image: leadCase.afterImage } : undefined}
        />
      )}

      {toggles.section_brand_positioning && (
        <section className="relative overflow-hidden border-t border-line">
          <Ambient motes={false} />
          <div className="relative mx-auto grid max-w-[110rem] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-8 lg:px-12">
            <div className="lg:col-span-6 lg:self-center">
              <Rise as="p" className="text-sm text-fg-muted/60">
                The method
              </Rise>
              <Words as="h2" text="We don't guess. We diagnose." delay={0.1} className="mt-3 font-display text-4xl leading-[1.02] text-fg sm:text-6xl lg:text-7xl" />
              <Rise as="p" delay={0.3} className="mt-6 max-w-lg text-base leading-relaxed text-fg-muted/85">
                Most menswear stores sell you items in isolation and hope they add up to a presence. The clinic works the other way round. We
                read your proportions, your rooms and your position before prescribing a single garment.
              </Rise>
              <Rise as="p" delay={0.4} className="mt-4 max-w-lg text-base leading-relaxed text-fg-muted/85">
                The result is not merely being well dressed. It is walking into a room already taken seriously.
              </Rise>
              <Rise delay={0.5} className="mt-8 flex flex-wrap items-center gap-8">
                <Link href={SERVICES} className="group inline-flex items-center gap-3 text-sm text-fg">
                  <span className="h-px w-4 bg-fg-muted/40 transition-[width,background-color] duration-300 group-hover:w-8 group-hover:bg-accent" />
                  The treatments
                </Link>
                <Link href={CASE_FILES} className="group inline-flex items-center gap-3 text-sm text-fg">
                  <span className="h-px w-4 bg-fg-muted/40 transition-[width,background-color] duration-300 group-hover:w-8 group-hover:bg-accent" />
                  Case files
                </Link>
              </Rise>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <ScrollImage src={SARTORIAL.philosophy} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/5] bg-surface" parallax={8} zoom={1.08} />
            </div>
          </div>
        </section>
      )}

      {toggles.section_clinical_process && (
        <Process
          title="From style ailment to executive presence."
          intro="The protocol, in order. Every patient goes through the same five steps, whatever the complaint."
          steps={PROTOCOL.map((step, i) => ({ ...step, image: SARTORIAL.protocol[i] }))}
        />
      )}

      {toggles.section_sartorial_executive && (
        <section className="relative overflow-hidden border-t border-line">
          <ScrollImage src={SARTORIAL.spotlight} sizes="100vw" className="h-[90svh] min-h-[34rem]" parallax={12} zoom={1.1} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/50 to-deep/10" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-[110rem] px-5 sm:px-8 lg:px-12">
              <RiseGroup stagger={0.1} className="max-w-2xl">
                <RiseItem as="p" className="text-sm text-fg-muted/70">
                  {sartorialContent.eyebrow}
                </RiseItem>
                <RiseItem as="h2" className="mt-3 font-display text-5xl leading-[0.98] text-fg sm:text-7xl lg:text-8xl">
                  {sartorialContent.heading}
                </RiseItem>
                <RiseItem as="p" className="mt-5 font-display text-xl italic text-fg/90 sm:text-2xl">
                  {sartorialContent.subheading}
                </RiseItem>
                <RiseItem as="p" className="mt-5 max-w-lg text-base leading-relaxed text-fg-muted/85">
                  {sartorialContent.description}
                </RiseItem>
                <RiseItem className="mt-8 flex flex-wrap gap-4">
                  <Link href={sartorialContent.ctaLink.startsWith("/sartorial-executive") ? sartorialContent.ctaLink : CHECKUP} className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-6 py-3 text-sm font-medium text-bg">
                    {sartorialContent.ctaText}
                  </Link>
                  <Link href={BOOK} className="btn-sheen relative inline-flex items-center overflow-hidden border border-fg/40 px-6 py-3 text-sm text-fg">
                    Book a consultation
                  </Link>
                </RiseItem>
              </RiseGroup>
            </div>
          </div>

          <div className="relative border-t border-line bg-bg">
            <RiseGroup as="dl" stagger={0.06} className="mx-auto grid max-w-[110rem] gap-x-8 gap-y-8 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-12">
              {PILLARS.map((p, i) => (
                <RiseItem key={p.title} as="div" className="border-t border-line pt-4">
                  <dt className="flex items-baseline gap-3 font-display text-xl text-fg">
                    <span className="font-mono text-xs text-fg-muted/60">{String(i + 1).padStart(2, "0")}</span>
                    {p.title}
                  </dt>
                  <dd className="mt-2 pl-8 text-sm leading-relaxed text-fg-muted/75">{p.desc}</dd>
                </RiseItem>
              ))}
            </RiseGroup>
          </div>
        </section>
      )}

      {toggles.section_services && (
        <section className="border-t border-line py-20 sm:py-28">
          <div className="mx-auto mb-12 max-w-[110rem] px-5 sm:px-8 lg:px-12">
            <Rise as="p" className="text-sm text-fg-muted/60">
              The menu
            </Rise>
            <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <Words as="h2" text="Treatments, with the fee written down." delay={0.1} className="max-w-3xl font-display text-4xl leading-[1.02] text-fg sm:text-6xl" />
              <Rise as="p" delay={0.3} className="max-w-sm text-sm leading-relaxed text-fg-muted/75">
                {fromPrice ? `From ${formatNaira(fromPrice)}. ` : ""}Half to book, the balance before delivery, aftercare included. Pay the deposit online or talk to us
                first.
              </Rise>
            </div>
          </div>
          <ServicesCatalogue services={services} contact={contact} showHeading={false} />
        </section>
      )}

      {toggles.section_case_files && leadCase && (
        <section className="relative overflow-hidden border-t border-line py-20 sm:py-28">
          <Ambient motes={false} />
          <div className="relative mx-auto max-w-[110rem] px-5 sm:px-8 lg:px-12">
            <Rise className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm text-fg-muted/60">Case files</p>
                <h2 className="mt-3 font-display text-4xl leading-[1.02] text-fg sm:text-6xl">Symptoms, diagnosis, result.</h2>
              </div>
              <Link href={CASE_FILES} className="link-line text-sm text-fg-muted hover:text-fg">
                All case files
              </Link>
            </Rise>
            <div className="mt-14">
              <CaseFileDossier caseFile={leadCase} compact />
            </div>
            {caseFiles.length > 1 && (
              <RiseGroup as="ul" stagger={0.06} className="mt-16 divide-y divide-line border-y border-line">
                {caseFiles.slice(1, 4).map((cf) => (
                  <RiseItem key={cf.id} as="li">
                    <Link href={`${CASE_FILES}#case-${cf.caseNumber}`} className="group flex items-center justify-between gap-6 py-5">
                      <span className="flex items-baseline gap-5">
                        <span className="case-number text-xs">Nº {cf.caseNumber}</span>
                        <span className="font-display text-xl text-fg transition group-hover:text-accent sm:text-2xl">{cf.title}</span>
                      </span>
                      <span className="hidden max-w-xs text-right text-sm text-fg-muted/60 sm:block">{cf.diagnosis}</span>
                    </Link>
                  </RiseItem>
                ))}
              </RiseGroup>
            )}
          </div>
        </section>
      )}

      {toggles.section_checkup && (
        <section className="relative overflow-hidden border-t border-line">
          <div className="mx-auto grid max-w-[110rem] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-8 lg:px-12">
            <div className="lg:col-span-6 lg:self-center">
              <Rise as="p" className="text-sm text-fg-muted/60">
                The signature
              </Rise>
              <Words as="h2" text="Begin your Executive Checkup." delay={0.1} className="mt-3 font-display text-4xl leading-[1.02] text-fg sm:text-6xl" />
              <Rise as="p" delay={0.3} className="mt-6 max-w-lg text-base leading-relaxed text-fg-muted/85">
                Six questions about your profession, your rooms and what frustrates you about your wardrobe. You leave with a Patient File
                and a recommended treatment. Online, three minutes, no charge.
              </Rise>
              <Rise delay={0.42} className="mt-8">
                <Link href={CHECKUP} className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-6 py-3 text-sm font-medium text-bg">
                  Start your checkup
                </Link>
              </Rise>
            </div>
            <div className="relative lg:col-span-5 lg:col-start-8">
              <ScrollImage src={SARTORIAL.checkup} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/5] bg-surface" parallax={8} zoom={1.08} />
              <Rise delay={0.35} className="paper absolute -bottom-6 left-4 w-[70%] max-w-xs rotate-[-2deg] p-5 sm:left-8">
                <div className="paper-rule flex items-center justify-between border-b pb-2">
                  <span className="font-display text-sm">The Fashion Clinic</span>
                  <span className="font-mono text-[10px]">TFC-····</span>
                </div>
                <dl className="mt-3 space-y-2 text-[11px]">
                  <div className="flex gap-2">
                    <dt className="paper-muted w-16 shrink-0 uppercase tracking-[0.12em]">Patient</dt>
                    <dd className="paper-rule flex-1 border-b border-dotted" />
                  </div>
                  <div className="flex gap-2">
                    <dt className="paper-muted w-16 shrink-0 uppercase tracking-[0.12em]">Rooms</dt>
                    <dd className="paper-rule flex-1 border-b border-dotted" />
                  </div>
                  <div className="flex gap-2">
                    <dt className="paper-muted w-16 shrink-0 uppercase tracking-[0.12em]">Dx</dt>
                    <dd className="paper-rule flex-1 border-b border-dotted" />
                  </div>
                </dl>
                <span className="stamp mt-4 text-[10px]">Prescribed</span>
              </Rise>
            </div>
          </div>
        </section>
      )}

      {toggles.section_shop && spotlightProducts.length > 0 && (
        <section className="border-t border-line py-20 sm:py-28">
          <div className="mx-auto max-w-[110rem] px-5 sm:px-8 lg:px-12">
            <Rise className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm text-fg-muted/60">Pieces</p>
                <h2 className="mt-3 font-display text-4xl leading-[1.02] text-fg sm:text-6xl">Chosen to solve a named problem.</h2>
              </div>
              <Link href={SHOP} className="link-line text-sm text-fg-muted hover:text-fg">
                The full edit
              </Link>
            </Rise>
            <RiseGroup stagger={0.08} className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {spotlightProducts.map((product) => (
                <RiseItem key={product.id}>
                  <ProductCard product={product} basePath={S.prefix} />
                </RiseItem>
              ))}
            </RiseGroup>
          </div>
        </section>
      )}

      {toggles.section_aftercare && guideArticles.length > 0 && (
        <section className="border-t border-line py-20 sm:py-28">
          <div className="mx-auto max-w-[110rem] px-5 sm:px-8 lg:px-12">
            <Rise className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm text-fg-muted/60">Aftercare</p>
                <h2 className="mt-3 font-display text-4xl leading-[1.02] text-fg sm:text-6xl">Every treatment comes with aftercare.</h2>
              </div>
              <Link href="/guide" className="link-line text-sm text-fg-muted hover:text-fg">
                The Guide
              </Link>
            </Rise>
            <RiseGroup stagger={0.08} className="mt-12 grid gap-6 sm:grid-cols-3">
              {guideArticles.map((article) => (
                <RiseItem key={article.id} as="article">
                  <Link href={`/guide/${article.slug}`} className="group block" data-cursor="Read">
                    {article.coverImage && (
                      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                        <Image src={article.coverImage} alt={article.title} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:scale-[1.04]" />
                      </div>
                    )}
                    <p className="mt-4 text-xs text-fg-muted/60">{article.category}</p>
                    <h3 className="mt-1 font-display text-2xl text-fg transition group-hover:text-accent">{article.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-fg-muted/70">{article.excerpt}</p>
                  </Link>
                </RiseItem>
              ))}
            </RiseGroup>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden border-t border-line">
        <ScrollImage src={SARTORIAL.closing} sizes="100vw" className="h-[80svh] min-h-[30rem]" parallax={12} zoom={1.1} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/35 to-deep/15" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12">
          <RiseGroup stagger={0.1} className="max-w-3xl">
            <RiseItem as="p" className="text-sm text-fg-muted/70">
              The Fashion Clinic · {contact.location}
            </RiseItem>
            <RiseItem as="h2" className="mt-3 font-display text-4xl leading-[1.02] text-fg sm:text-6xl lg:text-7xl">
              Become the Sartorial Executive.
            </RiseItem>
            <RiseItem as="p" className="mt-5 max-w-lg text-base leading-relaxed text-fg-muted/85">
              Stop guessing with random purchases. Start with a checkup, or book a consultation at the clinic. House calls available.
            </RiseItem>
            <RiseItem className="mt-8 flex flex-wrap gap-4">
              <Link href={CHECKUP} className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-6 py-3 text-sm font-medium text-bg">
                Start your checkup
              </Link>
              <Link href={BOOK} className="btn-sheen relative inline-flex items-center overflow-hidden border border-fg/40 px-6 py-3 text-sm text-fg">
                Book a consultation
              </Link>
            </RiseItem>
          </RiseGroup>
        </div>
      </section>
    </div>
  );
}
