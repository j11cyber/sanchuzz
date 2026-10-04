import Link from "next/link";
import { confirmOrderPayment } from "@/lib/orders";
import { getBookingByOrderReference, getBookingByReference } from "@/lib/bookings";
import { formatNaira } from "@/lib/money";
import { BRANDS, brandHref } from "@/lib/brands";
import { whatsappLink, type ContactSettings } from "@/lib/contact";
import { occasionLabel } from "@/lib/booking-options";

const S = BRANDS.sartorial;

/**
 * Booking confirmation. Reached from Paystack's return (order reference) or
 * directly with a booking reference. Verifies the deposit on arrival and shows
 * everything the owner needs to follow up: booking reference, treatment,
 * deposit paid and balance remaining, with the same details prefilled in a
 * WhatsApp message.
 */
export default async function BookingConfirmation({
  contact,
  orderReference,
  bookingReference,
}: {
  contact: ContactSettings;
  orderReference?: string;
  bookingReference?: string;
}) {
  if (orderReference) {
    try {
      await confirmOrderPayment(orderReference);
    } catch (err) {
      console.warn("Deposit verification failed:", err);
    }
  }

  const booking = orderReference
    ? await getBookingByOrderReference(orderReference)
    : bookingReference
      ? await getBookingByReference(bookingReference)
      : null;

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-4xl text-fg">We could not find that booking</h1>
        <p className="mt-4 text-sm text-fg-muted/70">
          {orderReference ? (
            <>
              Payment reference <span className="font-mono text-fg">{orderReference}</span>. If you were charged, send us this reference and we will confirm it by hand.
            </>
          ) : (
            "Check the link, or message us and we will find it."
          )}
        </p>
        <a
          href={whatsappLink(contact.whatsappNumber, `Hello Sartorial Executive, I need help with a booking${orderReference ? ` (payment ${orderReference})` : ""}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition hover:bg-accent-soft"
        >
          Message us on WhatsApp
        </a>
      </div>
    );
  }

  const paid = booking.status === "DEPOSIT_PAID" || booking.status === "SCHEDULED" || booking.status === "COMPLETED";
  const paymentFailed = !!booking.order && booking.order.status === "FAILED";
  const balance = booking.service.price - booking.depositAmount;
  const date = booking.preferredDate ? booking.preferredDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Next available";

  const message = [
    paid
      ? `Hello Sartorial Executive, I have paid the deposit for booking ${booking.reference}.`
      : `Hello Sartorial Executive, about booking ${booking.reference}.`,
    ``,
    `Treatment: ${booking.service.name} (${formatNaira(booking.service.price)})`,
    paid ? `Deposit paid: ${formatNaira(booking.depositAmount)}${booking.order ? ` (payment ${booking.order.reference})` : ""}` : `Deposit due: ${formatNaira(booking.depositAmount)}`,
    `Balance remaining: ${formatNaira(balance)}`,
    `Occasion: ${occasionLabel(booking.occasion)}`,
    `Preferred date: ${date}`,
    booking.format ? `Format: ${booking.format}` : null,
    `Name: ${booking.customerName}`,
    `Phone: ${booking.phone}`,
    booking.checkup ? `Checkup: ${booking.checkup.patientRef}` : null,
    ``,
    paid ? `Please confirm my appointment.` : `Please confirm how to pay the deposit.`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
      <div className="rounded-2xl border border-line bg-surface p-8 sm:p-12">
        <p className="font-mono text-sm text-mark">{booking.reference}</p>
        <h1 className="mt-2 font-display text-4xl text-fg">
          {paid ? "Deposit received" : paymentFailed ? "Payment not completed" : "Booking saved"}
        </h1>
        <p className="mt-3 text-sm text-fg-muted/70">
          {paid
            ? "Thank you. Your place is held. Send us the message below and we will confirm the time."
            : paymentFailed
              ? "The deposit did not go through and nothing has been charged. Your booking is still saved; message us and we will arrange the deposit another way."
              : "Your request is saved. Send us the message below and we will confirm the time and take the deposit."}
        </p>

        <dl className="mt-8 space-y-2 rounded-xl bg-bg p-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Treatment</dt>
            <dd className="text-right text-fg">{booking.service.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Price</dt>
            <dd className="text-fg">{formatNaira(booking.service.price)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">{paid ? "Deposit paid" : "Deposit due"}</dt>
            <dd className="text-accent">{formatNaira(booking.depositAmount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Balance remaining</dt>
            <dd className="text-fg">{formatNaira(balance)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted/60">Preferred date</dt>
            <dd className="text-fg">{date}</dd>
          </div>
          {booking.order && (
            <div className="flex justify-between gap-4">
              <dt className="text-fg-muted/60">Payment reference</dt>
              <dd className="font-mono text-fg">{booking.order.reference}</dd>
            </div>
          )}
        </dl>

        <a
          href={whatsappLink(contact.whatsappNumber, message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 block rounded-full bg-accent px-6 py-3.5 text-center text-sm font-semibold text-bg transition hover:bg-accent-soft"
        >
          {paid ? "Confirm my appointment on WhatsApp" : "Send to WhatsApp"}
        </a>
        <Link href={brandHref(S, "/services")} className="mt-4 block text-center text-sm text-fg-muted/70 hover:text-accent">
          Back to treatments
        </Link>
      </div>
    </div>
  );
}
