"use client";

import { useEffect, useState } from "react";
import { HOUSE_NAME } from "@/lib/brands";

const KEY = "house-intro-seen";

/**
 * A short intro the first time the site loads in a session: the house name
 * settles into place on a dark curtain, then the curtain lifts to reveal the
 * page. Skipped with reduced motion, on Save-Data or slow connections, and
 * on every page after the first. Never longer than 1.4 seconds, and the page
 * underneath is already rendered, so nothing waits on it.
 */
export default function Intro() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
    } catch {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || (conn?.effectiveType && /2g|3g/.test(conn.effectiveType))) return;

    document.documentElement.classList.add("intro-lock");
    const t0 = setTimeout(() => setShow(true), 0);
    const t1 = setTimeout(() => setLeaving(true), 1000);
    const t2 = setTimeout(() => {
      setShow(false);
      document.documentElement.classList.remove("intro-lock");
    }, 1400);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.classList.remove("intro-lock");
    };
  }, []);

  if (!show) return null;

  return (
    <div className="intro" data-leaving={leaving ? "true" : "false"} aria-hidden>
      <span className="intro-word font-display">{HOUSE_NAME}</span>
    </div>
  );
}
