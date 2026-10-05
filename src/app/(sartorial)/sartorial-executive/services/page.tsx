import Link from "next/link";
import type { Metadata } from "next";
import { getActiveServices } from "@/lib/services";
import { getContactSettings } from "@/lib/site-settings";
import { BRANDS, brandHref } from "@/lib/brands";
import { SARTORIAL } from "@/lib/photos";
import ServicesCatalogue from "@/components/ServicesCatalogue";
import ScrollImage from "@/components/motion/ScrollImage";
import Words from "@/components/motion/Words";
import Rise, { RiseGroup, RiseItem } from "@/components/motion/Rise";

const S = BRANDS.sartorial;

export const metadata: Metadata = {
  title: "Treatments",
  description:
    "Five clinical interventions for the executive wardrobe: The Executive Checkup, The Wardrobe Detox, The Sartorial Prescription, The Boardroom Cure and Emergency Consultation. Prices and deposit terms stated.",
};

export default async function ServicesPage() {
  const [services, contact] = await Promise.all([getActiveServices(), getContactSettings()]);

  return (
    <div>
      <section className="mx-auto max-w-[110rem] px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <Words as="h1" text="Treatments" onLoad className="font-display text-5xl leading-[0.95] text-fg sm:text-7xl lg:col-span-7" />
          <Rise as="p" delay={0.3} className="text-base leading-relaxed text-fg-muted/80 lg:col-span-4 lg:col-start-9 lg:pt-4">
            We don&rsquo;t guess. We diagnose the specific friction in how you dress and prescribe the fix, from a thirty-minute consultation
            to a thirty-day transformation. Every fee is written down.
          </Rise>
        </div>

        <Rise delay={0.4} className="mt-12">
          <ScrollImage src={SARTORIAL.treatments} sizes="100vw" priority className="aspect-[16/9] bg-surface sm:aspect-[21/9]" parallax={8} zoom={1.08} />
        </Rise>

        <RiseGroup as="dl" stagger={0.08} className="mt-12 grid gap-x-8 gap-y-6 border-y border-line py-8 text-sm sm:grid-cols-3">
          <RiseItem as="div">
            <dt className="text-xs text-fg-muted/60">To book</dt>
            <dd className="mt-1.5 font-display text-xl text-fg">A deposit secures the appointment</dd>
            <dd className="mt-1 text-fg-muted/70">Paid online, by card or transfer, with your reference.</dd>
          </RiseItem>
          <RiseItem as="div">
            <dt className="text-xs text-fg-muted/60">Balance</dt>
            <dd className="mt-1.5 font-display text-xl text-fg">Before delivery</dd>
            <dd className="mt-1 text-fg-muted/70">Aftercare included with every treatment.</dd>
          </RiseItem>
          <RiseItem as="div">
            <dt className="text-xs text-fg-muted/60">Where</dt>
            <dd className="mt-1.5 font-display text-xl text-fg">{contact.location}</dd>
            <dd className="mt-1 text-fg-muted/70">{contact.locationNote}</dd>
          </RiseItem>
        </RiseGroup>
      </section>

      <section className="py-16 sm:py-20">
        <ServicesCatalogue services={services} contact={contact} showHeading={false} level="h2" />
      </section>

      <section className="mx-auto max-w-[110rem] border-t border-line px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <Rise className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl leading-tight text-fg sm:text-5xl">Not sure which treatment you need?</h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-fg-muted/75">
              Take the Executive Checkup. In under three minutes it reads your profession, your rooms and your complaints, and recommends the
              treatment that fits.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href={brandHref(S, "/checkup")} className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-6 py-3 text-sm font-medium text-bg">
              Start your checkup
            </Link>
            <Link href={brandHref(S, "/case-files")} className="btn-sheen relative inline-flex items-center overflow-hidden border border-fg/40 px-6 py-3 text-sm text-fg">
              Read the case files
            </Link>
          </div>
        </Rise>
      </section>
    </div>
  );
}
