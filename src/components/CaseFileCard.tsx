"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CaseFileType } from "@/lib/case-files";

export default function CaseFileCard({ caseFile }: { caseFile: CaseFileType }) {
  const [activeView, setActiveView] = useState<"after" | "before">("after");
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      id={`case-${caseFile.caseNumber}`}
      className="group overflow-hidden rounded-2xl border border-charcoal-800 bg-charcoal-900 shadow-soft transition hover:border-gold/40 hover:shadow-lift flex flex-col"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-charcoal-800 bg-navy-950/80 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold tracking-widest uppercase">
            CASE #{caseFile.caseNumber}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-cream-dim/60">
            Clinical Dossier
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Resolved
        </span>
      </div>

      {/* Image View Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal-950">
        {activeView === "after" ? (
          caseFile.afterImage ? (
            <Image
              src={caseFile.afterImage}
              alt={`${caseFile.title} - Post-Transformation`}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-cream-dim/40">
              Post-Transformation Visual Dossier
            </div>
          )
        ) : (
          caseFile.beforeImage ? (
            <Image
              src={caseFile.beforeImage}
              alt={`${caseFile.title} - Pre-Diagnosis`}
              fill
              className="object-cover grayscale transition duration-700"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-cream-dim/40">
              Initial Symptom Record
            </div>
          )
        )}

        {/* View Toggle Pill */}
        <div className="absolute bottom-3 left-3 flex rounded-full border border-charcoal-700/80 bg-charcoal-950/90 p-0.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveView("before")}
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
              activeView === "before"
                ? "bg-charcoal-700 text-cream"
                : "text-cream-dim/60 hover:text-cream"
            }`}
          >
            Before
          </button>
          <button
            type="button"
            onClick={() => setActiveView("after")}
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
              activeView === "after"
                ? "bg-gold text-charcoal-950"
                : "text-cream-dim/60 hover:text-cream"
            }`}
          >
            After (Rx)
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-lg text-cream group-hover:text-gold transition">
            {caseFile.title}
          </h3>

          {/* Tags */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {caseFile.tags.map((t) => (
              <span
                key={t}
                className="rounded border border-charcoal-700/60 bg-charcoal-950/60 px-2 py-0.5 text-[9px] uppercase tracking-wider text-cream-dim/70"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Symptoms List */}
          <div className="mt-4 rounded-xl border border-charcoal-800/80 bg-charcoal-950/60 p-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-red-300/90 flex items-center gap-1">
              <span>✕</span> Reported Symptoms
            </div>
            <ul className="mt-1.5 space-y-1">
              {caseFile.symptoms.slice(0, expanded ? undefined : 2).map((s, i) => (
                <li key={i} className="text-xs text-cream-dim/75 leading-relaxed flex items-start gap-1.5">
                  <span className="text-red-400/80 text-[10px] mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Diagnosis Badge */}
          <div className="mt-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gold">
              Clinical Diagnosis
            </div>
            <p className="mt-1 text-xs leading-relaxed text-cream-dim/85">
              {caseFile.diagnosis}
            </p>
          </div>

          {/* Expanded Prescription & Result */}
          {expanded && (
            <div className="mt-4 space-y-3 border-t border-charcoal-800 pt-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  Prescription Protocol (Rx)
                </div>
                <ul className="mt-1.5 space-y-1">
                  {caseFile.prescription.map((rx, idx) => (
                    <li key={idx} className="text-xs text-cream-dim/80 flex items-start gap-1.5">
                      <span className="text-emerald-400 text-[10px] mt-0.5">✓</span>
                      <span>{rx}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-gold/30 bg-gold/10 p-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gold">
                  Measured Outcome
                </div>
                <p className="mt-1 text-xs text-cream leading-relaxed">
                  {caseFile.result}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-charcoal-800/80 pt-3 text-xs">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gold hover:text-gold-soft font-medium flex items-center gap-1"
          >
            {expanded ? "Collapse Dossier ↑" : "Expand Full Diagnosis & Rx ↓"}
          </button>

          <Link
            href="/sartorial-executive/checkup"
            className="rounded-full bg-charcoal-800 px-3 py-1.5 text-[11px] font-medium text-cream hover:bg-gold hover:text-charcoal-950 transition"
          >
            Diagnose My Style
          </Link>
        </div>
      </div>
    </div>
  );
}
