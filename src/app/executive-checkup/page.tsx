"use client";

import { useState } from "react";
import Link from "next/link";
import { evaluateCheckupDiagnosis, type CheckupFormData, type PatientFileResult } from "@/lib/checkup";
import { formatNaira } from "@/lib/money";
import BookingModal from "@/components/BookingModal";

const INITIAL_FORM: CheckupFormData = {
  name: "",
  email: "",
  phone: "",
  profession: "",
  industry: "Finance / Private Equity",
  roleLevel: "c_suite",
  workEnvironment: "Corporate Boardroom",
  travelFrequency: "Frequent International (Monthly)",
  chiefComplaint: "baggy_suits",
  colorPreference: "Midnight Navy & Deep Charcoal",
  fitProblem: "excess_fabric",
  transformationGoal: "c_suite_command",
};

export default function ExecutiveCheckupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CheckupFormData>(INITIAL_FORM);
  const [result, setResult] = useState<PatientFileResult | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (step < 5) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 100, behavior: "smooth" });
    } else {
      const diagResult = evaluateCheckupDiagnosis(form);
      setResult(diagResult);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlePrint() {
    window.print();
  }

  function resetQuiz() {
    setForm(INITIAL_FORM);
    setResult(null);
    setStep(1);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
      {/* Header */}
      {!result && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            THE FASHION CLINIC &middot; DIAGNOSTIC TRIAGE
          </div>
          <h1 className="mt-4 font-display text-3xl text-cream sm:text-5xl">
            The Executive Checkup
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-xs leading-relaxed text-cream-dim/80 sm:text-sm">
            Complete the 5-step clinical assessment. We diagnose your style friction points and formulate your personalized Patient File (#TFC-XXXX) and tailored prescriptions.
          </p>

          {/* Progress Bar */}
          <div className="mt-8 mx-auto max-w-md">
            <div className="flex justify-between text-[11px] font-medium uppercase tracking-wider text-gold">
              <span>Stage 0{step} of 05</span>
              <span>{Math.round((step / 5) * 100)}% Diagnosed</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-charcoal-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-gold transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* QUESTIONNAIRE STEPS */}
      {!result && (
        <form onSubmit={handleNext} className="mt-10 rounded-3xl border border-charcoal-800 bg-charcoal-900 p-6 sm:p-10 shadow-lift">
          {/* STEP 1: DEMOGRAPHICS */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Step 01 &middot; Patient Profile</span>
                <h2 className="mt-1 font-display text-2xl text-cream">Executive Demographics</h2>
                <p className="mt-1 text-xs text-cream-dim/70">Establish your baseline identity for your clinical record.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-wider text-cream-dim/60">Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Sterling Ademola"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-xs text-cream placeholder:text-cream-dim/30 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-cream-dim/60">Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="sterling@executive.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-xs text-cream placeholder:text-cream-dim/30 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-cream-dim/60">Phone / WhatsApp *</label>
                  <input
                    required
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-xs text-cream placeholder:text-cream-dim/30 focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-cream-dim/60">Profession / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Managing Partner / Tech Founder"
                    value={form.profession}
                    onChange={(e) => setForm((f) => ({ ...f, profession: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-xs text-cream placeholder:text-cream-dim/30 focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-wider text-cream-dim/60">Industry Sector</label>
                  <select
                    value={form.industry}
                    onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-xs text-cream focus:border-gold focus:outline-none"
                  >
                    <option value="Finance / Banking / PE">Finance / Banking / Private Equity</option>
                    <option value="Technology & Venture Capital">Technology &amp; Venture Capital</option>
                    <option value="Legal & Advisory Services">Legal &amp; Advisory Services</option>
                    <option value="Energy & Infrastructure">Energy &amp; Infrastructure</option>
                    <option value="Media, Entertainment & Creative">Media, Entertainment &amp; Creative</option>
                    <option value="Healthcare & Life Sciences">Healthcare &amp; Life Sciences</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-cream-dim/60">Leadership Level</label>
                  <select
                    value={form.roleLevel}
                    onChange={(e) => setForm((f) => ({ ...f, roleLevel: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-xs text-cream focus:border-gold focus:outline-none"
                  >
                    <option value="founder">Founder / Chief Executive (CEO)</option>
                    <option value="c_suite">C-Suite Executive / Managing Director</option>
                    <option value="partner">Senior Partner / VP / Director</option>
                    <option value="senior_manager">Senior Manager / Principal</option>
                    <option value="emerging_leader">Emerging Executive / Consultant</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LIFESTYLE & WORK ENVIRONMENT */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Step 02 &middot; Environmental Stressors</span>
                <h2 className="mt-1 font-display text-2xl text-cream">Workplace &amp; Lifestyle Dynamics</h2>
                <p className="mt-1 text-xs text-cream-dim/70">Where does your wardrobe encounter the greatest scrutiny?</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: "Corporate Boardroom", label: "Formal Corporate Boardrooms", desc: "High-stakes meetings, international institutional investors, formal suit-and-tie protocols." },
                  { id: "Executive Smart Casual", label: "Executive Smart Casual / Hybrid", desc: "Modern tech/finance culture where unstructured tailoring, bespoke kaftans, and luxury knits dominate." },
                  { id: "Keynotes & Media Appearances", label: "Keynotes, Media & Public Speaking", desc: "High-visibility stage lights, broadcast television, and conference panels requiring non-reflective, commanding attire." },
                  { id: "Black-Tie & High Society Galas", label: "Black-Tie & High Society Galas", desc: "Formal banquets, state dinners, luxury weddings, and evening receptions." },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, workEnvironment: item.id }))}
                    className={`w-full text-left rounded-xl border p-4 transition ${
                      form.workEnvironment === item.id
                        ? "border-gold bg-navy-950 shadow-sm"
                        : "border-charcoal-700 bg-charcoal-950 hover:border-gold/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm text-cream">{item.label}</span>
                      {form.workEnvironment === item.id && <span className="text-xs text-gold">Selected ✓</span>}
                    </div>
                    <p className="mt-1 text-xs text-cream-dim/70">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: CHIEF COMPLAINT */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Step 03 &middot; Symptom Triage</span>
                <h2 className="mt-1 font-display text-2xl text-cream">Chief Style Complaint</h2>
                <p className="mt-1 text-xs text-cream-dim/70">What primary aesthetic flaw or friction do you experience most severely?</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: "baggy_suits", title: "Baggy Suit Syndrome & Proportional Misalignment", desc: "Swimming in off-the-rack fabric, collapsing shoulder lines, and excessive trouser break diminishing height." },
                  { id: "lack_of_authority", title: "Boardroom Invisibility & Lack of Visual Presence", desc: "Dressed like everyone else; ideas overlooked due to absence of distinct executive authority." },
                  { id: "decision_fatigue", title: "Full Wardrobe With Nothing Cohesive to Wear", desc: "Closet overflowing with disparate impulse items that resist effortless pairing." },
                  { id: "upcoming_event", title: "Urgent Upcoming Event / High-Stakes Milestone", desc: "Imminent wedding, media appearance, or promotion needing immediate 24-hr style resolution." },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, chiefComplaint: item.id }))}
                    className={`w-full text-left rounded-xl border p-4 transition ${
                      form.chiefComplaint === item.id
                        ? "border-red-400/80 bg-red-950/20 shadow-sm"
                        : "border-charcoal-700 bg-charcoal-950 hover:border-gold/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm text-cream">{item.title}</span>
                      {form.chiefComplaint === item.id && <span className="text-xs text-red-300">Diagnosed Flaw</span>}
                    </div>
                    <p className="mt-1 text-xs text-cream-dim/70">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: COLOR & FIT PREFERENCES */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Step 04 &middot; Anatomical Palette</span>
                <h2 className="mt-1 font-display text-2xl text-cream">Proportions &amp; Undertones</h2>
                <p className="mt-1 text-xs text-cream-dim/70">Select your preferred color discipline and tailored drape profile.</p>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-cream-dim/60">Preferred Color Discipline</label>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {[
                    "Midnight Navy & Deep Charcoal",
                    "Monochromatic Black & Gunmetal",
                    "Warm Earth: Camel, Olive & Umber",
                    "Ivory, Raw Silk & Gold Accents",
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, colorPreference: color }))}
                      className={`p-3 text-left rounded-xl border text-xs transition ${
                        form.colorPreference === color
                          ? "border-gold bg-navy-950 text-cream font-medium"
                          : "border-charcoal-700 bg-charcoal-950 text-cream-dim hover:border-gold/40"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-cream-dim/60">Anatomical Fit Challenge</label>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {[
                    { id: "excess_fabric", label: "Broad shoulders, slim waist (Jackets too baggy around waist)" },
                    { id: "tight_shoulders", label: "Athletic broad chest (Jackets pull across back)" },
                    { id: "trouser_pooling", label: "Trouser break issues (Pants pooling over shoes)" },
                    { id: "sleeve_length", label: "Sleeve length discrepancy (Shirt cuffs completely buried)" },
                  ].map((fit) => (
                    <button
                      key={fit.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, fitProblem: fit.id }))}
                      className={`p-3 text-left rounded-xl border text-xs transition ${
                        form.fitProblem === fit.id
                          ? "border-gold bg-navy-950 text-cream font-medium"
                          : "border-charcoal-700 bg-charcoal-950 text-cream-dim hover:border-gold/40"
                      }`}
                    >
                      {fit.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: TRANSFORMATION GOAL */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Step 05 &middot; Target Outcome</span>
                <h2 className="mt-1 font-display text-2xl text-cream">Executive Objective</h2>
                <p className="mt-1 text-xs text-cream-dim/70">What ultimate outcome should your personalized prescription unlock?</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: "c_suite_command", title: "Complete Sartorial Executive Authority", desc: "A total visual transformation for high-level boardroom mastery and global executive respect." },
                  { id: "modular_capsule", title: "Effortless 7-Day / 12-Piece Capsule Wardrobe", desc: "A perfectly interchangeable wardrobe delivering 20+ complete outfits with zero decision fatigue." },
                  { id: "urgent_event", title: "High-Stakes Milestone / Media Appearance Execution", desc: "Flawless styling for an imminent speaking event, wedding, pitch, or gala." },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, transformationGoal: item.id }))}
                    className={`w-full text-left rounded-xl border p-4 transition ${
                      form.transformationGoal === item.id
                        ? "border-emerald-400 bg-emerald-950/20 shadow-sm"
                        : "border-charcoal-700 bg-charcoal-950 hover:border-gold/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm text-cream">{item.title}</span>
                      {form.transformationGoal === item.id && <span className="text-xs text-emerald-400">Selected ✓</span>}
                    </div>
                    <p className="mt-1 text-xs text-cream-dim/70">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FORM NAVIGATION BUTTONS */}
          <div className="mt-10 flex items-center justify-between border-t border-charcoal-800 pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-full border border-charcoal-700 px-6 py-2.5 text-xs text-cream-dim transition hover:border-gold hover:text-gold"
              >
                &larr; Previous Stage
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="rounded-full bg-gold px-8 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-950 shadow-gold transition hover:bg-gold-soft hover:scale-[1.02]"
            >
              {step === 5 ? "Generate Patient File & Prescription &rarr;" : "Next Stage &rarr;"}
            </button>
          </div>
        </form>
      )}

      {/* PATIENT FILE & PRESCRIPTION RESULTS */}
      {result && (
        <div className="space-y-8 animate-fade-in">
          {/* Action Bar (Print / Retake) */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal-800 pb-4">
            <div>
              <span className="rounded bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold uppercase tracking-widest">
                OFFICIAL PATIENT RECORD
              </span>
              <h2 className="font-display text-2xl text-cream mt-1">Patient File: {result.patientRef}</h2>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-full border border-charcoal-700 bg-charcoal-900 px-4 py-2 text-xs text-cream-dim transition hover:border-gold hover:text-gold flex items-center gap-1.5"
              >
                <span>🖨️</span> Print Patient Dossier
              </button>
              <button
                type="button"
                onClick={resetQuiz}
                className="rounded-full border border-charcoal-700 px-4 py-2 text-xs text-cream-dim transition hover:text-cream"
              >
                New Assessment
              </button>
            </div>
          </div>

          {/* THE STRUCTURED PATIENT FILE (EDITORIAL PRESCRIPTION PAD LAYOUT) */}
          <div className="rounded-3xl border border-gold/50 bg-charcoal-900 p-6 sm:p-10 shadow-lift rx-watermark relative overflow-hidden font-sans">
            {/* Header Header Seal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-gold/40 pb-6 gap-4">
              <div>
                <div className="font-display text-2xl font-bold tracking-wider text-cream">THE FASHION CLINIC</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold">Diagnose &middot; Prescribe &middot; Transform</div>
              </div>
              <div className="text-left sm:text-right text-xs">
                <div className="font-mono text-gold font-bold">{result.patientRef}</div>
                <div className="text-cream-dim/60 text-[11px]">{result.date}</div>
              </div>
            </div>

            {/* Patient Header Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-charcoal-800 bg-charcoal-950/80 p-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cream-dim/50">PATIENT NAME</span>
                <div className="font-display text-sm text-cream mt-0.5">{result.patientName}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cream-dim/50">PROFESSION / INDUSTRY</span>
                <div className="text-cream mt-0.5">{result.profession} &middot; {result.industry}</div>
              </div>
              <div className="col-span-2 border-t border-charcoal-800/80 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">CHIEF COMPLAINT</span>
                <div className="text-cream font-medium mt-0.5">{result.chiefComplaint}</div>
              </div>
            </div>

            {/* Clinical Diagnosis Block */}
            <div className="mt-6 rounded-2xl border border-gold/30 bg-navy-950/90 p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold">
                <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                CLINICAL DIAGNOSIS
              </div>
              <p className="mt-2 font-display text-base text-cream leading-relaxed">
                {result.clinicalDiagnosis}
              </p>
              <div className="mt-4 border-t border-charcoal-800 pt-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-cream-dim/50">IDENTIFIED SYMPTOMS</div>
                <ul className="mt-2 space-y-1 text-xs text-cream-dim/80">
                  {result.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-red-400">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prescription Protocol (Rx) */}
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-charcoal-950 p-6">
              <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">Rx</span>
                  <span className="font-display text-base text-cream">Sartorial Prescription Protocol</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-emerald-400">Tailored Regimen</span>
              </div>
              <div className="mt-4 space-y-3">
                {result.prescriptionRx.map((rx, idx) => (
                  <div key={idx} className="rounded-xl border border-charcoal-800/80 bg-charcoal-900/60 p-3 text-xs text-cream-dim/90 flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold mt-0.5">✦</span>
                    <span className="leading-relaxed">{rx}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Clinical Treatment Service */}
            <div className="mt-6 rounded-2xl border border-gold/40 bg-gradient-to-r from-navy-950 to-charcoal-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                  RECOMMENDED CLINICAL TREATMENT
                </span>
                <h3 className="mt-1 font-display text-xl text-cream">{result.treatmentPlan.serviceName}</h3>
                <p className="mt-1 text-xs text-cream-dim/80 max-w-md">{result.treatmentPlan.description}</p>
                <div className="mt-2 text-xs text-gold font-medium">Timeline: {result.treatmentPlan.timeline}</div>
              </div>
              <div className="text-left sm:text-right">
                <div className="font-display text-2xl text-gold">{formatNaira(result.treatmentPlan.priceNaira)}</div>
                <button
                  type="button"
                  onClick={() => setBookingOpen(true)}
                  className="mt-3 rounded-full bg-gold px-6 py-3 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:scale-105 hover:bg-gold-soft"
                >
                  Book This Treatment
                </button>
              </div>
            </div>

            {/* Signoff */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-charcoal-800 pt-4 text-xs text-cream-dim/60 gap-2">
              <span className="text-[10px] uppercase tracking-widest">CONFIDENTIAL PATIENT RECORD &middot; STRICTLY FOR EXECUTIVE WARDROBE TRANSFORMATION</span>
              <span className="font-display italic text-cream">{result.consultantSignoff}</span>
            </div>
          </div>

          {/* Booking Modal Instance */}
          <BookingModal
            isOpen={bookingOpen}
            onClose={() => setBookingOpen(false)}
            initialServiceSlug={result.treatmentPlan.serviceSlug}
            initialServiceName={result.treatmentPlan.serviceName}
            initialPrice={result.treatmentPlan.priceNaira}
          />
        </div>
      )}
    </div>
  );
}
