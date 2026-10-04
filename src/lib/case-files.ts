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
  published: boolean;
};

type Row = {
  id: string;
  caseNumber: string;
  slug: string;
  title: string;
  symptoms: string;
  diagnosis: string;
  prescription: string;
  result: string;
  beforeImage: string | null;
  afterImage: string | null;
  tags: string;
  order: number;
  published: boolean;
};

function hydrate(c: Row): CaseFileType {
  return {
    ...c,
    symptoms: safeParseArray(c.symptoms),
    prescription: safeParseArray(c.prescription),
    tags: safeParseArray(c.tags),
  };
}

/** Published case files, in display order. */
export async function getPublishedCaseFiles(): Promise<CaseFileType[]> {
  try {
    const cases = await prisma.caseFile.findMany({ where: { published: true }, orderBy: { order: "asc" } });
    return cases.map(hydrate);
  } catch (err) {
    console.error("Error loading case files:", err);
    return [];
  }
}


export async function getAllCaseFilesAdmin(): Promise<CaseFileType[]> {
  try {
    const cases = await prisma.caseFile.findMany({ orderBy: { order: "asc" } });
    return cases.map(hydrate);
  } catch (err) {
    console.error("Error loading all case files:", err);
    return [];
  }
}

export async function getCaseFileBySlug(slug: string): Promise<CaseFileType | null> {
  try {
    const caseItem = await prisma.caseFile.findUnique({ where: { slug } });
    return caseItem ? hydrate(caseItem) : null;
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
