import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BRANDS, HOUSE_NAME } from "@/lib/brands";
import { PHOTOS } from "@/lib/photos";
import Threshold from "@/components/house/Threshold";

/**
 * The house homepage.
 *
 * One cinematic moment, the threshold, then calm: a short house story, the
 * daily pick, one Guide feature. Layouts vary on purpose; nothing fades in
 * on scroll.
 */
export default async function HouseHome() {
  const [articles, cloth, color] = await Promise.all([
    prisma.guideArticle.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.dailyPick.findFirst({ where: { type: "CLOTH" }, orderBy: { date: "desc" }, include: { product: true } }),
    prisma.dailyPick.findFirst({ where: { type: "COLOR" }, orderBy: { date: "desc" } }),
  ]);

  const [feature, ...more] = articles;

  return (
    <div>
      <Threshold
        doors={[
          {
            href: BRANDS.santus.prefix,
            name: "Santus Sabaoth",
            line: "The maker's own line. Tailoring, kaftans, shoes and bags, cut by one hand.",
            enter: "Enter the atelier",
            image: PHOTOS.atelierCheckSuit,
            imageActive: PHOTOS.windowpaneBowTie,
            alt: "Santus Sabaoth, the maker's own line",
          },
          {
            href: BRANDS.sartorial.prefix,
            name: "Sartorial Executive",
            line: "The Fashion Clinic. Diagnose. Prescribe. Transform.",
            enter: "Enter the clinic",
            image: PHOTOS.darkSuitRedTie,
            imageActive: PHOTOS.blackSuitBrick,
            alt: "Sartorial Executive, The Fashion Clinic",
          },
        ]}
      />

      {/* House story: wide statement, offset paragraph, a single narrow portrait. */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <h2 className="font-display text-4xl leading-[1.05] text-fg sm:text-5xl lg:col-span-7 lg:text-6xl">
            One house. Two ways of dressing a man well.
          </h2>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-3">
            <p className="text-base leading-relaxed text-fg-muted/85">
              {HOUSE_NAME} is the name on the bag. Behind it sit two labels that start from opposite ends: Santus Sabaoth makes the
              clothes, one hand from first sketch to last stitch. Sartorial Executive decides what you should be wearing in the first
              place, and why.
            </p>
            <Link href="/about" className="mt-6 inline-block border-b border-accent pb-0.5 text-sm text-fg transition hover:text-accent">
              About the house
            </Link>
          </div>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          <div className="relative aspect-[4/5] overflow-hidden lg:col-span-4 lg:col-start-2">
            <Image src={PHOTOS.beretPortrait} alt="" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
          </div>
          <div className="lg:col-span-5 lg:col-start-7 lg:self-end">
            <p className="font-display text-2xl leading-snug text-fg sm:text-3xl">
              &ldquo;Most men don&rsquo;t need more clothes. They need better decisions, and someone who can cut.&rdquo;
            </p>
            <p className="mt-4 text-sm text-fg-muted/60">Santus Sabaoth, founder</p>
          </div>
        </div>
      </section>

      {/* Today: colour as a solid field, cloth as a photograph. */}
      {(cloth || color) && (
        <section className="border-t border-line">
          <div className="grid lg:grid-cols-2">
            {color && (
              <Link href="/daily" className="group relative flex min-h-[60svh] flex-col justify-between p-8 sm:p-12" style={{ backgroundColor: color.colorHex ?? "#7A4B2A" }}>
                <span className="text-sm text-black/70 mix-blend-multiply">Colour of the day</span>
                <div>
                  <h2 className="font-display text-5xl leading-none text-black/85 mix-blend-multiply sm:text-7xl">{color.title}</h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-black/70 mix-blend-multiply">{color.description}</p>
                  <span className="mt-6 inline-block font-mono text-xs text-black/60 mix-blend-multiply">{color.colorHex}</span>
                </div>
              </Link>
            )}
            {cloth && (
              <Link href="/daily" className="group relative flex min-h-[60svh] items-end overflow-hidden">
                {cloth.imageUrl && (
                  <Image src={cloth.imageUrl} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/20 to-transparent" />
                <div className="relative p-8 sm:p-12">
                  <span className="text-sm text-fg-muted/80">Cloth of the day</span>
                  <h2 className="mt-2 font-display text-4xl leading-none text-fg sm:text-6xl">{cloth.title}</h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted/80">{cloth.description}</p>
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* The Guide: one feature, then a plain list. */}
      {feature && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="font-display text-4xl text-fg sm:text-5xl">The Guide</h2>
              <Link href="/guide" className="border-b border-line pb-0.5 text-sm text-fg-muted transition hover:border-accent hover:text-accent">
                All articles
              </Link>
            </div>

            <Link href={`/guide/${feature.slug}`} className="group mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
              {feature.coverImage && (
                <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7">
                  <Image src={feature.coverImage} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                </div>
              )}
              <div className="lg:col-span-5 lg:self-center">
                <span className="text-sm text-accent">{feature.category}</span>
                <h3 className="mt-3 font-display text-3xl leading-tight text-fg sm:text-4xl">{feature.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-fg-muted/80">{feature.excerpt}</p>
                <span className="mt-6 inline-block border-b border-accent pb-0.5 text-sm text-fg">Read</span>
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
