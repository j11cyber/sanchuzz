import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ScrollReveal from "@/components/ScrollReveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.guideArticle.findUnique({ where: { slug } });
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.guideArticle.findUnique({ where: { slug } });
  if (!article || !article.published) notFound();

  const more = await prisma.guideArticle.findMany({
    where: { published: true, category: article.category, NOT: { id: article.id } },
    take: 3,
  });

  return (
    <div>
      {article.coverImage && (
        <div className="relative h-[50vh] w-full overflow-hidden">
          <Image src={article.coverImage} alt={article.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-charcoal-950/10" />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <Link href="/guide" className="text-sm text-cream-dim/60 hover:text-gold">
          ← The Guide
        </Link>
        <ScrollReveal>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-gold">{article.category}</p>
          <h1 className="mt-3 font-display text-3xl text-cream sm:text-4xl">{article.title}</h1>
          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-cream-dim/80">
            {article.content}
          </p>
        </ScrollReveal>

        {more.length > 0 && (
          <div className="mt-16 border-t border-charcoal-800 pt-10">
            <h2 className="font-display text-xl text-cream">More on {article.category}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {more.map((a) => (
                <Link
                  key={a.id}
                  href={`/guide/${a.slug}`}
                  className="rounded-xl border border-charcoal-800 bg-charcoal-900 p-4 transition hover:border-gold/50"
                >
                  <div className="font-display text-sm text-cream">{a.title}</div>
                  <div className="mt-1 text-xs text-cream-dim/60">{a.excerpt}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
