"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/money";
import type { ServiceItemType } from "@/lib/services";
import BookingModal from "@/components/BookingModal";

export default function ServicesCatalogue({
  services,
  showHeading = true,
}: {
  services: ServiceItemType[];
  showHeading?: boolean;
}) {
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-8">
      {showHeading && (
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Clinical Services</p>
          <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">
            Diagnose. Prescribe. Solve.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-cream-dim/75">
            Every man requires a distinct clinical intervention — from rapid 30-minute flaw diagnosis to full 30-day executive transformation.
          </p>
        </div>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={service.id}
            id={service.slug}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-charcoal-900 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift ${
              index === 3
                ? "border-gold/50 bg-gradient-to-b from-navy-950 to-charcoal-900 lg:col-span-2"
                : "border-charcoal-800"
            }`}
          >
            {/* Top Badge & Duration */}
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold">
                  {service.duration || "Clinical Protocol"}
                </span>
                <div className="font-display text-xl font-medium text-gold">
                  {formatNaira(service.price)}
                </div>
              </div>

              {/* Service Title */}
              <h3 className="mt-4 font-display text-2xl text-cream group-hover:text-gold transition">
                {service.name}
              </h3>

              <p className="mt-3 text-xs leading-relaxed text-cream-dim/80">
                {service.description}
              </p>

              {/* Features List */}
              <div className="mt-6 border-t border-charcoal-800 pt-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-cream-dim/50">
                  Treatment Inclusions
                </div>
                <ul className="mt-2.5 space-y-2">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-cream-dim/80">
                      <span className="text-emerald-400 font-bold text-xs mt-0.5">✦</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best For Callout */}
              <div className="mt-5 rounded-xl border border-charcoal-800/80 bg-charcoal-950/70 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gold">
                  Indicated For
                </div>
                <p className="mt-1 text-xs text-cream-dim/70">
                  {service.bestFor}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-charcoal-800/60">
              <button
                type="button"
                onClick={() => setSelectedServiceSlug(service.slug)}
                className="flex-1 rounded-full bg-gold py-3 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:scale-[1.02] hover:bg-gold-soft text-center"
              >
                Book This Service
              </button>

              <Link
                href="/executive-checkup"
                className="rounded-full border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-xs font-medium text-cream-dim transition hover:border-gold hover:text-gold text-center"
              >
                Diagnose First
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal Instance */}
      {selectedServiceSlug && (
        <BookingModal
          isOpen={!!selectedServiceSlug}
          onClose={() => setSelectedServiceSlug(null)}
          initialServiceSlug={selectedServiceSlug}
        />
      )}
    </div>
  );
}
