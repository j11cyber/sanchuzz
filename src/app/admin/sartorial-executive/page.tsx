import { getSartorialExecutiveContent } from "@/lib/site-settings";
import { saveSartorialContentAction } from "@/lib/actions/admin-sartorial";

export const metadata = { title: "Sartorial Executive Content · Admin" };

export default async function AdminSartorialExecutivePage() {
  const content = await getSartorialExecutiveContent();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-cream">The Sartorial Executive Editor</h1>
        <p className="mt-1 text-xs text-cream-dim/70">
          Customize the core brand positioning copy, headlines, and call-to-action details for The Sartorial Executive feature.
        </p>
      </div>

      <form action={saveSartorialContentAction} className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Eyebrow / Badge Text</label>
          <input
            name="eyebrow"
            defaultValue={content.eyebrow}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Main Heading</label>
          <input
            name="heading"
            defaultValue={content.heading}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Subheading / Tagline</label>
          <input
            name="subheading"
            defaultValue={content.subheading}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Description Copy</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={content.description}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">CTA Button Text</label>
            <input
              name="ctaText"
              defaultValue={content.ctaText}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">CTA Button Link</label>
            <input
              name="ctaLink"
              defaultValue={content.ctaLink}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="rounded-full bg-gold px-8 py-3 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
          >
            Save Sartorial Content
          </button>
        </div>
      </form>
    </div>
  );
}
