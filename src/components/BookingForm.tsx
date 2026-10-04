"use client";

import { useState } from "react";
import { formatNaira } from "@/lib/money";
import { whatsappLink, type ContactSettings } from "@/lib/contact";
import { depositOf, FORMATS, OCCASIONS, occasionLabel, type BookableService, type BookRequest, type BookResponse, type Occasion } from "@/lib/booking-options";

export type { BookableService } from "@/lib/booking-options";
export { depositOf } from "@/lib/booking-options";

/**
 * Consultation booking form for Sartorial Executive services.
 *
 * Two ways to finish: pay the deposit now through Paystack, or send the
 * request on WhatsApp and arrange the deposit by transfer. Both save a
 * Booking first through POST /api/book.
 */
export default function BookingForm({
  services,
  contact,
  initialServiceSlug,
  initialOccasion,
  checkupRef,
}: {
  services: BookableService[];
  contact: ContactSettings;
  initialServiceSlug?: string;
  initialOccasion?: string;
  checkupRef?: string;
}) {
  const occasionDefault: Occasion = OCCASIONS.some((o) => o.value === initialOccasion) ? (initialOccasion as Occasion) : "boardroom";
  // A wedding without a chosen service is an emergency consultation by default.
  const serviceDefault =
    initialServiceSlug && services.some((s) => s.slug === initialServiceSlug)
      ? initialServiceSlug
      : occasionDefault === "wedding" && services.some((s) => s.slug === "emergency-consultation")
        ? "emergency-consultation"
        : (services[0]?.slug ?? "");

  const [serviceSlug, setServiceSlug] = useState(serviceDefault);
  const [occasion, setOccasion] = useState<Occasion>(occasionDefault);
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", format: FORMATS[0] as string, notes: "" });
  const [pending, setPending] = useState<null | "pay" | "enquire">(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<BookResponse | null>(null);

  const service = services.find((s) => s.slug === serviceSlug) ?? services[0];

  if (!service) {
    return <p className="text-sm text-fg-muted/70">No services are available to book right now.</p>;
  }

  const deposit = depositOf(service);
  const balance = service.price - deposit;

  async function submit(pay: boolean) {
    setPending(pay ? "pay" : "enquire");
    setError(null);
    try {
      const payload: BookRequest = {
        serviceSlug: service!.slug,
        occasion,
        name: form.name,
        email: form.email,
        phone: form.phone,
        preferredDate: form.date || undefined,
        format: form.format,
        notes: form.notes || undefined,
        checkupRef,
        pay,
      };
      const res = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "We could not save your booking. Please try again.");
      const result = data as BookResponse;
      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
        return;
      }
      setDone(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPending(null);
    }
  }

  if (done) {
    const message = [
      `Hello Sartorial Executive, booking ${done.bookingReference}.`,
      ``,
      `Treatment: ${done.serviceName} (${formatNaira(done.price)})`,
      `Deposit due: ${formatNaira(done.depositAmount)}`,
      `Balance: ${formatNaira(done.balance)}`,
      `Occasion: ${occasionLabel(occasion)}`,
      `Preferred date: ${form.date || "Next available"}`,
      `Format: ${form.format}`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.notes ? `Notes: ${form.notes}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    return (
      <div className="text-center">
        <h3 className="font-display text-2xl text-fg">Booking saved</h3>
        <p className="mt-1 font-mono text-sm text-mark">{done.bookingReference}</p>
        <p className="mt-3 text-sm text-fg-muted/75">
          Thank you, {form.name}. {done.paymentUnavailable ? done.message : "Send this to us on WhatsApp and we will confirm your time and take the deposit."}
        </p>
        <dl className="mt-6 space-y-1.5 rounded-xl border border-line bg-bg p-4 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Treatment</dt>
            <dd className="text-fg">{done.serviceName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Deposit due</dt>
            <dd className="text-fg">{formatNaira(done.depositAmount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Balance before delivery</dt>
            <dd className="text-fg">{formatNaira(done.balance)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Preferred date</dt>
            <dd className="text-fg">{form.date || "Next available"}</dd>
          </div>
        </dl>
        <a
          href={whatsappLink(contact.whatsappNumber, message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition hover:bg-accent-soft"
        >
          Send on WhatsApp
        </a>
      </div>
    );
  }

  const input = "mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-fg-muted/30 focus:border-accent focus:outline-none";
  const label = "text-xs text-fg-muted/60";
  const busy = pending !== null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(true);
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

      <dl className="rounded-xl border border-line bg-bg p-3 text-xs text-fg-muted/70">
        <div className="flex justify-between gap-4">
          <dt>Deposit to book ({service.depositPercent}%)</dt>
          <dd className="text-fg">{formatNaira(deposit)}</dd>
        </div>
        <div className="mt-1 flex justify-between gap-4">
          <dt>Balance before delivery</dt>
          <dd className="text-fg">{formatNaira(balance)}</dd>
        </div>
        <p className="mt-2">
          Aftercare included. {contact.location}. {contact.locationNote}
        </p>
      </dl>

      {error && <p className="text-sm text-fg-muted">{error}</p>}

      <button type="submit" disabled={busy} className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-bg transition hover:bg-accent-soft disabled:opacity-50">
        {pending === "pay" ? "Opening Paystack…" : `Pay deposit ${formatNaira(deposit)}`}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          const formEl = document.getElementById("bk-name")?.closest("form");
          if (formEl && !formEl.reportValidity()) return;
          submit(false);
        }}
        className="w-full rounded-full border border-line py-3 text-sm text-fg-muted transition hover:border-accent hover:text-accent disabled:opacity-50"
      >
        {pending === "enquire" ? "Saving…" : "Prefer to talk first? Request on WhatsApp"}
      </button>
    </form>
  );
}
