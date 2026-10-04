"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUiStore } from "@/lib/ui-store";
import { formatNaira } from "@/lib/money";
import type { SearchResult } from "@/lib/search";

const QUICK = ["Executive Checkup", "Wardrobe Detox", "Baggy Suit Syndrome", "Blazer", "Kaftan", "Loafers", "Suit care"];

/** The open panel. Mounted only while open, so its state resets naturally on close. */
function SearchPanel({ close }: { close: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    const q = query.trim();
    const timer = setTimeout(async () => {
      if (!q) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24" role="dialog" aria-modal="true" aria-label="Search">
      <div className="fixed inset-0 bg-deep/80 backdrop-blur-md" onClick={close} />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-surface shadow-lift">
        <div className="flex items-center border-b border-line px-4 py-3.5 sm:px-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-accent" aria-hidden>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pieces, treatments, case files and care guides"
            aria-label="Search"
            className="flex-1 bg-transparent px-3 text-sm text-fg placeholder:text-fg-muted/40 focus:outline-none"
          />
          <button onClick={close} className="rounded border border-line px-2 py-0.5 text-xs text-fg-muted/60 hover:text-fg">
            Esc
          </button>
        </div>

        {!query && (
          <div className="p-5 text-xs text-fg-muted/60">
            <div className="flex flex-wrap gap-2">
              {QUICK.map((term) => (
                <button key={term} onClick={() => setQuery(term)} className="rounded-full border border-line bg-bg px-3 py-1.5 text-xs text-fg-muted transition hover:border-accent hover:text-accent">
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {query && (
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5" aria-live="polite">
            {loading && <div className="py-8 text-center text-sm text-fg-muted/60">Searching…</div>}

            {!loading && results.length === 0 && (
              <div className="py-8 text-center text-sm text-fg-muted/60">Nothing found for &ldquo;{query}&rdquo;.</div>
            )}

            {!loading && results.length > 0 && (
              <ul className="space-y-3">
                {results.map((r) => (
                  <li key={r.id}>
                    <Link href={r.href} onClick={close} className="group flex items-center gap-4 rounded-xl border border-line bg-bg/60 p-3 transition hover:border-accent/50">
                      {r.image && (
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                          <Image src={r.image} alt="" fill sizes="56px" className="object-cover" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-base text-fg group-hover:text-accent">{r.title}</span>
                          {r.badge && <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-accent">{r.badge}</span>}
                        </div>
                        <p className="truncate text-xs text-fg-muted/70">{r.description}</p>
                      </div>
                      {r.price !== undefined && <div className="text-right text-xs text-accent">{formatNaira(r.price)}</div>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchModal() {
  const isOpen = useUiStore((s) => s.isSearchOpen);
  const close = useUiStore((s) => s.closeSearch);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useUiStore.getState().toggleSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!isOpen) return null;
  return <SearchPanel close={close} />;
}
