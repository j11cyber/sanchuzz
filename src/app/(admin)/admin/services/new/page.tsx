import Link from "next/link";
import { upsertServiceAction } from "@/lib/actions/admin-services";

export const metadata = { title: "New Service · Admin" };

export default function NewServicePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/services" className="text-xs text-gold hover:underline">
          &larr; Back to Services
        </Link>
        <h1 className="mt-2 font-display text-3xl text-cream">Add New Clinical Service</h1>
      </div>

      <form action={upsertServiceAction} className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Service Name *</label>
          <input
            required
            name="name"
            placeholder="e.g. The Executive Checkup"
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Slug *</label>
            <input
              required
              name="slug"
              placeholder="the-executive-checkup"
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Price (in Naira ₦) *</label>
            <input
              required
              type="number"
              name="price"
              placeholder="50000"
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Duration</label>
            <input
              name="duration"
              placeholder="30 Minutes"
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

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Deposit to book (% of price)</label>
          <input
            type="number"
            name="depositPercent"
            min={0}
            max={100}
            defaultValue={50}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Description *</label>
          <textarea
            required
            name="description"
            rows={3}
            placeholder="Clinical description of the styling intervention..."
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Best For</label>
          <input
            name="bestFor"
            placeholder="Executives preparing for high-stakes presentations or wardrobe overhaul"
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Features (one per line)</label>
          <textarea
            name="features"
            rows={4}
            placeholder="30-min 1-on-1 virtual or atelier diagnosis&#10;Full anatomical proportion assessment&#10;Written Patient File & Sartorial Prescription"
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Image URL</label>
          <input
            name="image"
            placeholder="https://images.unsplash.com/..."
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
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
            Create Service
          </button>
        </div>
      </form>
    </div>
  );
}
