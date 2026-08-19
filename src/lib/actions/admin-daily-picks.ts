"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createDailyPickAction(formData: FormData) {
  const type = String(formData.get("type") ?? "CLOTH") as "CLOTH" | "COLOR";
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const colorHex = String(formData.get("colorHex") ?? "").trim();
  const productId = String(formData.get("productId") ?? "").trim();

  await prisma.dailyPick.create({
    data: {
      type,
      title,
      description,
      imageUrl: type === "CLOTH" ? imageUrl || null : null,
      colorHex: type === "COLOR" ? colorHex || null : null,
      productId: productId || null,
    },
  });

  revalidatePath("/admin/daily-picks");
  revalidatePath("/services/cloth-of-the-day");
  revalidatePath("/services/color-of-the-day");
  redirect("/admin/daily-picks");
}

export async function deleteDailyPickAction(id: string) {
  await prisma.dailyPick.delete({ where: { id } });
  revalidatePath("/admin/daily-picks");
  revalidatePath("/services/cloth-of-the-day");
  revalidatePath("/services/color-of-the-day");
  redirect("/admin/daily-picks");
}
