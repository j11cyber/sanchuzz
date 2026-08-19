"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Executive Checkup Consultation",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const whatsappMessage = encodeURIComponent(
    `Hello The Fashion Clinic, I would like to make an inquiry regarding: ${form.inquiryType}.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nMessage: ${form.message}`
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      {/* Header */}
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-charcoal-900 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
          CONSULTATIONS &middot; LAGOS ATELIER
        </span>
        <h1 className="mt-4 font-display text-4xl text-cream sm:text-6xl">
          Contact The Clinic
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-cream-dim/80 sm:text-base">
          Schedule an in-person diagnostic consultation at our Lagos Atelier, book a virtual global styling session, or speak with our concierge.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="rounded-3xl border border-charcoal-800 bg-charcoal-900 p-6 sm:p-10 shadow-lift">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="mt-4 font-display text-2xl text-cream">Message Transmitted</h3>
              <p className="mt-2 text-xs text-cream-dim/75 max-w-md mx-auto">
                Thank you, <span className="text-cream font-medium">{form.name}</span>. Our lead sartorial coordinator will review your inquiry and respond within 12 business hours.
              </p>

              <div className="mt-6">
                <a
                  href={`https://wa.me/2348000000000?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-semibold text-white shadow-rx transition hover:bg-emerald-500"
                >
                  <span>Connect Directly on WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-display text-xl text-cream">Send a Consultation Inquiry</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-wider text-cream-dim/60">Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Sterling Ademola"
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
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                  <label className="text-xs uppercase tracking-wider text-cream-dim/60">Inquiry Scope</label>
                  <select
                    value={form.inquiryType}
                    onChange={(e) => setForm((f) => ({ ...f, inquiryType: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-xs text-cream focus:border-gold focus:outline-none"
                  >
                    <option value="The Executive Checkup (₦50,000)">The Executive Checkup (₦50,000)</option>
                    <option value="The Wardrobe Detox (₦120,000)">The Wardrobe Detox (₦120,000)</option>
                    <option value="The Sartorial Prescription (₦250,000)">The Sartorial Prescription (₦250,000)</option>
                    <option value="The Boardroom Cure (₦400,000)">The Boardroom Cure (₦400,000)</option>
                    <option value="Emergency Consultation (₦75,000)">Emergency Consultation (₦75,000)</option>
                    <option value="Bespoke Tailoring & Private Orders">Bespoke Tailoring &amp; Private Orders</option>
                    <option value="Corporate Executive Leadership Image Training">Corporate Leadership Image Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-cream-dim/60">Clinical Notes / Message</label>
                <textarea
                  rows={4}
                  placeholder="Describe your current style objectives, upcoming milestones, or specific fit issues..."
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-xs text-cream placeholder:text-cream-dim/30 focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gold py-3.5 text-xs font-semibold uppercase tracking-wider text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
              >
                Submit Consultation Request
              </button>
            </form>
          )}
        </div>

        {/* Clinic Location & Concierge Info */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="rounded-3xl border border-charcoal-800 bg-navy-950/70 p-6 sm:p-8 space-y-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gold">
                The Atelier Location
              </div>
              <h3 className="mt-1 font-display text-xl text-cream">Lagos Atelier &amp; Consultation Suite</h3>
              <p className="mt-2 text-xs text-cream-dim/75 leading-relaxed">
                Victoria Island / Ikoyi, Lagos, Nigeria.<br />
                Private appointments strictly scheduled in advance for bespoke consultations and anatomical fittings.
              </p>
            </div>

            <div className="border-t border-charcoal-800 pt-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gold">
                Consultation Hours
              </div>
              <p className="mt-1 text-xs text-cream-dim/75 leading-relaxed">
                Monday &ndash; Friday: 9:00 AM &ndash; 6:00 PM WAT<br />
                Saturday: 10:00 AM &ndash; 4:00 PM WAT<br />
                Sunday: Emergency Consultations only by appointment
              </p>
            </div>

            <div className="border-t border-charcoal-800 pt-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Direct WhatsApp Concierge
              </div>
              <p className="mt-1 text-xs text-cream-dim/75">
                For rapid scheduling and 24-hour style triage inquiries.
              </p>
              <div className="mt-3">
                <a
                  href="https://wa.me/2348000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-charcoal-950 transition"
                >
                  <span>Chat With Concierge &rarr;</span>
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-charcoal-800 bg-charcoal-900 p-6 text-xs text-cream-dim/70 flex items-center justify-between">
            <div>
              <div className="font-display text-cream text-sm">Need immediate style triage?</div>
              <div className="text-[11px] mt-0.5">Take the online Executive Checkup in 3 minutes.</div>
            </div>
            <Link
              href="/executive-checkup"
              className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-charcoal-950 shadow-gold hover:bg-gold-soft transition shrink-0"
            >
              Start Checkup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
