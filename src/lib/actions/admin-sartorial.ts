"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function saveSartorialContentAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const eyebrow = String(formData.get("eyebrow") ?? "").trim();
  const heading = String(formData.get("heading") ?? "").trim();
  const subheading = String(formData.get("subheading") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const ctaText = String(formData.get("ctaText") ?? "").trim();
  const ctaLink = String(formData.get("ctaLink") ?? "").trim();

  await prisma.siteSetting.upsert({
    where: { key: "sartorial_executive_content" },
    update: {
      value: JSON.stringify({ eyebrow, heading, subheading, description, ctaText, ctaLink }),
    },
    create: {
      key: "sartorial_executive_content",
      value: JSON.stringify({ eyebrow, heading, subheading, description, ctaText, ctaLink }),
    },
  });

  revalidatePath("/sartorial-executive");
  revalidatePath("/admin/sartorial-executive");
}

export async function savePrescriptionPadSettingsAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const clinicName = String(formData.get("clinicName") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const consultantName = String(formData.get("consultantName") ?? "").trim();
  const consultantTitle = String(formData.get("consultantTitle") ?? "").trim();
  const disclaimer = String(formData.get("disclaimer") ?? "").trim();

  await prisma.siteSetting.upsert({
    where: { key: "prescription_pad_settings" },
    update: {
      value: JSON.stringify({ clinicName, tagline, consultantName, consultantTitle, disclaimer }),
    },
    create: {
      key: "prescription_pad_settings",
      value: JSON.stringify({ clinicName, tagline, consultantName, consultantTitle, disclaimer }),
    },
  });

  revalidatePath("/sartorial-executive");
  revalidatePath("/sartorial-executive/checkup");
  revalidatePath("/admin/prescription-pad");
}
