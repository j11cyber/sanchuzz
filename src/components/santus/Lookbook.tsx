"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, useScroll, useTransform } from "motion/react";
import { formatNaira } from "@/lib/money";
import type { Product } from "@/lib/products";

/**
 * The lookbook: a pinned viewport that scrolls sideways as you scroll down.
 * Each spread is an oversized photograph with the piece name set large
 * beside it. The track moves exactly its overflow, so the last spread lands
 * flush. Transform-only, so phones scroll it on the compositor.
 */
export default function Lookbook({ products, basePath }: { products: Product[]; basePath: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setOverflow(Math.max(0, track.scrollWidth - track.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [products.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -overflow]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Height gives the scroll room: one viewport per spread, a little less on phones.
  const spreads = products.length;

  return (
    <section ref={sectionRef} className="relative" style={{ height: `calc(${spreads} * 80svh + 100svh)` }} aria-label="Lookbook">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute left-5 top-24 z-10 sm:left-8 lg:left-12">
          <p className="text-sm text-fg-muted/60">The collection</p>
          <h2 className="mt-1 font-display text-3xl text-fg sm:text-4xl">Lookbook</h2>
        </div>
        <div className="absolute bottom-8 left-5 right-5 z-10 h-px bg-line sm:left-8 sm:right-8 lg:left-12 lg:right-12" aria-hidden>
          <m.div style={{ width: progress }} className="h-full bg-accent" />
        </div>

        <m.div ref={trackRef} style={{ x }} className="flex h-full items-center gap-6 px-5 will-change-transform sm:gap-10 sm:px-8 lg:gap-16 lg:px-12">
          {products.map((p, i) => (
            <article key={p.id} className="group flex h-[72svh] shrink-0 items-end gap-4 sm:gap-8 lg:h-[76svh]">
              <Link href={`${basePath}/${p.slug}`} data-cursor="View" className="relative block h-full w-[70vw] overflow-hidden bg-surface sm:w-[46vw] lg:w-[34vw]" aria-label={p.name}>
                {p.images[0] && (
                  <Image
                    src={p.images[0]}
                    alt=""
                    fill
                    priority={i < 2}
                    sizes="(min-width: 1024px) 34vw, (min-width: 640px) 46vw, 70vw"
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                  />
                )}
                {p.images[1] && <Image src={p.images[1]} alt="" fill sizes="(min-width: 1024px) 34vw, 46vw" className="pc-img-2 object-cover" />}
              </Link>
              <div className="w-[22vw] pb-2 sm:w-[26vw] lg:w-[20vw]">
                <span className="font-mono text-xs text-accent-dim">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-[clamp(1.6rem,4.6vw,4.5rem)] leading-[0.95] text-fg">
                  <Link href={`${basePath}/${p.slug}`} className="transition hover:text-accent">
                    {p.name}
                  </Link>
                </h3>
                <p className="mt-3 text-sm text-fg-muted/70">{p.category}</p>
                <p className="mt-1 text-sm text-fg">{formatNaira(p.price)}</p>
              </div>
            </article>
          ))}
          <div className="flex h-[72svh] w-[60vw] shrink-0 items-center justify-center sm:w-[40vw] lg:w-[30vw]">
            <Link href={`${basePath}/shop`} className="btn-sheen relative inline-flex items-center gap-3 overflow-hidden border border-fg/40 px-7 py-3.5 text-sm text-fg">
              See everything
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                <path d="M0 5h14M10 1l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </m.div>
      </div>
    </section>
  );
}
