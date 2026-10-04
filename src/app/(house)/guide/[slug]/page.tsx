import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.guideArticle.findUnique({ where: { slug } });
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function GuideArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.guideArticle.findUnique({ where: { slug } });
  if (!article || !article.published) notFound();

  // Same category first, then the most recent of the rest, three in all.
  const sameCategory = await prisma.guideArticle.findMany({
    where: { published: true, category: article.category, NOT: { id: article.id } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const others =
    sameCategory.length < 3
      ? await prisma.guideArticle.findMany({
          where: { published: true, NOT: { id: { in: [article.id, ...sameCategory.map((a) => a.id)] } } },
          orderBy: { createdAt: "desc" },
          take: 3 - sameCategory.length,
        })
      : [];
  const more = [...sameCategory, ...others];

  const paragraphs = article.content.split(/\n{2,}|\n/).map((p) => p.trim()).filter(Boolean);
  const [lead, ...body] = paragraphs;

  return (
    <article>
      <header className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24">
        <Link href="/guide" className="text-sm text-fg-muted/60 transition hover:text-accent">
          The Guide
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <h1 className="font-display text-4xl leading-[1.05] text-fg sm:text-6xl lg:col-span-8">{article.title}</h1>
          <p className="text-sm text-fg-muted/60 lg:col-span-3 lg:col-start-10 lg:pt-3">
            {article.category}
            <br />
            {new Date(article.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </p>
        </div>
      </header>

      {article.coverImage && (
        <div className="relative mt-12 aspect-[21/9] w-full overflow-hidden">
          <Image src={article.coverImage} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <p className="font-display text-2xl leading-snug text-fg lg:col-span-4">{article.excerpt}</p>
          <div className="space-y-6 text-base leading-[1.75] text-fg-muted/90 lg:col-span-6 lg:col-start-6">
            {lead && <p className="text-lg leading-[1.7] text-fg">{lead}</p>}
            {body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {more.length > 0 && (
          <aside className="mt-24 border-t border-line pt-10 lg:ml-auto lg:max-w-3xl">
            <h2 className="text-sm text-fg-muted/60">Keep reading</h2>
            <ul className="mt-4 divide-y divide-line">
              {more.map((a) => (
                <li key={a.id}>
                  <Link href={`/guide/${a.slug}`} className="group flex items-baseline justify-between gap-6 py-4">
                    <span className="font-display text-xl text-fg transition group-hover:text-accent sm:text-2xl">{a.title}</span>
                    <span className="shrink-0 text-sm text-fg-muted/60">{a.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </article>
  );
}
