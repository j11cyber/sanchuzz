"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function upsertServiceAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const price = parseInt(String(formData.get("price") ?? "0"), 10);
  const duration = String(formData.get("duration") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const bestFor = String(formData.get("bestFor") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim() || null;
  const order = parseInt(String(formData.get("order") ?? "0"), 10);
  const active = formData.get("active") === "on";

  const rawFeatures = String(formData.get("features") ?? "");
  const features = rawFeatures
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  if (id) {
    await prisma.serviceItem.update({
      where: { id },
      data: {
        name,
        slug,
        price,
        duration,
        description,
        bestFor,
        image,
        order,
        active,
        features: JSON.stringify(features),
      },
    });
  } else {
    await prisma.serviceItem.create({
      data: {
        name,
        slug,
        price,
        duration,
        description,
        bestFor,
        image,
        order,
        active,
        features: JSON.stringify(features),
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/sartorial-executive"); revalidatePath("/sartorial-executive/services");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function deleteServiceAction(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.serviceItem.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/sartorial-executive"); revalidatePath("/sartorial-executive/services");
  revalidatePath("/admin/services");
}

export async function toggleServiceActiveAction(id: string, active: boolean) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.serviceItem.update({
    where: { id },
    data: { active },
  });

  revalidatePath("/");
  revalidatePath("/sartorial-executive"); revalidatePath("/sartorial-executive/services");
  revalidatePath("/admin/services");
}
