"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ParallaxImage({
  strength = 46,
  style,
  ...props
}: ImageProps & { strength?: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = wrapperRef.current;
    if (!el) return;

    let ticking = false;
    function update() {
      const rect = el!.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      setOffset(Math.max(-1, Math.min(1, progress)) * strength);
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [strength]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is required by ImageProps and always supplied via spread */}
      <Image
        {...props}
        style={{
          transform: `translate3d(0, ${offset}px, 0) scale(1.15)`,
          ...style,
        }}
      />
    </div>
  );
}
