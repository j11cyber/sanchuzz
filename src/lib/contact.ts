/**
 * House contact details: types, defaults and pure helpers.
 *
 * The live values are owner-editable in admin and stored in SiteSetting
 * under the key "contact". Server code reads them with getContactSettings()
 * from "@/lib/site-settings" and passes them down to client components.
 * Nothing should import DEFAULT_CONTACT to render a number directly; the
 * defaults exist only as the seed and the fallback when the row is missing.
 */

export type ContactSettings = {
  /** International format without "+", as wa.me expects. */
  whatsappNumber: string;
  contactEmail: string;
  location: string;
  locationNote: string;
  hours: string[];
  instagram: string;
  tiktok: string;
  x: string;
};

/** Seed values. TODO(owner): confirm the real WhatsApp number and email. */
export const DEFAULT_CONTACT: ContactSettings = {
  whatsappNumber: "2348000000000",
  contactEmail: "hello@example.com",
  location: "Abuja, FCT, Nigeria",
  locationNote: "House calls available across Abuja by appointment.",
  hours: ["Monday to Friday, 9:00 to 18:00 WAT", "Saturday, 10:00 to 16:00 WAT", "Sunday, emergency consultations by appointment"],
  instagram: "",
  tiktok: "",
  x: "",
};

/** Build a wa.me link with an optional prefilled message. */
export function whatsappLink(number: string, message?: string): string {
  const digits = number.replace(/[^\d]/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
