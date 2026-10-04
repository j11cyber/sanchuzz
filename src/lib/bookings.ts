import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

/** Human-friendly booking reference, e.g. SEB-241004-K7Q2. */
export async function newBookingReference(): Promise<string> {
  const day = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 10; attempt++) {
    const bytes = randomBytes(4);
    let code = "";
    for (const b of bytes) code += alphabet[b % alphabet.length];
    const reference = `SEB-${day}-${code}`;
    const exists = await prisma.booking.findUnique({ where: { reference }, select: { id: true } });
    if (!exists) return reference;
  }
  return `SEB-${day}-${Date.now().toString(36).toUpperCase()}`;
}

export type BookingWithRelations = NonNullable<Awaited<ReturnType<typeof getBookingByReference>>>;

export async function getBookingByReference(reference: string) {
  return prisma.booking.findUnique({
    where: { reference },
    include: { service: true, order: true, checkup: { select: { patientRef: true } } },
  });
}

export async function getBookingByOrderReference(orderReference: string) {
  const order = await prisma.order.findUnique({ where: { reference: orderReference }, select: { id: true } });
  if (!order) return null;
  return prisma.booking.findUnique({
    where: { orderId: order.id },
    include: { service: true, order: true, checkup: { select: { patientRef: true } } },
  });
}
