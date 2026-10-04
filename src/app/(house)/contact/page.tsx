import type { Metadata } from "next";
import Link from "next/link";
import { BRANDS, brandHref, HOUSE_NAME } from "@/lib/brands";
import { ATELIER_LOCATION, ATELIER_NOTE, CONSULTATION_HOURS, CONTACT_EMAIL, whatsappLink } from "@/lib/contact";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach ${HOUSE_NAME} in ${ATELIER_LOCATION}: WhatsApp, email, or book a consultation.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl text-fg sm:text-6xl">Contact the house</h1>
        <p className="mt-4 text-sm leading-relaxed text-fg-muted/80 sm:text-base">
          For an order, a commission or a consultation. The fastest route is WhatsApp.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-10">
          <ContactForm />
        </div>

        <div className="space-y-6">
          <div className="space-y-6 rounded-3xl border border-line bg-surface p-6 sm:p-8">
            <div>
              <div className="text-xs text-accent">The atelier</div>
              <h2 className="mt-1 font-display text-2xl text-fg">{ATELIER_LOCATION}</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted/75">
                Private appointments, scheduled in advance. {ATELIER_NOTE}
              </p>
            </div>
            <div className="border-t border-line pt-4">
              <div className="text-xs text-accent">Hours</div>
              <ul className="mt-1 space-y-0.5 text-sm text-fg-muted/75">
                {CONSULTATION_HOURS.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
            <div className="border-t border-line pt-4">
              <div className="text-xs text-accent">Direct</div>
              <div className="mt-2 flex flex-wrap gap-3">
                <a href={whatsappLink(`Hello ${HOUSE_NAME}, I have an enquiry.`)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent-soft">
                  WhatsApp
                </a>
                <a href={`mailto:${CONTACT_EMAIL}`} className="rounded-full border border-line px-4 py-2 text-sm text-fg-muted transition hover:border-accent hover:text-accent">
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link href={brandHref(BRANDS.sartorial, "/book")} className="rounded-2xl border border-line bg-surface p-5 transition hover:border-accent/50">
              <div className="text-xs text-accent">Sartorial Executive</div>
              <div className="mt-1 font-display text-lg text-fg">Book a consultation</div>
            </Link>
            <Link href={brandHref(BRANDS.santus, "/commission")} className="rounded-2xl border border-line bg-surface p-5 transition hover:border-accent/50">
              <div className="text-xs text-accent">Santus Sabaoth</div>
              <div className="mt-1 font-display text-lg text-fg">Commission a piece</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
