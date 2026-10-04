"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform } from "motion/react";

/**
 * A photograph that moves with the scroll: a gentle vertical parallax and a
 * slow scale as it passes through the viewport. Transform-only, so it runs
 * on the compositor on phones as well. Honours reduced motion via MotionConfig.
 */
export default function ScrollImage({
  src,
  alt = "",
  sizes,
  priority = false,
  className = "",
  parallax = 10,
  zoom = 1.12,
}: {
  src: string;
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Percent of travel across the viewport. */
  parallax?: number;
  /** Peak scale while centred. */
  zoom?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, zoom, 1]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <m.div style={{ y, scale }} className="absolute -inset-[12%] will-change-transform">
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </m.div>
    </div>
  );
}
