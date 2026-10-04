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

function revalidateDaily() {
  revalidatePath("/");
  revalidatePath("/daily");
  revalidatePath("/admin/daily-picks");
}

export async function createDailyPickAction(formData: FormData) {
  await requireAdmin();

  const rawType = String(formData.get("type") ?? "CLOTH");
  const type: "CLOTH" | "COLOR" = rawType === "COLOR" ? "COLOR" : "CLOTH";
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

  revalidateDaily();
  redirect("/admin/daily-picks");
}

export async function deleteDailyPickAction(id: string) {
  await requireAdmin();
  await prisma.dailyPick.delete({ where: { id } });
  revalidateDaily();
  redirect("/admin/daily-picks");
}
