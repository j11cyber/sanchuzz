import { prisma } from "@/lib/prisma";

export type CaseFileType = {
  id: string;
  caseNumber: string;
  slug: string;
  title: string;
  symptoms: string[];
  diagnosis: string;
  prescription: string[];
  result: string;
  beforeImage?: string | null;
  afterImage?: string | null;
  tags: string[];
  order: number;
  active: boolean;
};

export async function getActiveCaseFiles(): Promise<CaseFileType[]> {
  try {
    const cases = await prisma.caseFile.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });

    return cases.map((c) => ({
      ...c,
      symptoms: safeParseArray(c.symptoms),
      prescription: safeParseArray(c.prescription),
      tags: safeParseArray(c.tags),
    }));
  } catch (err) {
    console.error("Error loading case files:", err);
    return [];
  }
}

export async function getAllCaseFilesAdmin(): Promise<CaseFileType[]> {
  try {
    const cases = await prisma.caseFile.findMany({
      orderBy: { order: "asc" },
    });

    return cases.map((c) => ({
      ...c,
      symptoms: safeParseArray(c.symptoms),
      prescription: safeParseArray(c.prescription),
      tags: safeParseArray(c.tags),
    }));
  } catch (err) {
    console.error("Error loading all case files:", err);
    return [];
  }
}

export async function getCaseFileBySlug(slug: string): Promise<CaseFileType | null> {
  try {
    const caseItem = await prisma.caseFile.findUnique({
      where: { slug },
    });

    if (!caseItem) return null;

    return {
      ...caseItem,
      symptoms: safeParseArray(caseItem.symptoms),
      prescription: safeParseArray(caseItem.prescription),
      tags: safeParseArray(caseItem.tags),
    };
  } catch (err) {
    console.error("Error loading case file by slug:", err);
    return null;
  }
}

function safeParseArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
