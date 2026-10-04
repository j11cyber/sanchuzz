"use client";

import { useRef } from "react";
import Link from "next/link";
import { m, useInView, useScroll, useTransform } from "motion/react";
import { EXPO } from "@/components/motion/Rise";
import Words from "@/components/motion/Words";
import { usePauseOffscreen } from "@/components/motion/Ambient";

export type ProcessStep = { number: string; title: string; body: string; href: string; cta: string };

/**
 * How the house works, as a lit diagram. The heading column pins on desktop
 * while the steps scroll past. When the list enters view, each step rises in
 * turn, the connecting lines grow down from the previous step, a gold pulse
 * then flows down each line continuously, and a fill bar on the left tracks
 * how far through the sequence you have scrolled.
 */
export default function Process({ title, intro, steps }: { title: string; intro: string; steps: ProcessStep[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pauseRef = usePauseOffscreen<HTMLDivElement>();
  const inView = useInView(listRef, { once: true, amount: 0.25, margin: "0px 0px -10% 0px" });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 70%", "end 80%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={sectionRef} className="mx-auto grid max-w-[110rem] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-8 lg:px-12">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-32">
          <Words as="h2" text={title} className="font-display text-4xl leading-[0.98] text-fg sm:text-6xl" />
          <m.p initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.75, ease: EXPO, delay: 0.25 }} className="mt-6 max-w-md text-base leading-relaxed text-fg-muted/85">
            {intro}
          </m.p>
        </div>
      </div>

      <div ref={pauseRef} className="relative lg:col-span-6 lg:col-start-7">
        {/* Scroll-tracked fill bar */}
        <div className="absolute bottom-6 left-0 top-6 hidden w-px bg-line sm:block" aria-hidden>
          <m.div style={{ scaleY: fill }} className="timeline-fill absolute inset-0 origin-top bg-gradient-to-b from-accent to-accent/40" />
        </div>

        <ol ref={listRef} className={`diagram ${inView ? "is-visible" : ""} sm:pl-10`}>
          {steps.map((s, i) => (
            <li key={s.number} className="relative pb-10 last:pb-0">
              {i < steps.length - 1 && (
                <div className="absolute left-[11px] top-12 bottom-0 hidden w-px sm:block" aria-hidden>
                  <span className="diagram-line absolute inset-0 bg-accent/40" style={{ "--step-delay": `${i * 160 + 300}ms` } as React.CSSProperties} />
                  <span className="diagram-pulse" style={{ "--pulse-delay": `${i * 1.2}s` } as React.CSSProperties} />
                </div>
              )}
              <div className="diagram-step group grid gap-4 sm:grid-cols-[2.5rem_1fr] sm:gap-6" style={{ "--step-delay": `${i * 160}ms` } as React.CSSProperties}>
                <div className="relative hidden h-6 w-6 items-center justify-center sm:flex">
                  <span className="pulse-ring absolute inset-0 rounded-full border border-accent/60" style={{ animationDelay: `${i * 0.8}s` }} />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
                </div>
                <div className="border-t border-line pt-5 transition-colors duration-500 group-hover:border-accent/60">
                  <span className="font-mono text-xs text-accent-dim">{s.number}</span>
                  <h3 className="mt-2 font-display text-3xl leading-tight text-fg sm:text-4xl">{s.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-fg-muted/85 sm:text-base">{s.body}</p>
                  <Link href={s.href} className="group/l mt-4 inline-flex items-center gap-3 text-sm text-fg">
                    <span className="h-px w-4 bg-fg-muted/40 transition-[width,background-color] duration-300 group-hover/l:w-8 group-hover/l:bg-accent" />
                    {s.cta}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
