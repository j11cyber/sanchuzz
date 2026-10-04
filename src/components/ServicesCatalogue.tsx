"use client";

import { useState } from "react";
import Link from "next/link";
import { formatNaira } from "@/lib/money";
import type { ServiceItemType } from "@/lib/services";
import { depositOf } from "@/lib/booking-options";
import { BRANDS, brandHref } from "@/lib/brands";
import type { ContactSettings } from "@/lib/contact";
import BookingModal from "@/components/BookingModal";

const S = BRANDS.sartorial;

export default function ServicesCatalogue({
  services,
  contact,
  showHeading = true,
}: {
  services: ServiceItemType[];
  contact: ContactSettings;
  showHeading?: boolean;
}) {
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);
  const bookable = services.map((s) => ({ slug: s.slug, name: s.name, price: s.price, depositPercent: s.depositPercent }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-8">
      {showHeading && (
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl text-fg sm:text-4xl">Treatments</h2>
          <p className="mt-4 text-sm leading-relaxed text-fg-muted/75">
            Five interventions, from a thirty-minute diagnosis to a thirty-day transformation. A deposit books your place.
          </p>
        </div>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <article
            key={service.id}
            id={service.slug}
            className={`flex flex-col justify-between rounded-2xl border bg-surface p-6 ${index === 3 ? "border-accent/50 lg:col-span-2" : "border-line"}`}
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-xs text-fg-muted/60">{service.duration || "By arrangement"}</span>
                <div className="text-right">
                  <div className="font-display text-xl text-accent">{formatNaira(service.price)}</div>
                  <div className="text-xs text-fg-muted/60">
                    {formatNaira(depositOf(service))} to book
                  </div>
                </div>
              </div>

              <h3 className="mt-4 font-display text-2xl text-fg">
                <Link href={brandHref(S, `/services/${service.slug}`)} className="hover:text-accent">
                  {service.name}
                </Link>
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-fg-muted/80">{service.description}</p>

              <div className="mt-6 border-t border-line pt-4">
                <div className="text-xs text-fg-muted/50">Included</div>
                <ul className="mt-2.5 space-y-2">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-fg-muted/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mark" aria-hidden />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 rounded-xl border border-line bg-bg/70 p-3">
                <div className="text-xs text-accent">Indicated for</div>
                <p className="mt-1 text-sm text-fg-muted/70">{service.bestFor}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line/60 pt-4">
              <button
                type="button"
                onClick={() => setSelectedServiceSlug(service.slug)}
                className="flex-1 rounded-full bg-accent py-3 text-center text-sm font-semibold text-bg transition hover:bg-accent-soft"
              >
                Book this treatment
              </button>
              <Link
                href={brandHref(S, `/services/${service.slug}`)}
                className="rounded-full border border-line px-4 py-3 text-sm text-fg-muted transition hover:border-accent hover:text-accent"
              >
                Details
              </Link>
            </div>
          </article>
        ))}
      </div>

      {selectedServiceSlug && (
        <BookingModal isOpen onClose={() => setSelectedServiceSlug(null)} services={bookable} contact={contact} initialServiceSlug={selectedServiceSlug} />
      )}
    </div>
  );
}
