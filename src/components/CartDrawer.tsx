"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { useUiStore } from "@/lib/ui-store";
import { formatNaira } from "@/lib/money";
import { useHydrated } from "@/lib/use-hydrated";

export default function CartDrawer() {
  const isOpen = useUiStore((s) => s.isCartDrawerOpen);
  const close = useUiStore((s) => s.closeCartDrawer);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const hydrated = useHydrated();

  if (!isOpen || !hydrated) return null;

  const subtotal = cartSubtotal(items);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/75 backdrop-blur-sm transition-opacity"
        onClick={close}
      />

      {/* Drawer Panel */}
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-charcoal-800 bg-charcoal-900 shadow-lift">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-charcoal-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-cream">Your Shopping Bag</span>
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={close}
            aria-label="Close cart drawer"
            className="text-cream-dim/60 transition hover:text-cream"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-full border border-charcoal-700 bg-charcoal-950 p-4 text-cream-dim/40">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
              </div>
              <p className="mt-4 font-display text-base text-cream">Your bag is empty</p>
              <p className="mt-1 text-xs text-cream-dim/60">
                Discover pieces recommended for your prescription.
              </p>
              <Link
                href="/shop"
                onClick={close}
                className="mt-6 rounded-full bg-gold px-6 py-2.5 text-xs font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-4 rounded-xl border border-charcoal-800 bg-charcoal-950/70 p-3.5"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-charcoal-800">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/${item.section === "SANTUS_SABAOTH" ? "santus-sabaoth" : "sartorial-executive"}/${item.slug}`}
                          onClick={close}
                          className="font-display text-sm text-cream hover:text-gold"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.key)}
                          className="text-xs text-cream-dim/40 transition hover:text-red-300"
                        >
                          ×
                        </button>
                      </div>
                      {item.size && (
                        <div className="mt-0.5 text-xs text-cream-dim/60">Size: {item.size}</div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(item.key, item.quantity - 1)}
                          className="h-6 w-6 rounded border border-charcoal-700 text-xs text-cream-dim transition hover:border-gold hover:text-gold"
                        >
                          -
                        </button>
                        <span className="text-xs text-cream">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.key, item.quantity + 1)}
                          className="h-6 w-6 rounded border border-charcoal-700 text-xs text-cream-dim transition hover:border-gold hover:text-gold"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-xs font-medium text-gold">
                        {formatNaira(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {items.length > 0 && (
          <div className="border-t border-charcoal-800 bg-charcoal-950 p-6">
            <div className="flex justify-between text-sm">
              <span className="text-cream-dim/70">Subtotal</span>
              <span className="font-display text-base text-cream">{formatNaira(subtotal)}</span>
            </div>
            <p className="mt-1 text-[11px] text-cream-dim/50">
              Tax and delivery calculated at checkout.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/checkout"
                onClick={close}
                className="w-full rounded-full bg-gold py-3 text-center text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/cart"
                onClick={close}
                className="w-full rounded-full border border-charcoal-700 py-2.5 text-center text-xs text-cream-dim transition hover:border-gold hover:text-gold"
              >
                View Full Bag
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
