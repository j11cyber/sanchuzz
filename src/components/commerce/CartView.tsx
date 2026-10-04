"use client";

import Image from "next/image";
import Link from "next/link";
import { useBrand } from "@/components/brand-context";
import { brandHref, productHref, type StoreSection } from "@/lib/brands";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { formatNaira } from "@/lib/money";
import { useHydrated } from "@/lib/use-hydrated";

function Cart({ section }: { section: StoreSection }) {
  const brand = useBrand();
  const items = useCartStore(section, (s) => s.items);
  const setQuantity = useCartStore(section, (s) => s.setQuantity);
  const removeItem = useCartStore(section, (s) => s.removeItem);
  const hydrated = useHydrated();

  if (!hydrated) return <div className="min-h-[50vh]" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-4xl text-fg">Your bag is empty</h1>
        <p className="mt-4 text-sm text-fg-muted/70">Browse the collection and add something you like.</p>
        <Link
          href={brandHref(brand, "/shop")}
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition hover:bg-accent-soft"
        >
          Shop {brand.name}
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <h1 className="font-display text-4xl text-fg">Your bag</h1>

      <div className="mt-10 grid gap-10 md:grid-cols-3">
        <ul className="space-y-4 md:col-span-2">
          {items.map((item) => (
            <li key={item.key} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                {item.image && <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={productHref(item.section, item.slug)} className="font-display text-lg text-fg hover:text-accent">
                    {item.name}
                  </Link>
                  {item.size && <div className="mt-1 text-xs text-fg-muted/60">Size {item.size}</div>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(item.key, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="h-8 w-8 rounded-full border border-line text-fg-muted hover:border-accent hover:text-accent"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm text-fg">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.key, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="h-8 w-8 rounded-full border border-line text-fg-muted hover:border-accent hover:text-accent"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-accent">{formatNaira(item.price * item.quantity)}</div>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.key)}
                aria-label={`Remove ${item.name}`}
                className="self-start text-fg-muted/40 hover:text-fg"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display text-xl text-fg">Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-fg-muted/70">
            <span>Subtotal</span>
            <span className="text-fg">{formatNaira(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-fg-muted/50">Delivery is arranged with you after payment.</p>
          <Link
            href={brandHref(brand, "/checkout")}
            className="mt-6 block rounded-full bg-accent px-6 py-3 text-center text-sm font-medium text-bg transition hover:bg-accent-soft"
          >
            Pay with Paystack
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CartView() {
  const brand = useBrand();
  if (!brand.section) return null;
  return <Cart section={brand.section} />;
}
