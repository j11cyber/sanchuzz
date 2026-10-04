"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

function revalidateCaseFiles() {
  revalidatePath("/sartorial-executive");
  revalidatePath("/sartorial-executive/case-files");
  revalidatePath("/admin/case-files");
}

function lines(raw: FormDataEntryValue | null) {
  return String(raw ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function upsertCaseFileAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const data = {
    caseNumber: String(formData.get("caseNumber") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    diagnosis: String(formData.get("diagnosis") ?? "").trim(),
    result: String(formData.get("result") ?? "").trim(),
    beforeImage: String(formData.get("beforeImage") ?? "").trim() || null,
    afterImage: String(formData.get("afterImage") ?? "").trim() || null,
    order: parseInt(String(formData.get("order") ?? "0"), 10) || 0,
    published: formData.get("published") === "on",
    symptoms: JSON.stringify(lines(formData.get("symptoms"))),
    prescription: JSON.stringify(lines(formData.get("prescription"))),
    tags: JSON.stringify(
      String(formData.get("tags") ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  };

  if (id) {
    await prisma.caseFile.update({ where: { id }, data });
  } else {
    await prisma.caseFile.create({ data });
  }

  revalidateCaseFiles();
  redirect("/admin/case-files");
}

export async function deleteCaseFileAction(id: string) {
  await requireAdmin();
  await prisma.caseFile.delete({ where: { id } });
  revalidateCaseFiles();
}

export async function toggleCaseFilePublishedAction(id: string, published: boolean) {
  await requireAdmin();
  await prisma.caseFile.update({ where: { id }, data: { published } });
  revalidateCaseFiles();
}
