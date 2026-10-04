"use client";

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

  if (!isOpen || !hydrated) return null;

  const subtotal = cartSubtotal(items);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Your bag">
      <div className="fixed inset-0 bg-deep/75 backdrop-blur-sm" onClick={close} />

      <div className="relative flex h-full w-full max-w-md flex-col border-l border-line bg-surface shadow-lift">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <span className="font-display text-xl text-fg">Your bag</span>
          <button onClick={close} aria-label="Close bag" className="text-fg-muted/60 transition hover:text-fg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-lg text-fg">Your bag is empty</p>
              <Link
                href={brandHref(brand, "/shop")}
                onClick={close}
                className="mt-6 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-bg transition hover:bg-accent-soft"
              >
                Browse the collection
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 rounded-xl border border-line bg-bg/60 p-3.5">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                    {item.image && <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={productHref(item.section, item.slug)} onClick={close} className="font-display text-base text-fg hover:text-accent">
                        {item.name}
                      </Link>
                      <button onClick={() => removeItem(item.key)} aria-label={`Remove ${item.name}`} className="text-sm text-fg-muted/50 hover:text-fg">
                        ×
                      </button>
                    </div>
                    {item.size && <div className="text-xs text-fg-muted/60">Size {item.size}</div>}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setQuantity(item.key, item.quantity - 1)} aria-label="Decrease quantity" className="h-7 w-7 rounded-full border border-line text-sm text-fg-muted hover:border-accent hover:text-accent">
                          −
                        </button>
                        <span className="w-5 text-center text-sm text-fg">{item.quantity}</span>
                        <button onClick={() => setQuantity(item.key, item.quantity + 1)} aria-label="Increase quantity" className="h-7 w-7 rounded-full border border-line text-sm text-fg-muted hover:border-accent hover:text-accent">
                          +
                        </button>
                      </div>
                      <div className="text-sm text-accent">{formatNaira(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line bg-bg p-6">
            <div className="flex justify-between text-sm">
              <span className="text-fg-muted/70">Subtotal</span>
              <span className="font-display text-lg text-fg">{formatNaira(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-fg-muted/50">Delivery is arranged after payment.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href={brandHref(brand, "/checkout")} onClick={close} className="w-full rounded-full bg-accent py-3 text-center text-sm font-medium text-bg transition hover:bg-accent-soft">
                Pay with Paystack
              </Link>
              <Link href={brandHref(brand, "/cart")} onClick={close} className="w-full rounded-full border border-line py-2.5 text-center text-sm text-fg-muted transition hover:border-accent hover:text-accent">
                View bag
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Mounted in selling-brand layouts. Renders nothing for brands without a cart. */
export default function CartDrawer() {
  const brand = useBrand();
  if (!brand.section) return null;
  return <Drawer section={brand.section} />;
}
