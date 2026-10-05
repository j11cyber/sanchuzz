"use client";

import { useState } from "react";
import Link from "next/link";
import { m } from "motion/react";
import { formatNaira } from "@/lib/money";
import type { ServiceItemType } from "@/lib/services";
import { depositOf } from "@/lib/booking-options";
import { BRANDS, brandHref } from "@/lib/brands";
import { whatsappLink, type ContactSettings } from "@/lib/contact";
import { EXPO } from "@/components/motion/Rise";
import BookingModal from "@/components/BookingModal";

const S = BRANDS.sartorial;

/**
 * The treatment menu. Each treatment is a row like a line on a consultation
 * card: name, duration, fee, deposit, what is included, and two ways to
 * proceed. The hairline above each row grows on hover.
 */
export default function ServicesCatalogue({
  services,
  contact,
  showHeading = true,
  level = "h3",
}: {
  services: ServiceItemType[];
  contact: ContactSettings;
  showHeading?: boolean;
  /** Heading level for each treatment name, so the page outline stays in order. */
  level?: "h2" | "h3";
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const Heading = level;
  const bookable = services.map((s) => ({ slug: s.slug, name: s.name, price: s.price, depositPercent: s.depositPercent }));

  return (
    <div className="mx-auto max-w-[110rem] px-5 sm:px-8 lg:px-12">
      {showHeading && (
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-4xl text-fg sm:text-6xl">Treatments</h2>
          <Link href={brandHref(S, "/services")} className="link-line text-sm text-fg-muted hover:text-fg">
            The full menu
          </Link>
        </div>
      )}

      <ol className={showHeading ? "mt-12" : ""}>
        {services.map((service, i) => {
          const deposit = depositOf(service);
          return (
            <m.li
              key={service.id}
              id={service.slug}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: EXPO, delay: Math.min(i, 4) * 0.06 }}
              className="group relative border-t border-line py-8 last:border-b sm:py-10"
            >
              <span className="card-line" aria-hidden />
              <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-5">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-fg-muted/60">{String(i + 1).padStart(2, "0")}</span>
                    <Heading className="font-display text-3xl leading-tight text-fg sm:text-4xl">
                      <Link href={brandHref(S, `/services/${service.slug}`)} className="transition hover:text-accent">
                        {service.name}
                      </Link>
                    </Heading>
                  </div>
                  <p className="mt-2 pl-8 text-sm text-fg-muted/60">{service.duration}</p>
                  <p className="mt-4 pl-8 text-sm leading-relaxed text-fg-muted/85">{service.description}</p>
                </div>

                <div className="lg:col-span-4 lg:pt-1">
                  <ul className="space-y-1.5 text-sm text-fg-muted/85">
                    {service.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mark" aria-hidden />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-fg-muted/60">
                    <span className="text-accent">Indicated for</span> {service.bestFor}
                  </p>
                </div>

                <div className="flex flex-col justify-between gap-5 lg:col-span-3 lg:items-end lg:text-right">
                  <dl className="text-sm">
                    <dd className="font-display text-3xl text-fg">{formatNaira(service.price)}</dd>
                    <dt className="sr-only">Fee</dt>
                    <dd className="mt-1 text-fg-muted/70">
                      {formatNaira(deposit)} deposit · balance before delivery
                    </dd>
                  </dl>
                  <div className="flex flex-wrap gap-3 lg:justify-end">
                    <button type="button" onClick={() => setSelected(service.slug)} className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-5 py-2.5 text-sm font-medium text-bg">
                      Pay deposit
                    </button>
                    <a
                      href={whatsappLink(contact.whatsappNumber, `Hello Sartorial Executive, I would like to talk about ${service.name}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-sheen relative inline-flex items-center overflow-hidden border border-fg/40 px-5 py-2.5 text-sm text-fg"
                    >
                      Talk on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </m.li>
          );
        })}
      </ol>

      {selected && <BookingModal isOpen onClose={() => setSelected(null)} services={bookable} contact={contact} initialServiceSlug={selected} />}
    </div>
  );
}
