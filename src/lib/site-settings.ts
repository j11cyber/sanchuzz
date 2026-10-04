import { prisma } from "@/lib/prisma";
import { DEFAULT_CONTACT, type ContactSettings } from "@/lib/contact";

/**
 * Owner-editable settings stored as JSON in SiteSetting.
 *
 * Every key read here has an admin screen, and every admin screen's key is
 * read by a public page:
 *   section_*                  -> Sartorial Executive landing section toggles
 *   sartorial_executive_content-> Sartorial Executive landing spotlight block
 *   prescription_pad_settings  -> Patient File header, signoff and disclaimer on the checkup result
 *   contact                    -> WhatsApp, email, location, hours, socials, site-wide
 */

async function readJson<T>(key: string): Promise<Partial<T> | null> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    if (!row) return null;
    return JSON.parse(row.value) as Partial<T>;
  } catch (err) {
    console.error(`Error reading setting ${key}:`, err);
    return null;
  }
}

/* ---------------------------------------------------------------- sections */

export const SECTION_KEYS = [
  "section_hero",
  "section_brand_positioning",
  "section_clinical_process",
  "section_sartorial_executive",
  "section_services",
  "section_case_files",
  "section_checkup",
  "section_shop",
  "section_aftercare",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];
export type SectionToggles = Record<SectionKey, boolean>;

export const DEFAULT_SECTION_TOGGLES: SectionToggles = Object.fromEntries(SECTION_KEYS.map((k) => [k, true])) as SectionToggles;

export async function getSectionToggles(): Promise<SectionToggles> {
  const toggles = { ...DEFAULT_SECTION_TOGGLES };
  try {
    const settings = await prisma.siteSetting.findMany({ where: { key: { startsWith: "section_" } } });
    for (const setting of settings) {
      if (!(SECTION_KEYS as readonly string[]).includes(setting.key)) continue;
      try {
        const parsed = JSON.parse(setting.value);
        if (typeof parsed.isEnabled === "boolean") toggles[setting.key as SectionKey] = parsed.isEnabled;
      } catch {
        // ignore malformed row
      }
    }
  } catch (err) {
    console.error("Error reading section toggles:", err);
  }
  return toggles;
}

/* ------------------------------------------------------------- spotlight */

export type SartorialContent = {
  eyebrow: string;
  heading: string;
  subheading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
};

export const DEFAULT_SARTORIAL_CONTENT: SartorialContent = {
  eyebrow: "The outcome",
  heading: "The Sartorial Executive",
  subheading: "Not just well dressed. Authoritative, intentional, and undeniable.",
  description:
    "The Sartorial Executive is the definitive transformation. It is the move from accidental clothing choices to an engineered visual identity that communicates leadership before you say a word.",
  ctaText: "Start your checkup",
  ctaLink: "/sartorial-executive/checkup",
};

export async function getSartorialExecutiveContent(): Promise<SartorialContent> {
  const parsed = await readJson<SartorialContent>("sartorial_executive_content");
  return { ...DEFAULT_SARTORIAL_CONTENT, ...(parsed ?? {}) };
}

/* ------------------------------------------------------- prescription pad */

export type PrescriptionPadSettings = {
  clinicName: string;
  tagline: string;
  consultantName: string;
  consultantTitle: string;
  disclaimer: string;
};

export const DEFAULT_PRESCRIPTION_PAD: PrescriptionPadSettings = {
  clinicName: "The Fashion Clinic",
  tagline: "Diagnose. Prescribe. Transform.",
  consultantName: "Lead Sartorial Consultant",
  consultantTitle: "Executive Image Director",
  disclaimer: "Confidential patient record. Prepared for executive wardrobe transformation.",
};

export async function getPrescriptionPadSettings(): Promise<PrescriptionPadSettings> {
  const parsed = await readJson<PrescriptionPadSettings>("prescription_pad_settings");
  return { ...DEFAULT_PRESCRIPTION_PAD, ...(parsed ?? {}) };
}

/* ---------------------------------------------------------------- contact */

export async function getContactSettings(): Promise<ContactSettings> {
  const parsed = await readJson<ContactSettings>("contact");
  const merged = { ...DEFAULT_CONTACT, ...(parsed ?? {}) };
  if (!Array.isArray(merged.hours)) merged.hours = DEFAULT_CONTACT.hours;
  return merged;
}
