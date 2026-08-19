import Link from "next/link";
import type { Metadata } from "next";
import { getActiveCaseFiles } from "@/lib/case-files";
import CaseFileCard from "@/components/CaseFileCard";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Case Files · Clinical Transformations",
  description:
    "Explore real style case files from The Fashion Clinic: Baggy Suit Syndrome (#07), Boardroom Invisibility (#12), Weekend-to-Workwear Whiplash (#03), and more.",
};

export default async function CaseFilesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const allCaseFiles = await getActiveCaseFiles();

  const allTags = Array.from(
    new Set(allCaseFiles.flatMap((c) => c.tags))
  );

  const filtered = tag
    ? allCaseFiles.filter((c) => c.tags.includes(tag))
    : allCaseFiles;

  return (
    <div className="space-y-16 py-12 sm:space-y-20 sm:py-16">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <ScrollReveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-charcoal-900 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            CLINICAL DOSSIERS &middot; PATIENT CASE STUDIES
          </span>
          <h1 className="mt-4 font-display text-4xl text-cream sm:text-6xl">
            Case Files Archive
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream-dim/80 sm:text-base">
            Every man has a style blindspot. Inspect our documented case studies to examine reported symptoms, anatomical diagnoses, tailored prescriptions, and resolved executive outcomes.
          </p>
        </ScrollReveal>

        {/* Tag Filters */}
        <div className="snap-row no-scrollbar mt-8 sm:flex-wrap sm:overflow-visible">
          <Link
            href="/case-files"
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition ${
              !tag
                ? "border-gold bg-gold text-charcoal-950 font-semibold"
                : "border-charcoal-700 text-cream-dim hover:border-gold/60 hover:text-gold"
            }`}
          >
            All Cases ({allCaseFiles.length})
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/case-files?tag=${encodeURIComponent(t)}`}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition ${
                tag === t
                  ? "border-gold bg-gold text-charcoal-950 font-semibold"
                  : "border-charcoal-700 text-cream-dim hover:border-gold/60 hover:text-gold"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      </section>

      {/* Case Files Grid */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((caseFile) => (
            <CaseFileCard key={caseFile.id} caseFile={caseFile} />
          ))}
        </div>
      </section>

      {/* Diagnostic CTA */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-navy-950 via-charcoal-900 to-navy-950 p-8 sm:p-12 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Recognize Any of These Symptoms?
          </span>
          <h2 className="mt-3 font-display text-3xl text-cream">
            Get Your Own Style Diagnosis
          </h2>
          <p className="mt-3 max-w-lg mx-auto text-xs text-cream-dim/75">
            Take our 3-minute interactive checkup to formulate your personalized Patient File and prescription.
          </p>
          <div className="mt-6">
            <Link
              href="/executive-checkup"
              className="rounded-full bg-emerald-500 px-8 py-3.5 text-xs font-bold text-charcoal-950 shadow-rx transition hover:bg-emerald-400"
            >
              Start Your Executive Checkup &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
