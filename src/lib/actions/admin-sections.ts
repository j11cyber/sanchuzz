"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function toggleSectionAction(key: string, isEnabled: boolean) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.siteSetting.upsert({
    where: { key },
    update: {
      value: JSON.stringify({ isEnabled }),
    },
    create: {
      key,
      value: JSON.stringify({ isEnabled }),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/sections");
}

export async function saveAllSectionsAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const sectionKeys = [
    "section_hero",
    "section_brand_positioning",
    "section_clinical_process",
    "section_sartorial_executive",
    "section_services",
    "section_case_files",
    "section_checkup",
    "section_prescription_pad",
    "section_shop",
    "section_story",
    "section_aftercare",
  ];

  for (const key of sectionKeys) {
    const isEnabled = formData.get(key) === "on";
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: JSON.stringify({ isEnabled }) },
      create: { key, value: JSON.stringify({ isEnabled }) },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/sections");
}
