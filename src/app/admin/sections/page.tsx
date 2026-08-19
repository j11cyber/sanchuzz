import { getSectionToggles } from "@/lib/site-settings";
import { saveAllSectionsAction } from "@/lib/actions/admin-sections";

export const metadata = { title: "Section Management · Admin" };

const SECTIONS = [
  { key: "section_hero", label: "Hero Banner", desc: "Main headline ('You don't need more clothes. You need a diagnosis.') and primary booking CTAs" },
  { key: "section_brand_positioning", label: "Brand Positioning & Philosophy", desc: "The 'We don't guess. We diagnose.' editorial statement and formula" },
  { key: "section_clinical_process", label: "5-Step Clinical Process", desc: "01 Diagnose → 02 Prescribe → 03 Treat → 04 Transform → 05 Sartorial Executive" },
  { key: "section_sartorial_executive", label: "The Sartorial Executive Feature", desc: "Core brand transformation highlight, pillars, and blueprint CTA" },
  { key: "section_services", label: "Clinical Services Catalogue", desc: "The 5 official services grid (Checkup, Detox, Prescription, Boardroom, Emergency)" },
  { key: "section_case_files", label: "Case Files Dossiers", desc: "Real transformation case studies with before/after comparisons" },
  { key: "section_checkup", label: "Executive Checkup Interactive Launcher", desc: "3-minute style assessment launcher banner" },
  { key: "section_shop", label: "Prescription Shop / Spotlight Pieces", desc: "Featured tailoring, blazers, and luxury menswear pieces" },
  { key: "section_prescription_pad", label: "Prescription Pad Concept Card", desc: "Editorial prescription document preview and generator CTA" },
  { key: "section_story", label: "Philosophy & Atelier Craft", desc: "Story of precision craft and bespoke heritage" },
  { key: "section_aftercare", label: "Aftercare & Garment Longevity Notes", desc: "Care guides from the atelier and concierge support" },
];

export default async function AdminSectionsPage() {
  const toggles = await getSectionToggles();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-cream">Homepage Section Controls</h1>
        <p className="mt-1 text-xs text-cream-dim/70">
          Enable or disable any homepage section in real-time. When toggled OFF, the section cleanly disappears from the public website with zero empty space or errors.
        </p>
      </div>

      <form action={saveAllSectionsAction} className="mt-8 space-y-4">
        <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 divide-y divide-charcoal-800">
          {SECTIONS.map((s) => {
            const isChecked = toggles[s.key as keyof typeof toggles] ?? true;
            return (
              <div key={s.key} className="flex items-center justify-between p-4 sm:p-5">
                <div className="max-w-lg">
                  <div className="font-display text-sm text-cream">{s.label}</div>
                  <div className="text-xs text-cream-dim/60 mt-0.5">{s.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name={s.key}
                    defaultChecked={isChecked}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-charcoal-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-charcoal-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            );
          })}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="rounded-full bg-gold px-8 py-3 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
          >
            Save Section Visibility
          </button>
        </div>
      </form>
    </div>
  );
}
