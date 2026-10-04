"use client";

import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/money";
import type { Product } from "@/lib/products";
import { brandHref, productHref, type Brand, type StoreSection } from "@/lib/brands";
import AddToCartButton from "@/components/AddToCartButton";
import ScrollImage from "@/components/motion/ScrollImage";
import Words from "@/components/motion/Words";
import Rise, { RiseGroup, RiseItem } from "@/components/motion/Rise";

/**
 * A piece, editorially. Desktop: the photographs stack tall down the left,
 * each moving a little with the scroll, while the details pin on the right.
 * Phone: a swipeable gallery first, then the details. Add to bag opens the
 * sliding bag.
 */
export default function ProductDetail({ product, brand, relatedProducts = [] }: { product: Product; brand: Brand; relatedProducts?: Product[] }) {
  const isClinic = brand.key === "sartorial";
  const images = product.images.length > 0 ? product.images : [];

  return (
    <div className="mx-auto max-w-[110rem] px-0 sm:px-8 lg:px-12">
      <nav className="px-5 pt-6 text-xs text-fg-muted/50 sm:px-0" aria-label="Breadcrumb">
        <Link href={brandHref(brand, "/shop")} className="link-line hover:text-fg">
          {isClinic ? "Pieces" : "The collection"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-fg-muted/80">{product.name}</span>
      </nav>

      <div className="mt-6 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Gallery: swipe on phones, tall stack on desktop */}
        <div className="lg:col-span-7">
          <div className="snap-row no-scrollbar gap-2 px-5 sm:px-0 lg:hidden" aria-label="Photographs">
            {images.map((src, i) => (
              <div key={i} className="relative aspect-[4/5] w-[86vw] shrink-0 overflow-hidden bg-surface sm:w-[60vw]">
                <Image src={src} alt={`${product.name}, view ${i + 1}`} fill priority={i === 0} sizes="86vw" className="object-cover" />
              </div>
            ))}
            {images.length === 0 && <div className="flex aspect-[4/5] w-[86vw] items-center justify-center bg-surface text-xs text-fg-muted/40">Photo to follow</div>}
          </div>
          <div className="hidden space-y-6 lg:block">
            {images.map((src, i) => (
              <ScrollImage key={i} src={src} alt={`${product.name}, view ${i + 1}`} priority={i === 0} sizes="(min-width: 1024px) 58vw, 100vw" className={i === 0 ? "aspect-[4/5] bg-surface" : "aspect-[4/5] bg-surface"} parallax={5} zoom={1.05} />
            ))}
            {images.length === 0 && <div className="flex aspect-[4/5] items-center justify-center bg-surface text-xs text-fg-muted/40">Photo to follow</div>}
          </div>
        </div>

        {/* Details */}
        <div className="px-5 pt-8 sm:px-0 lg:col-span-5 lg:pt-0">
          <div className="lg:sticky lg:top-28">
            <Rise as="p" className="text-xs text-fg-muted/60">
              {product.brand ?? brand.name} · {product.category}
            </Rise>
            <Words as="h1" text={product.name} onLoad delay={0.1} stagger={0.05} className="mt-3 font-display text-4xl leading-[1.02] text-fg sm:text-5xl lg:text-6xl" />
            <Rise as="p" delay={0.3} className="mt-4 text-lg text-fg">
              {formatNaira(product.price)}
            </Rise>

            <Rise delay={0.4} className="mt-8">
              <AddToCartButton product={product} />
            </Rise>

            <Rise as="p" delay={0.5} className="mt-8 border-t border-line pt-6 text-sm leading-relaxed text-fg-muted/85">
              {product.description}
            </Rise>

            <RiseGroup as="div" stagger={0.08} className="mt-6 divide-y divide-line border-y border-line text-sm">
              <RiseItem className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                <span className="text-fg-muted/60">Care</span>
                <span className="text-fg-muted/85">Brush after wear. Steam, don&rsquo;t iron. Dry clean rarely.</span>
              </RiseItem>
              <RiseItem className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                <span className="text-fg-muted/60">Availability</span>
                <span className="text-fg-muted/85">{product.stock > 0 ? `${product.stock} in stock` : "Made to order"}</span>
              </RiseItem>
              <RiseItem className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                <span className="text-fg-muted/60">Delivery</span>
                <span className="text-fg-muted/85">Arranged with you after payment. Fittings at the atelier or by house call.</span>
              </RiseItem>
            </RiseGroup>

            <Rise delay={0.2} className="mt-8">
              {isClinic ? (
                <Link href={brandHref(brand, "/checkup")} className="group inline-flex items-center gap-3 text-sm text-fg">
                  <span className="h-px w-4 bg-fg-muted/40 transition-[width,background-color] duration-300 group-hover:w-8 group-hover:bg-accent" />
                  Unsure of the cut? Take the checkup
                </Link>
              ) : (
                <Link href={brandHref(brand, "/commission")} className="group inline-flex items-center gap-3 text-sm text-fg">
                  <span className="h-px w-4 bg-fg-muted/40 transition-[width,background-color] duration-300 group-hover:w-8 group-hover:bg-accent" />
                  Want it cut to your measurements? Commission it
                </Link>
              )}
            </Rise>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-24 border-t border-line px-5 pt-14 sm:px-0">
          <div className="flex items-end justify-between">
            <Words as="h2" text={isClinic ? "Also prescribed" : "More from the bench"} className="font-display text-3xl text-fg sm:text-5xl" />
            <Link href={brandHref(brand, "/shop")} className="link-line text-sm text-fg-muted hover:text-fg">
              {isClinic ? "All pieces" : "The collection"}
            </Link>
          </div>
          <RiseGroup as="ul" stagger={0.09} className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <RiseItem key={rel.id} as="li" className="pc hover-lift group relative">
                <Link href={productHref(rel.section as StoreSection, rel.slug)} className="pc-media relative block aspect-[4/5] overflow-hidden bg-surface">
                  {rel.images[0] && <Image src={rel.images[0]} alt="" fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover" />}
                  {rel.images[1] && <Image src={rel.images[1]} alt="" fill sizes="(min-width: 640px) 25vw, 50vw" className="pc-img-2 object-cover" />}
                </Link>
                <div className="relative mt-4 pt-3">
                  <span className="card-line" aria-hidden />
                  <Link href={productHref(rel.section as StoreSection, rel.slug)} className="block truncate font-display text-lg leading-tight text-fg transition hover:text-accent">
                    {rel.name}
                  </Link>
                  <div className="mt-1 text-sm text-fg-muted/70">{formatNaira(rel.price)}</div>
                </div>
              </RiseItem>
            ))}
          </RiseGroup>
        </section>
      )}
    </div>
  );
}
