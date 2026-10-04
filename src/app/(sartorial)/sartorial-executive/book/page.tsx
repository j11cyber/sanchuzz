import type { Metadata } from "next";
import Link from "next/link";
import { getActiveServices } from "@/lib/services";
import { getContactSettings } from "@/lib/site-settings";
import { BRANDS, brandHref } from "@/lib/brands";
import BookingForm from "@/components/BookingForm";

const S = BRANDS.sartorial;

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Book a Sartorial Executive treatment. A deposit books your place, balance before delivery, aftercare included. Abuja, house calls available.",
};

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string; occasion?: string }> }) {
  const [{ service, occasion }, services, contact] = await Promise.all([searchParams, getActiveServices(), getContactSettings()]);
  const bookable = services.map((s) => ({ slug: s.slug, name: s.name, price: s.price, depositPercent: s.depositPercent }));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h1 className="font-display text-4xl text-fg sm:text-6xl">Book a consultation</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-fg-muted/80 sm:text-base">
            Choose a treatment, tell us what it is for, and pick a date. We confirm the time with you on WhatsApp.
          </p>

          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="text-xs text-accent">Terms</dt>
              <dd className="mt-1 text-fg-muted/80">A deposit books your place. Balance before delivery. Aftercare included.</dd>
            </div>
            <div>
              <dt className="text-xs text-accent">Where</dt>
              <dd className="mt-1 text-fg-muted/80">
                {contact.location}. {contact.locationNote}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-accent">Hours</dt>
              <dd className="mt-1 space-y-0.5 text-fg-muted/80">
                {contact.hours.map((h) => (
                  <div key={h}>{h}</div>
                ))}
              </dd>
            </div>
          </dl>

          <p className="mt-10 text-sm text-fg-muted/70">
            Not sure which treatment?{" "}
            <Link href={brandHref(S, "/checkup")} className="text-accent underline underline-offset-4">
              Take the checkup first
            </Link>
            .
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <BookingForm services={bookable} contact={contact} initialServiceSlug={service} initialOccasion={occasion} />
        </div>
      </div>
    </div>
  );
}
