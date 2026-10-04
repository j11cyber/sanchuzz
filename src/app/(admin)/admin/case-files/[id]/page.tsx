import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { upsertCaseFileAction } from "@/lib/actions/admin-case-files";

export const metadata = { title: "Edit Case File · Admin" };

export default async function EditCaseFilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caseFile = await prisma.caseFile.findUnique({ where: { id } });
  if (!caseFile) notFound();

  let symptomsList: string[] = [];
  let rxList: string[] = [];
  let tagsList: string[] = [];

  try {
    symptomsList = JSON.parse(caseFile.symptoms);
  } catch {}
  try {
    rxList = JSON.parse(caseFile.prescription);
  } catch {}
  try {
    tagsList = JSON.parse(caseFile.tags);
  } catch {}

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/admin/case-files" className="text-xs text-gold hover:underline">
          &larr; Back to Case Files
        </Link>
        <h1 className="mt-2 font-display text-3xl text-cream">
          Edit Case File: {caseFile.caseNumber} &middot; {caseFile.title}
        </h1>
      </div>

      <form action={upsertCaseFileAction} className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 space-y-4">
        <input type="hidden" name="id" value={caseFile.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Case Number *</label>
            <input
              required
              name="caseNumber"
              defaultValue={caseFile.caseNumber}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Slug *</label>
            <input
              required
              name="slug"
              defaultValue={caseFile.slug}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Title *</label>
          <input
            required
            name="title"
            defaultValue={caseFile.title}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Clinical Diagnosis *</label>
          <textarea
            required
            name="diagnosis"
            rows={2}
            defaultValue={caseFile.diagnosis}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Reported Symptoms (one per line)</label>
          <textarea
            name="symptoms"
            rows={3}
            defaultValue={symptomsList.join("\n")}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Tailored Prescription (one per line)</label>
          <textarea
            name="prescription"
            rows={3}
            defaultValue={rxList.join("\n")}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Transformation Result</label>
          <textarea
            name="result"
            rows={2}
            defaultValue={caseFile.result}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Before Image URL</label>
            <input
              name="beforeImage"
              defaultValue={caseFile.beforeImage ?? ""}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">After Image URL</label>
            <input
              name="afterImage"
              defaultValue={caseFile.afterImage ?? ""}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Tags (comma-separated)</label>
            <input
              name="tags"
              defaultValue={tagsList.join(", ")}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Display Order</label>
            <input
              type="number"
              name="order"
              defaultValue={caseFile.order}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            name="published"
            id="published"
            defaultChecked={caseFile.published}
            className="h-4 w-4 rounded border-charcoal-700 text-gold focus:ring-gold"
          />
          <label htmlFor="published" className="text-xs text-cream">
            Published on the public site
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="rounded-full bg-gold px-8 py-3 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
