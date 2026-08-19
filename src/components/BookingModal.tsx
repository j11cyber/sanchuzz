"use client";

import { useState } from "react";
import { formatNaira } from "@/lib/money";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialServiceSlug?: string;
  initialServiceName?: string;
  initialPrice?: number;
};

const ALL_SERVICES = [
  { slug: "the-executive-checkup", name: "The Executive Checkup", price: 50000 },
  { slug: "the-wardrobe-detox", name: "The Wardrobe Detox", price: 120000 },
  { slug: "the-sartorial-prescription", name: "The Sartorial Prescription", price: 250000 },
  { slug: "the-boardroom-cure", name: "The Boardroom Cure", price: 400000 },
  { slug: "emergency-consultation", name: "Emergency Consultation", price: 75000 },
];

export default function BookingModal({
  isOpen,
  onClose,
  initialServiceSlug = "the-executive-checkup",
}: BookingModalProps) {
  const [selectedService, setSelectedService] = useState(initialServiceSlug);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    mode: "In-Person (Lagos Atelier)",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentService = ALL_SERVICES.find((s) => s.slug === selectedService) || ALL_SERVICES[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const whatsappMessage = encodeURIComponent(
    `Hello The Fashion Clinic, I would like to book "${currentService.name}" (${formatNaira(currentService.price)}).\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nPreferred Date: ${form.date}\nFormat: ${form.mode}\nNotes: ${form.notes || "None"}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-charcoal-700 bg-charcoal-900 shadow-lift">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-charcoal-800 bg-navy-950 px-6 py-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Clinical Appointment Booking
            </span>
            <h3 className="font-display text-lg text-cream">Reserve Your Consultation</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close booking modal"
            className="text-cream-dim/60 transition hover:text-cream"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h4 className="mt-4 font-display text-xl text-cream">Appointment Request Logged</h4>
            <p className="mt-2 text-xs leading-relaxed text-cream-dim/75">
              Thank you, <span className="font-medium text-cream">{form.name}</span>. Your request for{" "}
              <span className="text-gold font-medium">{currentService.name}</span> ({formatNaira(currentService.price)}) has been registered.
            </p>

            <div className="mt-6 rounded-xl border border-charcoal-800 bg-charcoal-950 p-4 text-left text-xs space-y-1.5">
              <div className="text-cream-dim/60">Preferred Date: <span className="text-cream font-medium">{form.date || "Next Available Slot"}</span></div>
              <div className="text-cream-dim/60">Format: <span className="text-cream font-medium">{form.mode}</span></div>
              <div className="text-cream-dim/60">Contact: <span className="text-cream font-medium">{form.phone} &middot; {form.email}</span></div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`https://wa.me/2348000000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-semibold text-white shadow-rx transition hover:bg-emerald-500"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                </svg>
                Confirm via WhatsApp Concierge
              </a>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="rounded-full border border-charcoal-700 py-2.5 text-xs text-cream-dim transition hover:border-gold hover:text-gold"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-cream-dim/60">
                Select Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-3 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
              >
                {ALL_SERVICES.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name} — {formatNaira(s.price)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-cream-dim/60">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Adebayo Sterling"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-3 py-2 text-xs text-cream placeholder:text-cream-dim/30 focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-cream-dim/60">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="name@executive.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-3 py-2 text-xs text-cream placeholder:text-cream-dim/30 focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-cream-dim/60">
                  Phone / WhatsApp *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-3 py-2 text-xs text-cream placeholder:text-cream-dim/30 focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-cream-dim/60">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-3 py-2 text-xs text-cream focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-cream-dim/60">
                Consultation Format
              </label>
              <select
                value={form.mode}
                onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-3 py-2 text-xs text-cream focus:border-gold focus:outline-none"
              >
                <option value="In-Person (Lagos Atelier)">In-Person (Lagos Atelier Consultation)</option>
                <option value="Virtual Executive Session (Global Zoom)">Virtual Executive Session (Global Zoom)</option>
                <option value="Executive On-Site Wardrobe Visit">Executive On-Site Wardrobe Visit</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-cream-dim/60">
                Specific Goals / Flaws to Address
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Boardroom presence, ill-fitting suits, upcoming keynote speech..."
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-3 py-2 text-xs text-cream placeholder:text-cream-dim/30 focus:border-gold focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-full bg-gold py-3 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
              >
                Confirm Consultation Request ({formatNaira(currentService.price)})
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
