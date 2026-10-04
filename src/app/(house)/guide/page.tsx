import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "The Guide",
  description: "How to care for what you wear: clothing, shoes and bags, plus wardrobe and fit fundamentals.",
};

export default async function GuidePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const articles = await prisma.guideArticle.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });
  const categories = Array.from(new Set(articles.map((a) => a.category)));
  const filtered = category ? articles.filter((a) => a.category === category) : articles;
  const [feature, ...rest] = filtered;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-12">
        <h1 className="font-display text-5xl leading-[1.02] text-fg sm:text-7xl lg:col-span-7">The Guide</h1>
        <p className="text-base leading-relaxed text-fg-muted/80 lg:col-span-4 lg:col-start-9 lg:pt-4">
          Plain advice on keeping clothing, shoes and bags in good order, and on the fundamentals of fit and colour. Ask the assistant in
          the corner if you have a specific question.
        </p>
      </div>

      <nav className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-y border-line py-4 text-sm" aria-label="Categories">
        <Link href="/guide" className={!category ? "border-b border-accent pb-0.5 text-fg" : "text-fg-muted/70 transition hover:text-accent"}>
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/guide?category=${encodeURIComponent(c)}`}
            className={category === c ? "border-b border-accent pb-0.5 text-fg" : "text-fg-muted/70 transition hover:text-accent"}
          >
            {c}
          </Link>
        ))}
      </nav>

      {feature && (
        <Link href={`/guide/${feature.slug}`} className="group relative mt-12 block min-h-[60svh] overflow-hidden">
          {feature.coverImage && (
            <Image src={feature.coverImage} alt="" fill priority sizes="100vw" className="object-cover transition duration-700 group-hover:scale-[1.02]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12">
            <span className="text-sm text-fg-muted/80">{feature.category}</span>
            <h2 className="mt-2 max-w-3xl font-display text-3xl leading-tight text-fg sm:text-5xl">{feature.title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted/80 sm:text-base">{feature.excerpt}</p>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <ul className="mt-12 divide-y divide-line border-t border-line">
          {rest.map((a) => (
            <li key={a.id}>
              <Link href={`/guide/${a.slug}`} className="group grid gap-5 py-7 sm:grid-cols-[7rem_1fr] sm:gap-8">
                {a.coverImage ? (
                  <div className="relative aspect-[4/5] w-28 overflow-hidden sm:w-full">
                    <Image src={a.coverImage} alt="" fill sizes="112px" className="object-cover" />
                  </div>
                ) : (
                  <div />
                )}
                <div className="self-center">
                  <span className="text-sm text-fg-muted/60">{a.category}</span>
                  <h2 className="mt-1 font-display text-2xl leading-tight text-fg transition group-hover:text-accent sm:text-3xl">{a.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted/75">{a.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {filtered.length === 0 && <p className="mt-16 text-sm text-fg-muted/60">Nothing published in this category yet.</p>}
    </div>
  );
}
