import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/products";
import { BRANDS, brandForSection, HOUSE_NAME, type StoreSection } from "@/lib/brands";
import { PHOTOS } from "@/lib/photos";
import Reveal from "@/components/motion/Reveal";
import ProductCard from "@/components/ProductCard";

/**
 * The house homepage, as a campaign.
 *
 * Full-screen editorial photography, large display type that glides in, two
 * brand chapters with scroll-driven parallax, then the pieces themselves.
 * Motion is CSS and one small IntersectionObserver; images are next/image
 * with explicit sizes so phones download small files.
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
    <div>
      {/* Campaign hero */}
      <section className="relative h-[100svh] min-h-[34rem] overflow-hidden bg-deep">
        <div className="absolute inset-0 overflow-hidden">
          <Image src={PHOTOS.atelierCheckSuit} alt="" fill priority sizes="100vw" className="sd-zoom object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/25 to-deep/10" />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-10 sm:px-8 sm:pb-14 lg:px-12">
          <Reveal as="h1" variant="lines" className="max-w-[12ch] font-display text-[clamp(3rem,10vw,9.5rem)] leading-[0.92] tracking-[-0.02em] text-fg">
            {HOUSE_NAME}
          </Reveal>
          <div className="mt-6 flex flex-col gap-6 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
            <Reveal as="p" variant="lines" delay={150} className="max-w-md text-base leading-relaxed text-fg-muted/85 sm:text-lg">
              Two labels. One hand. Clothes made in Abuja, and the judgement to wear them well.
            </Reveal>
            <Reveal variant="fade" delay={320} className="flex gap-8 text-sm text-fg">
              <Link href={BRANDS.santus.prefix} className="link-line">
                Santus Sabaoth
              </Link>
              <Link href={BRANDS.sartorial.prefix} className="link-line">
                Sartorial Executive
              </Link>
            </Reveal>
          </div>
        </div>

        <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 items-center gap-3 sm:right-8 lg:flex" aria-hidden>
          <span className="[writing-mode:vertical-rl] text-[11px] tracking-[0.2em] text-fg-muted/50">Scroll</span>
          <span className="h-16 w-px bg-fg-muted/30" />
        </div>
      </section>

      {/* Chapter: Santus Sabaoth */}
      <section className="mx-auto max-w-[110rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Link href={BRANDS.santus.prefix} className="relative block aspect-[4/5] overflow-hidden bg-surface sm:aspect-[3/4] lg:col-span-8 lg:aspect-[16/11]" aria-label="Santus Sabaoth">
            <Image src={PHOTOS.windowpaneBowTie} alt="" fill sizes="(min-width: 1024px) 66vw, 100vw" className="sd-parallax object-cover" />
          </Link>
          <div className="lg:col-span-4 lg:self-end lg:pb-4">
            <Reveal as="p" variant="lines" className="text-sm text-fg-muted/60">
              The maker&rsquo;s line
            </Reveal>
            <Reveal as="h2" variant="lines" delay={80} className="mt-3 font-display text-5xl leading-[0.95] text-fg sm:text-6xl lg:text-7xl">
              Santus Sabaoth
            </Reveal>
            <Reveal as="p" variant="fade" delay={200} className="mt-6 max-w-sm text-base leading-relaxed text-fg-muted/85">
              Tailoring, kaftans, agbada, shoes and bags. Every piece drawn, cut and finished by one hand, ready to wear or made to your
              measure.
            </Reveal>
            <Reveal variant="fade" delay={300} className="mt-7">
              <Link href={BRANDS.santus.prefix} className="link-line text-sm text-fg">
                Enter the atelier
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Chapter: Sartorial Executive */}
      <section className="mx-auto max-w-[110rem] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="order-2 lg:order-1 lg:col-span-4 lg:self-end lg:pb-4">
            <Reveal as="p" variant="lines" className="text-sm text-fg-muted/60">
              The Fashion Clinic
            </Reveal>
            <Reveal as="h2" variant="lines" delay={80} className="mt-3 font-display text-5xl leading-[0.95] text-fg sm:text-6xl lg:text-7xl">
              Sartorial Executive
            </Reveal>
            <Reveal as="p" variant="fade" delay={200} className="mt-6 max-w-sm text-base leading-relaxed text-fg-muted/85">
              Diagnose. Prescribe. Transform. A styling practice for men who need to command a room, and a curated edit of luxury pieces
              to do it with.
            </Reveal>
            <Reveal variant="fade" delay={300} className="mt-7 flex gap-8">
              <Link href={BRANDS.sartorial.prefix} className="link-line text-sm text-fg">
                Enter the clinic
              </Link>
              <Link href={`${BRANDS.sartorial.prefix}/checkup`} className="link-line text-sm text-fg-muted">
                Start the checkup
              </Link>
            </Reveal>
          </div>
          <Link href={BRANDS.sartorial.prefix} className="relative order-1 block aspect-[4/5] overflow-hidden bg-surface sm:aspect-[3/4] lg:order-2 lg:col-span-7 lg:col-start-6 lg:aspect-[16/11]" aria-label="Sartorial Executive">
            <Image src={PHOTOS.darkSuitRedTie} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="sd-parallax object-cover" />
          </Link>
        </div>
      </section>

      {/* Selected pieces */}
      {pieces.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[110rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
            <div className="flex items-end justify-between gap-6">
              <Reveal as="h2" variant="lines" className="font-display text-4xl leading-none text-fg sm:text-6xl">
                Selected pieces
              </Reveal>
              <Reveal variant="fade" delay={120} className="flex gap-6 text-sm">
                <Link href={`${BRANDS.santus.prefix}/shop`} className="link-line text-fg-muted hover:text-fg">
                  Santus Sabaoth
                </Link>
                <Link href={`${BRANDS.sartorial.prefix}/shop`} className="link-line text-fg-muted hover:text-fg">
                  Sartorial Executive
                </Link>
              </Reveal>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
              {pieces.map((p, i) => {
                const brand = brandForSection(p.section as StoreSection);
                const large = i === 0;
                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    basePath={brand.prefix}
                    priority={i < 2}
                    className={large ? "col-span-2 lg:row-span-2" : ""}
                    sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Today */}
      {(cloth || color) && (
        <section className="border-t border-line">
          <div className="grid lg:grid-cols-2">
            {color && (
              <Link href="/daily" className="flex min-h-[50svh] flex-col justify-between p-8 sm:p-12 lg:p-16" style={{ backgroundColor: color.colorHex ?? "#7A4B2A" }}>
                <span className="text-sm text-black/70 mix-blend-multiply">Colour of the day</span>
                <div>
                  <h2 className="font-display text-5xl leading-none text-black/85 mix-blend-multiply sm:text-7xl">{color.title}</h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-black/70 mix-blend-multiply">{color.description}</p>
                </div>
              </Link>
            )}
            {cloth && (
              <Link href="/daily" className="group relative flex min-h-[50svh] items-end overflow-hidden">
                {cloth.imageUrl && (
                  <div className="absolute inset-0 overflow-hidden">
                    <Image src={cloth.imageUrl} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="sd-zoom object-cover" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/20 to-transparent" />
                <div className="relative p-8 sm:p-12 lg:p-16">
                  <span className="text-sm text-fg-muted/80">Cloth of the day</span>
                  <h2 className="mt-2 font-display text-4xl leading-none text-fg sm:text-6xl">{cloth.title}</h2>
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
              <Reveal as="h2" variant="lines" className="font-display text-4xl leading-none text-fg sm:text-6xl">
                The Guide
              </Reveal>
              <Link href="/guide" className="link-line text-sm text-fg-muted hover:text-fg">
                All articles
              </Link>
            </div>

            <Link href={`/guide/${feature.slug}`} className="group mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
              {feature.coverImage && (
                <div className="relative aspect-[16/10] overflow-hidden bg-surface lg:col-span-7">
                  <Image src={feature.coverImage} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover transition duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]" />
                </div>
              )}
              <div className="lg:col-span-5 lg:self-center">
                <span className="text-sm text-fg-muted/60">{feature.category}</span>
                <h3 className="mt-3 font-display text-3xl leading-tight text-fg sm:text-4xl">{feature.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-fg-muted/80">{feature.excerpt}</p>
                <span className="link-line mt-6 inline-block text-sm text-fg">Read</span>
              </div>
            </Link>

            {more.length > 0 && (
              <ul className="mt-16 divide-y divide-line border-t border-line lg:ml-auto lg:max-w-3xl">
                {more.map((a) => (
                  <li key={a.id}>
                    <Link href={`/guide/${a.slug}`} className="group flex items-baseline justify-between gap-6 py-5">
                      <span className="font-display text-xl text-fg transition group-hover:text-accent sm:text-2xl">{a.title}</span>
                      <span className="shrink-0 text-sm text-fg-muted/60">{a.category}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
