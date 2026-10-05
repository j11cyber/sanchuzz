"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBrand } from "@/components/brand-context";
import { brandHref, productHref, type StoreSection } from "@/lib/brands";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { useUiStore } from "@/lib/ui-store";
import { formatNaira } from "@/lib/money";
import { useHydrated } from "@/lib/use-hydrated";

function Drawer({ section }: { section: StoreSection }) {
  const brand = useBrand();
  const isOpen = useUiStore((s) => s.isCartDrawerOpen);
  const close = useUiStore((s) => s.closeCartDrawer);
  const items = useCartStore(section, (s) => s.items);
  const removeItem = useCartStore(section, (s) => s.removeItem);
  const setQuantity = useCartStore(section, (s) => s.setQuantity);
  const hydrated = useHydrated();

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, close]);

  if (!hydrated) return null;

  const subtotal = cartSubtotal(items);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50" data-open={isOpen ? "true" : "false"} aria-hidden={!isOpen} style={{ pointerEvents: isOpen ? "auto" : "none" }}>
      <div className="drawer-backdrop fixed inset-0 bg-deep/80" onClick={close} />

      <aside className="drawer-panel absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bg" role="dialog" aria-modal="true" aria-label="Your bag">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-2xl text-fg">
            Bag {count > 0 && <span className="ml-1 text-base text-fg-muted/60">{count}</span>}
          </h2>
          <button onClick={close} aria-label="Close bag" className="p-1 text-fg-muted/60 transition hover:text-fg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-xl text-fg">Your bag is empty</p>
              <Link href={brandHref(brand, "/shop")} onClick={close} className="link-line mt-5 text-sm text-fg-muted hover:text-accent">
                Browse the collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-surface">
                    {item.image && <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={productHref(item.section, item.slug)} onClick={close} className="font-display text-lg leading-tight text-fg hover:text-accent">
                        {item.name}
                      </Link>
                      <button onClick={() => removeItem(item.key)} aria-label={`Remove ${item.name}`} className="text-xs text-fg-muted/50 transition hover:text-fg">
                        Remove
                      </button>
                    </div>
                    {item.size && <div className="text-xs text-fg-muted/60">Size {item.size}</div>}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm">
                        <button onClick={() => setQuantity(item.key, item.quantity - 1)} aria-label="Decrease quantity" className="text-fg-muted/70 transition hover:text-fg">
                          −
                        </button>
                        <span className="w-4 text-center text-fg">{item.quantity}</span>
                        <button onClick={() => setQuantity(item.key, item.quantity + 1)} aria-label="Increase quantity" className="text-fg-muted/70 transition hover:text-fg">
                          +
                        </button>
                      </div>
                      <div className="text-sm text-fg">{formatNaira(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line px-6 py-5">
            <div className="flex justify-between text-sm">
              <span className="text-fg-muted/70">Subtotal</span>
              <span className="text-fg">{formatNaira(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-fg-muted/50">Delivery is arranged after payment.</p>
            <Link href={brandHref(brand, "/checkout")} onClick={close} className="btn-pill mt-5 block bg-fg py-3.5 text-center text-sm font-medium text-bg hover:bg-accent">
              Pay with Paystack
            </Link>
            <Link href={brandHref(brand, "/cart")} onClick={close} className="link-line mt-4 block text-center text-sm text-fg-muted hover:text-accent">
              View bag
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

/** Mounted in selling-brand layouts. Renders nothing for brands without a cart. */
export default function CartDrawer() {
  const brand = useBrand();
  if (!brand.section) return null;
  return <Drawer section={brand.section} />;
}
