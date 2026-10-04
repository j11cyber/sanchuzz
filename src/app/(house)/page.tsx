import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BRANDS, HOUSE_NAME } from "@/lib/brands";

/**
 * House homepage. Structural version: two brand doors, the Guide, today's
 * pick. The full-viewport threshold hero arrives in Phase 5.
 */
export default async function HouseHome() {
  const [articles, cloth, color] = await Promise.all([
    prisma.guideArticle.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.dailyPick.findFirst({ where: { type: "CLOTH" }, orderBy: { date: "desc" } }),
    prisma.dailyPick.findFirst({ where: { type: "COLOR" }, orderBy: { date: "desc" } }),
  ]);

  const doors = [
    {
      brand: BRANDS.santus,
      image: "https://picsum.photos/seed/santus-hero/1200/1500",
      line: "The maker's own line. Tailoring, kaftans, shoes and bags, cut by one hand.",
      cta: "Enter the atelier",
    },
    {
      brand: BRANDS.sartorial,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
      line: "The Fashion Clinic. Diagnose. Prescribe. Transform.",
      cta: "Enter the clinic",
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28">
      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-16">
        <h1 className="max-w-3xl font-display text-4xl leading-tight text-fg sm:text-6xl">
          {HOUSE_NAME}. The house behind two ways of dressing well.
        </h1>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {doors.map(({ brand, image, line, cta }) => (
            <Link key={brand.key} href={brand.prefix} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-surface sm:aspect-[3/4]">
              <Image src={image} alt={brand.name} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <h2 className="font-display text-3xl text-fg sm:text-4xl">{brand.name}</h2>
                <p className="mt-2 max-w-sm text-sm text-fg-muted/85">{line}</p>
                <span className="mt-4 inline-block text-sm text-accent">{cta}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {(cloth || color) && (
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl text-fg sm:text-4xl">Today</h2>
            <Link href="/daily" className="text-sm text-accent hover:text-accent-soft">
              The daily pick
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {cloth && (
              <Link href="/daily" className="flex gap-5 rounded-2xl border border-line bg-surface p-5">
                {cloth.imageUrl && (
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image src={cloth.imageUrl} alt={cloth.title} fill sizes="96px" className="object-cover" />
                  </div>
                )}
                <div>
                  <div className="text-xs text-accent">Cloth of the day</div>
                  <div className="mt-1 font-display text-xl text-fg">{cloth.title}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-fg-muted/70">{cloth.description}</p>
                </div>
              </Link>
            )}
            {color && (
              <Link href="/daily" className="flex gap-5 rounded-2xl border border-line bg-surface p-5">
                <div className="h-28 w-24 shrink-0 rounded-lg" style={{ backgroundColor: color.colorHex ?? "#D4AF5A" }} aria-hidden />
                <div>
                  <div className="text-xs text-accent">Colour of the day</div>
                  <div className="mt-1 font-display text-xl text-fg">{color.title}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-fg-muted/70">{color.description}</p>
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl text-fg sm:text-4xl">The Guide</h2>
              <p className="mt-2 text-sm text-fg-muted/70">How to care for what you wear.</p>
            </div>
            <Link href="/guide" className="text-sm text-accent hover:text-accent-soft">
              All articles
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {articles.map((a) => (
              <Link key={a.id} href={`/guide/${a.slug}`} className="group overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-accent/50">
                {a.coverImage && (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={a.coverImage} alt={a.title} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  <span className="text-xs text-accent">{a.category}</span>
                  <h3 className="mt-2 font-display text-lg text-fg transition group-hover:text-accent">{a.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-fg-muted/70">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
