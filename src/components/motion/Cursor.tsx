"use client";

import { useEffect, useState } from "react";
import { m, useMotionValue, useSpring } from "motion/react";

/**
 * A custom cursor for pointer devices: a small gold ring that trails the
 * pointer and grows into a labelled disc over anything marked
 * `data-cursor="View"` (or any short word). Touch devices and anyone who
 * prefers reduced motion never see it. The native cursor is hidden only
 * over the marked elements, so text and form controls keep theirs.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 38, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 420, damping: 38, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const t = setTimeout(() => {
      setEnabled(true);
      document.documentElement.classList.add("has-cursor");
    }, 0);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(target ? target.dataset.cursor || "View" : null);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setLabel(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      clearTimeout(t);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  const active = label !== null;

  return (
    <m.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[120] mix-blend-normal" style={{ x: sx, y: sy }}>
      <m.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent text-[11px] tracking-[0.12em] text-bg"
        animate={{
          width: active ? 72 : down ? 10 : 14,
          height: active ? 72 : down ? 10 : 14,
          backgroundColor: active ? "var(--brand-accent)" : "rgba(0,0,0,0)",
          opacity: 1,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.5 }}
      >
        <m.span initial={false} animate={{ opacity: active ? 1 : 0, y: active ? 0 : 4 }} transition={{ duration: 0.25 }} className="select-none uppercase">
          {label}
        </m.span>
      </m.div>
    </m.div>
  );
}
