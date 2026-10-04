import type { Metadata } from "next";
import OrderConfirmation from "@/components/commerce/OrderConfirmation";
import { BRANDS } from "@/lib/brands";
import { getContactSettings } from "@/lib/site-settings";

export const metadata: Metadata = { title: "Order confirmation" };

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const [{ reference, trxref }, contact] = await Promise.all([searchParams, getContactSettings()]);
  return <OrderConfirmation brand={BRANDS.santus} contact={contact} reference={reference || trxref} />;
}
