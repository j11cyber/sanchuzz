"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";

/**
 * Before and after, one over the other, with a handle you drag across.
 * The after photograph is clipped with clip-path (composited), the handle
 * moves with transform, and a range input underneath makes it work with a
 * keyboard and a screen reader.
 */
export default function BeforeAfter({
  before,
  after,
  alt,
  initial = 55,
  sizes,
  priority = false,
  className = "",
}: {
  before: string;
  after: string;
  alt: string;
  initial?: number;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [pos, setPos] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const id = useId();

  function setFromClientX(clientX: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }

  return (
    <div
      ref={ref}
      className={`compare-handle group relative select-none overflow-hidden bg-surface ${className}`}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) setFromClientX(e.clientX);
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={before} alt={`${alt}, before`} fill priority={priority} sizes={sizes} className="object-cover grayscale-[0.6]" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <Image src={after} alt={`${alt}, after`} fill priority={priority} sizes={sizes} className="object-cover" draggable={false} />
      </div>

      {/* Handle: a hairline and a small knob, moved with transform only */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full" style={{ transform: `translateX(${pos}%)` }} aria-hidden>
        <div className="absolute inset-y-0 left-0 w-px bg-fg/80" />
        <div className="absolute left-0 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-fg/60 bg-deep/80 text-fg">
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M5 1 1 5l4 4M11 1l4 4-4 4" />
          </svg>
        </div>
      </div>

      <span className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] tracking-[0.2em] text-fg/80">BEFORE</span>
      <span className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] tracking-[0.2em] text-mark">AFTER</span>

      <label htmlFor={id} className="sr-only">
        Reveal the after photograph
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-0 bottom-0 h-8 w-full cursor-ew-resize opacity-0"
        aria-valuetext={`${Math.round(pos)} percent after`}
      />
    </div>
  );
}
