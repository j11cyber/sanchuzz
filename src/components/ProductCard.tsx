import Link from "next/link";
import Image from "next/image";
import { formatNaira } from "@/lib/money";
import type { Product } from "@/lib/products";

export default function ProductCard({
  product,
  basePath,
}: {
  product: Product;
  basePath: string;
}) {
  const image = product.images[0];
  return (
    <Link
      href={`${basePath}/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-charcoal-800/60 bg-charcoal-900 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:rounded-2xl sm:border-charcoal-800"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal-800">
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        {product.brand && (
          <span className="absolute left-2 top-2 rounded-full bg-charcoal-950/80 px-2 py-0.5 text-[9px] uppercase tracking-widest text-gold backdrop-blur-sm sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
            {product.brand}
          </span>
        )}
      </div>
      <div className="p-2.5 sm:p-4">
        <div className="text-[9px] uppercase tracking-widest text-cream-dim/50 sm:text-[11px]">
          {product.category}
        </div>
        <h3 className="mt-1 font-display text-sm text-cream sm:text-base">{product.name}</h3>
        <div className="mt-1 text-xs text-gold sm:mt-2 sm:text-sm">{formatNaira(product.price)}</div>
      </div>
    </Link>
  );
}
