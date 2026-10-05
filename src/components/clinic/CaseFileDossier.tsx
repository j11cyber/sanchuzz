"use client";

import Link from "next/link";
import { m } from "motion/react";
import type { CaseFileType } from "@/lib/case-files";
import { BRANDS, brandHref } from "@/lib/brands";
import { EXPO } from "@/components/motion/Rise";
import BeforeAfter from "@/components/clinic/BeforeAfter";

const S = BRANDS.sartorial;

function Tick({ delay }: { delay: number }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className="mt-[3px] shrink-0 text-mark" aria-hidden>
      <rect x="0.5" y="0.5" width="13" height="13" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.6" />
      <m.path
        d="M3 7.2l2.6 2.6L11 4.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.45, ease: EXPO, delay }}
      />
    </svg>
  );
}

/**
 * A case file as an editorial spread: the before-and-after comparator on
 * one side, the dossier on the other. Photograph and copy alternate sides
 * down the page. Symptoms tick off as the dossier comes into view.
 */
export default function CaseFileDossier({
  caseFile,
  flip = false,
  compact = false,
  level = "h3",
}: {
  caseFile: CaseFileType;
  flip?: boolean;
  compact?: boolean;
  /** Heading level, so the page outline stays in order (h2 under a page h1, h3 under a section h2). */
  level?: "h2" | "h3";
}) {
  const before = caseFile.beforeImage ?? caseFile.afterImage ?? "";
  const after = caseFile.afterImage ?? caseFile.beforeImage ?? "";
  const Heading = m[level];

  return (
    <article id={`case-${caseFile.caseNumber}`} className={`grid gap-8 lg:grid-cols-12 lg:gap-12 ${compact ? "" : "items-center"}`}>
      <m.div
        className={`lg:col-span-6 ${flip ? "lg:order-2 lg:col-start-7" : ""}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EXPO }}
      >
        {before && <BeforeAfter before={before} after={after} alt={caseFile.title} sizes="(min-width: 1024px) 50vw, 100vw" className={compact ? "aspect-[4/5]" : "aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]"} />}
      </m.div>

      <m.div
        className={`lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
      >
        <m.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EXPO } } }} className="flex items-center gap-4">
          <span className="case-number text-xs">CASE FILE Nº {caseFile.caseNumber}</span>
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-mark">RESOLVED</span>
        </m.div>

        <Heading variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EXPO } } }} className="mt-4 font-display text-3xl leading-tight text-fg sm:text-5xl">
          {caseFile.title}
        </Heading>

        <m.dl variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EXPO } } }} className="mt-6 space-y-5 text-sm">
          <div>
            <dt className="text-xs text-fg-muted/60">Presenting symptoms</dt>
            <dd>
              <ul className="mt-2 space-y-1.5">
                {caseFile.symptoms.slice(0, compact ? 2 : undefined).map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-fg-muted/90">
                    <Tick delay={0.3 + i * 0.12} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-fg-muted/60">Diagnosis</dt>
            <dd className="mt-1.5 font-display text-lg leading-snug text-fg">{caseFile.diagnosis}</dd>
          </div>
          {!compact && (
            <div>
              <dt className="flex items-center gap-2 text-xs text-fg-muted/60">
                <span className="rounded-sm bg-mark/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-mark">Rx</span> Prescription
              </dt>
              <dd>
                <ol className="mt-2 space-y-1.5 text-fg-muted/90">
                  {caseFile.prescription.map((rx, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-[11px] text-fg-muted/60">{String(i + 1).padStart(2, "0")}</span>
                      <span>{rx}</span>
                    </li>
                  ))}
                </ol>
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-fg-muted/60">Result</dt>
            <dd className="mt-1.5 text-fg">{caseFile.result}</dd>
          </div>
        </m.dl>

        {caseFile.tags.length > 0 && (
          <m.ul variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }} className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-muted/60">
            {caseFile.tags.map((t) => (
              <li key={t}>
                <Link href={brandHref(S, `/case-files?tag=${encodeURIComponent(t)}`)} className="link-line hover:text-fg">
                  {t}
                </Link>
              </li>
            ))}
          </m.ul>
        )}

        {compact && (
          <m.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="mt-6">
            <Link href={brandHref(S, `/case-files#case-${caseFile.caseNumber}`)} className="group inline-flex items-center gap-3 text-sm text-fg">
              <span className="h-px w-4 bg-fg-muted/40 transition-[width,background-color] duration-300 group-hover:w-8 group-hover:bg-accent" />
              Read the file
            </Link>
          </m.div>
        )}
      </m.div>
    </article>
  );
}
