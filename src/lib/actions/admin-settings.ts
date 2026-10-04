"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import type { ContactSettings } from "@/lib/contact";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

/** Contact details appear on every brand, so revalidate the whole tree. */
export async function saveContactAction(formData: FormData) {
  await requireAdmin();

  const text = (key: keyof ContactSettings) => String(formData.get(key) ?? "").trim();

  const value: ContactSettings = {
    whatsappNumber: text("whatsappNumber").replace(/[^\d]/g, ""),
    contactEmail: text("contactEmail"),
    location: text("location"),
    locationNote: text("locationNote"),
    hours: String(formData.get("hours") ?? "")
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean),
    instagram: text("instagram"),
    tiktok: text("tiktok"),
    x: text("x"),
  };

  await prisma.siteSetting.upsert({
    where: { key: "contact" },
    update: { value: JSON.stringify(value) },
    create: { key: "contact", value: JSON.stringify(value) },
  });

  revalidatePath("/", "layout");
}
