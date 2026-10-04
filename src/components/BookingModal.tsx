"use client";

import { useEffect } from "react";
import BookingForm from "@/components/BookingForm";
import type { BookableService } from "@/lib/booking-options";
import type { ContactSettings } from "@/lib/contact";

export default function BookingModal({
  isOpen,
  onClose,
  services,
  contact,
  initialServiceSlug,
  initialOccasion,
  checkupRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  services: BookableService[];
  contact: ContactSettings;
  initialServiceSlug?: string;
  initialOccasion?: string;
  checkupRef?: string;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Book a consultation">
      <div className="fixed inset-0 bg-deep/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-line bg-surface shadow-lift sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h3 className="font-display text-xl text-fg">Book a consultation</h3>
          <button onClick={onClose} aria-label="Close" className="text-fg-muted/60 transition hover:text-fg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <BookingForm services={services} contact={contact} initialServiceSlug={initialServiceSlug} initialOccasion={initialOccasion} checkupRef={checkupRef} />
        </div>
      </div>
    </div>
  );
}
