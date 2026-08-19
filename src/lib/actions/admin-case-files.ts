"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function upsertCaseFileAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "").trim();
  const caseNumber = String(formData.get("caseNumber") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const diagnosis = String(formData.get("diagnosis") ?? "").trim();
  const result = String(formData.get("result") ?? "").trim();
  const beforeImage = String(formData.get("beforeImage") ?? "").trim() || null;
  const afterImage = String(formData.get("afterImage") ?? "").trim() || null;
  const order = parseInt(String(formData.get("order") ?? "0"), 10);
  const active = formData.get("active") === "on";

  const rawSymptoms = String(formData.get("symptoms") ?? "");
  const symptoms = rawSymptoms.split("\n").map((s) => s.trim()).filter(Boolean);

  const rawPrescription = String(formData.get("prescription") ?? "");
  const prescription = rawPrescription.split("\n").map((p) => p.trim()).filter(Boolean);

  const rawTags = String(formData.get("tags") ?? "");
  const tags = rawTags.split(",").map((t) => t.trim()).filter(Boolean);

  if (id) {
    await prisma.caseFile.update({
      where: { id },
      data: {
        caseNumber,
        title,
        slug,
        diagnosis,
        result,
        beforeImage,
        afterImage,
        order,
        active,
        symptoms: JSON.stringify(symptoms),
        prescription: JSON.stringify(prescription),
        tags: JSON.stringify(tags),
      },
    });
  } else {
    await prisma.caseFile.create({
      data: {
        caseNumber,
        title,
        slug,
        diagnosis,
        result,
        beforeImage,
        afterImage,
        order,
        active,
        symptoms: JSON.stringify(symptoms),
        prescription: JSON.stringify(prescription),
        tags: JSON.stringify(tags),
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/case-files");
  revalidatePath("/admin/case-files");
  redirect("/admin/case-files");
}

export async function deleteCaseFileAction(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.caseFile.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/case-files");
  revalidatePath("/admin/case-files");
}

export async function toggleCaseFileActiveAction(id: string, active: boolean) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.caseFile.update({
    where: { id },
    data: { active },
  });

  revalidatePath("/");
  revalidatePath("/case-files");
  revalidatePath("/admin/case-files");
}
