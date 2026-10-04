import type { Metadata } from "next";
import OrderConfirmation from "@/components/commerce/OrderConfirmation";
import { BRANDS } from "@/lib/brands";

export const metadata: Metadata = { title: "Order confirmation" };

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const { reference, trxref } = await searchParams;
  return <OrderConfirmation brand={BRANDS.sartorial} reference={reference || trxref} />;
}
