import Link from "next/link";
import { createGuideArticleAction } from "@/lib/actions/admin-guide";
import GuideForm from "@/components/admin/GuideForm";

export default function NewGuideArticlePage() {
  return (
    <div>
      <Link href="/admin/guide" className="text-sm text-cream-dim/60 hover:text-gold">
        ← Back to guide articles
      </Link>
      <h1 className="mt-3 font-display text-3xl text-cream">New Article</h1>
      <GuideForm action={createGuideArticleAction} submitLabel="Publish article" />
    </div>
  );
}
