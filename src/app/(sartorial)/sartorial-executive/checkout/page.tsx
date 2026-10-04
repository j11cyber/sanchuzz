import type { Metadata } from "next";
import CheckoutForm from "@/components/commerce/CheckoutForm";
import { getContactSettings } from "@/lib/site-settings";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const contact = await getContactSettings();
  return <CheckoutForm contact={contact} />;
}
