"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/money";
import type { Product } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";
import ScrollReveal from "@/components/ScrollReveal";

export default function ProductDetail({
  product,
  basePath,
  basePathLabel,
  relatedProducts = [],
}: {
  product: Product;
  basePath: string;
  basePathLabel: string;
  relatedProducts?: Product[];
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-cream-dim/50">
        <Link href="/shop" className="hover:text-gold">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link href={basePath} className="hover:text-gold">
          {basePathLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream-dim/80 font-medium">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
        {/* Multi-Image Gallery */}
        <ScrollReveal variant="3d">
          <div className="grid gap-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-charcoal-900 shadow-soft border border-charcoal-800">
              {product.images[selectedImageIndex] ? (
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-cream-dim/40">
                  Image Unavailable
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square overflow-hidden rounded-xl bg-charcoal-900 border transition ${
                      selectedImageIndex === idx
                        ? "border-gold ring-1 ring-gold shadow-sm"
                        : "border-charcoal-800 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} - view ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Product Information */}
        <ScrollReveal variant="right" delay={100} className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold">
                {product.brand ?? basePathLabel}
              </span>
              <span className="text-xs text-cream-dim/50">&middot;</span>
              <span className="text-xs uppercase tracking-wider text-cream-dim/70">
                {product.category}
              </span>
            </div>

            <h1 className="mt-3 font-display text-3xl text-cream sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 font-display text-2xl text-gold">
              {formatNaira(product.price)}
            </div>

            <div className="mt-6 border-t border-charcoal-800 pt-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-cream-dim/60">
                Description &amp; Drape Profile
              </div>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim/80">
                {product.description}
              </p>
            </div>

            {/* Materials & Aftercare Specifications */}
            <div className="mt-6 rounded-2xl border border-charcoal-800 bg-charcoal-900/60 p-4 text-xs space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gold">
                Materials &amp; Clinical Care
              </div>
              <div className="text-cream-dim/80">
                &bull; <span className="text-cream font-medium">Composition:</span> Premium grade natural fibers with hand-finished bespoke detailing.
              </div>
              <div className="text-cream-dim/80">
                &bull; <span className="text-cream font-medium">Aftercare:</span> Natural bristle brush after wear. Steam lightly; dry clean sparingly.
              </div>
              <div className="text-cream-dim/80">
                &bull; <span className="text-cream font-medium">Availability:</span> {product.stock > 0 ? `${product.stock} units available in atelier` : "Crafted to order"}
              </div>
            </div>

            {/* Add to Bag Component */}
            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>
          </div>

          {/* Clinical Prescription Banner */}
          <div className="mt-10 rounded-xl border border-emerald-500/30 bg-navy-950/60 p-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Sartorial Prescription Pairing
              </div>
              <div className="text-xs text-cream-dim/80 mt-0.5">
                Unsure if this cut matches your build?
              </div>
            </div>
            <Link
              href="/executive-checkup"
              className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500 hover:text-charcoal-950 transition"
            >
              Take Checkup
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Recommended For Your Prescription / Complete the Look */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-charcoal-800 pt-12">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
                Complete The Look
              </span>
              <h2 className="mt-2 font-display text-2xl text-cream sm:text-3xl">
                Recommended For Your Prescription
              </h2>
            </div>
            <Link href="/shop" className="text-xs text-gold hover:text-gold-soft">
              Explore Catalogue &rarr;
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <Link
                key={rel.id}
                href={`/${rel.section === "SANTUS_SABAOTH" ? "santus-sabaoth" : "sartorial-executive"}/${rel.slug}`}
                className="group rounded-2xl border border-charcoal-800 bg-charcoal-900 p-3 shadow-soft transition hover:-translate-y-1 hover:border-gold/50"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-charcoal-800">
                  {rel.images[0] && (
                    <Image src={rel.images[0]} alt={rel.name} fill className="object-cover group-hover:scale-105 transition" />
                  )}
                </div>
                <div className="mt-3">
                  <div className="text-[10px] uppercase tracking-widest text-gold">{rel.category}</div>
                  <div className="font-display text-sm text-cream truncate group-hover:text-gold">{rel.name}</div>
                  <div className="text-xs text-gold mt-1">{formatNaira(rel.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
