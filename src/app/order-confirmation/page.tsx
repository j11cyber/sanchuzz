import Link from "next/link";
import { confirmOrderPayment } from "@/lib/orders";
import { formatNaira } from "@/lib/money";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const { reference, trxref } = await searchParams;
  const ref = reference || trxref;

  if (!ref) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-3xl text-cream">No order reference found</h1>
        <p className="mt-4 text-sm text-cream-dim/70">
          If you just completed a payment, check your email for confirmation.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-gold px-6 py-3 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
        >
          Back home
        </Link>
      </div>
    );
  }

  let order;
  let verifyError = false;
  try {
    order = await confirmOrderPayment(ref);
  } catch {
    verifyError = true;
  }

  if (verifyError || !order) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-3xl text-cream">We couldn&rsquo;t verify this order</h1>
        <p className="mt-4 text-sm text-cream-dim/70">
          Reference: {ref}. If you were charged, contact us with this reference and we&rsquo;ll
          confirm manually.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-gold px-6 py-3 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
        >
          Back home
        </Link>
      </div>
    );
  }

  const paid = order.status === "PAID";

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
      <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-8 text-center shadow-soft sm:p-12">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            paid ? "bg-gold text-charcoal-950" : "bg-red-400/20 text-red-300"
          }`}
        >
          {paid ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          )}
        </div>
        <h1 className="mt-6 font-display text-3xl text-cream">
          {paid ? "Payment confirmed" : "Payment not completed"}
        </h1>
        <p className="mt-3 text-sm text-cream-dim/70">
          {paid
            ? "Thank you — your order has been received and is being prepared."
            : "Your payment did not go through. No charge has been confirmed for this order."}
        </p>

        <div className="mt-8 space-y-2 rounded-xl bg-charcoal-950 p-5 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-cream-dim/60">Reference</span>
            <span className="text-cream">{order.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cream-dim/60">Name</span>
            <span className="text-cream">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cream-dim/60">Total</span>
            <span className="text-gold">{formatNaira(order.total)}</span>
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-gold px-6 py-3 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
