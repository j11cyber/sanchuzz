"use client";

import { LazyMotion, MotionConfig } from "motion/react";

/** Motion features load in their own chunk, only when a page first needs them. domMax adds layout animations for the shop filters. */
const loadFeatures = () => import("motion/react").then((mod) => mod.domMax);

/**
 * Site-wide Motion setup. `reducedMotion="user"` turns transforms into
 * instant changes for anyone with prefers-reduced-motion, so every `m.*`
 * element below honours it without extra code.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
