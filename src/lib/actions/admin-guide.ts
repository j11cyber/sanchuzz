"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidateGuide(slug?: string) {
  revalidatePath("/");
  revalidatePath("/guide");
  if (slug) revalidatePath(`/guide/${slug}`);
  revalidatePath("/sartorial-executive");
  revalidatePath("/admin/guide");
}

export async function createGuideArticleAction(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const published = formData.get("published") === "on";

  await prisma.guideArticle.create({
    data: {
      title,
      slug: `${slugify(title)}-${Date.now().toString(36)}`,
      category,
      excerpt,
      content,
      coverImage: coverImage || null,
      published,
    },
  });

  revalidateGuide();
  redirect("/admin/guide");
}

export async function updateGuideArticleAction(id: string, formData: FormData) {
  await requireAdmin();

  const article = await prisma.guideArticle.findUnique({ where: { id } });
  if (!article) redirect("/admin/guide");

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const published = formData.get("published") === "on";

  await prisma.guideArticle.update({
    where: { id },
    data: { title, category, excerpt, content, coverImage: coverImage || null, published },
  });

  revalidateGuide(article.slug);
  redirect("/admin/guide");
}

export async function deleteGuideArticleAction(id: string) {
  await requireAdmin();
  await prisma.guideArticle.delete({ where: { id } });
  revalidateGuide();
  redirect("/admin/guide");
}
