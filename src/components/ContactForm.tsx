"use client";

import { useState } from "react";
import { HOUSE_NAME } from "@/lib/brands";
import { whatsappLink } from "@/lib/contact";

const TOPICS = [
  "An order from Santus Sabaoth",
  "Commissioning a piece",
  "A Sartorial Executive consultation",
  "Press or partnership",
  "Something else",
];

/**
 * House enquiry form. Phase 2: hands off to WhatsApp with the details
 * prefilled. Phase 4 persists enquiries.
 */
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: TOPICS[0], message: "" });
  const [submitted, setSubmitted] = useState(false);

  const message = `Hello ${HOUSE_NAME}, regarding: ${form.topic}.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n${form.message}`;

  const input =
    "mt-1.5 w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-muted/30 focus:border-accent focus:outline-none";
  const label = "text-xs text-fg-muted/60";

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <h2 className="font-display text-2xl text-fg">Thank you, {form.name}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted/75">Send this to us on WhatsApp and we will reply within one working day.</p>
        <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition hover:bg-accent-soft">
          Send on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-5"
    >
      <h2 className="font-display text-2xl text-fg">Send an enquiry</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-name" className={label}>Full name</label>
          <input id="ct-name" required autoComplete="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={input} />
        </div>
        <div>
          <label htmlFor="ct-email" className={label}>Email</label>
          <input id="ct-email" required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={input} />
        </div>
        <div>
          <label htmlFor="ct-phone" className={label}>Phone or WhatsApp</label>
          <input id="ct-phone" required type="tel" autoComplete="tel" placeholder="+234" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={input} />
        </div>
        <div>
          <label htmlFor="ct-topic" className={label}>About</label>
          <select id="ct-topic" value={form.topic} onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))} className={input}>
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="ct-message" className={label}>Message</label>
        <textarea id="ct-message" rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className={input} />
      </div>
      <button type="submit" className="w-full rounded-full bg-accent py-3.5 text-sm font-semibold text-bg transition hover:bg-accent-soft">
        Continue
      </button>
    </form>
  );
}
