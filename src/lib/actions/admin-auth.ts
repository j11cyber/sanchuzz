"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminSessionToken, setAdminSessionCookie, clearAdminSessionCookie } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  if (!username || !password) {
    redirect(`/admin/login?error=1&from=${encodeURIComponent(from)}`);
  }

  const user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user) {
    redirect(`/admin/login?error=1&from=${encodeURIComponent(from)}`);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    redirect(`/admin/login?error=1&from=${encodeURIComponent(from)}`);
  }

  const token = await createAdminSessionToken(user.username);
  await setAdminSessionCookie(token);
  redirect(from.startsWith("/admin") ? from : "/admin");
}

export async function logoutAction() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}
