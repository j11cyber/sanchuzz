import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/products";
import { BRANDS, brandForSection, HOUSE_NAME, type StoreSection } from "@/lib/brands";
import { PHOTOS } from "@/lib/photos";
import HeroCampaign from "@/components/house/HeroCampaign";
import Process from "@/components/house/Process";
import Ambient from "@/components/motion/Ambient";
import ScrollImage from "@/components/motion/ScrollImage";
import Words from "@/components/motion/Words";
import Rise, { RiseGroup, RiseItem } from "@/components/motion/Rise";
import ProductCard from "@/components/ProductCard";

/**
 * The house homepage, as a campaign.
 *
 * Load: photograph settles, headline words rise one by one, seal turns,
 * motes drift. Scroll: parallax photography, staggered reveals, a pinned
 * process column with lines that grow and pulse, a fill bar that tracks the
 * scroll. Hover: sheen across buttons, hairlines that grow, images that lift.
 */
export default async function HouseHome() {
  const [featuredRows, articles, cloth, color] = await Promise.all([
    prisma.product.findMany({ where: { featured: true }, orderBy: { createdAt: "asc" }, take: 6 }),
    prisma.guideArticle.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.dailyPick.findFirst({ where: { type: "CLOTH" }, orderBy: { date: "desc" } }),
    prisma.dailyPick.findFirst({ where: { type: "COLOR" }, orderBy: { date: "desc" } }),
  ]);
  const pieces = featuredRows.map(serializeProduct);
  const [feature, ...more] = articles;

  return (
    <div className="relative">
      <HeroCampaign
        image={PHOTOS.atelierCheckSuit}
        eyebrow="Atelier open · Abuja"
        headline={HOUSE_NAME}
        line="Two labels. One hand. Clothes made in Abuja, and the judgement to wear them well."
        links={[
          { href: BRANDS.santus.prefix, label: "Santus Sabaoth" },
          { href: BRANDS.sartorial.prefix, label: "Sartorial Executive" },
        ]}
        card={cloth ? { href: "/daily", label: "Cloth of the day", title: cloth.title, image: cloth.imageUrl } : undefined}
      />

      {/* Chapter: Santus Sabaoth */}
      <section className="relative overflow-hidden">
        <Ambient motes={false} />
        <div className="relative mx-auto max-w-[110rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <Link href={BRANDS.santus.prefix} className="group relative block lg:col-span-8" aria-label="Santus Sabaoth">
              <ScrollImage src={PHOTOS.windowpaneBowTie} sizes="(min-width: 1024px) 66vw, 100vw" className="aspect-[4/5] bg-surface sm:aspect-[3/4] lg:aspect-[16/11]" parallax={9} zoom={1.1} />
              <span className="card-line" aria-hidden />
            </Link>
            <div className="lg:col-span-4 lg:self-end lg:pb-4">
              <Rise as="p" className="text-sm text-fg-muted/60">
                The maker&rsquo;s line
              </Rise>
              <Words as="h2" text="Santus Sabaoth" delay={0.1} className="mt-3 font-display text-5xl leading-[0.95] text-fg sm:text-6xl lg:text-7xl" />
              <Rise as="p" delay={0.3} className="mt-6 max-w-sm text-base leading-relaxed text-fg-muted/85">
                Tailoring, kaftans, agbada, shoes and bags. Every piece drawn, cut and finished by one hand, ready to wear or made to your
                measure.
              </Rise>
              <Rise delay={0.42} className="mt-7">
                <Link href={BRANDS.santus.prefix} className="btn-sheen group relative inline-flex items-center gap-3 overflow-hidden border border-fg/40 px-6 py-3 text-sm text-fg">
                  Enter the atelier
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                    <path d="M0 5h14M10 1l4 4-4 4" />
                  </svg>
                </Link>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter: Sartorial Executive */}
      <section className="mx-auto max-w-[110rem] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="order-2 lg:order-1 lg:col-span-4 lg:self-end lg:pb-4">
            <Rise as="p" className="text-sm text-fg-muted/60">
              The Fashion Clinic
            </Rise>
            <Words as="h2" text="Sartorial Executive" delay={0.1} className="mt-3 font-display text-5xl leading-[0.95] text-fg sm:text-6xl lg:text-7xl" />
            <Rise as="p" delay={0.3} className="mt-6 max-w-sm text-base leading-relaxed text-fg-muted/85">
              Diagnose. Prescribe. Transform. A styling practice for men who need to command a room, and a curated edit of luxury pieces
              to do it with.
            </Rise>
            <Rise delay={0.42} className="mt-7 flex flex-wrap gap-4">
              <Link href={BRANDS.sartorial.prefix} className="btn-sheen group relative inline-flex items-center gap-3 overflow-hidden border border-fg/40 px-6 py-3 text-sm text-fg">
                Enter the clinic
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  <path d="M0 5h14M10 1l4 4-4 4" />
                </svg>
              </Link>
              <Link href={`${BRANDS.sartorial.prefix}/checkup`} className="link-line self-center text-sm text-fg-muted">
                Start the checkup
              </Link>
            </Rise>
          </div>
          <Link href={BRANDS.sartorial.prefix} className="group relative order-1 block lg:order-2 lg:col-span-7 lg:col-start-6" aria-label="Sartorial Executive">
            <ScrollImage src={PHOTOS.darkSuitRedTie} sizes="(min-width: 1024px) 58vw, 100vw" className="aspect-[4/5] bg-surface sm:aspect-[3/4] lg:aspect-[16/11]" parallax={9} zoom={1.1} />
            <span className="card-line" aria-hidden />
          </Link>
        </div>
      </section>

      {/* How the house works: the pinned, lit diagram */}
      <section className="relative overflow-hidden border-t border-line">
        <Ambient motes={false} />
        <Process
          title="How the house works"
          intro="Two labels, one method. The clinic reads the man; the atelier cuts the cloth; the Guide keeps it all in good order for years."
          steps={[
            { number: "01", title: "Diagnose", body: "Sartorial Executive reads your proportions, your rooms and your position before a single garment is chosen.", href: `${BRANDS.sartorial.prefix}/checkup`, cta: "Start your checkup" },
            { number: "02", title: "Make", body: "Santus Sabaoth cuts and finishes every piece in the line by hand. Commissions are made the same way.", href: `${BRANDS.santus.prefix}/commission`, cta: "Commission a piece" },
            { number: "03", title: "Keep", body: "Aftercare comes with every treatment, and the Guide tells you how to look after what you own.", href: "/guide", cta: "Open the Guide" },
          ]}
        />
      </section>

      {/* Selected pieces */}
      {pieces.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[110rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="flex items-end justify-between gap-6">
              <Words as="h2" text="Selected pieces" className="font-display text-4xl leading-none text-fg sm:text-6xl" />
              <Rise delay={0.2} className="flex gap-6 text-sm">
                <Link href={`${BRANDS.santus.prefix}/shop`} className="link-line text-fg-muted hover:text-fg">
                  Santus Sabaoth
                </Link>
                <Link href={`${BRANDS.sartorial.prefix}/shop`} className="link-line text-fg-muted hover:text-fg">
                  Sartorial Executive
                </Link>
              </Rise>
            </div>

            <RiseGroup stagger={0.09} amount={0.1} className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
              {pieces.map((p, i) => {
                const brand = brandForSection(p.section as StoreSection);
                const large = i === 0;
                return (
                  <RiseItem key={p.id} className={large ? "col-span-2 lg:row-span-2" : ""}>
                    <ProductCard product={p} basePath={brand.prefix} priority={i < 2} sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"} />
                  </RiseItem>
                );
              })}
            </RiseGroup>
          </div>
        </section>
      )}

      {/* Today */}
      {(cloth || color) && (
        <section className="border-t border-line">
          <div className="grid lg:grid-cols-2">
            {color && (
              <Link href="/daily" className="group relative flex min-h-[50svh] flex-col justify-between overflow-hidden p-8 sm:p-12 lg:p-16" style={{ backgroundColor: color.colorHex ?? "#7A4B2A" }}>
                <span className="text-sm text-black/70 mix-blend-multiply">Colour of the day</span>
                <div>
                  <Words as="h2" text={color.title} className="font-display text-5xl leading-none text-black/85 mix-blend-multiply sm:text-7xl" />
                  <Rise as="p" delay={0.3} className="mt-4 max-w-md text-sm leading-relaxed text-black/70 mix-blend-multiply">
                    {color.description}
                  </Rise>
                </div>
              </Link>
            )}
            {cloth && (
              <Link href="/daily" className="group relative flex min-h-[50svh] items-end overflow-hidden">
                {cloth.imageUrl && <ScrollImage src={cloth.imageUrl} sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0" parallax={8} zoom={1.08} />}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/20 to-transparent" />
                <div className="relative p-8 sm:p-12 lg:p-16">
                  <span className="text-sm text-fg-muted/80">Cloth of the day</span>
                  <Words as="h2" text={cloth.title} className="mt-2 font-display text-4xl leading-none text-fg sm:text-6xl" />
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* The Guide */}
      {feature && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[110rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="flex items-baseline justify-between gap-6">
              <Words as="h2" text="The Guide" className="font-display text-4xl leading-none text-fg sm:text-6xl" />
              <Link href="/guide" className="link-line text-sm text-fg-muted hover:text-fg">
                All articles
              </Link>
            </div>

            <Link href={`/guide/${feature.slug}`} className="group mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
              {feature.coverImage && (
                <div className="relative lg:col-span-7">
                  <ScrollImage src={feature.coverImage} sizes="(min-width: 1024px) 58vw, 100vw" className="aspect-[16/10] bg-surface" parallax={6} zoom={1.06} />
                  <span className="card-line" aria-hidden />
                </div>
              )}
              <div className="lg:col-span-5 lg:self-center">
                <Rise as="p" className="text-sm text-fg-muted/60">
                  {feature.category}
                </Rise>
                <Rise as="h3" delay={0.1} className="mt-3 font-display text-3xl leading-tight text-fg sm:text-4xl">
                  {feature.title}
                </Rise>
                <Rise as="p" delay={0.2} className="mt-4 text-base leading-relaxed text-fg-muted/80">
                  {feature.excerpt}
                </Rise>
                <Rise delay={0.3} className="mt-6">
                  <span className="group/l inline-flex items-center gap-3 text-sm text-fg">
                    <span className="h-px w-4 bg-fg-muted/40 transition-[width,background-color] duration-300 group-hover:w-8 group-hover:bg-accent" />
                    Read
                  </span>
                </Rise>
              </div>
            </Link>

            {more.length > 0 && (
              <RiseGroup as="ul" stagger={0.08} className="mt-16 divide-y divide-line border-t border-line lg:ml-auto lg:max-w-3xl">
                {more.map((a) => (
                  <RiseItem key={a.id} as="li">
                    <Link href={`/guide/${a.slug}`} className="group flex items-baseline justify-between gap-6 py-5">
                      <span className="font-display text-xl text-fg transition group-hover:text-accent sm:text-2xl">{a.title}</span>
                      <span className="shrink-0 text-sm text-fg-muted/60">{a.category}</span>
                    </Link>
                  </RiseItem>
                ))}
              </RiseGroup>
            )}
          </div>
        </section>
      )}

      {/* Closing frame */}
      <section className="relative overflow-hidden border-t border-line">
        <ScrollImage src={PHOTOS.blackSuitBrick} sizes="100vw" className="h-[70svh] min-h-[28rem]" parallax={12} zoom={1.1} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/30 to-deep/20" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12">
          <Words as="p" text="Dress like the decision has already been made." className="max-w-3xl font-display text-3xl leading-[1.05] text-fg sm:text-5xl lg:text-6xl" />
          <Rise delay={0.4} className="mt-8 flex flex-wrap gap-4">
            <Link href={`${BRANDS.sartorial.prefix}/checkup`} className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-6 py-3 text-sm text-bg">
              Start your checkup
            </Link>
            <Link href={`${BRANDS.santus.prefix}/shop`} className="btn-sheen relative inline-flex items-center overflow-hidden border border-fg/40 px-6 py-3 text-sm text-fg">
              Shop the collection
            </Link>
          </Rise>
        </div>
      </section>
    </div>
  );
}
