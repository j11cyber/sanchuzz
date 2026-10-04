import Link from "next/link";
import type { Metadata } from "next";
import { getActiveServices } from "@/lib/services";
import { getContactSettings } from "@/lib/site-settings";
import { BRANDS, brandHref } from "@/lib/brands";
import ServicesCatalogue from "@/components/ServicesCatalogue";

const S = BRANDS.sartorial;

export const metadata: Metadata = {
  title: "Treatments",
  description:
    "Five clinical interventions for the executive wardrobe: The Executive Checkup, The Wardrobe Detox, The Sartorial Prescription, The Boardroom Cure and Emergency Consultation.",
};

export default async function ServicesPage() {
  const [services, contact] = await Promise.all([getActiveServices(), getContactSettings()]);

  return (
    <div className="space-y-16 py-12 sm:space-y-20 sm:py-16">
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <h1 className="font-display text-4xl text-fg sm:text-6xl">Treatments</h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-fg-muted/80 sm:text-base">
          We don&rsquo;t guess. We diagnose the specific friction in how you dress and prescribe the fix, from a thirty-minute consultation to a
          thirty-day transformation.
        </p>
        <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-surface p-4">
            <dt className="text-xs text-accent">To book</dt>
            <dd className="mt-1 text-fg">A deposit secures your appointment</dd>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <dt className="text-xs text-accent">Balance</dt>
            <dd className="mt-1 text-fg">Paid before delivery. Aftercare included.</dd>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <dt className="text-xs text-accent">Where</dt>
            <dd className="mt-1 text-fg">
              {contact.location}. {contact.locationNote}
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <ServicesCatalogue services={services} contact={contact} showHeading={false} />
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 rounded-3xl border border-line bg-deep/70 p-8 sm:p-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-2xl text-fg sm:text-3xl">Not sure which treatment you need?</h2>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted/75">
              Take the online Executive Checkup. In under three minutes it reads your profession, your wardrobe complaints and your goals, and
              recommends the treatment that fits.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href={brandHref(S, "/checkup")} className="rounded-full bg-accent px-8 py-3.5 text-center text-sm font-semibold text-bg transition hover:bg-accent-soft">
              Start your checkup
            </Link>
            <Link href={brandHref(S, "/case-files")} className="rounded-full border border-line px-6 py-3.5 text-center text-sm text-fg transition hover:border-accent hover:text-accent">
              Read the case files
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
