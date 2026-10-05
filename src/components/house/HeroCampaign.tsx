"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, useScroll, useTransform } from "motion/react";
import { EXPO } from "@/components/motion/Rise";
import Words from "@/components/motion/Words";
import Ambient, { usePauseOffscreen } from "@/components/motion/Ambient";
import { Monogram } from "@/components/brand/Logo";
import { HOUSE_NAME } from "@/lib/brands";
import type { HeroVideo } from "@/lib/photos";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EXPO, delay },
});

/**
 * Decide whether to play the hero video and which file. Poster only for
 * reduced motion, Save-Data, 2G/3G, or when no video is configured.
 */
function useHeroVideoSource(video: HeroVideo | null | undefined) {
  const [src, setSrc] = useState<{ mp4: string; webm?: string } | null>(null);
  useEffect(() => {
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || (conn?.effectiveType && /2g|3g/.test(conn.effectiveType))) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const t = setTimeout(() => setSrc(mobile ? video.mobile : video.desktop), 0);
    return () => clearTimeout(t);
  }, [video]);
  return src;
}

/**
 * The campaign hero. On load: the photograph settles from a slight zoom and
 * fades in, the eyebrow, headline words, line and links rise one after
 * another, the monogram seal turns slowly in the corner, warm orbs drift,
 * motes rise, and a floating card breathes at the bottom right. On scroll:
 * the picture parallaxes and the copy drifts up and fades. With a video
 * configured, it plays muted on a loop over the poster photograph and
 * inherits the same zoom and parallax.
 */
export default function HeroCampaign({
  image,
  video,
  eyebrow,
  headline,
  line,
  links,
  card,
}: {
  image: string;
  video?: HeroVideo | null;
  eyebrow: string;
  headline: string;
  line: string;
  links: { href: string; label: string }[];
  card?: { href: string; label: string; title: string; image?: string | null };
}) {
  const ref = useRef<HTMLElement>(null);
  const sealRef = usePauseOffscreen<HTMLDivElement>();
  const videoSrc = useHeroVideoSource(video);
  const [videoReady, setVideoReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const sealText = `${HOUSE_NAME} · Abuja · Santus Sabaoth · Sartorial Executive · `;

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[36rem] overflow-hidden bg-deep">
      {/* Picture (and video) share one transform so the motion is identical */}
      <m.div
        className="absolute -inset-[6%] will-change-transform"
        style={{ y: imgY, scale: imgScale }}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
        {videoSrc && (
          <video
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
            style={{ opacity: videoReady ? 1 : 0 }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={image}
            onCanPlay={() => setVideoReady(true)}
            aria-hidden
          >
            {videoSrc.webm && <source src={videoSrc.webm} type="video/webm" />}
            <source src={videoSrc.mp4} type="video/mp4" />
          </video>
        )}
      </m.div>
      <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/30 to-deep/10" />
      <div className="ray-shimmer absolute inset-0" />
      <Ambient />

      {/* Seal: circular text turning slowly, inner dashed ring turning the other way, the monogram at the centre */}
      <div ref={sealRef} aria-hidden className="pointer-events-none absolute right-5 top-24 h-28 w-28 text-accent sm:right-8 sm:top-28 sm:h-40 sm:w-40 lg:right-12">
        <m.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.6 }}>
          <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full">
            <defs>
              <path id="seal-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
            </defs>
            <text className="fill-current text-[10.5px] uppercase tracking-[0.28em]" opacity="0.85">
              <textPath href="#seal-path">{sealText}</textPath>
            </text>
          </svg>
          <svg viewBox="0 0 200 200" className="spin-slow-reverse absolute inset-0 h-full w-full">
            <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="30 10" />
            <circle cx="100" cy="42" r="2.5" fill="currentColor" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Monogram className="h-[38%] w-[38%]" />
          </div>
        </m.div>
      </div>

      {/* Copy */}
      <m.div style={{ y: copyY, opacity: copyOpacity }} className="absolute inset-x-0 bottom-0 px-5 pb-10 sm:px-8 sm:pb-14 lg:px-12">
        <m.p {...rise(0.1)} className="flex items-center gap-3 text-[13px] text-fg-muted/85">
          <span className="relative flex h-2 w-2">
            <span className="pulse-ring absolute inset-0 rounded-full border border-accent/70" />
            <span className="relative h-2 w-2 rounded-full bg-accent" />
          </span>
          {eyebrow}
        </m.p>

        <Words as="h1" text={headline} onLoad delay={0.25} stagger={0.09} className="mt-5 max-w-[12ch] font-display text-[clamp(3rem,10vw,9.5rem)] leading-[0.92] tracking-[-0.02em] text-fg" />

        <div className="mt-6 flex flex-col gap-6 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
          <m.p {...rise(0.75)} className="max-w-md text-base leading-relaxed text-fg-muted/85 sm:text-lg">
            {line}
          </m.p>
          <m.div {...rise(0.9)} className="flex gap-4">
            {links.map((l, i) => (
              <Link key={l.href} href={l.href} data-cursor="Enter" className={`btn-sheen group relative inline-flex items-center gap-3 overflow-hidden px-6 py-3 text-sm ${i === 0 ? "bg-fg text-bg" : "border border-fg/40 text-fg"}`}>
                {l.label}
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2" className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  <path d="M0 5h14M10 1l4 4-4 4" />
                </svg>
              </Link>
            ))}
          </m.div>
        </div>
      </m.div>

      {/* Floating card: rises last, then floats, with a glint running round its edge */}
      {card && (
        <m.div {...rise(1.3)} className="absolute bottom-10 right-5 hidden w-64 md:block lg:bottom-14 lg:right-12">
          <Link href={card.href} data-cursor="View" className="float-soft glass group relative block p-4">
            <span className="border-glint">
              <span className="border-glint__top" />
              <span className="border-glint__right" />
              <span className="border-glint__bottom" />
              <span className="border-glint__left" />
            </span>
            <div className="flex items-center gap-4">
              {card.image && (
                <div className="relative h-16 w-12 shrink-0 overflow-hidden">
                  <Image src={card.image} alt="" fill sizes="48px" className="object-cover" />
                </div>
              )}
              <div className="min-w-0">
                <div className="text-[11px] text-fg-muted/70">{card.label}</div>
                <div className="mt-1 truncate font-display text-lg leading-tight text-fg">{card.title}</div>
                <span className="mt-1 inline-block h-px w-4 bg-accent/60 transition-[width] duration-300 group-hover:w-8" />
              </div>
            </div>
          </Link>
        </m.div>
      )}

      {/* Scroll cue */}
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }} className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex" aria-hidden>
        <span className="text-[10px] tracking-[0.25em] text-fg-muted/50">SCROLL</span>
        <span className="relative h-10 w-px overflow-hidden bg-fg-muted/20">
          <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-accent" />
        </span>
      </m.div>
    </section>
  );
}
