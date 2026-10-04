import type { Metadata } from "next";
import BookingConfirmation from "@/components/commerce/BookingConfirmation";
import { getContactSettings } from "@/lib/site-settings";

export const metadata: Metadata = { title: "Booking confirmation", robots: { index: false } };

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string; booking?: string }>;
}) {
  const [{ reference, trxref, booking }, contact] = await Promise.all([searchParams, getContactSettings()]);
  return <BookingConfirmation contact={contact} orderReference={reference || trxref} bookingReference={booking} />;
}
