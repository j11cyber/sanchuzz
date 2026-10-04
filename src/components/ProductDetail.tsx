"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/money";
import type { Product } from "@/lib/products";
import { brandHref, productHref, type Brand, type StoreSection } from "@/lib/brands";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductDetail({
  product,
  brand,
  relatedProducts = [],
}: {
  product: Product;
  brand: Brand;
  relatedProducts?: Product[];
}) {
  const [selected, setSelected] = useState(0);
  const isClinic = brand.key === "sartorial";

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <nav className="text-xs text-fg-muted/50" aria-label="Breadcrumb">
        <Link href={brandHref(brand, "/shop")} className="hover:text-accent">
          {isClinic ? "Pieces" : "Shop"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-fg-muted/80">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
        <div className="grid gap-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface">
            {product.images[selected] ? (
              <Image src={product.images[selected]} alt={product.name} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-fg-muted/40">Photo to follow</div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3" role="tablist" aria-label="Product photos">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={selected === idx}
                  onClick={() => setSelected(idx)}
                  className={`relative aspect-square overflow-hidden rounded-xl border bg-surface transition ${
                    selected === idx ? "border-accent" : "border-line opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${product.name}, view ${idx + 1}`} fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-fg-muted/70">
              <span className="text-accent">{product.brand ?? brand.name}</span>
              <span aria-hidden>·</span>
              <span>{product.category}</span>
            </div>

            <h1 className="mt-3 font-display text-4xl text-fg sm:text-5xl">{product.name}</h1>
            <div className="mt-4 font-display text-2xl text-accent">{formatNaira(product.price)}</div>

            <p className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-fg-muted/85">{product.description}</p>

            <dl className="mt-6 space-y-2 rounded-2xl border border-line bg-surface/60 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-fg-muted/60">Care</dt>
                <dd className="text-right text-fg-muted/85">Brush after wear. Steam, don&rsquo;t iron. Dry clean rarely.</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-fg-muted/60">Availability</dt>
                <dd className="text-fg-muted/85">{product.stock > 0 ? `${product.stock} in stock` : "Made to order"}</dd>
              </div>
            </dl>

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>
          </div>

          {isClinic ? (
            <div className="mt-10 flex items-center justify-between gap-4 rounded-xl border border-mark/30 bg-deep/60 p-4">
              <div className="text-sm text-fg-muted/80">Unsure if this cut suits your build?</div>
              <Link href={brandHref(brand, "/checkup")} className="shrink-0 rounded-full border border-mark/50 px-4 py-1.5 text-xs text-mark transition hover:bg-mark hover:text-bg">
                Take the checkup
              </Link>
            </div>
          ) : (
            <div className="mt-10 flex items-center justify-between gap-4 rounded-xl border border-line bg-surface/60 p-4">
              <div className="text-sm text-fg-muted/80">Want it cut to your measurements?</div>
              <Link href={brandHref(brand, "/commission")} className="shrink-0 rounded-full border border-accent/50 px-4 py-1.5 text-xs text-accent transition hover:bg-accent hover:text-bg">
                Commission a piece
              </Link>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-line pt-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl text-fg sm:text-3xl">{isClinic ? "Also prescribed" : "More from the atelier"}</h2>
            <Link href={brandHref(brand, "/shop")} className="text-sm text-accent hover:text-accent-soft">
              {isClinic ? "All pieces" : "The collection"}
            </Link>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <li key={rel.id}>
                <Link href={productHref(rel.section as StoreSection, rel.slug)} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface">
                    {rel.images[0] && (
                      <Image src={rel.images[0]} alt={rel.name} fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover transition group-hover:scale-105" />
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-fg-muted/60">{rel.category}</div>
                    <div className="truncate font-display text-base text-fg group-hover:text-accent">{rel.name}</div>
                    <div className="mt-1 text-sm text-accent">{formatNaira(rel.price)}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
