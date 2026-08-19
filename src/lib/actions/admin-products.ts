"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { StoreSection } from "@/generated/prisma/enums";
import { sectionToSlug } from "@/lib/products";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseLines(raw: string) {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseCsv(raw: string) {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createProductAction(section: StoreSection, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const category = String(formData.get("category") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const images = parseLines(String(formData.get("images") ?? ""));
  const sizes = parseCsv(String(formData.get("sizes") ?? ""));
  const stock = Number(formData.get("stock") ?? 0);
  const featured = formData.get("featured") === "on";

  await prisma.product.create({
    data: {
      section,
      name,
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      brand: brand || (section === "SANTUS_SABAOTH" ? "Santus Sabaoth" : null),
      category,
      price,
      description,
      images: JSON.stringify(images),
      sizes: JSON.stringify(sizes),
      stock,
      featured,
    },
  });

  revalidatePath(`/admin/products/${sectionToSlug(section)}`);
  revalidatePath(section === "SANTUS_SABAOTH" ? "/santus-sabaoth" : "/sartorial-executive");
  redirect(`/admin/products/${sectionToSlug(section)}`);
}

export async function updateProductAction(id: string, formData: FormData) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) redirect("/admin");

  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const category = String(formData.get("category") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const images = parseLines(String(formData.get("images") ?? ""));
  const sizes = parseCsv(String(formData.get("sizes") ?? ""));
  const stock = Number(formData.get("stock") ?? 0);
  const featured = formData.get("featured") === "on";

  await prisma.product.update({
    where: { id },
    data: {
      name,
      brand: brand || null,
      category,
      price,
      description,
      images: JSON.stringify(images),
      sizes: JSON.stringify(sizes),
      stock,
      featured,
    },
  });

  const slug = sectionToSlug(product!.section);
  revalidatePath(`/admin/products/${slug}`);
  revalidatePath(`/${slug}`);
  revalidatePath(`/${slug}/${product!.slug}`);
  redirect(`/admin/products/${slug}`);
}

export async function deleteProductAction(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.delete({ where: { id } });

  const slug = sectionToSlug(product.section);
  revalidatePath(`/admin/products/${slug}`);
  revalidatePath(`/${slug}`);
  redirect(`/admin/products/${slug}`);
}
