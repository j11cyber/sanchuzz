"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUiStore } from "@/lib/ui-store";
import { formatNaira } from "@/lib/money";
import type { SearchResult } from "@/lib/search";

export default function SearchModal() {
  const isOpen = useUiStore((s) => s.isSearchOpen);
  const close = useUiStore((s) => s.closeSearch);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useUiStore.getState().toggleSearch();
      } else if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-md transition-opacity"
        onClick={close}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-charcoal-700 bg-charcoal-900 shadow-lift">
        {/* Search Header */}
        <div className="flex items-center border-b border-charcoal-800 px-4 py-3.5 sm:px-6">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="text-gold"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, services, case files, prescriptions, care guides..."
            className="flex-1 bg-transparent px-3 text-sm text-cream placeholder:text-cream-dim/40 focus:outline-none"
          />
          <button
            onClick={close}
            className="rounded border border-charcoal-700 px-2 py-0.5 text-xs text-cream-dim/60 hover:text-cream"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        {!query && (
          <div className="p-5 text-xs text-cream-dim/60">
            <div className="font-semibold uppercase tracking-widest text-gold text-[10px]">
              Quick Searches
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "The Executive Checkup",
                "Wardrobe Detox",
                "Baggy Suit Syndrome",
                "Obsidian Blazer",
                "Kaftan",
                "Boardroom Invisibility",
                "Suit Care",
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="rounded-full border border-charcoal-800 bg-charcoal-950 px-3 py-1.5 text-xs text-cream-dim transition hover:border-gold hover:text-gold"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        {query && (
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
            {loading && (
              <div className="py-8 text-center text-sm text-cream-dim/60">
                Searching clinic records...
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="py-8 text-center text-sm text-cream-dim/60">
                No matching results found for &ldquo;{query}&rdquo;.
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-3">
                {results.map((r) => (
                  <Link
                    key={r.id}
                    href={r.href}
                    onClick={close}
                    className="group flex items-center gap-4 rounded-xl border border-charcoal-800 bg-charcoal-950/60 p-3 transition hover:border-gold/50 hover:bg-charcoal-800"
                  >
                    {r.image && (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-charcoal-800">
                        <Image src={r.image} alt={r.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-medium text-cream group-hover:text-gold">
                          {r.title}
                        </span>
                        {r.badge && (
                          <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gold">
                            {r.badge}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-cream-dim/70">{r.description}</p>
                    </div>
                    {r.price !== undefined && (
                      <div className="text-right text-xs font-medium text-gold">
                        {formatNaira(r.price)}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-charcoal-800 bg-charcoal-950 px-5 py-2.5 text-right text-[11px] text-cream-dim/50">
          The Fashion Clinic · Clinical Index
        </div>
      </div>
    </div>
  );
}
