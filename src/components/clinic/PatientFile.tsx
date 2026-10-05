"use client";

import { m } from "motion/react";
import { formatNaira } from "@/lib/money";
import type { PatientFileResult } from "@/lib/checkup";
import type { PrescriptionPadSettings } from "@/lib/site-settings";
import { EXPO } from "@/components/motion/Rise";

/**
 * The Patient File assembling on screen, like a document being completed in
 * front of you: ivory paper settles, the clinic header prints, the patient's
 * name types in, each presenting symptom ticks off, the prescription lines
 * appear, the recommended treatment is entered, and the green PRESCRIBED
 * stamp presses in last. Printable as it stands.
 */
export default function PatientFile({
  result,
  pad,
  price,
  deposit,
  serviceName,
}: {
  result: PatientFileResult;
  pad: PrescriptionPadSettings;
  price: number;
  deposit: number;
  serviceName: string;
}) {
  const nameChars = result.patientName.split("");
  const T = {
    paper: 0,
    header: 0.35,
    name: 0.7,
    nameDone: 0.7 + nameChars.length * 0.045,
  };
  const afterName = T.nameDone + 0.2;
  const symptomsStart = afterName + 0.5;
  const rxStart = symptomsStart + result.symptoms.length * 0.25 + 0.3;
  const planStart = rxStart + result.prescriptionRx.length * 0.18 + 0.3;
  const stampAt = planStart + 0.6;

  const fade = (delay: number, y = 10) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EXPO, delay },
  });

  return (
    <m.article
      className="paper relative mx-auto w-full max-w-3xl overflow-hidden px-6 py-8 sm:px-10 sm:py-12"
      initial={{ opacity: 0, y: 40, rotate: -0.6 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, ease: EXPO }}
      aria-label={`Patient file ${result.patientRef}`}
    >
      {/* Header */}
      <m.header {...fade(T.header)} className="paper-rule flex flex-col justify-between gap-3 border-b-2 pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="font-display text-2xl leading-none text-[#0e1a2b] sm:text-3xl">{pad.clinicName}</div>
          <div className="paper-muted mt-1.5 text-[11px] tracking-[0.18em] uppercase">{pad.tagline}</div>
        </div>
        <div className="font-mono text-xs sm:text-right">
          <div className="text-[#0e1a2b]">FILE {result.patientRef}</div>
          <div className="paper-muted">{result.date}</div>
        </div>
      </m.header>

      {/* Patient */}
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <m.div {...fade(T.name - 0.1, 0)}>
          <dt className="paper-muted text-[11px] tracking-[0.14em] uppercase">Patient</dt>
          <dd className="mt-1 font-display text-2xl text-[#0e1a2b]" aria-label={result.patientName}>
            <m.span initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: T.name } } }} aria-hidden>
              {nameChars.map((ch, i) => (
                <m.span key={i} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.01 } } }}>
                  {ch}
                </m.span>
              ))}
            </m.span>
            <m.span className="caret inline-block" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: afterName + 1.2, duration: 0.2 }} aria-hidden />
          </dd>
        </m.div>
        <m.div {...fade(afterName, 0)}>
          <dt className="paper-muted text-[11px] tracking-[0.14em] uppercase">Occupation</dt>
          <dd className="mt-1 text-[#0e1a2b]">
            {result.profession} · {result.industry}
          </dd>
        </m.div>
        <m.div {...fade(afterName + 0.15, 0)} className="sm:col-span-2">
          <dt className="paper-muted text-[11px] tracking-[0.14em] uppercase">Chief complaint</dt>
          <dd className="mt-1 text-[#0e1a2b]">{result.chiefComplaint}</dd>
        </m.div>
      </dl>

      {/* Diagnosis */}
      <m.section {...fade(afterName + 0.3)} className="paper-rule mt-7 border-t pt-5">
        <h2 className="paper-muted text-[11px] tracking-[0.14em] uppercase">Diagnosis</h2>
        <p className="mt-2 font-display text-xl leading-snug text-[#0e1a2b] sm:text-2xl">{result.clinicalDiagnosis}</p>
        <ul className="mt-4 space-y-2">
          {result.symptoms.map((s, i) => {
            const d = symptomsStart + i * 0.25;
            return (
              <li key={i} className="flex items-start gap-3 text-sm text-[#0e1a2b]">
                <svg width="16" height="16" viewBox="0 0 16 16" className="mt-0.5 shrink-0" aria-hidden>
                  <rect x="0.75" y="0.75" width="14.5" height="14.5" rx="2" fill="none" stroke="#0e1a2b" strokeOpacity="0.45" />
                  <m.path
                    d="M3.5 8.3l2.9 2.9L12.5 5"
                    fill="none"
                    stroke="var(--brand-mark)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: EXPO, delay: d }}
                  />
                </svg>
                <m.span {...fade(d - 0.15, 4)}>{s}</m.span>
              </li>
            );
          })}
        </ul>
      </m.section>

      {/* Prescription */}
      <m.section {...fade(rxStart - 0.2)} className="paper-rule mt-7 border-t pt-5">
        <h2 className="flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase">
          <span className="rounded-sm border border-mark px-1.5 py-0.5 font-mono text-[10px] font-bold text-mark">Rx</span>
          <span className="paper-muted">Prescription</span>
        </h2>
        <ol className="mt-3 space-y-2.5">
          {result.prescriptionRx.map((rx, i) => (
            <m.li key={i} {...fade(rxStart + i * 0.18, 8)} className="flex gap-3 text-sm leading-relaxed text-[#0e1a2b]">
              <span className="paper-muted font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
              <span>{rx}</span>
            </m.li>
          ))}
        </ol>
      </m.section>

      {/* Treatment plan */}
      <m.section {...fade(planStart)} className="paper-rule mt-7 border-t pt-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="paper-muted text-[11px] tracking-[0.14em] uppercase">Recommended treatment</h2>
            <p className="mt-1 font-display text-2xl text-[#0e1a2b] sm:text-3xl">{serviceName}</p>
            <p className="paper-muted mt-1 max-w-md text-sm">{result.treatmentPlan.description}</p>
            <p className="paper-muted mt-1 text-xs">{result.treatmentPlan.timeline}</p>
          </div>
          <dl className="shrink-0 text-sm sm:text-right">
            <dt className="paper-muted text-[11px] tracking-[0.14em] uppercase">Fee</dt>
            <dd className="font-display text-2xl text-[#0e1a2b]">{formatNaira(price)}</dd>
            <dt className="paper-muted mt-2 text-[11px] tracking-[0.14em] uppercase">Deposit to book</dt>
            <dd className="text-[#0e1a2b]">{formatNaira(deposit)}</dd>
          </dl>
        </div>
      </m.section>

      {/* Signoff */}
      <m.footer {...fade(stampAt - 0.3)} className="paper-rule mt-8 flex items-end justify-between gap-6 border-t pt-5">
        <div className="paper-muted max-w-xs text-[10px] leading-relaxed">{pad.disclaimer}</div>
        <div className="text-right">
          <div className="font-display text-lg italic text-[#0e1a2b]">{pad.consultantName}</div>
          <div className="paper-muted text-[10px] tracking-[0.14em] uppercase">{pad.consultantTitle}</div>
        </div>
      </m.footer>

      {/* The stamp presses in last */}
      <m.div
        className="pointer-events-none absolute right-6 top-24 sm:right-12 sm:top-28"
        initial={{ opacity: 0, scale: 1.9, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: stampAt, type: "spring", stiffness: 520, damping: 28, mass: 0.6 }}
        aria-hidden
      >
        <span className="stamp text-sm sm:text-base">Prescribed</span>
      </m.div>
    </m.article>
  );
}
