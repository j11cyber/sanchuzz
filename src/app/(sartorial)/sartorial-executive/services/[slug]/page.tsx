import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getActiveServices, getServiceBySlug, depositFor } from "@/lib/services";
import { getContactSettings } from "@/lib/site-settings";
import { formatNaira } from "@/lib/money";
import { BRANDS, brandHref } from "@/lib/brands";
import { whatsappLink } from "@/lib/contact";

const S = BRANDS.sartorial;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return { title: service.name, description: service.description };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, contact] = await Promise.all([getServiceBySlug(slug), getContactSettings()]);
  if (!service || !service.active) notFound();

  const others = (await getActiveServices()).filter((s) => s.slug !== service.slug);
  const deposit = depositFor(service);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <nav className="text-xs text-fg-muted/50" aria-label="Breadcrumb">
        <Link href={brandHref(S, "/services")} className="hover:text-accent">
          Treatments
        </Link>
        <span className="mx-2">/</span>
        <span className="text-fg-muted/80">{service.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          {service.image && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-surface">
              <Image src={service.image} alt={service.name} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            </div>
          )}
          <h1 className="mt-8 font-display text-4xl text-fg sm:text-5xl">{service.name}</h1>
          {service.duration && <p className="mt-2 text-sm text-fg-muted/70">{service.duration}</p>}
          <p className="mt-6 text-base leading-relaxed text-fg-muted/85">{service.description}</p>

          <h2 className="mt-10 font-display text-2xl text-fg">What is included</h2>
          <ul className="mt-4 space-y-3">
            {service.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-fg-muted/85">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mark" aria-hidden />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-display text-2xl text-fg">Indicated for</h2>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted/80">{service.bestFor}</p>
        </div>

        <aside className="h-fit rounded-2xl border border-accent/40 bg-surface p-6 lg:sticky lg:top-24">
          <div className="font-display text-3xl text-accent">{formatNaira(service.price)}</div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-fg-muted/60">Deposit to book ({service.depositPercent}%)</dt>
              <dd className="text-fg">{formatNaira(deposit)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-fg-muted/60">Balance</dt>
              <dd className="text-fg">Before delivery</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-fg-muted/60">Aftercare</dt>
              <dd className="text-fg">Included</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-fg-muted/60">Where</dt>
              <dd className="text-right text-fg">{contact.location}, or a house call</dd>
            </div>
          </dl>
          <Link
            href={brandHref(S, `/book?service=${encodeURIComponent(service.slug)}`)}
            className="mt-6 block rounded-full bg-accent py-3.5 text-center text-sm font-semibold text-bg transition hover:bg-accent-soft"
          >
            Book this treatment
          </Link>
          <a
            href={whatsappLink(contact.whatsappNumber, `Hello Sartorial Executive, I have a question about ${service.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-center text-xs text-fg-muted/70 underline underline-offset-4 hover:text-accent"
          >
            Prefer to talk first? Message us on WhatsApp
          </a>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="font-display text-2xl text-fg">Other treatments</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <li key={s.id}>
                <Link href={brandHref(S, `/services/${s.slug}`)} className="block rounded-xl border border-line bg-surface p-4 transition hover:border-accent/50">
                  <div className="font-display text-lg text-fg">{s.name}</div>
                  <div className="mt-1 text-sm text-accent">{formatNaira(s.price)}</div>
                  {s.duration && <div className="mt-1 text-xs text-fg-muted/60">{s.duration}</div>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
