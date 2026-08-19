import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/products";
import { getActiveServices } from "@/lib/services";
import { getActiveCaseFiles } from "@/lib/case-files";

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
    // 1. Search Products
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { category: { contains: q } },
          { brand: { contains: q } },
        ],
      },
      take: 6,
    });

    for (const p of products) {
      const sp = serializeProduct(p);
      results.push({
        id: `prod-${p.id}`,
        type: "product",
        title: p.name,
        subtitle: p.brand ? `${p.brand} · ${p.category}` : p.category,
        description: p.description.slice(0, 120) + "...",
        href: `/${p.section === "SANTUS_SABAOTH" ? "santus-sabaoth" : "sartorial-executive"}/${p.slug}`,
        badge: "Product",
        image: sp.images[0] || null,
        price: p.price,
      });
    }

    // 2. Search Services
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
        subtitle: s.duration || "Clinical Service",
        description: s.description,
        href: `/services#${s.slug}`,
        badge: "Service",
        image: s.image,
        price: s.price,
      });
    }

    // 3. Search Case Files
    const caseFiles = await getActiveCaseFiles();
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
        title: `Case #${c.caseNumber}: ${c.title}`,
        subtitle: "Case Study",
        description: c.diagnosis,
        href: `/case-files#case-${c.caseNumber}`,
        badge: "Case File",
        image: c.afterImage || c.beforeImage,
      });
    }

    // 4. Search Guide Articles
    const articles = await prisma.guideArticle.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
          { content: { contains: q } },
          { category: { contains: q } },
        ],
      },
      take: 4,
    });

    for (const a of articles) {
      results.push({
        id: `art-${a.id}`,
        type: "guide",
        title: a.title,
        subtitle: `Aftercare · ${a.category}`,
        description: a.excerpt,
        href: `/guide/${a.slug}`,
        badge: "Aftercare Guide",
        image: a.coverImage,
      });
    }
  } catch (err) {
    console.error("Search query error:", err);
  }

  return results;
}
