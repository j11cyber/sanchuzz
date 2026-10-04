"use client";

import { useState } from "react";
import { formatNaira } from "@/lib/money";
import { ATELIER_LOCATION, whatsappLink } from "@/lib/contact";

export type BookableService = { slug: string; name: string; price: number };

export const OCCASIONS = [
  { value: "boardroom", label: "Boardroom and everyday work" },
  { value: "wedding", label: "Wedding" },
  { value: "interview", label: "Interview or promotion" },
  { value: "keynote", label: "Pitch, keynote or media" },
  { value: "gala", label: "Gala or black tie" },
  { value: "wardrobe", label: "Whole wardrobe" },
] as const;

export type Occasion = (typeof OCCASIONS)[number]["value"];

export const FORMATS = ["In person at the Abuja atelier", "House call in Abuja", "Virtual session"] as const;

/**
 * Consultation booking form for Sartorial Executive services.
 *
 * Phase 2: collects details and hands off to WhatsApp with a prefilled
 * message. Phase 4 adds the Booking record and the Paystack deposit flow.
 */
export default function BookingForm({
  services,
  initialServiceSlug,
  initialOccasion,
}: {
  services: BookableService[];
  initialServiceSlug?: string;
  initialOccasion?: string;
}) {
  const occasionDefault = OCCASIONS.some((o) => o.value === initialOccasion) ? (initialOccasion as Occasion) : "boardroom";
  // A wedding without a chosen service is an emergency consultation by default.
  const serviceDefault =
    initialServiceSlug && services.some((s) => s.slug === initialServiceSlug)
      ? initialServiceSlug
      : occasionDefault === "wedding" && services.some((s) => s.slug === "emergency-consultation")
        ? "emergency-consultation"
        : (services[0]?.slug ?? "");

  const [serviceSlug, setServiceSlug] = useState(serviceDefault);
  const [occasion, setOccasion] = useState<Occasion>(occasionDefault);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    format: FORMATS[0] as string,
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const service = services.find((s) => s.slug === serviceSlug) ?? services[0];
  const occasionLabel = OCCASIONS.find((o) => o.value === occasion)?.label ?? occasion;

  const message = service
    ? `Hello Sartorial Executive, I would like to book ${service.name} (${formatNaira(service.price)}).\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nOccasion: ${occasionLabel}\nPreferred date: ${form.date || "Next available"}\nFormat: ${form.format}\nNotes: ${form.notes || "None"}`
    : "";

  if (!service) {
    return <p className="text-sm text-fg-muted/70">No services are available to book right now.</p>;
  }

  if (submitted) {
    return (
      <div className="text-center">
        <h3 className="font-display text-2xl text-fg">Request noted</h3>
        <p className="mt-2 text-sm text-fg-muted/75">
          Thank you, {form.name}. You asked for <span className="text-accent">{service.name}</span> ({formatNaira(service.price)}) for a{" "}
          {occasionLabel.toLowerCase()}.
        </p>
        <dl className="mt-6 space-y-1.5 rounded-xl border border-line bg-bg p-4 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Preferred date</dt>
            <dd className="text-fg">{form.date || "Next available"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Format</dt>
            <dd className="text-fg">{form.format}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Contact</dt>
            <dd className="text-fg">{form.phone}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-fg-muted/60">
          To confirm a time, send us this request on WhatsApp. Booking is secured with a 50% deposit.
        </p>
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition hover:bg-accent-soft"
        >
          Send on WhatsApp
        </a>
      </div>
    );
  }

  const input =
    "mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-fg-muted/30 focus:border-accent focus:outline-none";
  const label = "text-xs text-fg-muted/60";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="bk-service" className={label}>
          Treatment
        </label>
        <select id="bk-service" value={serviceSlug} onChange={(e) => setServiceSlug(e.target.value)} className={input}>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name} — {formatNaira(s.price)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="bk-occasion" className={label}>
          What is this for?
        </label>
        <select id="bk-occasion" value={occasion} onChange={(e) => setOccasion(e.target.value as Occasion)} className={input}>
          {OCCASIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {occasion === "wedding" && (
          <p className="mt-1.5 text-xs text-fg-muted/60">
            For weddings we plan the groom and the party together, traditional and white wedding as one story. Tell us the date below.
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="bk-name" className={label}>
            Full name
          </label>
          <input id="bk-name" required autoComplete="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={input} />
        </div>
        <div>
          <label htmlFor="bk-email" className={label}>
            Email
          </label>
          <input id="bk-email" required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={input} />
        </div>
        <div>
          <label htmlFor="bk-phone" className={label}>
            Phone or WhatsApp
          </label>
          <input id="bk-phone" required type="tel" autoComplete="tel" placeholder="+234" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={input} />
        </div>
        <div>
          <label htmlFor="bk-date" className={label}>
            {occasion === "wedding" ? "Wedding date" : "Preferred date"}
          </label>
          <input id="bk-date" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={input} />
        </div>
      </div>

      <div>
        <label htmlFor="bk-format" className={label}>
          Format
        </label>
        <select id="bk-format" value={form.format} onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))} className={input}>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="bk-notes" className={label}>
          Anything we should know
        </label>
        <textarea
          id="bk-notes"
          rows={3}
          placeholder="Fit problems, the rooms you need to command, dates that matter"
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          className={input}
        />
      </div>

      <div className="rounded-xl border border-line bg-bg p-3 text-xs text-fg-muted/70">
        50% deposit to book, balance before delivery, aftercare included. {ATELIER_LOCATION}, house calls available.
      </div>

      <button type="submit" className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-bg transition hover:bg-accent-soft">
        Request this booking ({formatNaira(service.price)})
      </button>
      <a
        href={whatsappLink("Hello Sartorial Executive, I would like to talk before booking.")}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-xs text-fg-muted/70 underline underline-offset-4 hover:text-accent"
      >
        Prefer to talk first? Message us on WhatsApp
      </a>
    </form>
  );
}
