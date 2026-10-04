import Link from "next/link";
import type { Metadata } from "next";
import { getProductsBySection } from "@/lib/products";
import { BRANDS, brandHref } from "@/lib/brands";
import ProductGrid from "@/components/ProductGrid";

const B = BRANDS.santus;

export const metadata: Metadata = {
  title: "Shop",
  description: "Santus Sabaoth's own line: tailoring, kaftans, agbada, shirts, shoes and bags, all made by the designer.",
};

export default async function SantusShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; size?: string; sort?: string }>;
}) {
  const { category, size, sort } = await searchParams;
  const products = await getProductsBySection("SANTUS_SABAOTH");

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const sizes = Array.from(new Set(products.flatMap((p) => p.sizes))).filter((s) => s !== "One Size");

  let filtered = products;
  if (category) filtered = filtered.filter((p) => p.category === category);
  if (size) filtered = filtered.filter((p) => p.sizes.includes(size));
  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

  const base = brandHref(B, "/shop");
  const link = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries({ category, size, sort, ...params })) {
      if (v) sp.set(k, v);
    }
    const qs = sp.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const pill = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-1.5 text-xs transition ${
      active ? "border-accent bg-accent text-bg" : "border-line text-fg-muted hover:border-accent/60 hover:text-accent"
    }`;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl text-fg sm:text-6xl">The collection</h1>
        <p className="mt-4 text-sm leading-relaxed text-fg-muted/80 sm:text-base">
          Everything here is made by Santus Sabaoth. No outside labels.
        </p>
      </div>

      <div className="mt-8 space-y-4 border-y border-line py-5">
        <div className="snap-row no-scrollbar sm:flex-wrap sm:overflow-visible">
          <Link href={link({ category: undefined })} className={pill(!category)}>
            All
          </Link>
          {categories.map((c) => (
            <Link key={c} href={link({ category: c })} className={pill(category === c)}>
              {c}
            </Link>
          ))}
        </div>
        {sizes.length > 0 && (
          <div className="snap-row no-scrollbar items-center sm:flex-wrap sm:overflow-visible">
            <span className="shrink-0 text-xs text-fg-muted/50">Size</span>
            <Link href={link({ size: undefined })} className={pill(!size)}>
              Any
            </Link>
            {sizes.map((s) => (
              <Link key={s} href={link({ size: s })} className={pill(size === s)}>
                {s}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between py-4 text-xs text-fg-muted/60">
        <span>
          {filtered.length} piece{filtered.length === 1 ? "" : "s"}
        </span>
        <div className="flex items-center gap-3">
          <Link href={link({ sort: "price-asc" })} className={sort === "price-asc" ? "text-accent" : "hover:text-accent"}>
            Price, low to high
          </Link>
          <Link href={link({ sort: "price-desc" })} className={sort === "price-desc" ? "text-accent" : "hover:text-accent"}>
            Price, high to low
          </Link>
        </div>
      </div>

      <ProductGrid products={filtered} basePath={B.prefix} />

      <div className="mt-16 rounded-3xl border border-line bg-surface p-8 text-center sm:p-12">
        <h2 className="font-display text-2xl text-fg sm:text-3xl">Not your size, or not quite your cut?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted/75">Any piece can be made to your measurements.</p>
        <Link href={brandHref(B, "/commission")} className="mt-6 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-bg transition hover:bg-accent-soft">
          Commission a piece
        </Link>
      </div>
    </div>
  );
}
