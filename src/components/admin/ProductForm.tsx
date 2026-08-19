import type { StoreSection } from "@/generated/prisma/enums";
import type { Product } from "@/lib/products";

export default function ProductForm({
  action,
  section,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  section: StoreSection;
  product?: Product;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-5">
      <div>
        <label className="text-xs uppercase tracking-widest text-cream-dim/50">Name</label>
        <input
          name="name"
          required
          defaultValue={product?.name}
          className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
        />
      </div>

      {section === "SARTORIAL_EXECUTIVE" && (
        <div>
          <label className="text-xs uppercase tracking-widest text-cream-dim/50">
            Brand (leave blank for Santus Sabaoth&rsquo;s own piece)
          </label>
          <input
            name="brand"
            defaultValue={product?.brand ?? ""}
            className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
          />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="text-xs uppercase tracking-widest text-cream-dim/50">Category</label>
          <input
            name="category"
            required
            defaultValue={product?.category}
            className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-cream-dim/50">Price (₦)</label>
          <input
            type="number"
            name="price"
            min={0}
            required
            defaultValue={product?.price}
            className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-cream-dim/50">Stock qty</label>
          <input
            type="number"
            name="stock"
            min={0}
            required
            defaultValue={product?.stock ?? 0}
            className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-cream-dim/50">Description</label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={product?.description}
          className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-cream-dim/50">
          Image URLs (one per line)
        </label>
        <textarea
          name="images"
          rows={3}
          defaultValue={product?.images.join("\n")}
          placeholder="https://..."
          className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-cream-dim/50">
          Sizes (comma separated)
        </label>
        <input
          name="sizes"
          defaultValue={product?.sizes.join(", ")}
          placeholder="S, M, L, XL"
          className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-900 px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-cream-dim/70">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={product?.featured}
          className="h-4 w-4 rounded border-charcoal-700 bg-charcoal-900 accent-[#d4af5a]"
        />
        Feature on storefront &amp; homepage
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
