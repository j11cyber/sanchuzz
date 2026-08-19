"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { formatNaira } from "@/lib/money";
import { useHydrated } from "@/lib/use-hydrated";

const sectionLabel = {
  SANTUS_SABAOTH: "Santus Sabaoth",
  SARTORIAL_EXECUTIVE: "Sartorial Executive",
};

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const hydrated = useHydrated();

  if (!hydrated) return null;

  const subtotal = cartSubtotal(items);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-3xl text-cream">Your cart is empty</h1>
        <p className="mt-4 text-sm text-cream-dim/70">
          Browse the collections and add something to your cart.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/santus-sabaoth"
            className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
          >
            Shop Santus Sabaoth
          </Link>
          <Link
            href="/sartorial-executive"
            className="rounded-full border border-cream-dim/30 px-6 py-3 text-sm font-medium text-cream transition hover:border-gold hover:text-gold"
          >
            Shop Sartorial Executive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <h1 className="font-display text-3xl text-cream">Your Cart</h1>

      <div className="mt-10 grid gap-10 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex gap-4 rounded-2xl border border-charcoal-800 bg-charcoal-900 p-4 shadow-soft"
            >
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-charcoal-800">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gold">
                    {sectionLabel[item.section]}
                  </div>
                  <Link
                    href={`/${item.section === "SANTUS_SABAOTH" ? "santus-sabaoth" : "sartorial-executive"}/${item.slug}`}
                    className="font-display text-base text-cream hover:text-gold"
                  >
                    {item.name}
                  </Link>
                  {item.size && (
                    <div className="mt-1 text-xs text-cream-dim/60">Size: {item.size}</div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(item.key, item.quantity - 1)}
                      className="h-7 w-7 rounded-full border border-charcoal-700 text-cream-dim hover:border-gold hover:text-gold"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm text-cream">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.key, item.quantity + 1)}
                      className="h-7 w-7 rounded-full border border-charcoal-700 text-cream-dim hover:border-gold hover:text-gold"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-gold">{formatNaira(item.price * item.quantity)}</div>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.key)}
                aria-label="Remove item"
                className="self-start text-cream-dim/40 hover:text-red-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 shadow-soft">
          <h2 className="font-display text-lg text-cream">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-cream-dim/70">
            <span>Subtotal</span>
            <span className="text-cream">{formatNaira(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-cream-dim/50">Shipping calculated at checkout.</p>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-gold px-6 py-3 text-center text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
