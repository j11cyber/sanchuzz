import type { Metadata } from "next";
import CheckoutForm from "@/components/commerce/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return <CheckoutForm />;
}
