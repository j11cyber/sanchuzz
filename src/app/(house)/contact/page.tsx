import type { Metadata } from "next";
import Link from "next/link";
import { BRANDS, brandHref, HOUSE_NAME } from "@/lib/brands";
import { whatsappLink } from "@/lib/contact";
import { getContactSettings } from "@/lib/site-settings";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach ${HOUSE_NAME}: WhatsApp, email, or book a consultation.`,
};

export default async function ContactPage() {
  const contact = await getContactSettings();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="font-display text-5xl leading-[1.02] text-fg sm:text-7xl">Contact the house</h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted/80">
        For an order, a commission or a consultation. The fastest route is WhatsApp.
      </p>

      <div className="mt-16 grid gap-16 lg:grid-cols-12">
        <dl className="divide-y divide-line border-y border-line lg:col-span-5">
          <div className="py-6">
            <dt className="text-sm text-fg-muted/60">The atelier</dt>
            <dd className="mt-2 font-display text-2xl text-fg">{contact.location}</dd>
            <dd className="mt-2 text-sm leading-relaxed text-fg-muted/75">Private appointments, scheduled in advance. {contact.locationNote}</dd>
          </div>
          <div className="py-6">
            <dt className="text-sm text-fg-muted/60">Hours</dt>
            <dd className="mt-2 space-y-0.5 text-sm text-fg-muted/85">
              {contact.hours.map((h) => (
                <div key={h}>{h}</div>
              ))}
            </dd>
          </div>
          <div className="py-6">
            <dt className="text-sm text-fg-muted/60">Direct</dt>
            <dd className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a
                href={whatsappLink(contact.whatsappNumber, `Hello ${HOUSE_NAME}, I have an enquiry.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-accent pb-0.5 text-fg transition hover:text-accent"
              >
                WhatsApp
              </a>
              <a href={`mailto:${contact.contactEmail}`} className="border-b border-line pb-0.5 text-fg-muted transition hover:border-accent hover:text-accent">
                {contact.contactEmail}
              </a>
            </dd>
          </div>
          <div className="py-6">
            <dt className="text-sm text-fg-muted/60">Or go straight to</dt>
            <dd className="mt-3 space-y-2 text-sm">
              <Link href={brandHref(BRANDS.sartorial, "/book")} className="block text-fg transition hover:text-accent">
                Book a Sartorial Executive consultation
              </Link>
              <Link href={brandHref(BRANDS.santus, "/commission")} className="block text-fg transition hover:text-accent">
                Commission a piece from Santus Sabaoth
              </Link>
            </dd>
          </div>
        </dl>

        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm contact={contact} />
        </div>
      </div>
    </div>
  );
}
