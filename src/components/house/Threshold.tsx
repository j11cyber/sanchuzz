"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m } from "motion/react";
import { EXPO } from "@/components/motion/Rise";

export type ThresholdDoor = {
  href: string;
  name: string;
  /** One line, revealed when the door is active. */
  line: string;
  /** Short verb phrase on the entry link. */
  enter: string;
  /** Resting photograph. */
  image: string;
  /** Photograph that crossfades in when the door is active. */
  imageActive: string;
  alt: string;
};

/**
 * The threshold: two full-height doors, one per brand.
 *
 * Desktop: side by side. Hovering (or focusing) a door widens it, crossfades
 * its photograph to a closer shot and reveals its line while the other door
 * darkens and recedes. Clicking enters the brand.
 *
 * Touch: stacked. The first tap expands a door, the second tap enters. A tap
 * on the other door swaps.
 *
 * Both doors rise into view as the section arrives; the motion between
 * states is CSS (see .threshold-* in globals.css), honours reduced motion,
 * and the whole thing is two plain links for keyboard and screen readers.
 */
export default function Threshold({ doors }: { doors: [ThresholdDoor, ThresholdDoor] }) {
  const [active, setActive] = useState<number | null>(null);
  const [touch, setTouch] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setTouch(mq.matches);
    const t = setTimeout(update, 0);
    mq.addEventListener("change", update);
    return () => {
      clearTimeout(t);
      mq.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!touch) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [touch]);

  const onDoorClick = useCallback(
    (index: number) => (e: React.MouseEvent) => {
      if (!touch) return;
      if (active !== index) {
        e.preventDefault();
        setActive(index);
      }
    },
    [touch, active],
  );

  return (
    <section ref={rootRef} className="threshold" data-active={active === null ? "none" : active} data-touch={touch ? "true" : "false"} aria-label="Enter a brand">
      {doors.map((door, index) => {
        const isActive = active === index;
        const isReceding = active !== null && !isActive;
        return (
          <m.div
            key={door.href}
            className="threshold-door-wrap"
            data-state={isActive ? "active" : isReceding ? "receding" : "rest"}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: EXPO, delay: index * 0.12 }}
          >
            <Link
              href={door.href}
              className="threshold-door"
              data-cursor="Enter"
              data-state={isActive ? "active" : isReceding ? "receding" : "rest"}
              onMouseEnter={() => !touch && setActive(index)}
              onMouseLeave={() => !touch && setActive(null)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              onClick={onDoorClick(index)}
              aria-expanded={touch ? isActive : undefined}
            >
              <div className="threshold-media" aria-hidden>
                <Image src={door.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="threshold-img threshold-img-rest object-cover" />
                <Image src={door.imageActive} alt="" fill sizes="(min-width: 1024px) 70vw, 100vw" className="threshold-img threshold-img-active object-cover" />
                <div className="threshold-shade" />
                <div className="threshold-dim" />
              </div>

              <span className="sr-only">{door.alt}</span>

              <div className="threshold-copy">
                <h2 className="threshold-name font-display">{door.name}</h2>
                <p className="threshold-line">{door.line}</p>
                <span className="threshold-enter">
                  {door.enter}
                  <svg width="22" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                    <path d="M0 5h20M16 1l4 4-4 4" />
                  </svg>
                </span>
              </div>
            </Link>
          </m.div>
        );
      })}

      <div className="threshold-seam" aria-hidden />
    </section>
  );
}
