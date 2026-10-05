import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getActiveServices, getServiceBySlug, depositFor } from "@/lib/services";
import { getContactSettings } from "@/lib/site-settings";
import { formatNaira } from "@/lib/money";
import { BRANDS, brandHref } from "@/lib/brands";
import { whatsappLink } from "@/lib/contact";
import { SARTORIAL } from "@/lib/photos";
import ScrollImage from "@/components/motion/ScrollImage";
import Words from "@/components/motion/Words";
import Rise, { RiseGroup, RiseItem } from "@/components/motion/Rise";

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

  const all = await getActiveServices();
  const index = all.findIndex((s) => s.slug === service.slug);
  const others = all.filter((s) => s.slug !== service.slug);
  const deposit = depositFor(service);
  const balance = service.price - deposit;
  const wa = whatsappLink(contact.whatsappNumber, `Hello Sartorial Executive, I have a question about ${service.name}.`);

  return (
    <div className="mx-auto max-w-[110rem] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
      <Rise>
        <nav className="flex items-center gap-3 text-xs text-fg-muted/60" aria-label="Breadcrumb">
          <Link href={brandHref(S, "/services")} className="link-line hover:text-fg">
            Treatments
          </Link>
          <span aria-hidden>/</span>
          <span className="text-fg-muted/80">{service.name}</span>
        </nav>
      </Rise>

      <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Rise as="p" className="font-mono text-xs text-fg-muted/60">
            {index >= 0 ? `Treatment ${String(index + 1).padStart(2, "0")}` : "Treatment"}
            {service.duration ? ` · ${service.duration}` : ""}
          </Rise>
          <Words as="h1" text={service.name} onLoad delay={0.05} className="mt-3 font-display text-5xl leading-[0.98] text-fg sm:text-7xl" />
          <Rise as="p" delay={0.3} className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted/85">
            {service.description}
          </Rise>

          <Rise delay={0.4} className="mt-10">
            <ScrollImage src={service.image ?? SARTORIAL.treatments} sizes="(min-width: 1024px) 60vw, 100vw" priority className="aspect-[16/10] bg-surface" parallax={8} zoom={1.08} />
          </Rise>

          <div className="mt-14 grid gap-12 sm:grid-cols-2">
            <div>
              <Rise as="h2" className="text-sm text-fg-muted/60">
                What is included
              </Rise>
              <RiseGroup as="ul" stagger={0.06} className="mt-4 divide-y divide-line border-y border-line">
                {service.features.map((f, i) => (
                  <RiseItem key={i} as="li" className="flex items-start gap-4 py-3.5 text-base text-fg">
                    <span className="mt-1 font-mono text-xs text-mark">{String(i + 1).padStart(2, "0")}</span>
                    <span>{f}</span>
                  </RiseItem>
                ))}
              </RiseGroup>
            </div>
            <div>
              <Rise as="h2" className="text-sm text-fg-muted/60">
                Indicated for
              </Rise>
              <Rise as="p" delay={0.1} className="mt-4 font-display text-2xl leading-snug text-fg">
                {service.bestFor}
              </Rise>
              <Rise as="p" delay={0.2} className="mt-6 text-sm leading-relaxed text-fg-muted/75">
                Not certain this is the right treatment? The Executive Checkup reads your situation and recommends one in three minutes.{" "}
                <Link href={brandHref(S, "/checkup")} className="link-line text-fg">
                  Start the checkup
                </Link>
                .
              </Rise>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <Rise delay={0.2} className="border-glint relative overflow-hidden border border-line bg-surface p-6 sm:p-8 lg:sticky lg:top-28">
            <p className="text-xs text-fg-muted/60">Fee</p>
            <p className="mt-1 font-display text-4xl text-fg sm:text-5xl">{formatNaira(service.price)}</p>
            <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-fg-muted/60">Deposit to book ({service.depositPercent}%)</dt>
                <dd className="text-fg">{formatNaira(deposit)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-fg-muted/60">Balance before delivery</dt>
                <dd className="text-fg">{formatNaira(balance)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-fg-muted/60">Aftercare</dt>
                <dd className="text-fg">Included</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-fg-muted/60">Where</dt>
                <dd className="text-right text-fg">{contact.location.split(",")[0]}, or a house call</dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-col gap-3">
              <Link href={brandHref(S, `/book?service=${encodeURIComponent(service.slug)}`)} className="btn-sheen relative inline-flex items-center justify-center overflow-hidden bg-fg px-6 py-3.5 text-sm font-medium text-bg">
                Pay deposit · {formatNaira(deposit)}
              </Link>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-sheen relative inline-flex items-center justify-center overflow-hidden border border-fg/40 px-6 py-3.5 text-sm text-fg">
                Talk on WhatsApp
              </a>
            </div>
            <p className="mt-4 text-center text-xs text-fg-muted/60">We confirm the time with you on WhatsApp after the deposit.</p>
          </Rise>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="mt-24 border-t border-line pt-14">
          <Rise className="flex items-end justify-between gap-6">
            <h2 className="font-display text-3xl text-fg sm:text-4xl">Other treatments</h2>
            <Link href={brandHref(S, "/services")} className="link-line text-sm text-fg-muted hover:text-fg">
              The full menu
            </Link>
          </Rise>
          <RiseGroup as="ul" stagger={0.06} className="mt-8 divide-y divide-line border-y border-line">
            {others.map((s) => (
              <RiseItem key={s.id} as="li">
                <Link href={brandHref(S, `/services/${s.slug}`)} className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="font-display text-2xl text-fg transition group-hover:text-accent">{s.name}</span>
                  <span className="flex items-baseline gap-4 text-sm text-fg-muted/70">
                    {s.duration && <span>{s.duration}</span>}
                    <span className="font-display text-xl text-fg">{formatNaira(s.price)}</span>
                  </span>
                </Link>
              </RiseItem>
            ))}
          </RiseGroup>
        </section>
      )}
    </div>
  );
}
