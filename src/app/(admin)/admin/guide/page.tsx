import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminGuideListPage() {
  const articles = await prisma.guideArticle.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-cream">Guide Articles</h1>
        <Link
          href="/admin/guide/new"
          className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
        >
          + New article
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-charcoal-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-charcoal-900 text-xs uppercase tracking-widest text-cream-dim/50">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-cream-dim/50">
                  No articles yet.
                </td>
              </tr>
            )}
            {articles.map((a) => (
              <tr key={a.id} className="border-t border-charcoal-800">
                <td className="px-4 py-3 text-cream">{a.title}</td>
                <td className="px-4 py-3 text-cream-dim/70">{a.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      a.published ? "bg-gold/20 text-gold" : "bg-charcoal-700 text-cream-dim"
                    }`}
                  >
                    {a.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/guide/${a.id}/edit`} className="text-gold hover:text-gold-soft">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
