"use client";

import { m, type Variants } from "motion/react";

export const EXPO = [0.16, 1, 0.3, 1] as const;

/** Rise 22px and fade in, 0.75s expo. The reference's `.reveal.is-visible`. */
export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (delay: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, ease: EXPO, delay } }),
};

type Tag = "div" | "section" | "p" | "h2" | "h3" | "li" | "ul" | "ol" | "dl" | "figure" | "span" | "article" | "nav";

/**
 * Rises into place once when it scrolls into view (threshold 0.15, a little
 * before the bottom edge), optionally delayed for a stagger.
 */
export default function Rise({
  children,
  delay = 0,
  as = "div",
  className = "",
  amount = 0.15,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: Tag;
  className?: string;
  amount?: number;
}) {
  const Comp = m[as];
  return (
    <Comp className={className} variants={riseVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }} custom={delay}>
      {children}
    </Comp>
  );
}

/** A parent that staggers its Rise children. Children should use variants without their own `initial`/`whileInView`. */
export function RiseGroup({
  children,
  stagger = 0.08,
  as = "div",
  className = "",
  amount = 0.15,
}: {
  children: React.ReactNode;
  stagger?: number;
  as?: Tag;
  className?: string;
  amount?: number;
}) {
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Comp>
  );
}

/** A child of RiseGroup. */
export function RiseItem({ children, as = "div", className = "" }: { children: React.ReactNode; as?: Tag; className?: string }) {
  const Comp = m[as];
  return (
    <Comp className={className} variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EXPO } } }}>
      {children}
    </Comp>
  );
}
