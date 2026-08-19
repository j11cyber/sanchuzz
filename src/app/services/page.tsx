import Link from "next/link";
import type { Metadata } from "next";
import { getActiveServices } from "@/lib/services";
import ServicesCatalogue from "@/components/ServicesCatalogue";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Clinical Services & Prescriptions",
  description:
    "The Fashion Clinic offers five distinct clinical interventions: The Executive Checkup (₦50k), The Wardrobe Detox (₦120k), The Sartorial Prescription (₦250k), The Boardroom Cure (₦400k), and Emergency Consultation (₦75k).",
};

export default async function ServicesPage() {
  const services = await getActiveServices();

  return (
    <div className="space-y-16 py-12 sm:space-y-20 sm:py-16">
      {/* Header Banner */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <ScrollReveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-charcoal-900 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            CLINICAL SERVICE CATALOGUE
          </span>
          <h1 className="mt-4 font-display text-4xl text-cream sm:text-6xl">
            Diagnose. Prescribe. Solve.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-cream-dim/80 sm:text-base">
            We don&rsquo;t guess. We diagnose your specific styling friction points and prescribe targeted executive solutions — from rapid 30-minute flaw identification to comprehensive 30-day executive presence mastery.
          </p>
        </ScrollReveal>
      </section>

      {/* Services Grid */}
      <section>
        <ServicesCatalogue services={services} showHeading={false} />
      </section>

      {/* Philosophy Callout */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 rounded-3xl border border-charcoal-800 bg-navy-950/70 p-8 sm:p-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
              First-Time Patient Protocol
            </span>
            <h2 className="mt-2 font-display text-2xl text-cream sm:text-3xl">
              Not Sure Which Intervention You Need?
            </h2>
            <p className="mt-4 text-xs leading-relaxed text-cream-dim/75">
              Take our interactive online Executive Checkup. In less than 3 minutes, our diagnostic engine evaluates your profession, wardrobe complaints, and style milestones to generate a personalized Patient File (#TFC-XXXX) and matched service recommendation.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/executive-checkup"
              className="rounded-full bg-gold px-8 py-3.5 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft text-center"
            >
              Take Online Checkup
            </Link>
            <Link
              href="/case-files"
              className="rounded-full border border-charcoal-700 bg-charcoal-900 px-6 py-3.5 text-xs font-medium text-cream transition hover:border-gold hover:text-gold text-center"
            >
              Browse Case Files
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
