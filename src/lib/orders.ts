import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";

export async function confirmOrderPayment(reference: string) {
  const order = await prisma.order.findUnique({
    where: { reference },
    include: { items: true },
  });
  if (!order) return null;

  if (order.status === "PAID") return order;

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return order;
  }

  try {
    const transaction = await verifyTransaction(reference);
    const isPaid = transaction.status === "success";

    // Atomic claim: only the first caller to flip status away from PENDING/FAILED
    // decrements stock, so a near-simultaneous webhook + confirmation-page call
    // can't double-decrement.
    const claim = await prisma.order.updateMany({
      where: { reference, status: { not: "PAID" } },
      data: { status: isPaid ? "PAID" : "FAILED" },
    });

    if (isPaid && claim.count > 0) {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }
  } catch (err) {
    console.warn("Paystack verification skipped or failed:", err);
  }

  const updated = await prisma.order.findUnique({
    where: { reference },
    include: { items: true },
  });
  return updated;
}
