import Link from "next/link";
import { upsertCaseFileAction } from "@/lib/actions/admin-case-files";

export const metadata = { title: "New Case File · Admin" };

export default function NewCaseFilePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/case-files" className="text-xs text-gold hover:underline">
          &larr; Back to Case Files
        </Link>
        <h1 className="mt-2 font-display text-3xl text-cream">Add New Clinical Case File</h1>
      </div>

      <form action={upsertCaseFileAction} className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Case Number *</label>
            <input
              required
              name="caseNumber"
              placeholder="Case #21"
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Slug *</label>
            <input
              required
              name="slug"
              placeholder="the-overstated-executive"
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Title *</label>
          <input
            required
            name="title"
            placeholder="The Overstated Executive"
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Clinical Diagnosis *</label>
          <textarea
            required
            name="diagnosis"
            rows={2}
            placeholder="Excessive contrast patterns distracting from leadership messaging..."
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Reported Symptoms (one per line)</label>
          <textarea
            name="symptoms"
            rows={3}
            placeholder="Clashing tie patterns&#10;Shiny polyester suit sheen&#10;Collapsing collar spread"
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Tailored Prescription (one per line)</label>
          <textarea
            name="prescription"
            rows={3}
            placeholder="Matte Italian hopsack navy blazer&#10;Egyptian cotton spread collar shirt&#10;Solid grenadine silk tie in burgundy"
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Transformation Result</label>
          <textarea
            name="result"
            rows={2}
            placeholder="Restored understated gravitas and seamless executive commanding presence."
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Before Image URL</label>
            <input
              name="beforeImage"
              placeholder="https://images.unsplash.com/..."
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">After Image URL</label>
            <input
              name="afterImage"
              placeholder="https://images.unsplash.com/..."
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Tags (comma-separated)</label>
            <input
              name="tags"
              placeholder="Tailoring, Proportions, C-Suite"
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Display Order</label>
            <input
              type="number"
              name="order"
              defaultValue={1}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            name="active"
            id="active"
            defaultChecked
            className="h-4 w-4 rounded border-charcoal-700 text-gold focus:ring-gold"
          />
          <label htmlFor="active" className="text-xs text-cream">
            Active / Visible on public site
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="rounded-full bg-gold px-8 py-3 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
          >
            Create Case File
          </button>
        </div>
      </form>
    </div>
  );
}
