"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import type { CheckupFormData, PatientFileResult } from "@/lib/checkup";
import { submitCheckupAction } from "@/lib/actions/checkup";
import { BRANDS, brandHref } from "@/lib/brands";
import { whatsappLink, type ContactSettings } from "@/lib/contact";
import type { PrescriptionPadSettings } from "@/lib/site-settings";
import { depositOf, type BookableService } from "@/lib/booking-options";
import { formatNaira } from "@/lib/money";
import { EXPO } from "@/components/motion/Rise";
import BookingModal from "@/components/BookingModal";
import PatientFile from "@/components/clinic/PatientFile";

const S = BRANDS.sartorial;

const INITIAL: CheckupFormData = {
  name: "",
  email: "",
  phone: "",
  profession: "",
  industry: "Finance / Banking / PE",
  roleLevel: "c_suite",
  workEnvironment: "",
  travelFrequency: "",
  chiefComplaint: "",
  colorPreference: "Midnight Navy & Deep Charcoal",
  fitProblem: "",
  transformationGoal: "c_suite_command",
  budgetBand: "",
};

type Option = { value: string; title: string; desc?: string };

const ROOMS: Option[] = [
  { value: "Corporate Boardroom", title: "Formal boardrooms", desc: "Institutional investors. Suit and tie, no exceptions." },
  { value: "Executive Smart Casual", title: "Executive smart casual", desc: "Unstructured tailoring, kaftans, fine knits." },
  { value: "Keynotes & Media Appearances", title: "Keynotes and cameras", desc: "Stage lights and broadcast. Nothing that shines or shouts." },
  { value: "Black-Tie & High Society Galas", title: "Black tie and galas", desc: "State dinners, weddings, evening receptions." },
];
const SHAPES: Option[] = [
  { value: "excess_fabric", title: "Broad shoulders, slim waist", desc: "Jackets bag at the waist." },
  { value: "tight_shoulders", title: "Athletic chest", desc: "Jackets pull across the back." },
  { value: "trouser_pooling", title: "Long in the body, shorter in the leg", desc: "Trousers pool over the shoe." },
  { value: "sleeve_length", title: "Long arms", desc: "Sleeves too long. Cuffs disappear." },
];
const FRUSTRATIONS: Option[] = [
  { value: "baggy_suits", title: "My suits swim on me", desc: "Off-the-rack fabric, collapsing shoulders." },
  { value: "lack_of_authority", title: "I look like everyone else in the room", desc: "Dressed safely. Ideas overlooked." },
  { value: "decision_fatigue", title: "A full wardrobe and nothing to wear", desc: "Impulse pieces that refuse to combine." },
  { value: "upcoming_event", title: "Something important is coming", desc: "A wedding, interview, pitch or appearance, soon." },
];
const BUDGETS: Option[] = [
  { value: "50-120", title: "₦50,000 to ₦120,000", desc: "A diagnosis, or a detox of what you own." },
  { value: "120-250", title: "₦120,000 to ₦250,000", desc: "A full prescription: seven outfits for seven days." },
  { value: "250-400", title: "₦250,000 to ₦400,000", desc: "A thirty-day transformation." },
  { value: "400+", title: "₦400,000 and above", desc: "Everything, managed." },
];
const LEVELS: Option[] = [
  { value: "founder", title: "Founder or chief executive" },
  { value: "c_suite", title: "C-suite or managing director" },
  { value: "partner", title: "Partner, VP or director" },
  { value: "senior_manager", title: "Senior manager or principal" },
  { value: "emerging_leader", title: "Emerging executive" },
];

const STEPS = ["Who you are", "Your occupation", "The rooms you command", "Your build", "What frustrates you", "Your budget"] as const;

const inputCls = "mt-2 w-full border-b border-line bg-transparent py-3 font-display text-2xl text-fg placeholder:text-fg-muted/30 focus:border-accent focus:outline-none sm:text-3xl";

function Choices({ options, value, onPick, name }: { options: Option[]; value: string; onPick: (v: string) => void; name: string }) {
  return (
    <div className="mt-8 divide-y divide-line border-y border-line" role="radiogroup" aria-label={name}>
      {options.map((o, i) => {
        const on = value === o.value;
        return (
          <m.button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onPick(o.value)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EXPO, delay: 0.15 + i * 0.06 }}
            className="group flex w-full items-center justify-between gap-6 py-5 text-left"
          >
            <span>
              <span className={`block font-display text-xl transition-colors sm:text-2xl ${on ? "text-accent" : "text-fg group-hover:text-accent"}`}>{o.title}</span>
              {o.desc && <span className="mt-1 block text-sm text-fg-muted/70">{o.desc}</span>}
            </span>
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${on ? "border-mark bg-mark text-bg" : "border-line text-transparent group-hover:border-accent"}`} aria-hidden>
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M1 5l3.5 3.5L11 1" />
              </svg>
            </span>
          </m.button>
        );
      })}
    </div>
  );
}

/**
 * The Executive Checkup: one question at a time, each sliding in as the
 * last leaves, then the Patient File assembling on screen. The diagnosis
 * runs on the server and every completed checkup is saved.
 */
export default function ExecutiveCheckup({ services, contact, pad }: { services: BookableService[]; contact: ContactSettings; pad: PrescriptionPadSettings }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<CheckupFormData>(INITIAL);
  const [result, setResult] = useState<PatientFileResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);

  const set = <K extends keyof CheckupFormData>(key: K, value: CheckupFormData[K]) => setForm((f) => ({ ...f, [key]: value }));
  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const pickAndAdvance = <K extends keyof CheckupFormData>(key: K, value: CheckupFormData[K]) => {
    set(key, value);
    if (step < STEPS.length - 1) setTimeout(() => go(step + 1), 380);
  };

  async function finish() {
    setSubmitting(true);
    setError(null);
    const goal = form.budgetBand === "400+" || form.budgetBand === "250-400" ? "c_suite_command" : form.chiefComplaint === "upcoming_event" ? "urgent_event" : "modular_capsule";
    try {
      const r = await submitCheckupAction({ ...form, transformationGoal: goal });
      setResult(r);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not write your file. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const canContinue = (() => {
    switch (step) {
      case 0:
        return form.name.trim() && form.email.trim() && form.phone.trim();
      case 1:
        return form.profession.trim() && form.roleLevel;
      case 2:
        return !!form.workEnvironment;
      case 3:
        return !!form.fitProblem;
      case 4:
        return !!form.chiefComplaint;
      case 5:
        return !!form.budgetBand;
      default:
        return false;
    }
  })();

  if (result) {
    const recommended = services.find((s) => s.slug === result.treatmentPlan.serviceSlug);
    const price = recommended?.price ?? result.treatmentPlan.priceNaira;
    const deposit = recommended ? depositOf(recommended) : Math.round(price / 2);
    const serviceName = recommended?.name ?? result.treatmentPlan.serviceName;
    const wa = whatsappLink(contact.whatsappNumber, `Hello Sartorial Executive, my checkup (${result.patientRef}) recommended ${serviceName}. I would like to talk it through.`);

    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-16">
        <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="case-number text-xs">PATIENT FILE {result.patientRef}</span>
            <h1 className="mt-1 font-display text-3xl text-fg sm:text-4xl">Your file is ready</h1>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <button type="button" onClick={() => window.print()} className="link-line text-fg-muted hover:text-fg">
              Print
            </button>
            <button type="button" onClick={() => window.print()} className="link-line text-fg-muted hover:text-fg" title="Choose “Save as PDF” in the print dialog">
              Save as PDF
            </button>
            <button type="button" onClick={() => { setResult(null); setForm(INITIAL); setStep(0); }} className="link-line text-fg-muted hover:text-fg">
              Start again
            </button>
          </div>
        </div>

        <PatientFile result={result} pad={pad} price={price} deposit={deposit} serviceName={serviceName} />

        <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.7, ease: EXPO }} className="no-print mx-auto mt-8 flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-fg-muted/80">
            Book {serviceName} with a {formatNaira(deposit)} deposit, or talk it through first.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setBooking(true)} className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-6 py-3 text-sm font-medium text-bg">
              Pay deposit
            </button>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-sheen relative inline-flex items-center overflow-hidden border border-fg/40 px-6 py-3 text-sm text-fg">
              Talk on WhatsApp
            </a>
          </div>
        </m.div>

        <p className="no-print mt-8 text-center text-sm text-fg-muted/70">
          See how others were treated in the{" "}
          <Link href={brandHref(S, "/case-files")} className="link-line text-fg">
            case files
          </Link>
          .
        </p>

        <BookingModal isOpen={booking} onClose={() => setBooking(false)} services={services} contact={contact} initialServiceSlug={result.treatmentPlan.serviceSlug} checkupRef={result.patientRef} />
      </div>
    );
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -40 }),
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-fg-muted/60">
        <span>THE EXECUTIVE CHECKUP</span>
        <span>
          {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-3 h-px w-full bg-line" aria-hidden>
        <m.div className="h-full origin-left bg-accent" animate={{ scaleX: (step + 1) / STEPS.length }} transition={{ duration: 0.6, ease: EXPO }} />
      </div>

      <div className="relative mt-10 min-h-[26rem]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <m.div key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: EXPO }}>
            <p className="text-sm text-fg-muted/60">{STEPS[step]}</p>

            {step === 0 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (canContinue) go(1);
                }}
              >
                <h1 className="mt-3 font-display text-4xl leading-tight text-fg sm:text-5xl">Let&rsquo;s open your file.</h1>
                <div className="mt-8 space-y-6">
                  <div>
                    <label htmlFor="ck-name" className="text-xs text-fg-muted/60">Full name</label>
                    <input id="ck-name" required autoComplete="name" autoFocus value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Your name" />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ck-email" className="text-xs text-fg-muted/60">Email</label>
                      <input id="ck-email" required type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls + " !text-xl"} placeholder="you@company.com" />
                    </div>
                    <div>
                      <label htmlFor="ck-phone" className="text-xs text-fg-muted/60">Phone or WhatsApp</label>
                      <input id="ck-phone" required type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls + " !text-xl"} placeholder="+234" />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {step === 1 && (
              <div>
                <h1 className="mt-3 font-display text-4xl leading-tight text-fg sm:text-5xl">What do you do, and at what level?</h1>
                <div className="mt-8">
                  <label htmlFor="ck-profession" className="text-xs text-fg-muted/60">Profession or title</label>
                  <input id="ck-profession" autoFocus value={form.profession} onChange={(e) => set("profession", e.target.value)} className={inputCls} placeholder="Managing partner, founder, senior advocate" />
                </div>
                <Choices name="Level" options={LEVELS} value={form.roleLevel} onPick={(v) => set("roleLevel", v)} />
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className="mt-3 font-display text-4xl leading-tight text-fg sm:text-5xl">Which rooms do you need to command?</h1>
                <Choices name="Rooms" options={ROOMS} value={form.workEnvironment} onPick={(v) => pickAndAdvance("workEnvironment", v)} />
              </div>
            )}

            {step === 3 && (
              <div>
                <h1 className="mt-3 font-display text-4xl leading-tight text-fg sm:text-5xl">Where does tailoring usually fail you?</h1>
                <Choices name="Build" options={SHAPES} value={form.fitProblem} onPick={(v) => pickAndAdvance("fitProblem", v)} />
              </div>
            )}

            {step === 4 && (
              <div>
                <h1 className="mt-3 font-display text-4xl leading-tight text-fg sm:text-5xl">What frustrates you most?</h1>
                <Choices name="Frustration" options={FRUSTRATIONS} value={form.chiefComplaint} onPick={(v) => pickAndAdvance("chiefComplaint", v)} />
              </div>
            )}

            {step === 5 && (
              <div>
                <h1 className="mt-3 font-display text-4xl leading-tight text-fg sm:text-5xl">What are you prepared to invest?</h1>
                <Choices name="Budget" options={BUDGETS} value={form.budgetBand ?? ""} onPick={(v) => set("budgetBand", v)} />
              </div>
            )}

            {error && <p className="mt-6 text-sm text-fg-muted">{error}</p>}

            <div className="mt-10 flex items-center justify-between">
              {step > 0 ? (
                <button type="button" onClick={() => go(step - 1)} className="link-line text-sm text-fg-muted hover:text-fg">
                  Back
                </button>
              ) : (
                <span />
              )}
              {step < STEPS.length - 1 ? (
                <button type="button" disabled={!canContinue} onClick={() => go(step + 1)} className="btn-sheen relative inline-flex items-center gap-3 overflow-hidden bg-fg px-6 py-3 text-sm font-medium text-bg disabled:opacity-40">
                  Continue
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                    <path d="M0 5h14M10 1l4 4-4 4" />
                  </svg>
                </button>
              ) : (
                <button type="button" disabled={!canContinue || submitting} onClick={finish} className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-6 py-3 text-sm font-medium text-bg disabled:opacity-40">
                  {submitting ? "Writing your file…" : "Write my Patient File"}
                </button>
              )}
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
