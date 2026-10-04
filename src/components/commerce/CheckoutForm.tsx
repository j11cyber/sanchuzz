"use client";

import { useState } from "react";
import Link from "next/link";
import { useBrand } from "@/components/brand-context";
import { brandHref, type StoreSection } from "@/lib/brands";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { formatNaira } from "@/lib/money";
import { useHydrated } from "@/lib/use-hydrated";
import { whatsappLink, type ContactSettings } from "@/lib/contact";

function Checkout({ section, contact }: { section: StoreSection; contact: ContactSettings }) {
  const brand = useBrand();
  const items = useCartStore(section, (s) => s.items);
  const clear = useCartStore(section, (s) => s.clear);
  const hydrated = useHydrated();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ customerName: "", email: "", phone: "", address: "", city: "", state: "" });

  if (!hydrated) return <div className="min-h-[50vh]" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center sm:px-8">
        <h1 className="font-display text-4xl text-fg">Nothing to pay for yet</h1>
        <p className="mt-4 text-sm text-fg-muted/70">Your bag is empty.</p>
        <Link href={brandHref(brand, "/shop")} className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition hover:bg-accent-soft">
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
        body: JSON.stringify({ ...form, section, items: items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "We could not start the payment. Please try again.");
      clear();
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const field = (key: keyof typeof form, label: string, type = "text", full = false, autoComplete?: string) => (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={`co-${key}`} className="text-xs text-fg-muted/60">
        {label}
      </label>
      <input
        id={`co-${key}`}
        required
        type={type}
        autoComplete={autoComplete}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-sm text-fg focus:border-accent focus:outline-none"
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <h1 className="font-display text-4xl text-fg">Checkout</h1>

      <div className="mt-10 grid gap-10 md:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-5 md:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            {field("customerName", "Full name", "text", true, "name")}
            {field("email", "Email", "email", false, "email")}
            {field("phone", "Phone", "tel", false, "tel")}
            {field("address", "Delivery address", "text", true, "street-address")}
            {field("city", "City", "text", false, "address-level2")}
            {field("state", "State", "text", false, "address-level1")}
          </div>

          {error && (
            <div className="rounded-xl border border-line bg-surface p-4 text-sm text-fg-muted">
              <p>{error}</p>
              <a
                href={whatsappLink(contact.whatsappNumber, `Hello, I would like to complete an order from ${brand.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-accent underline underline-offset-4"
              >
                Message us on WhatsApp instead
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-bg transition hover:bg-accent-soft disabled:opacity-50 sm:w-auto"
          >
            {submitting ? "Opening Paystack…" : `Pay ${formatNaira(subtotal)}`}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-display text-xl text-fg">Your order</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.key} className="flex justify-between gap-3 text-sm text-fg-muted/70">
                <span>
                  {item.name}
                  {item.size ? ` (${item.size})` : ""} × {item.quantity}
                </span>
                <span className="shrink-0 text-fg">{formatNaira(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm">
            <span className="text-fg-muted/70">Total</span>
            <span className="text-accent">{formatNaira(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutForm({ contact }: { contact: ContactSettings }) {
  const brand = useBrand();
  if (!brand.section) return null;
  return <Checkout section={brand.section} contact={contact} />;
}
