import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "The Guide",
  description:
    "Fashion care and management tips — how to care for and manage clothing, shoes, and bags.",
};

export default async function GuidePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const articles = await prisma.guideArticle.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  const categories = Array.from(new Set(articles.map((a) => a.category)));
  const filtered = category ? articles.filter((a) => a.category === category) : articles;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <ScrollReveal>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">The Management Guide</p>
        <h1 className="mt-4 font-display text-4xl text-cream sm:text-5xl">
          Care for what you wear
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-cream-dim/75">
          Notes on maintaining clothing, shoes, and bags — plus wardrobe and
          styling fundamentals. Have a specific question? The guide assistant
          in the corner can help too.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={100} className="snap-row no-scrollbar mt-10 sm:flex-wrap sm:overflow-visible">
        <Link
          href="/guide"
          className={`shrink-0 rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition ${
            !category
              ? "border-gold bg-gold text-charcoal-950"
              : "border-charcoal-700 text-cream-dim hover:border-gold/60 hover:text-gold"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/guide?category=${encodeURIComponent(c)}`}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition ${
              category === c
                ? "border-gold bg-gold text-charcoal-950"
                : "border-charcoal-700 text-cream-dim hover:border-gold/60 hover:text-gold"
            }`}
          >
            {c}
          </Link>
        ))}
      </ScrollReveal>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {filtered.map((a, i) => (
          <ScrollReveal key={a.id} variant={i % 2 === 0 ? "left" : "right"} delay={(i % 3) * 100}>
            <Link
              href={`/guide/${a.slug}`}
              className="group block h-full overflow-hidden rounded-xl border border-charcoal-800 bg-charcoal-900 shadow-soft transition hover:-translate-y-1 hover:shadow-lift sm:rounded-2xl"
            >
              {a.coverImage && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={a.coverImage}
                    alt={a.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-3 sm:p-5">
                <div className="text-[10px] uppercase tracking-widest text-gold sm:text-[11px]">
                  {a.category}
                </div>
                <h2 className="mt-1.5 font-display text-sm text-cream sm:mt-2 sm:text-lg">
                  {a.title}
                </h2>
                <p className="mt-1.5 hidden text-sm text-cream-dim/70 sm:mt-2 sm:block">
                  {a.excerpt}
                </p>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
