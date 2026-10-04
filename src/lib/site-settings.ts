import { prisma } from "@/lib/prisma";

export type SectionToggles = {
  section_hero: boolean;
  section_brand_positioning: boolean;
  section_clinical_process: boolean;
  section_sartorial_executive: boolean;
  section_services: boolean;
  section_case_files: boolean;
  section_checkup: boolean;
  section_prescription_pad: boolean;
  section_shop: boolean;
  section_story: boolean;
  section_aftercare: boolean;
};

export const DEFAULT_SECTION_TOGGLES: SectionToggles = {
  section_hero: true,
  section_brand_positioning: true,
  section_clinical_process: true,
  section_sartorial_executive: true,
  section_services: true,
  section_case_files: true,
  section_checkup: true,
  section_prescription_pad: true,
  section_shop: true,
  section_story: true,
  section_aftercare: true,
};

export async function getSectionToggles(): Promise<SectionToggles> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          startsWith: "section_",
        },
      },
    });

    const toggles = { ...DEFAULT_SECTION_TOGGLES };

    for (const setting of settings) {
      try {
        const parsed = JSON.parse(setting.value);
        const key = setting.key as keyof SectionToggles;
        if (key in toggles && typeof parsed.isEnabled === "boolean") {
          toggles[key] = parsed.isEnabled;
        }
      } catch {
        // ignore parse error
      }
    }

    return toggles;
  } catch (err) {
    console.error("Error reading section toggles:", err);
    return DEFAULT_SECTION_TOGGLES;
  }
}

export type SartorialContent = {
  eyebrow: string;
  heading: string;
  subheading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
};

export async function getSartorialExecutiveContent(): Promise<SartorialContent> {
  const defaultContent: SartorialContent = {
    eyebrow: "THE ULTIMATE OUTCOME",
    heading: "The Sartorial Executive",
    subheading: "Not just well dressed. Authoritative, intentional, and undeniable.",
    description: "The Sartorial Executive is the definitive transformation. It is the transition from accidental clothing choices to an engineered visual identity that communicates leadership before you say a single word.",
    ctaText: "Book Your Executive Checkup",
    ctaLink: "/sartorial-executive/checkup",
  };

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "sartorial_executive_content" },
    });
    if (!setting) return defaultContent;
    const parsed = JSON.parse(setting.value);
    return { ...defaultContent, ...parsed };
  } catch {
    return defaultContent;
  }
}

export type PrescriptionPadSettings = {
  clinicName: string;
  tagline: string;
  consultantName: string;
  consultantTitle: string;
  disclaimer: string;
};

export async function getPrescriptionPadSettings(): Promise<PrescriptionPadSettings> {
  const defaultSettings: PrescriptionPadSettings = {
    clinicName: "THE FASHION CLINIC",
    tagline: "DIAGNOSE. PRESCRIBE. TRANSFORM.",
    consultantName: "Lead Sartorial Consultant",
    consultantTitle: "Executive Image Director",
    disclaimer: "CONFIDENTIAL SARTORIAL DOSSIER · STRICTLY FOR EXECUTIVE WARDROBE TRANSFORMATION",
  };

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "prescription_pad_settings" },
    });
    if (!setting) return defaultSettings;
    const parsed = JSON.parse(setting.value);
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}
