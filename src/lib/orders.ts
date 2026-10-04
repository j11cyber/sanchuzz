import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";

/**
 * Confirm a Paystack payment for an order of either type.
 *
 * Called from the return page and from the webhook; either may run first.
 * An atomic claim (updateMany where status != PAID) means only one caller
 * performs the side effects: stock is decremented once for product orders,
 * and the linked booking is marked DEPOSIT_PAID once for service deposits.
 */
export async function confirmOrderPayment(reference: string) {
  const order = await prisma.order.findUnique({
    where: { reference },
    include: { items: true, booking: true },
  });
  if (!order) return null;

  if (order.status === "PAID") return order;

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return order;
  }

  try {
    const transaction = await verifyTransaction(reference);
    const isPaid = transaction.status === "success";

    const claim = await prisma.order.updateMany({
      where: { reference, status: { not: "PAID" } },
      data: { status: isPaid ? "PAID" : "FAILED" },
    });

    if (isPaid && claim.count > 0) {
      if (order.type === "PRODUCT") {
        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      } else if (order.type === "SERVICE_DEPOSIT" && order.booking) {
        await prisma.booking.update({
          where: { id: order.booking.id },
          data: { status: "DEPOSIT_PAID" },
        });
      }
    }
  } catch (err) {
    console.warn("Paystack verification skipped or failed:", err);
  }

  return prisma.order.findUnique({
    where: { reference },
    include: { items: true, booking: true },
  });
}
