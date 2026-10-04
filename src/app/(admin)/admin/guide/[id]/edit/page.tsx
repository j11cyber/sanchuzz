import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateGuideArticleAction, deleteGuideArticleAction } from "@/lib/actions/admin-guide";
import GuideForm from "@/components/admin/GuideForm";

export default async function EditGuideArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await prisma.guideArticle.findUnique({ where: { id } });
  if (!article) notFound();

  const updateAction = updateGuideArticleAction.bind(null, id);
  const deleteAction = deleteGuideArticleAction.bind(null, id);

  return (
    <div>
      <Link href="/admin/guide" className="text-sm text-cream-dim/60 hover:text-gold">
        ← Back to guide articles
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-3xl text-cream">Edit Article</h1>
        <form action={deleteAction}>
          <button type="submit" className="text-sm text-red-300 hover:text-red-200">
            Delete article
          </button>
        </form>
      </div>
      <GuideForm action={updateAction} article={article} submitLabel="Save changes" />
    </div>
  );
}
