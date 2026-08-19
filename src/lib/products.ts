import { prisma } from "@/lib/prisma";
import type { Product as DbProduct } from "@/generated/prisma/client";

export type StoreSection = "SANTUS_SABAOTH" | "SARTORIAL_EXECUTIVE";

const SECTION_SLUGS: Record<StoreSection, string> = {
  SANTUS_SABAOTH: "santus-sabaoth",
  SARTORIAL_EXECUTIVE: "sartorial-executive",
};

export function sectionToSlug(section: StoreSection) {
  return SECTION_SLUGS[section];
}

export function sectionFromSlug(slug: string): StoreSection | null {
  if (slug === "santus-sabaoth") return "SANTUS_SABAOTH";
  if (slug === "sartorial-executive") return "SARTORIAL_EXECUTIVE";
  return null;
}

export type Product = Omit<DbProduct, "images" | "sizes"> & {
  images: string[];
  sizes: string[];
};

export function serializeProduct(p: DbProduct): Product {
  return {
    ...p,
    images: safeParseArray(p.images),
    sizes: safeParseArray(p.sizes),
  };
}

function safeParseArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getProductsBySection(section: StoreSection) {
  const products = await prisma.product.findMany({
    where: { section },
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProduct);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug } });
  return product ? serializeProduct(product) : null;
}

export async function getFeaturedProduct(section: StoreSection) {
  const product = await prisma.product.findFirst({
    where: { section, featured: true },
    orderBy: { createdAt: "desc" },
  });
  if (product) return serializeProduct(product);
  const fallback = await prisma.product.findFirst({
    where: { section },
    orderBy: { createdAt: "desc" },
  });
  return fallback ? serializeProduct(fallback) : null;
}

export async function getAllProducts() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return products.map(serializeProduct);
}
