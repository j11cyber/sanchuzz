"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useUiStore } from "@/lib/ui-store";
import { brandForSection, brandHref, type StoreSection } from "@/lib/brands";
import type { Product } from "@/lib/products";

export default function AddToCartButton({ product, compact = false }: { product: Product; compact?: boolean }) {
  const section = product.section as StoreSection;
  const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(section, (s) => s.addItem);
  const openCartDrawer = useUiStore((s) => s.openCartDrawer);
  const router = useRouter();
  const outOfStock = product.stock <= 0;

  function add() {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      section,
      name: product.name,
      price: product.price,
      size: product.sizes.length > 0 ? size : null,
      quantity: 1,
      image: product.images[0] ?? "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleAdd() {
    add();
    if (!outOfStock) setTimeout(openCartDrawer, 300);
  }

  function handleBuyNow() {
    add();
    if (!outOfStock) router.push(brandHref(brandForSection(section), "/checkout"));
  }

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-bg transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
      >
        {outOfStock ? "Sold out" : added ? "Added" : "Add to bag"}
      </button>
    );
  }

  return (
    <div>
      {product.sizes.length > 0 && (
        <div>
          <div className="text-xs text-fg-muted/60">Size</div>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => setSize(s)}
                className={`rounded-lg border px-4 py-2 text-sm transition ${
                  size === s ? "border-accent bg-accent text-bg" : "border-line text-fg-muted hover:border-accent hover:text-accent"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="flex-1 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-bg transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          {outOfStock ? "Out of stock" : added ? "Added to bag" : "Add to bag"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="rounded-full border border-line px-6 py-3.5 text-sm text-fg transition hover:border-accent hover:text-accent disabled:opacity-40"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
