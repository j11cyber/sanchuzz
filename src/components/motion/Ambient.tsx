"use client";

import { useEffect, useRef, useState } from "react";

/** Pauses every CSS animation inside the element while it is off screen. */
export function usePauseOffscreen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("anim-paused", !e.isIntersecting), { rootMargin: "80px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
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
 * Cheap: a handful of elements, transform and opacity only, paused when
 * off screen. Phones get two mote layers instead of three.
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
          <div className="orb orb-b" />
        </>
      )}
      {motes && (
        <div className="mote-field">
          <div className="mote-layer mote-layer-1" />
          <div className="mote-layer mote-layer-2" />
          <div className="mote-layer mote-layer-3 hidden sm:block" />
        </div>
      )}
    </div>
  );
}
