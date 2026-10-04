/**
 * House contact details.
 *
 * TODO(owner): confirm the real WhatsApp number and contact email. Phase 3
 * moves these into SiteSetting so the owner can edit them in admin without a
 * deploy. Until then this is the single place they live; never hard-code them
 * in a page.
 */

/** International format without "+", as wa.me expects. Placeholder until confirmed. */
export const WHATSAPP_NUMBER = "2348000000000";

export const CONTACT_EMAIL = "hello@example.com"; // TODO(owner): confirm

export const ATELIER_LOCATION = "Abuja, FCT, Nigeria";
export const ATELIER_NOTE = "House calls available across Abuja by appointment.";

export const CONSULTATION_HOURS = [
  "Monday to Friday, 9:00 to 18:00 WAT",
  "Saturday, 10:00 to 16:00 WAT",
  "Sunday, emergency consultations by appointment",
];

/** Build a wa.me link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
