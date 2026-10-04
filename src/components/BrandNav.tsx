"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useBrand } from "@/components/brand-context";
import { brandHref, HOUSE_NAME } from "@/lib/brands";
import { useCartStore, cartCount } from "@/lib/cart-store";
import { useUiStore } from "@/lib/ui-store";
import { useHydrated } from "@/lib/use-hydrated";
import type { StoreSection } from "@/lib/brands";

function BagButton({ section }: { section: StoreSection }) {
  const items = useCartStore(section, (s) => s.items);
  const openCartDrawer = useUiStore((s) => s.openCartDrawer);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(items) : 0;

  return (
    <button
      type="button"
      onClick={openCartDrawer}
      className="relative rounded-full border border-line p-2 text-fg-muted transition hover:border-accent hover:text-accent"
      aria-label={count > 0 ? `Open bag, ${count} items` : "Open bag"}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M6 7h12l1 14H5L6 7z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-bg">
          {count}
        </span>
      )}
    </button>
  );
}

/**
 * Navigation for every brand. Reads the brand from context so the same
 * component gives each brand its own wordmark, links and bag.
 */
export default function BrandNav() {
  const brand = useBrand();
  const pathname = usePathname();
  const openSearch = useUiStore((s) => s.openSearch);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHouse = brand.key === "house";
  const home = brandHref(brand, "/");

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "border-line/80 bg-bg/90 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[110rem] items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-12">
        <div className="flex flex-col">
          <Link
            href={home}
            className={
              brand.key === "santus"
                ? "font-display text-[1.45rem] font-medium leading-none tracking-[-0.01em] text-fg transition hover:text-accent sm:text-[1.7rem]"
                : "font-display text-[1.15rem] uppercase leading-none tracking-[0.14em] text-fg transition hover:text-accent sm:text-[1.3rem]"
            }
          >
            {brand.key === "santus" ? (
              <>
                Santus <span className="italic">Sabaoth</span>
              </>
            ) : (
              brand.name
            )}
          </Link>
          {!isHouse && (
            <Link href="/" className="mt-1 text-[11px] text-fg-muted/60 transition hover:text-accent">
              A {HOUSE_NAME} house
            </Link>
          )}
        </div>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {brand.nav.map((l) => {
            const href = isHouse ? l.href : brandHref(brand, l.href);
            const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                className={`link-line text-[13px] tracking-[0.02em] transition hover:text-fg ${active ? "text-fg" : "text-fg-muted"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openSearch}
            className="rounded-full border border-line p-2 text-fg-muted transition hover:border-accent hover:text-accent"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>

          {brand.section && <BagButton section={brand.section} />}

          <button
            type="button"
            className="rounded-full border border-line p-2 text-fg lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-line bg-bg px-5 pb-8 pt-4 lg:hidden">
          <nav className="flex flex-col" aria-label="Primary mobile">
            {brand.nav.map((l, i) => {
              const href = isHouse ? l.href : brandHref(brand, l.href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="nav-item-in border-b border-line/60 py-3 font-display text-2xl text-fg hover:text-accent"
                  style={{ animationDelay: `${40 + i * 40}ms` }}
                >
                  {l.label}
                </Link>
              );
            })}
            {!isHouse && (
              <Link href="/" onClick={() => setMobileOpen(false)} className="nav-item-in pt-4 text-sm text-fg-muted/70 hover:text-accent" style={{ animationDelay: `${40 + brand.nav.length * 40}ms` }}>
                Back to {HOUSE_NAME}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
