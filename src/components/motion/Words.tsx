"use client";

import { m } from "motion/react";
import { EXPO } from "@/components/motion/Rise";

/**
 * A headline whose words rise one by one from behind a baseline mask.
 * `onLoad` plays immediately (hero); otherwise it plays when scrolled into view.
 */
export default function Words({
  text,
  as = "h2",
  className = "",
  delay = 0,
  stagger = 0.06,
  onLoad = false,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  onLoad?: boolean;
}) {
  const Comp = m[as];
  const words = text.split(" ");
  const trigger = onLoad ? { animate: "show" as const } : { whileInView: "show" as const, viewport: { once: true, amount: 0.4 } };

  return (
    <Comp className={className} aria-label={text} initial="hidden" {...trigger} variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top" aria-hidden>
          <m.span
            className="inline-block will-change-transform"
            variants={{ hidden: { y: "110%", opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.9, ease: EXPO } } }}
          >
            {word}
          </m.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Comp>
  );
}
