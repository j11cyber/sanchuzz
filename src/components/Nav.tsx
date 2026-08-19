"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore, cartCount } from "@/lib/cart-store";
import { useUiStore } from "@/lib/ui-store";
import { useHydrated } from "@/lib/use-hydrated";

const serviceLinks = [
  { href: "/services#the-executive-checkup", label: "The Executive Checkup", price: "₦50,000", desc: "30-min style diagnosis" },
  { href: "/services#the-wardrobe-detox", label: "The Wardrobe Detox", price: "₦120,000", desc: "Complete wardrobe audit" },
  { href: "/services#the-sartorial-prescription", label: "The Sartorial Prescription", price: "₦250,000", desc: "7 outfits for 7 days" },
  { href: "/services#the-boardroom-cure", label: "The Boardroom Cure", price: "₦400,000", desc: "30-day presence transformation" },
  { href: "/services#emergency-consultation", label: "Emergency Consultation", price: "₦75,000", desc: "24-hr urgent triage" },
];

const shopLinks = [
  { href: "/shop", label: "All Collections", desc: "Full menswear & accessories edit" },
  { href: "/santus-sabaoth", label: "Santus Sabaoth", desc: "Single-designer line & bespoke craft" },
  { href: "/sartorial-executive", label: "Sartorial Executive", desc: "Curated luxury multi-brand edit" },
];

export default function Nav() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const items = useCartStore((s) => s.items);
  const openSearch = useUiStore((s) => s.openSearch);
  const openCartDrawer = useUiStore((s) => s.openCartDrawer);
  const hydrated = useHydrated();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = hydrated ? cartCount(items) : 0;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "bg-charcoal-950/95 backdrop-blur-md shadow-soft border-b border-charcoal-800/80"
          : "bg-charcoal-950/75 backdrop-blur-sm border-b border-charcoal-800/40"
      }`}
    >
      {/* Top Banner Ticker */}
      <div className="hidden border-b border-charcoal-800/60 bg-navy-950/60 py-1 text-center text-[11px] tracking-widest text-cream-dim/70 sm:block">
        <span className="text-gold font-medium">THE FASHION CLINIC</span> &middot; DIAGNOSE. PRESCRIBE. TRANSFORM. &middot; LAGOS ATELIER
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex flex-col">
          <span className="font-display text-lg tracking-wider text-cream transition group-hover:text-gold sm:text-xl">
            THE FASHION CLINIC
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-gold/90">
            Diagnose &middot; Prescribe &middot; Transform
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          <Link
            href="/sartorial-executive"
            className="text-xs uppercase tracking-wider text-cream-dim transition hover:text-gold"
          >
            The Sartorial Executive
          </Link>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <Link
              href="/services"
              className="flex items-center gap-1 text-xs uppercase tracking-wider text-cream-dim transition hover:text-gold"
            >
              Services
              <svg width="8" height="5" viewBox="0 0 10 6" className="mt-px fill-current">
                <path d="M0 0l5 6 5-6z" />
              </svg>
            </Link>
            <div
              className={`absolute left-0 top-full w-80 pt-3 transition-all duration-200 ${
                servicesOpen
                  ? "pointer-events-auto opacity-100 translate-y-0"
                  : "pointer-events-none opacity-0 -translate-y-1"
              }`}
            >
              <div className="rounded-xl border border-charcoal-700 bg-charcoal-900 p-2 shadow-lift">
                <div className="border-b border-charcoal-800 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-gold">
                  Clinical Services Catalogue
                </div>
                {serviceLinks.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 transition hover:bg-charcoal-800"
                  >
                    <div>
                      <div className="font-display text-xs text-cream">{s.label}</div>
                      <div className="text-[10px] text-cream-dim/60">{s.desc}</div>
                    </div>
                    <div className="text-[11px] font-medium text-gold">{s.price}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/case-files"
            className="text-xs uppercase tracking-wider text-cream-dim transition hover:text-gold"
          >
            Case Files
          </Link>

          <Link
            href="/executive-checkup"
            className="flex items-center gap-1 text-xs uppercase tracking-wider text-emerald-400 transition hover:text-emerald-300 font-medium"
          >
            <span className="rounded bg-emerald-500/20 px-1 py-0.5 text-[9px] font-bold text-emerald-400">Rx</span>
            Checkup
          </Link>

          {/* Shop Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <Link
              href="/shop"
              className="flex items-center gap-1 text-xs uppercase tracking-wider text-cream-dim transition hover:text-gold"
            >
              Shop
              <svg width="8" height="5" viewBox="0 0 10 6" className="mt-px fill-current">
                <path d="M0 0l5 6 5-6z" />
              </svg>
            </Link>
            <div
              className={`absolute left-0 top-full w-72 pt-3 transition-all duration-200 ${
                shopOpen
                  ? "pointer-events-auto opacity-100 translate-y-0"
                  : "pointer-events-none opacity-0 -translate-y-1"
              }`}
            >
              <div className="rounded-xl border border-charcoal-700 bg-charcoal-900 p-2 shadow-lift">
                <div className="border-b border-charcoal-800 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-gold">
                  Prescription Storefronts
                </div>
                {shopLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block rounded-lg px-3 py-2.5 transition hover:bg-charcoal-800"
                  >
                    <div className="font-display text-xs text-cream">{l.label}</div>
                    <div className="text-[10px] text-cream-dim/60">{l.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/prescription-pad"
            className="text-xs uppercase tracking-wider text-cream-dim transition hover:text-gold"
          >
            Prescription Pad
          </Link>

          <Link
            href="/aftercare"
            className="text-xs uppercase tracking-wider text-cream-dim transition hover:text-gold"
          >
            Aftercare
          </Link>

          <Link
            href="/about"
            className="text-xs uppercase tracking-wider text-cream-dim transition hover:text-gold"
          >
            About
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={openSearch}
            className="flex items-center gap-1.5 rounded-full border border-charcoal-700 bg-charcoal-900/80 px-3 py-1.5 text-xs text-cream-dim transition hover:border-gold hover:text-gold"
            aria-label="Search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="hidden md:inline text-[11px]">Search</span>
            <span className="hidden rounded bg-charcoal-800 px-1 py-0.2 text-[9px] text-cream-dim/50 lg:inline">
              ⌘K
            </span>
          </button>

          {/* Cart Bag Trigger */}
          <button
            onClick={openCartDrawer}
            className="relative rounded-full border border-charcoal-700 bg-charcoal-900/80 p-2 text-cream-dim transition hover:border-gold hover:text-gold"
            aria-label="Open Cart Bag"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-charcoal-950 shadow-sm">
                {count}
              </span>
            )}
          </button>

          {/* Book Checkup CTA */}
          <Link
            href="/executive-checkup"
            className="hidden rounded-full bg-gold px-4 py-2 text-xs font-semibold tracking-wide text-charcoal-950 shadow-gold transition hover:bg-gold-soft md:inline-block"
          >
            Book Checkup
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            className="rounded-lg border border-charcoal-700 p-2 text-cream lg:hidden"
            aria-label="Toggle Mobile Navigation"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="max-h-[85vh] overflow-y-auto border-t border-charcoal-800 bg-charcoal-950 px-5 pb-8 pt-4 lg:hidden">
          <div className="space-y-4">
            <Link
              href="/executive-checkup"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-xl bg-gold/15 border border-gold/40 px-4 py-3 text-gold font-medium"
            >
              <span>Book Executive Checkup</span>
              <span className="text-xs">Start Diagnosis →</span>
            </Link>

            <div>
              <div className="text-[10px] uppercase tracking-widest text-gold">The Transformation</div>
              <Link
                href="/sartorial-executive"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-cream hover:text-gold"
              >
                The Sartorial Executive
              </Link>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest text-gold">Clinical Services</div>
              {serviceLinks.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between py-1.5 text-xs text-cream-dim hover:text-gold"
                >
                  <span>{s.label}</span>
                  <span className="text-gold/80">{s.price}</span>
                </Link>
              ))}
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest text-gold">Clinical Dossiers</div>
              <Link
                href="/case-files"
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-xs text-cream-dim hover:text-gold"
              >
                Case Files Archive
              </Link>
              <Link
                href="/prescription-pad"
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-xs text-cream-dim hover:text-gold"
              >
                Prescription Pad
              </Link>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest text-gold">Shop &amp; Collections</div>
              {shopLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-1.5 text-xs text-cream-dim hover:text-gold"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-charcoal-800 pt-3">
              <Link
                href="/aftercare"
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-xs text-cream-dim hover:text-gold"
              >
                Aftercare &amp; Garment Care Guide
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-xs text-cream-dim hover:text-gold"
              >
                About The Fashion Clinic
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block py-1.5 text-xs text-cream-dim hover:text-gold"
              >
                Contact &amp; Lagos Atelier
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
