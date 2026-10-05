"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, m } from "motion/react";
import type { Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { EXPO } from "@/components/motion/Rise";

type Sort = "newest" | "price-asc" | "price-desc";

/** A filter pill. The gold underline slides between pills that share a `group`. */
function Pill({ active, onClick, children, group }: { active: boolean; onClick: () => void; children: React.ReactNode; group: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative shrink-0 px-3 py-1.5 text-sm transition-colors duration-300 ${active ? "text-fg" : "text-fg-muted/70 hover:text-fg"}`}
    >
      {children}
      {active && <m.span layoutId={`pill-${group}`} className="absolute inset-x-3 bottom-0 h-px bg-accent" transition={{ duration: 0.45, ease: EXPO }} />}
    </button>
  );
}

/**
 * The shop grid with filters that work without a page load. Cards slide to
 * their new places and fade in and out as the filters change; the URL keeps
 * the current filter so a link to it still works.
 */
export default function ShopGrid({ products, basePath, showBrands = false }: { products: Product[]; basePath: string; showBrands?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [category, setCategory] = useState(params.get("category") ?? "");
  const [size, setSize] = useState(params.get("size") ?? "");
  const [brand, setBrand] = useState(params.get("brand") ?? "");
  const [sort, setSort] = useState<Sort>((params.get("sort") as Sort) || "newest");

  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products]);
  const sizes = useMemo(() => Array.from(new Set(products.flatMap((p) => p.sizes))).filter((s) => s !== "One Size"), [products]);
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[], [products]);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (category) sp.set("category", category);
    if (size) sp.set("size", size);
    if (brand) sp.set("brand", brand);
    if (sort !== "newest") sp.set("sort", sort);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [category, size, brand, sort, pathname, router]);

  const filtered = useMemo(() => {
    let list = products;
    if (category) list = list.filter((p) => p.category === category);
    if (size) list = list.filter((p) => p.sizes.includes(size));
    if (brand) list = list.filter((p) => p.brand === brand);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, size, brand, sort]);

  return (
    <LayoutGroup>
      <div className="space-y-3 border-y border-line py-4">
        <div className="snap-row no-scrollbar -mx-1 items-center sm:flex-wrap sm:overflow-visible">
          <Pill group="cat" active={!category} onClick={() => setCategory("")}>
            All
          </Pill>
          {categories.map((c) => (
            <Pill key={c} group="cat" active={category === c} onClick={() => setCategory(c)}>
              {c}
            </Pill>
          ))}
        </div>
        {showBrands && brands.length > 1 && (
          <div className="snap-row no-scrollbar -mx-1 items-center sm:flex-wrap sm:overflow-visible">
            <span className="shrink-0 px-3 text-xs text-fg-muted/60">House</span>
            <Pill group="brand" active={!brand} onClick={() => setBrand("")}>
              All
            </Pill>
            {brands.map((b) => (
              <Pill key={b} group="brand" active={brand === b} onClick={() => setBrand(b)}>
                {b}
              </Pill>
            ))}
          </div>
        )}
        {sizes.length > 0 && (
          <div className="snap-row no-scrollbar -mx-1 items-center sm:flex-wrap sm:overflow-visible">
            <span className="shrink-0 px-3 text-xs text-fg-muted/60">Size</span>
            <Pill group="size" active={!size} onClick={() => setSize("")}>
              Any
            </Pill>
            {sizes.map((s) => (
              <Pill key={s} group="size" active={size === s} onClick={() => setSize(s)}>
                {s}
              </Pill>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between py-4 text-xs text-fg-muted/60">
        <span aria-live="polite">
          {filtered.length} piece{filtered.length === 1 ? "" : "s"}
        </span>
        <label className="flex items-center gap-2">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-transparent text-fg-muted focus:outline-none">
            <option value="newest">Newest</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-fg-muted/60">
          Nothing matches those filters.{" "}
          <button type="button" onClick={() => { setCategory(""); setSize(""); setBrand(""); }} className="link-line text-fg">
            Clear them
          </button>
        </p>
      ) : (
        <m.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <m.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
                transition={{ duration: 0.6, ease: EXPO, delay: Math.min(i, 8) * 0.04 }}
              >
                <ProductCard product={p} basePath={basePath} priority={i < 4} />
              </m.div>
            ))}
          </AnimatePresence>
        </m.div>
      )}
    </LayoutGroup>
  );
}
