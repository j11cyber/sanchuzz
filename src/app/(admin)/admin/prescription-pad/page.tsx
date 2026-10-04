import { getPrescriptionPadSettings } from "@/lib/site-settings";
import { savePrescriptionPadSettingsAction } from "@/lib/actions/admin-sartorial";

export const metadata = { title: "Prescription Pad Settings · Admin" };

export default async function AdminPrescriptionPadPage() {
  const settings = await getPrescriptionPadSettings();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-cream">Prescription Pad Configurations</h1>
        <p className="mt-1 text-xs text-cream-dim/70">
          Configure the official clinic header credentials, consultant signature title, and confidential disclaimer across patient documents.
        </p>
      </div>

      <form action={savePrescriptionPadSettingsAction} className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Clinic Name</label>
          <input
            name="clinicName"
            defaultValue={settings.clinicName}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Clinic Tagline</label>
          <input
            name="tagline"
            defaultValue={settings.tagline}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Consultant Signoff Name</label>
            <input
              name="consultantName"
              defaultValue={settings.consultantName}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-cream-dim/60">Consultant Title</label>
            <input
              name="consultantTitle"
              defaultValue={settings.consultantTitle}
              className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-cream-dim/60">Confidential Disclaimer Note</label>
          <textarea
            name="disclaimer"
            rows={3}
            defaultValue={settings.disclaimer}
            className="mt-1 w-full rounded-xl border border-charcoal-700 bg-charcoal-950 px-4 py-2.5 text-xs text-cream focus:border-gold focus:outline-none"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="rounded-full bg-gold px-8 py-3 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
