import type { GuideArticle } from "@/generated/prisma/client";

export default function GuideForm({
  action,
  article,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  article?: GuideArticle;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5">
      <div>
        <label className="text-xs uppercase tracking-widest text-cream-dim/50">Title</label>
        <input
          name="title"
          required
          defaultValue={article?.title}
          className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-cream-dim/50">Category</label>
        <input
          name="category"
          required
          defaultValue={article?.category}
          placeholder="Clothing Care, Shoe Care, Bag Care, Wardrobe Building..."
          className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-cream-dim/50">Excerpt</label>
        <textarea
          name="excerpt"
          required
          rows={2}
          defaultValue={article?.excerpt}
          className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-cream-dim/50">Content</label>
        <textarea
          name="content"
          required
          rows={10}
          defaultValue={article?.content}
          className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-cream-dim/50">Cover image URL</label>
        <input
          name="coverImage"
          defaultValue={article?.coverImage ?? ""}
          className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-cream-dim/70">
        <input
          type="checkbox"
          name="published"
          defaultChecked={article?.published ?? true}
          className="h-4 w-4 rounded border-charcoal-700 bg-charcoal-900 accent-[#d4af5a]"
        />
        Published
      </label>

      <button
        type="submit"
        className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
      >
        {submitLabel}
      </button>
    </form>
  );
}
