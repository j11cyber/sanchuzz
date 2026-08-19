import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { upsertServiceAction } from "@/lib/actions/admin-services";

export const metadata = { title: "Edit Service · Admin" };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.serviceItem.findUnique({ where: { id } });
  if (!service) notFound();

  let featuresList: string[] = [];
  try {
    featuresList = JSON.parse(service.features);
  } catch {
    featuresList = [];
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/services" className="text-xs text-gold hover:underline">
          &larr; Back to Services
        </Link>
        <h1 className="mt-2 font-display text-3xl text-cream">Edit Service: {service.name}</h1>
      </div>

      <form action={upsertServiceAction} className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 space-y-4">
        <input type="hidden" name="id" value={service.id} />

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Service Name *</label>
          <input
            required
            name="name"
            defaultValue={service.name}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Slug *</label>
            <input
              required
              name="slug"
              defaultValue={service.slug}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Price (in Naira ₦) *</label>
            <input
              required
              type="number"
              name="price"
              defaultValue={service.price}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Duration</label>
            <input
              name="duration"
              defaultValue={service.duration ?? ""}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Display Order</label>
            <input
              type="number"
              name="order"
              defaultValue={service.order}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Description *</label>
          <textarea
            required
            name="description"
            rows={3}
            defaultValue={service.description}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Best For</label>
          <input
            name="bestFor"
            defaultValue={service.bestFor ?? ""}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Features (one per line)</label>
          <textarea
            name="features"
            rows={4}
            defaultValue={featuresList.join("\n")}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Image URL</label>
          <input
            name="image"
            defaultValue={service.image ?? ""}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            name="active"
            id="active"
            defaultChecked={service.active}
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
