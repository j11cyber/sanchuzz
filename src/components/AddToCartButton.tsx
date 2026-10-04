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
    if (!outOfStock) setTimeout(openCartDrawer, 250);
  }

  function handleBuyNow() {
    add();
    if (!outOfStock) router.push(brandHref(brandForSection(section), "/checkout"));
  }

  if (compact) {
    return (
      <button onClick={handleAdd} disabled={outOfStock} className="btn-sheen relative overflow-hidden bg-fg px-4 py-2 text-xs text-bg transition disabled:cursor-not-allowed disabled:opacity-40">
        {outOfStock ? "Sold out" : added ? "Added" : "Add to bag"}
      </button>
    );
  }

  return (
    <div>
      {product.sizes.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between text-xs text-fg-muted/60">
            <span>Size</span>
            {size && <span className="text-fg-muted/80">{size}</span>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => setSize(s)}
                className={`relative min-w-11 border px-3 py-2 text-sm transition-colors duration-300 ${
                  size === s ? "border-fg bg-fg text-bg" : "border-line text-fg-muted hover:border-fg hover:text-fg"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="btn-sheen relative flex-1 overflow-hidden bg-fg px-8 py-3.5 text-sm font-medium text-bg transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {outOfStock ? "Out of stock" : added ? "Added to bag" : "Add to bag"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="btn-sheen relative overflow-hidden border border-fg/40 px-6 py-3.5 text-sm text-fg transition hover:border-fg disabled:opacity-40"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
