"use client";

import { useState } from "react";
import Link from "next/link";
import { formatNaira } from "@/lib/money";

export default function PrescriptionPadPage() {
  const [patientName, setPatientName] = useState("Sterling Ademola");
  const [occupation, setOccupation] = useState("Managing Director / Tech Founder");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
  const [chiefComplaint, setChiefComplaint] = useState("Sub-optimal fit proportions and lack of commanding visual authority in executive summits.");
  const [diagnosis, setDiagnosis] = useState("Acute Proportional Misalignment with Boardroom Invisibility Tendencies.");
  const [treatmentPlan, setTreatmentPlan] = useState("The Sartorial Prescription (7 Outfits / 12-Piece Executive Capsule)");
  const [rxItems, setRxItems] = useState([
    "Rx 1: Obsidian Tailored Blazer — Italian wool soft-shoulder canvass cut precisely to natural acromion width.",
    "Rx 2: Charcoal Wool Trousers — Slim-tapered silhouette with a single-break hemline.",
    "Rx 3: Gold-Stitched Oxford Shirt — Crisp 100% cotton with structured semi-spread collar.",
    "Rx 4: Handcrafted Leather Loafers — Hand-lasted full-grain leather with antique brass buckle.",
    "Rx 5: Sartorial Signature Overcoat — Midnight cashmere-wool double-breasted overcoat.",
  ]);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-800 pb-6">
        <div>
          <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
            CLINICAL ARTIFACT
          </span>
          <h1 className="mt-2 font-display text-3xl text-cream sm:text-4xl">
            The Fashion Clinic Prescription Pad
          </h1>
          <p className="mt-1 text-xs text-cream-dim/70">
            A luxury editorial artifact formulating the exact wardrobe treatment prescribed for an executive client.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft flex items-center gap-1.5"
          >
            <span>🖨️</span> Print Prescription Pad
          </button>
          <Link
            href="/executive-checkup"
            className="rounded-full border border-charcoal-700 bg-charcoal-900 px-4 py-2.5 text-xs font-medium text-cream-dim transition hover:border-gold hover:text-gold"
          >
            Take Checkup
          </Link>
        </div>
      </div>

      {/* Interactive Prescription Pad Document */}
      <div className="mt-10 rounded-3xl border-2 border-gold/40 bg-charcoal-900 p-6 sm:p-12 shadow-lift rx-watermark relative overflow-hidden font-sans">
        {/* Prescription Pad Clinic Header */}
        <div className="border-b-2 border-gold/50 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="font-display text-3xl font-bold tracking-wider text-cream">
              THE FASHION CLINIC
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold mt-1">
              DIAGNOSE &middot; PRESCRIBE &middot; TRANSFORM
            </div>
            <div className="text-[10px] text-cream-dim/60 mt-1">
              Lagos Atelier &middot; Executive Image Consulting &middot; Bespoke Menswear
            </div>
          </div>
          <div className="text-left sm:text-right font-mono text-xs">
            <div className="rounded bg-gold/20 px-2.5 py-1 text-gold font-bold inline-block">
              PATIENT FILE #TFC-8492
            </div>
            <div className="mt-1 text-cream-dim/60 text-[11px]">{date}</div>
          </div>
        </div>

        {/* Patient Demographics Field Table */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-charcoal-800 bg-charcoal-950/70 p-5 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cream-dim/50">PATIENT NAME</span>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="mt-1 w-full bg-transparent font-display text-sm text-cream font-medium border-b border-charcoal-700 pb-1 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cream-dim/50">OCCUPATION / INDUSTRY</span>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="mt-1 w-full bg-transparent text-xs text-cream border-b border-charcoal-700 pb-1 focus:border-gold focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">CHIEF COMPLAINT</span>
            <textarea
              rows={2}
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="mt-1 w-full bg-transparent text-xs text-cream-dim/90 border-b border-charcoal-700 pb-1 focus:border-gold focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold">CLINICAL DIAGNOSIS</span>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="mt-1 w-full bg-transparent font-display text-sm text-gold border-b border-charcoal-700 pb-1 focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Prescription Rx Section */}
        <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-charcoal-950/90 p-6">
          <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-sm font-black text-emerald-400">Rx</span>
              <span className="font-display text-lg text-cream">Prescribed Wardrobe Regimen</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">Dosage &amp; Silhouette</span>
          </div>

          <div className="mt-4 space-y-3">
            {rxItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-charcoal-800 bg-charcoal-900/60 p-3 text-xs text-cream-dim/90">
                <span className="text-emerald-400 font-bold mt-0.5">✦</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...rxItems];
                    newItems[idx] = e.target.value;
                    setRxItems(newItems);
                  }}
                  className="flex-1 bg-transparent text-xs text-cream-dim/90 focus:border-b focus:border-gold focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Plan & Appointment */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-charcoal-800 bg-navy-950/80 p-5 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold">TREATMENT PLAN</span>
            <input
              type="text"
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              className="mt-1 w-full bg-transparent text-xs text-cream font-medium border-b border-charcoal-700 pb-1 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold">NEXT APPOINTMENT / REVIEW</span>
            <div className="mt-1 text-xs text-cream font-medium">30-Day Executive Image Review &middot; Lagos Atelier</div>
          </div>
        </div>

        {/* Signature & Seal */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t-2 border-charcoal-800 pt-6 gap-6">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-cream-dim/40">
              CONFIDENTIAL PATIENT DOSSIER
            </div>
            <div className="text-[10px] text-cream-dim/60 mt-0.5">
              Strictly formulated for executive image transformation &middot; The Fashion Clinic
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-charcoal-800 pt-3 sm:pt-0 sm:pl-6">
            <div className="font-display italic text-base text-cream">Lead Sartorial Consultant</div>
            <div className="text-[10px] uppercase tracking-widest text-gold font-semibold mt-0.5">
              Signed &middot; Executive Image Director
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
