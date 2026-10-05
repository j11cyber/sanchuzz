"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Pauses every CSS animation inside an element while it is off screen.
 * Pass an existing ref to pause a section you already reference, or omit it
 * and attach the returned ref.
 */
export function usePauseOffscreen<T extends HTMLElement>(existing?: RefObject<T | null>) {
  const own = useRef<T>(null);
  const ref = existing ?? own;
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("anim-paused", !e.isIntersecting), { rootMargin: "80px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return ref;
}

/** Pauses every CSS animation on the page while the tab is hidden. Mount once. */
export function TabVisibilityPause() {
  useEffect(() => {
    const update = () => document.documentElement.classList.toggle("tab-hidden", document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return null;
}

/** True when ambient effects should run at all. Read once on the client. */
export function useAmbientAllowed() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || (conn?.effectiveType && /2g/.test(conn.effectiveType))) return;
    const t = setTimeout(() => setOk(true), 0);
    return () => clearTimeout(t);
  }, []);
  return ok;
}

/**
 * Ambient life behind a section: two warm orbs that drift for a minute at a
 * time, and fine gold motes rising slowly, like dust in a shaft of light.
 * Cheap: a handful of elements, transform and opacity only, contained,
 * paused when off screen. Phones get one mote layer, desktop two.
 */
export default function Ambient({ motes = true, orbs = true, className = "" }: { motes?: boolean; orbs?: boolean; className?: string }) {
  const ref = usePauseOffscreen<HTMLDivElement>();
  const allowed = useAmbientAllowed();
  if (!allowed) return null;

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {orbs && (
        <>
          <div className="orb orb-a" />
          <div className="orb orb-b hidden sm:block" />
        </>
      )}
      {motes && (
        <div className="mote-field">
          <div className="mote-layer mote-layer-1" />
          <div className="mote-layer mote-layer-2 hidden sm:block" />
        </div>
      )}
    </div>
  );
}
