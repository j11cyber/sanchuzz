import Link from "next/link";
import type { Metadata } from "next";
import { getProductsBySection } from "@/lib/products";
import { BRANDS, brandHref } from "@/lib/brands";
import ProductGrid from "@/components/ProductGrid";

const S = BRANDS.sartorial;

export const metadata: Metadata = {
  title: "Pieces",
  description: "The Sartorial Executive edit: tailoring, whole-cut footwear, overcoats and accessories from the atelier and other luxury houses.",
};

export default async function SartorialShopPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; category?: string; sort?: string }>;
}) {
  const { brand, category, sort } = await searchParams;
  const products = await getProductsBySection("SARTORIAL_EXECUTIVE");

  const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[];
  const categories = Array.from(new Set(products.map((p) => p.category)));

  let filtered = products;
  if (brand) filtered = filtered.filter((p) => p.brand === brand);
  if (category) filtered = filtered.filter((p) => p.category === category);
  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);

  const base = brandHref(S, "/shop");
  const link = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries({ brand, category, sort, ...params })) {
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
        <h1 className="font-display text-4xl text-fg sm:text-6xl">Pieces</h1>
        <p className="mt-4 text-sm leading-relaxed text-fg-muted/80 sm:text-base">
          Tailoring, whole-cut footwear, overcoats and accessories, from the atelier and the houses we trust. Each piece earns its place by
          solving a problem a diagnosis has named.
        </p>
      </div>

      <div className="mt-8 space-y-4 border-y border-line py-5">
        <div className="snap-row no-scrollbar sm:flex-wrap sm:overflow-visible">
          <Link href={link({ brand: undefined })} className={pill(!brand)}>
            All houses
          </Link>
          {brands.map((b) => (
            <Link key={b} href={link({ brand: b })} className={pill(brand === b)}>
              {b}
            </Link>
          ))}
        </div>
        <div className="snap-row no-scrollbar sm:flex-wrap sm:overflow-visible">
          <Link href={link({ category: undefined })} className={pill(!category)}>
            All categories
          </Link>
          {categories.map((c) => (
            <Link key={c} href={link({ category: c })} className={pill(category === c)}>
              {c}
            </Link>
          ))}
        </div>
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

      <ProductGrid products={filtered} basePath={S.prefix} />

      <div className="mt-16 rounded-3xl border border-line bg-surface p-8 text-center sm:p-12">
        <h2 className="font-display text-2xl text-fg sm:text-3xl">Unsure of your cut?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted/75">
          Take the checkup first. It names the silhouettes and proportions that work for you before you buy a thing.
        </p>
        <Link href={brandHref(S, "/checkup")} className="mt-6 inline-block rounded-full bg-accent px-8 py-3 text-sm font-semibold text-bg transition hover:bg-accent-soft">
          Start your checkup
        </Link>
      </div>
    </div>
  );
}
