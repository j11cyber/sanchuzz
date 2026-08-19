import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import type { Product } from "@/lib/products";

export default function ProductGrid({
  products,
  basePath,
}: {
  products: Product[];
  basePath: string;
}) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-cream-dim/60">
        New pieces are on the way — check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <ScrollReveal key={p.id} variant="scale" delay={(i % 4) * 80}>
          <ProductCard product={p} basePath={basePath} />
        </ScrollReveal>
      ))}
    </div>
  );
}
