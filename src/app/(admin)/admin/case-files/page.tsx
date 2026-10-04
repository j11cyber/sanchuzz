import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteCaseFileAction } from "@/lib/actions/admin-case-files";

export const metadata = { title: "Case Files Manager · Admin" };

export default async function AdminCaseFilesPage() {
  const caseFiles = await prisma.caseFile.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-cream">Case Files Dossiers</h1>
          <p className="mt-1 text-xs text-cream-dim/70">
            Manage transformation case studies, symptoms, anatomical diagnoses, prescriptions, and before/after imagery.
          </p>
        </div>
        <Link
          href="/admin/case-files/new"
          className="rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft inline-block text-center"
        >
          + Add New Case File
        </Link>
      </div>

      <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 overflow-hidden">
        <table className="w-full text-left text-xs text-cream-dim">
          <thead className="border-b border-charcoal-800 bg-charcoal-950/60 text-[10px] uppercase tracking-wider text-gold">
            <tr>
              <th className="p-4">Case #</th>
              <th className="p-4">Title</th>
              <th className="p-4">Diagnosis</th>
              <th className="p-4">Status</th>
              <th className="p-4">Order</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-800/60">
            {caseFiles.map((c) => (
              <tr key={c.id} className="hover:bg-charcoal-800/40 transition">
                <td className="p-4 font-mono text-gold font-bold">{c.caseNumber}</td>
                <td className="p-4">
                  <div className="font-display text-sm text-cream">{c.title}</div>
                  <div className="text-[11px] text-cream-dim/50 font-mono">/{c.slug}</div>
                </td>
                <td className="p-4 max-w-xs truncate text-cream-dim/80">{c.diagnosis}</td>
                <td className="p-4">
                  {c.published ? (
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-charcoal-800 px-2.5 py-0.5 text-[10px] text-cream-dim/50">
                      Hidden
                    </span>
                  )}
                </td>
                <td className="p-4 font-mono">{c.order}</td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/admin/case-files/${c.id}`}
                    className="rounded-lg border border-charcoal-700 bg-charcoal-800 px-3 py-1.5 text-xs text-cream-dim hover:border-gold hover:text-gold"
                  >
                    Edit
                  </Link>
                  <form action={deleteCaseFileAction.bind(null, c.id)} className="inline-block">
                    <button
                      type="submit"
                      className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900/50"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
