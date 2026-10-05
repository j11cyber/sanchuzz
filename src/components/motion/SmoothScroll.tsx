"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { cancelFrame, frame } from "motion";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling, site-wide, driven by Motion's frame loop.
 *
 * One requestAnimationFrame per frame for everything: Lenis, the cursor
 * springs, scroll-linked images and every Motion animation all tick inside
 * the same loop, in a fixed order, so nothing fights for the frame.
 *
 * Skipped entirely when the visitor prefers reduced motion. On touch devices
 * Lenis leaves native scrolling alone (syncTouch is off).
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
    });

    const update = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp);
    frame.update(update, true);

    // Anchor links still work with smooth scroll.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")?.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -80 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelFrame(update);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
