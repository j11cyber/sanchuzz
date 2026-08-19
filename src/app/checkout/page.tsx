"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { formatNaira } from "@/lib/money";
import { useHydrated } from "@/lib/use-hydrated";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const hydrated = useHydrated();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-3xl text-cream">Nothing to check out</h1>
        <p className="mt-4 text-sm text-cream-dim/70">Your cart is empty.</p>
        <Link
          href="/santus-sabaoth"
          className="mt-8 inline-block rounded-full bg-gold px-6 py-3 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      clear();
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const field = (
    key: keyof typeof form,
    label: string,
    type = "text",
    full = false,
  ) => (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-xs uppercase tracking-widest text-cream-dim/50">{label}</label>
      <input
        required
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="mt-2 w-full rounded-lg border border-charcoal-700 bg-charcoal-950 px-4 py-3 text-sm text-cream placeholder:text-cream-dim/30 focus:border-gold focus:outline-none"
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <h1 className="font-display text-3xl text-cream">Checkout</h1>

      <div className="mt-10 grid gap-10 md:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-5 md:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            {field("customerName", "Full name", "text", true)}
            {field("email", "Email", "email")}
            {field("phone", "Phone", "tel")}
            {field("address", "Delivery address", "text", true)}
            {field("city", "City")}
            {field("state", "State")}
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft disabled:opacity-50 sm:w-auto"
          >
            {submitting ? "Redirecting to payment…" : "Pay with Paystack"}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-charcoal-800 bg-charcoal-900 p-6 shadow-soft">
          <h2 className="font-display text-lg text-cream">Order Summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.key} className="flex justify-between text-sm text-cream-dim/70">
                <span>
                  {item.name}
                  {item.size ? ` (${item.size})` : ""} × {item.quantity}
                </span>
                <span className="text-cream">{formatNaira(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-charcoal-800 pt-4 text-sm">
            <span className="text-cream-dim/70">Total</span>
            <span className="text-gold">{formatNaira(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
