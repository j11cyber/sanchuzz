"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/money";
import type { Product } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

/**
 * A product in a dialog: photographs, price, sizes, add to bag. Opens with a
 * rise-and-settle, closes with a short fade-and-drop before unmounting.
 */
export default function QuickView({ product, href, onClose }: { product: Product; href: string; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [closing, setClosing] = useState(false);

  function close() {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 180);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6 ${closing ? "modal-closing" : ""}`} role="dialog" aria-modal="true" aria-label={product.name}>
      <div className="modal-backdrop fixed inset-0 bg-deep/80" onClick={close} />
      <div className="modal-card relative grid max-h-[94svh] w-full max-w-4xl overflow-y-auto bg-bg sm:grid-cols-2">
        <div className="relative aspect-[4/5] bg-surface sm:aspect-auto sm:min-h-[32rem]">
          {product.images[index] && <Image src={product.images[index]} alt={product.name} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />}
          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {product.images.map((_, i) => (
                <button key={i} type="button" aria-label={`Photo ${i + 1}`} onClick={() => setIndex(i)} className={`h-1.5 w-6 transition ${i === index ? "bg-fg" : "bg-fg/35 hover:bg-fg/60"}`} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 p-2 text-fg-muted/70 transition hover:text-fg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div className="text-xs text-fg-muted/60">{product.brand ?? product.category}</div>
          <h2 className="mt-2 pr-8 font-display text-3xl leading-tight text-fg">{product.name}</h2>
          <div className="mt-2 text-base text-fg">{formatNaira(product.price)}</div>
          <p className="mt-5 text-sm leading-relaxed text-fg-muted/85">{product.description}</p>
          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>
          <Link href={href} className="link-line mt-6 self-start text-sm text-fg-muted hover:text-accent">
            Full details
          </Link>
        </div>
      </div>
    </div>
  );
}
