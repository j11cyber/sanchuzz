"use client";

import { useState, ViewTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatNaira } from "@/lib/money";
import type { Product } from "@/lib/products";
import QuickView from "@/components/QuickView";

/**
 * A product card. The photograph is the card. On hover: the hairline above
 * the title grows to full width, the card lifts, the photograph zooms a
 * touch and swaps to the second angle. "Quick view" opens the piece in place.
 */
export default function ProductCard({
  product,
  basePath,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  priority = false,
  className = "",
}: {
  product: Product;
  basePath: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [front, second] = product.images;
  const href = `${basePath}/${product.slug}`;

  return (
    <article className={`pc hover-lift group relative ${className}`}>
      <Link href={href} data-cursor="View" className="pc-media relative block aspect-[4/5] overflow-hidden bg-surface" aria-label={product.name}>
        {front ? (
          <ViewTransition name={`product-${product.id}`} share="product-morph" default="none">
            <div className="absolute inset-0">
              <Image src={front} alt="" fill priority={priority} sizes={sizes} className="object-cover" />
            </div>
          </ViewTransition>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-fg-muted/40">Photo to follow</div>
        )}
        {second && <Image src={second} alt="" fill sizes={sizes} className="pc-img-2 object-cover" />}
        {product.stock <= 0 && <span className="absolute left-3 top-3 bg-bg/85 px-2 py-1 text-[11px] text-fg-muted">Made to order</span>}
      </Link>

      <div className="relative mt-4 pt-3">
        <span className="card-line" aria-hidden />
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link href={href} className="block truncate font-display text-lg leading-tight text-fg transition hover:text-accent sm:text-xl">
              {product.name}
            </Link>
            <div className="mt-0.5 text-xs text-fg-muted/60">{product.brand ?? product.category}</div>
          </div>
          <div className="shrink-0 text-sm text-fg">{formatNaira(product.price)}</div>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="pc-quick link-line mt-2 text-xs text-fg-muted/80 hover:text-accent">
          Quick view
        </button>
      </div>

      {open && <QuickView product={product} href={href} onClose={() => setOpen(false)} />}
    </article>
  );
}
