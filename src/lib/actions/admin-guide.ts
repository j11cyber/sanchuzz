"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createGuideArticleAction(formData: FormData) {
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

  revalidatePath("/admin/guide");
  revalidatePath("/guide");
  redirect("/admin/guide");
}

export async function updateGuideArticleAction(id: string, formData: FormData) {
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

  revalidatePath("/admin/guide");
  revalidatePath("/guide");
  revalidatePath(`/guide/${article!.slug}`);
  redirect("/admin/guide");
}

export async function deleteGuideArticleAction(id: string) {
  await prisma.guideArticle.delete({ where: { id } });
  revalidatePath("/admin/guide");
  revalidatePath("/guide");
  redirect("/admin/guide");
}
