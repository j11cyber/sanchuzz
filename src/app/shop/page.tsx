import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts, type Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Shop All Collections · The Fashion Clinic",
  description:
    "Explore the complete menswear catalogue across Santus Sabaoth bespoke craft and the Sartorial Executive luxury multi-brand edit.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; category?: string; sort?: string }>;
}) {
  const { section, category, sort } = await searchParams;
  const allProducts = await getAllProducts();

  let filtered = allProducts;

  if (section === "santus") {
    filtered = filtered.filter((p) => p.section === "SANTUS_SABAOTH");
  } else if (section === "sartorial") {
    filtered = filtered.filter((p) => p.section === "SARTORIAL_EXECUTIVE");
  }

  if (category && category !== "all") {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  const categories = Array.from(new Set(allProducts.map((p) => p.category)));

  return (
    <div className="space-y-12 py-12 sm:space-y-16 sm:py-16">
      {/* Header Banner */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <ScrollReveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-charcoal-900 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            PRESCRIPTION CATALOGUE &middot; ATELIER SHOP
          </span>
          <h1 className="mt-4 font-display text-4xl text-cream sm:text-6xl">
            The Collection
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream-dim/80 sm:text-base">
            Every piece is engineered to solve a specific tailoring or wardrobe ailment — from soft-canvassed blazers to bespoke kaftans and Goodyear-welted footwear.
          </p>
        </ScrollReveal>

        {/* Section & Category Filters */}
        <div className="mt-8 space-y-4 border-y border-charcoal-800 py-6">
          {/* Section Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-cream-dim/50 mr-2">House:</span>
            <Link
              href="/shop"
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition ${
                !section
                  ? "border-gold bg-gold text-charcoal-950 font-semibold"
                  : "border-charcoal-700 text-cream-dim hover:border-gold/60 hover:text-gold"
              }`}
            >
              All Houses
            </Link>
            <Link
              href="/shop?section=santus"
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition ${
                section === "santus"
                  ? "border-gold bg-gold text-charcoal-950 font-semibold"
                  : "border-charcoal-700 text-cream-dim hover:border-gold/60 hover:text-gold"
              }`}
            >
              Santus Sabaoth (Single-Designer)
            </Link>
            <Link
              href="/shop?section=sartorial"
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition ${
                section === "sartorial"
                  ? "border-gold bg-gold text-charcoal-950 font-semibold"
                  : "border-charcoal-700 text-cream-dim hover:border-gold/60 hover:text-gold"
              }`}
            >
              Sartorial Executive (Luxury Multi-Brand)
            </Link>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs uppercase tracking-widest text-cream-dim/50 mr-2">Category:</span>
            <Link
              href={`/shop${section ? `?section=${section}` : ""}`}
              className={`rounded-full border px-3 py-1 text-[11px] transition ${
                !category || category === "all"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-400 font-medium"
                  : "border-charcoal-800 text-cream-dim/70 hover:text-cream"
              }`}
            >
              All Categories
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/shop?category=${encodeURIComponent(c)}${section ? `&section=${section}` : ""}`}
                className={`rounded-full border px-3 py-1 text-[11px] transition ${
                  category?.toLowerCase() === c.toLowerCase()
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-400 font-medium"
                    : "border-charcoal-800 text-cream-dim/70 hover:text-cream"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-center justify-between text-xs text-cream-dim/60 pb-4">
          <span>Showing {filtered.length} piece{filtered.length === 1 ? "" : "s"}</span>
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <Link
              href={`/shop?${new URLSearchParams({ ...(section ? { section } : {}), ...(category ? { category } : {}), sort: "price-asc" }).toString()}`}
              className={`hover:text-gold ${sort === "price-asc" ? "text-gold font-medium" : ""}`}
            >
              Price: Low to High
            </Link>
            <span>&middot;</span>
            <Link
              href={`/shop?${new URLSearchParams({ ...(section ? { section } : {}), ...(category ? { category } : {}), sort: "price-desc" }).toString()}`}
              className={`hover:text-gold ${sort === "price-desc" ? "text-gold font-medium" : ""}`}
            >
              Price: High to Low
            </Link>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-cream-dim/60">
            No products match the selected filters.
            <div className="mt-4">
              <Link href="/shop" className="text-gold underline">Clear filters</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                basePath={product.section === "SANTUS_SABAOTH" ? "/santus-sabaoth" : "/sartorial-executive"}
              />
            ))}
          </div>
        )}
      </section>

      {/* Clinical Consultation Callout */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="rounded-3xl border border-gold/30 bg-navy-950 p-8 sm:p-12 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
            Unsure of Sizing or Silhouette?
          </span>
          <h2 className="mt-2 font-display text-2xl text-cream sm:text-3xl">
            Let Us Diagnose Your Ideal Cut
          </h2>
          <p className="mt-2 max-w-md mx-auto text-xs text-cream-dim/75">
            Book a 30-minute Executive Checkup to receive precise shoulder, sleeve, and trouser proportions before completing your order.
          </p>
          <div className="mt-6">
            <Link
              href="/executive-checkup"
              className="rounded-full bg-gold px-8 py-3 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
            >
              Book Style Checkup (₦50,000)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
