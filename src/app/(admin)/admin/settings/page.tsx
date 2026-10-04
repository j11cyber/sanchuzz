import { getContactSettings } from "@/lib/site-settings";
import { saveContactAction } from "@/lib/actions/admin-settings";

export const metadata = { title: "Site settings" };

const input = "mt-1 w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-sm text-fg focus:border-accent focus:outline-none";
const label = "text-xs text-fg-muted/60";

export default async function AdminSettingsPage() {
  const contact = await getContactSettings();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-fg">Site settings</h1>
        <p className="mt-1 text-sm text-fg-muted/70">
          Contact details shown across all three brands: WhatsApp buttons, the footer, the contact and booking pages.
        </p>
      </div>

      <form action={saveContactAction} className="space-y-5 rounded-2xl border border-line bg-surface p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="whatsappNumber" className={label}>
              WhatsApp number (international, digits only, e.g. 2348012345678)
            </label>
            <input id="whatsappNumber" name="whatsappNumber" required inputMode="numeric" defaultValue={contact.whatsappNumber} className={input} />
          </div>
          <div>
            <label htmlFor="contactEmail" className={label}>
              Contact email
            </label>
            <input id="contactEmail" name="contactEmail" type="email" required defaultValue={contact.contactEmail} className={input} />
          </div>
        </div>

        <div>
          <label htmlFor="location" className={label}>
            Location
          </label>
          <input id="location" name="location" required defaultValue={contact.location} className={input} />
        </div>

        <div>
          <label htmlFor="locationNote" className={label}>
            Location note (house calls, appointments)
          </label>
          <input id="locationNote" name="locationNote" defaultValue={contact.locationNote} className={input} />
        </div>

        <div>
          <label htmlFor="hours" className={label}>
            Hours, one line each
          </label>
          <textarea id="hours" name="hours" rows={3} defaultValue={contact.hours.join("\n")} className={input} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="instagram" className={label}>
              Instagram URL
            </label>
            <input id="instagram" name="instagram" type="url" placeholder="https://instagram.com/…" defaultValue={contact.instagram} className={input} />
          </div>
          <div>
            <label htmlFor="tiktok" className={label}>
              TikTok URL
            </label>
            <input id="tiktok" name="tiktok" type="url" placeholder="https://tiktok.com/@…" defaultValue={contact.tiktok} className={input} />
          </div>
          <div>
            <label htmlFor="x" className={label}>
              X URL
            </label>
            <input id="x" name="x" type="url" placeholder="https://x.com/…" defaultValue={contact.x} className={input} />
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-bg transition hover:bg-accent-soft">
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}
