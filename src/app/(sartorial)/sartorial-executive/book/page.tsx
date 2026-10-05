import type { Metadata } from "next";
import Link from "next/link";
import { getActiveServices } from "@/lib/services";
import { getContactSettings } from "@/lib/site-settings";
import { BRANDS, brandHref } from "@/lib/brands";
import { SARTORIAL } from "@/lib/photos";
import BookingForm from "@/components/BookingForm";
import ScrollImage from "@/components/motion/ScrollImage";
import Words from "@/components/motion/Words";
import Rise, { RiseGroup, RiseItem } from "@/components/motion/Rise";

const S = BRANDS.sartorial;

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Book a Sartorial Executive treatment. A deposit books your place, balance before delivery, aftercare included. Abuja, house calls available.",
};

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string; occasion?: string }> }) {
  const [{ service, occasion }, services, contact] = await Promise.all([searchParams, getActiveServices(), getContactSettings()]);
  const bookable = services.map((s) => ({ slug: s.slug, name: s.name, price: s.price, depositPercent: s.depositPercent }));

  return (
    <div className="mx-auto max-w-[110rem] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Rise as="p" className="text-sm text-fg-muted/60">
            The Fashion Clinic
          </Rise>
          <Words as="h1" text="Book a consultation" onLoad delay={0.05} className="mt-3 font-display text-5xl leading-[0.95] text-fg sm:text-7xl" />
          <Rise as="p" delay={0.3} className="mt-6 max-w-md text-base leading-relaxed text-fg-muted/80">
            Choose a treatment, tell us what it is for, and pick a date. We confirm the time with you on WhatsApp.
          </Rise>

          <Rise delay={0.4} className="mt-10">
            <ScrollImage src={SARTORIAL.book} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/3] bg-surface" parallax={8} zoom={1.08} />
          </Rise>

          <RiseGroup as="dl" stagger={0.08} className="mt-10 divide-y divide-line border-y border-line text-sm">
            <RiseItem as="div" className="py-4">
              <dt className="text-xs text-fg-muted/60">Terms</dt>
              <dd className="mt-1 text-fg">A deposit books your place. Balance before delivery. Aftercare included.</dd>
            </RiseItem>
            <RiseItem as="div" className="py-4">
              <dt className="text-xs text-fg-muted/60">Where</dt>
              <dd className="mt-1 text-fg">
                {contact.location}. {contact.locationNote}
              </dd>
            </RiseItem>
            <RiseItem as="div" className="py-4">
              <dt className="text-xs text-fg-muted/60">Hours</dt>
              <dd className="mt-1 space-y-0.5 text-fg">
                {contact.hours.map((h) => (
                  <div key={h}>{h}</div>
                ))}
              </dd>
            </RiseItem>
          </RiseGroup>

          <Rise delay={0.2} as="p" className="mt-8 text-sm text-fg-muted/70">
            Not sure which treatment?{" "}
            <Link href={brandHref(S, "/checkup")} className="link-line text-fg">
              Take the checkup first
            </Link>
            .
          </Rise>
        </div>

        <Rise delay={0.25} className="lg:col-span-6 lg:col-start-7">
          <div className="border-glint relative overflow-hidden border border-line bg-surface p-6 sm:p-8">
            <BookingForm services={bookable} contact={contact} initialServiceSlug={service} initialOccasion={occasion} />
          </div>
        </Rise>
      </div>
    </div>
  );
}
