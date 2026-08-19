"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { useUiStore } from "@/lib/ui-store";
import type { Product } from "@/lib/products";

export default function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const [size, setSize] = useState(product.sizes[0] ?? (product.sizes.length > 0 ? product.sizes[0] : "One Size"));
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useUiStore((s) => s.openCartDrawer);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    if (outOfStock) return;

    addItem({
      productId: product.id,
      slug: product.slug,
      section: product.section as "SANTUS_SABAOTH" | "SARTORIAL_EXECUTIVE",
      name: product.name,
      price: product.price,
      size: product.sizes.length > 0 ? size : null,
      quantity: 1,
      image: product.images[0] ?? "",
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCartDrawer();
    }, 400);
  }

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:scale-105 hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-40"
      >
        {outOfStock ? "Sold Out" : added ? "Added ✓" : "Add to Bag"}
      </button>
    );
  }

  return (
    <div>
      {product.sizes.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-widest text-cream-dim/60">Select Size</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  size === s
                    ? "border-gold bg-gold text-charcoal-950 shadow-sm"
                    : "border-charcoal-700 bg-charcoal-900 text-cream-dim hover:border-gold/60 hover:text-gold"
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
          className="flex-1 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold tracking-wide text-charcoal-950 shadow-gold transition hover:scale-[1.01] hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          {outOfStock ? "Currently Out of Stock" : added ? "Added to Bag ✓" : "ADD TO BAG"}
        </button>

        <button
          onClick={() => {
            handleAdd();
            window.location.href = "/checkout";
          }}
          disabled={outOfStock}
          className="rounded-full border border-charcoal-700 bg-charcoal-900 px-6 py-3.5 text-sm font-medium text-cream transition hover:border-gold hover:text-gold disabled:opacity-40"
        >
          Buy Now
        </button>
      </div>

      {added && (
        <p className="mt-3 text-xs text-gold">
          Piece added to your shopping bag.
        </p>
      )}
    </div>
  );
}
