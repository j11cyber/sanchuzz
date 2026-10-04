import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/products";
import { getActiveServices } from "@/lib/services";
import { getPublishedCaseFiles } from "@/lib/case-files";
import { BRANDS, brandHref, productHref, type StoreSection } from "@/lib/brands";

export type SearchResult = {
  id: string;
  type: "product" | "service" | "case-file" | "guide";
  title: string;
  subtitle: string;
  description: string;
  href: string;
  badge?: string;
  image?: string | null;
  price?: number;
};

export async function searchSite(query: string): Promise<SearchResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { brand: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 6,
    });

    for (const p of products) {
      const sp = serializeProduct(p);
      const section = p.section as StoreSection;
      results.push({
        id: `prod-${p.id}`,
        type: "product",
        title: p.name,
        subtitle: p.brand ? `${p.brand} · ${p.category}` : p.category,
        description: p.description.slice(0, 120) + "…",
        href: productHref(section, p.slug),
        badge: section === "SANTUS_SABAOTH" ? "Santus Sabaoth" : "Sartorial Executive",
        image: sp.images[0] || null,
        price: p.price,
      });
    }

    const services = await getActiveServices();
    const matchedServices = services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.bestFor.toLowerCase().includes(q) ||
        s.features.some((f) => f.toLowerCase().includes(q)),
    );

    for (const s of matchedServices) {
      results.push({
        id: `srv-${s.id}`,
        type: "service",
        title: s.name,
        subtitle: s.duration || "Treatment",
        description: s.description,
        href: brandHref(BRANDS.sartorial, `/services/${s.slug}`),
        badge: "Treatment",
        image: s.image,
        price: s.price,
      });
    }

    const caseFiles = await getPublishedCaseFiles();
    const matchedCases = caseFiles.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.diagnosis.toLowerCase().includes(q) ||
        c.symptoms.some((sym) => sym.toLowerCase().includes(q)) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );

    for (const c of matchedCases) {
      results.push({
        id: `case-${c.id}`,
        type: "case-file",
        title: `Case file #${c.caseNumber}: ${c.title}`,
        subtitle: "Case file",
        description: c.diagnosis,
        href: brandHref(BRANDS.sartorial, `/case-files#case-${c.caseNumber}`),
        badge: "Case file",
        image: c.afterImage || c.beforeImage,
      });
    }

    const articles = await prisma.guideArticle.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 4,
    });

    for (const a of articles) {
      results.push({
        id: `art-${a.id}`,
        type: "guide",
        title: a.title,
        subtitle: `Guide · ${a.category}`,
        description: a.excerpt,
        href: `/guide/${a.slug}`,
        badge: "Guide",
        image: a.coverImage,
      });
    }
  } catch (err) {
    console.error("Search query error:", err);
  }

  return results;
}
