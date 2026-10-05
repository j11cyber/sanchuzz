import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedCaseFiles } from "@/lib/case-files";
import { BRANDS, brandHref } from "@/lib/brands";
import { SARTORIAL } from "@/lib/photos";
import CaseFileDossier from "@/components/clinic/CaseFileDossier";
import ScrollImage from "@/components/motion/ScrollImage";
import Words from "@/components/motion/Words";
import Rise from "@/components/motion/Rise";

const S = BRANDS.sartorial;

export const metadata: Metadata = {
  title: "Case files",
  description:
    "Documented cases from The Fashion Clinic, before and after: Baggy Suit Syndrome, Boardroom Invisibility, Weekend-to-Workwear Whiplash. Symptoms, diagnosis, prescription and result.",
};

export default async function CaseFilesPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const all = await getPublishedCaseFiles();
  const tags = Array.from(new Set(all.flatMap((c) => c.tags)));
  const filtered = tag ? all.filter((c) => c.tags.includes(tag)) : all;
  const base = brandHref(S, "/case-files");

  return (
    <div>
      <section className="mx-auto max-w-[110rem] px-5 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <Words as="h1" text="Case files" onLoad className="font-display text-5xl leading-[0.95] text-fg sm:text-7xl lg:col-span-7" />
          <Rise as="p" delay={0.3} className="text-base leading-relaxed text-fg-muted/80 lg:col-span-4 lg:col-start-9 lg:pt-4">
            Real patients, names withheld. Drag across each photograph to see the before and the after. Every file records the symptoms,
            the diagnosis, the prescription and the result.
          </Rise>
        </div>

        <Rise delay={0.4} className="mt-12">
          <ScrollImage src={SARTORIAL.caseFiles} sizes="100vw" priority className="aspect-[16/9] bg-surface sm:aspect-[21/9]" parallax={8} zoom={1.08} />
        </Rise>

        {tags.length > 0 && (
          <Rise delay={0.5} className="mt-10 border-y border-line py-4">
            <nav className="snap-row no-scrollbar items-center gap-x-6 text-sm sm:flex-wrap sm:overflow-visible" aria-label="Filter by symptom">
              <Link href={base} className={`shrink-0 transition ${!tag ? "text-fg" : "text-fg-muted/60 hover:text-fg"}`} aria-current={!tag ? "page" : undefined}>
                All cases <span className="font-mono text-xs text-fg-muted/60">{all.length}</span>
              </Link>
              {tags.map((t) => (
                <Link key={t} href={`${base}?tag=${encodeURIComponent(t)}`} className={`shrink-0 transition ${tag === t ? "text-fg" : "text-fg-muted/60 hover:text-fg"}`} aria-current={tag === t ? "page" : undefined}>
                  {t}
                </Link>
              ))}
            </nav>
          </Rise>
        )}
      </section>

      <section className="mx-auto max-w-[110rem] space-y-24 px-5 py-20 sm:space-y-32 sm:px-8 sm:py-28 lg:px-12">
        {filtered.length === 0 && <p className="text-sm text-fg-muted/70">No case files under that symptom yet.</p>}
        {filtered.map((cf, i) => (
          <CaseFileDossier key={cf.id} caseFile={cf} flip={i % 2 === 1} level="h2" />
        ))}
      </section>

      <section className="mx-auto max-w-[110rem] border-t border-line px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <Rise className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm text-fg-muted/60">Recognise any of these symptoms?</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-fg sm:text-5xl">Open your own file.</h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-fg-muted/75">
              The Executive Checkup takes three minutes and ends with a Patient File written for you, with a recommended treatment.
            </p>
          </div>
          <Link href={brandHref(S, "/checkup")} className="btn-sheen relative inline-flex items-center overflow-hidden bg-fg px-6 py-3 text-sm font-medium text-bg">
            Start your checkup
          </Link>
        </Rise>
      </section>
    </div>
  );
}
