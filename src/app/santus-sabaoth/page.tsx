import Link from "next/link";
import type { Metadata } from "next";
import { getProductsBySection } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import ScrollReveal from "@/components/ScrollReveal";
import ParallaxImage from "@/components/ParallaxImage";

export const metadata: Metadata = {
  title: "Santus Sabaoth",
  description:
    "Santus Sabaoth's own personally made and designed goods — the single-designer line.",
};

export default async function SantusSabaothPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getProductsBySection("SANTUS_SABAOTH");
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const filtered = category ? products.filter((p) => p.category === category) : products;

  return (
    <div>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <ParallaxImage
          src="https://picsum.photos/seed/santus-hero/1800/1200"
          alt="Santus Sabaoth"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/55 to-charcoal-950/10" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8">
          <ScrollReveal variant="3d">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">The single-designer line</p>
            <h1 className="mt-4 font-display text-5xl text-cream sm:text-6xl">Santus Sabaoth</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-dim/80">
              Every piece here is made and designed by Santus Sabaoth himself
              — no outside labels, no exceptions. Tailoring, kaftans, shoes,
              and bags, cut by the same hand from first sketch to final
              stitch.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <ScrollReveal>
          <h2 className="font-display text-xl text-cream sm:text-2xl">The Collection</h2>
        </ScrollReveal>
        <div className="snap-row no-scrollbar mt-4 sm:mt-4 sm:flex-wrap sm:overflow-visible">
          <Link
            href="/santus-sabaoth"
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition ${
              !category
                ? "border-gold bg-gold text-charcoal-950"
                : "border-charcoal-700 text-cream-dim hover:border-gold/60 hover:text-gold"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/santus-sabaoth?category=${encodeURIComponent(c)}`}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition ${
                category === c
                  ? "border-gold bg-gold text-charcoal-950"
                  : "border-charcoal-700 text-cream-dim hover:border-gold/60 hover:text-gold"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="mt-8 sm:mt-10">
          <ProductGrid products={filtered} basePath="/santus-sabaoth" />
        </div>
      </section>
    </div>
  );
}
