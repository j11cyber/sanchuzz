"use client";

import { useEffect, useRef } from "react";

type Variant = "up" | "3d" | "left" | "right" | "scale";

const VARIANT_CLASS: Record<Variant, string> = {
  up: "reveal",
  "3d": "reveal-3d",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
};

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
  variant = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: Variant;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${VARIANT_CLASS[variant]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
