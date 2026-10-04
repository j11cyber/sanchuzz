"use client";

import { useState } from "react";
import Link from "next/link";
import type { CheckupFormData, PatientFileResult } from "@/lib/checkup";
import { submitCheckupAction } from "@/lib/actions/checkup";
import { formatNaira } from "@/lib/money";
import { BRANDS, brandHref } from "@/lib/brands";
import { whatsappLink, type ContactSettings } from "@/lib/contact";
import type { PrescriptionPadSettings } from "@/lib/site-settings";
import BookingModal from "@/components/BookingModal";
import { depositOf, type BookableService } from "@/lib/booking-options";

const S = BRANDS.sartorial;

const INITIAL_FORM: CheckupFormData = {
  name: "",
  email: "",
  phone: "",
  profession: "",
  industry: "Finance / Banking / PE",
  roleLevel: "c_suite",
  workEnvironment: "Corporate Boardroom",
  travelFrequency: "Frequent International (Monthly)",
  chiefComplaint: "baggy_suits",
  colorPreference: "Midnight Navy & Deep Charcoal",
  fitProblem: "excess_fabric",
  transformationGoal: "c_suite_command",
};

const input =
  "mt-1.5 w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-muted/30 focus:border-accent focus:outline-none";
const label = "text-xs text-fg-muted/60";

function Choice({ selected, onSelect, title, desc }: { selected: boolean; onSelect: () => void; title: string; desc?: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`w-full rounded-xl border p-4 text-left transition ${selected ? "border-accent bg-deep" : "border-line bg-bg hover:border-accent/50"}`}
    >
      <span className="font-display text-base text-fg">{title}</span>
      {desc && <p className="mt-1 text-xs text-fg-muted/70">{desc}</p>}
    </button>
  );
}

/**
 * The Executive Checkup: five questions, then a Patient File with a diagnosis
 * and a recommended treatment. The diagnosis runs on the server and every
 * completed checkup is saved. Phase 7 refaces the document.
 */
export default function ExecutiveCheckup({
  services,
  contact,
  pad,
}: {
  services: BookableService[];
  contact: ContactSettings;
  pad: PrescriptionPadSettings;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CheckupFormData>(INITIAL_FORM);
  const [result, setResult] = useState<PatientFileResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (step < 5) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const r = await submitCheckupAction(form);
      setResult(r);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not write your file. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setForm(INITIAL_FORM);
    setResult(null);
    setError(null);
    setStep(1);
  }

  const set = <K extends keyof CheckupFormData>(key: K, value: CheckupFormData[K]) => setForm((f) => ({ ...f, [key]: value }));

  if (result) {
    const recommended = services.find((s) => s.slug === result.treatmentPlan.serviceSlug);
    const price = recommended?.price ?? result.treatmentPlan.priceNaira;
    const serviceName = recommended?.name ?? result.treatmentPlan.serviceName;
    const deposit = recommended ? depositOf(recommended) : Math.round(price / 2);

    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
        <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <h1 className="font-display text-3xl text-fg">Patient file {result.patientRef}</h1>
          <div className="flex gap-3">
            <button type="button" onClick={() => window.print()} className="rounded-full border border-line px-4 py-2 text-sm text-fg-muted transition hover:border-accent hover:text-accent">
              Print
            </button>
            <button type="button" onClick={reset} className="rounded-full border border-line px-4 py-2 text-sm text-fg-muted transition hover:text-fg">
              Start again
            </button>
          </div>
        </div>

        <article className="rx-watermark relative mt-8 overflow-hidden rounded-3xl border border-accent/50 bg-surface p-6 sm:p-10">
          <header className="flex flex-col justify-between gap-4 border-b-2 border-accent/40 pb-6 sm:flex-row sm:items-center">
            <div>
              <div className="font-display text-2xl text-fg">{pad.clinicName}</div>
              <div className="text-xs text-accent">{pad.tagline}</div>
            </div>
            <div className="text-sm sm:text-right">
              <div className="font-mono text-mark">{result.patientRef}</div>
              <div className="text-xs text-fg-muted/60">{result.date}</div>
            </div>
          </header>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-line bg-bg/80 p-4 text-sm">
            <div>
              <dt className="text-xs text-fg-muted/50">Patient</dt>
              <dd className="mt-0.5 font-display text-base text-fg">{result.patientName}</dd>
            </div>
            <div>
              <dt className="text-xs text-fg-muted/50">Profession</dt>
              <dd className="mt-0.5 text-fg">
                {result.profession} · {result.industry}
              </dd>
            </div>
            <div className="col-span-2 border-t border-line/80 pt-2">
              <dt className="text-xs text-fg-muted/50">Chief complaint</dt>
              <dd className="mt-0.5 text-fg">{result.chiefComplaint}</dd>
            </div>
          </dl>

          <section className="mt-6 rounded-2xl border border-accent/30 bg-deep/90 p-5">
            <h2 className="text-xs text-accent">Diagnosis</h2>
            <p className="mt-2 font-display text-lg leading-relaxed text-fg">{result.clinicalDiagnosis}</p>
            <div className="mt-4 border-t border-line pt-3">
              <h3 className="text-xs text-fg-muted/50">Symptoms</h3>
              <ul className="mt-2 space-y-1 text-sm text-fg-muted/80">
                {result.symptoms.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-mark/30 bg-bg p-6">
            <div className="flex items-center gap-3 border-b border-line pb-3">
              <span className="rounded bg-mark/15 px-2 py-0.5 font-mono text-sm font-bold text-mark">Rx</span>
              <h2 className="font-display text-lg text-fg">Prescription</h2>
            </div>
            <ol className="mt-4 space-y-3">
              {result.prescriptionRx.map((rx, idx) => (
                <li key={idx} className="rounded-xl border border-line/80 bg-surface/60 p-3 text-sm leading-relaxed text-fg-muted/90">
                  {rx}
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-6 flex flex-col justify-between gap-6 rounded-2xl border border-accent/40 bg-deep p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xs text-accent">Recommended treatment</h2>
              <h3 className="mt-1 font-display text-2xl text-fg">{serviceName}</h3>
              <p className="mt-1 max-w-md text-sm text-fg-muted/80">{result.treatmentPlan.description}</p>
              <div className="mt-2 text-xs text-fg-muted/70">{result.treatmentPlan.timeline}</div>
            </div>
            <div className="no-print sm:text-right">
              <div className="font-display text-2xl text-accent">{formatNaira(price)}</div>
              <div className="text-xs text-fg-muted/60">{formatNaira(deposit)} deposit to book</div>
              <button type="button" onClick={() => setBookingOpen(true)} className="mt-3 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition hover:bg-accent-soft">
                Book this treatment
              </button>
              <a
                href={whatsappLink(contact.whatsappNumber, `Hello Sartorial Executive, my checkup (${result.patientRef}) recommended ${serviceName}. I would like to talk it through.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-xs text-fg-muted/70 underline underline-offset-4 hover:text-accent"
              >
                Continue on WhatsApp
              </a>
            </div>
          </section>

          <footer className="mt-8 flex flex-col gap-2 border-t border-line pt-4 text-xs text-fg-muted/60 sm:flex-row sm:items-center sm:justify-between">
            <span>{pad.disclaimer}</span>
            <span className="text-right">
              <span className="font-display italic text-fg">{pad.consultantName}</span>
              <span className="block text-fg-muted/60">{pad.consultantTitle}</span>
            </span>
          </footer>
        </article>

        <p className="no-print mt-6 text-center text-sm text-fg-muted/70">
          See how others were treated in the{" "}
          <Link href={brandHref(S, "/case-files")} className="text-accent underline underline-offset-4">
            case files
          </Link>
          .
        </p>

        <BookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          services={services}
          contact={contact}
          initialServiceSlug={result.treatmentPlan.serviceSlug}
          checkupRef={result.patientRef}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-16">
      <div className="text-center">
        <p className="text-sm text-accent">{pad.clinicName}</p>
        <h1 className="mt-3 font-display text-4xl text-fg sm:text-5xl">The Executive Checkup</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-fg-muted/80">
          Five questions. We find the friction in how you dress and write you a Patient File with a prescription and a recommended treatment.
        </p>

        <div className="mx-auto mt-8 max-w-md" aria-live="polite">
          <div className="flex justify-between text-xs text-fg-muted/70">
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-2">
            <div className="h-full bg-accent transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }} />
          </div>
        </div>
      </div>

      <form onSubmit={handleNext} className="mt-10 rounded-3xl border border-line bg-surface p-6 sm:p-10">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-fg">Who are we dressing?</h2>
              <p className="mt-1 text-sm text-fg-muted/70">Your details go on the Patient File.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ck-name" className={label}>
                  Full name
                </label>
                <input id="ck-name" required autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} className={input} />
              </div>
              <div>
                <label htmlFor="ck-email" className={label}>
                  Email
                </label>
                <input id="ck-email" required type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={input} />
              </div>
              <div>
                <label htmlFor="ck-phone" className={label}>
                  Phone or WhatsApp
                </label>
                <input id="ck-phone" required type="tel" autoComplete="tel" placeholder="+234" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={input} />
              </div>
              <div>
                <label htmlFor="ck-profession" className={label}>
                  Profession or title
                </label>
                <input id="ck-profession" placeholder="Managing partner, founder, senior advocate" value={form.profession} onChange={(e) => set("profession", e.target.value)} className={input} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ck-industry" className={label}>
                  Industry
                </label>
                <select id="ck-industry" value={form.industry} onChange={(e) => set("industry", e.target.value)} className={input}>
                  <option value="Finance / Banking / PE">Finance, banking, private equity</option>
                  <option value="Technology & Venture Capital">Technology and venture capital</option>
                  <option value="Legal & Advisory Services">Legal and advisory</option>
                  <option value="Energy & Infrastructure">Energy and infrastructure</option>
                  <option value="Government & Public Service">Government and public service</option>
                  <option value="Media, Entertainment & Creative">Media, entertainment and creative</option>
                  <option value="Healthcare & Life Sciences">Healthcare and life sciences</option>
                </select>
              </div>
              <div>
                <label htmlFor="ck-role" className={label}>
                  Level
                </label>
                <select id="ck-role" value={form.roleLevel} onChange={(e) => set("roleLevel", e.target.value)} className={input}>
                  <option value="founder">Founder or chief executive</option>
                  <option value="c_suite">C-suite or managing director</option>
                  <option value="partner">Partner, VP or director</option>
                  <option value="senior_manager">Senior manager or principal</option>
                  <option value="emerging_leader">Emerging executive</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-fg">Which rooms do you need to command?</h2>
              <p className="mt-1 text-sm text-fg-muted/70">Where your wardrobe meets the most scrutiny.</p>
            </div>
            <div className="space-y-3" role="radiogroup">
              {[
                { id: "Corporate Boardroom", title: "Formal boardrooms", desc: "Institutional investors, formal suit-and-tie protocol." },
                { id: "Executive Smart Casual", title: "Executive smart casual", desc: "Unstructured tailoring, kaftans and fine knits." },
                { id: "Keynotes & Media Appearances", title: "Keynotes and media", desc: "Stage lights and cameras. Nothing that shines or shouts." },
                { id: "Black-Tie & High Society Galas", title: "Black tie and galas", desc: "State dinners, weddings, evening receptions." },
              ].map((item) => (
                <Choice key={item.id} selected={form.workEnvironment === item.id} onSelect={() => set("workEnvironment", item.id)} title={item.title} desc={item.desc} />
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-fg">What frustrates you most?</h2>
              <p className="mt-1 text-sm text-fg-muted/70">Your chief complaint.</p>
            </div>
            <div className="space-y-3" role="radiogroup">
              {[
                { id: "baggy_suits", title: "My suits swim on me", desc: "Off-the-rack fabric, collapsing shoulders, trousers pooling at the shoe." },
                { id: "lack_of_authority", title: "I look like everyone else in the room", desc: "Dressed safely. Ideas overlooked." },
                { id: "decision_fatigue", title: "A full wardrobe and nothing to wear", desc: "Impulse pieces that refuse to combine." },
                { id: "upcoming_event", title: "Something important is coming up", desc: "A wedding, interview, pitch or appearance that needs sorting fast." },
              ].map((item) => (
                <Choice key={item.id} selected={form.chiefComplaint === item.id} onSelect={() => set("chiefComplaint", item.id)} title={item.title} desc={item.desc} />
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-fg">Colour and fit</h2>
              <p className="mt-1 text-sm text-fg-muted/70">The palette you lean to and where tailoring usually fails you.</p>
            </div>
            <div>
              <div className={label}>Preferred palette</div>
              <div className="mt-2 grid gap-3 sm:grid-cols-2" role="radiogroup">
                {["Midnight Navy & Deep Charcoal", "Monochromatic Black & Gunmetal", "Warm Earth: Camel, Olive & Umber", "Ivory, Raw Silk & Gold Accents"].map((color) => (
                  <Choice key={color} selected={form.colorPreference === color} onSelect={() => set("colorPreference", color)} title={color} />
                ))}
              </div>
            </div>
            <div>
              <div className={label}>Where fit goes wrong</div>
              <div className="mt-2 grid gap-3 sm:grid-cols-2" role="radiogroup">
                {[
                  { id: "excess_fabric", title: "Broad shoulders, slim waist. Jackets bag at the waist." },
                  { id: "tight_shoulders", title: "Athletic chest. Jackets pull across the back." },
                  { id: "trouser_pooling", title: "Trousers pool over the shoe." },
                  { id: "sleeve_length", title: "Sleeves too long. Cuffs disappear." },
                ].map((fit) => (
                  <Choice key={fit.id} selected={form.fitProblem === fit.id} onSelect={() => set("fitProblem", fit.id)} title={fit.title} />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-fg">What should this unlock?</h2>
              <p className="mt-1 text-sm text-fg-muted/70">The outcome your prescription is written for.</p>
            </div>
            <div className="space-y-3" role="radiogroup">
              {[
                { id: "c_suite_command", title: "Complete executive authority", desc: "A total visual transformation for the boardroom and beyond." },
                { id: "modular_capsule", title: "A 7-day, 12-piece wardrobe", desc: "Twenty-plus outfits with zero decision fatigue." },
                { id: "urgent_event", title: "One event, done flawlessly", desc: "An imminent speech, wedding, pitch or gala." },
              ].map((item) => (
                <Choice key={item.id} selected={form.transformationGoal === item.id} onSelect={() => set("transformationGoal", item.id)} title={item.title} desc={item.desc} />
              ))}
            </div>
          </div>
        )}

        {error && <p className="mt-6 text-sm text-fg-muted">{error}</p>}

        <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
          {step > 1 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-full border border-line px-6 py-2.5 text-sm text-fg-muted transition hover:border-accent hover:text-accent">
              Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={submitting} className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-bg transition hover:bg-accent-soft disabled:opacity-50">
            {step === 5 ? (submitting ? "Writing your file…" : "Write my Patient File") : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}
