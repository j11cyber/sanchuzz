"use client";

import { useEffect, useRef } from "react";

type Variant = "lines" | "fade" | "image";

/**
 * Elegant one-time reveal when an element enters the viewport.
 *
 * - "lines": text glides up from behind a baseline mask (wrap each line or
 *   block in its own Reveal for a staggered feel).
 * - "fade": a soft rise and fade.
 * - "image": the image settles from a slight zoom; pair with an overflow-hidden wrapper.
 *
 * All motion is CSS (see .rv-* in globals.css). With prefers-reduced-motion
 * everything is visible immediately and nothing moves.
 */
export default function Reveal({
  children,
  variant = "lines",
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "p" | "h1" | "h2" | "h3" | "li" | "figure";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("rv-in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("rv-in");
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as React.ElementType;
  return (
    <Comp ref={ref} className={`rv rv-${variant} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Comp>
  );
}
