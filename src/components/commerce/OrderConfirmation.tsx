import Link from "next/link";
import { confirmOrderPayment } from "@/lib/orders";
import { formatNaira } from "@/lib/money";
import { brandHref, type Brand } from "@/lib/brands";
import { whatsappLink } from "@/lib/contact";

/**
 * Shared confirmation view, rendered by each selling brand's
 * /order-confirmation page. Verifies the Paystack reference on arrival.
 */
export default async function OrderConfirmation({ brand, reference }: { brand: Brand; reference?: string }) {
  const shopHref = brandHref(brand, "/shop");

  if (!reference) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-4xl text-fg">No order reference found</h1>
        <p className="mt-4 text-sm text-fg-muted/70">If you just paid, check your email for the Paystack receipt.</p>
        <Link href={shopHref} className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition hover:bg-accent-soft">
          Back to the shop
        </Link>
      </div>
    );
  }

  let order: Awaited<ReturnType<typeof confirmOrderPayment>> | null = null;
  let verifyError = false;
  try {
    order = await confirmOrderPayment(reference);
  } catch {
    verifyError = true;
  }

  if (verifyError || !order) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-4xl text-fg">We could not verify this order</h1>
        <p className="mt-4 text-sm text-fg-muted/70">
          Reference <span className="font-mono text-fg">{reference}</span>. If you were charged, send us this reference and we will confirm it by hand.
        </p>
        <a
          href={whatsappLink(`Hello, I need help confirming order ${reference}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition hover:bg-accent-soft"
        >
          Message us on WhatsApp
        </a>
      </div>
    );
  }

  const paid = order.status === "PAID";

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
      <div className="rounded-2xl border border-line bg-surface p-8 text-center sm:p-12">
        <h1 className="font-display text-4xl text-fg">{paid ? "Payment received" : "Payment not completed"}</h1>
        <p className="mt-3 text-sm text-fg-muted/70">
          {paid
            ? "Thank you. Your order is being prepared and we will contact you to arrange delivery."
            : "The payment did not go through. Nothing has been charged for this order."}
        </p>

        <dl className="mt-8 space-y-2 rounded-xl bg-bg p-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Reference</dt>
            <dd className="font-mono text-fg">{order.reference}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Name</dt>
            <dd className="text-fg">{order.customerName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Total</dt>
            <dd className="text-accent">{formatNaira(order.total)}</dd>
          </div>
        </dl>

        <Link href={shopHref} className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition hover:bg-accent-soft">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
