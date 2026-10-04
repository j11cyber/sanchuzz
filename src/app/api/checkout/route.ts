import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { initializeTransaction } from "@/lib/paystack";
import { brandForSection, brandHref, type StoreSection } from "@/lib/brands";

type CheckoutItem = { productId: string; size: string | null; quantity: number };

const SECTIONS: StoreSection[] = ["SANTUS_SABAOTH", "SARTORIAL_EXECUTIVE"];

/**
 * Product checkout for either selling brand. The server recomputes every
 * price and stock level from the database and never trusts client totals.
 * Service deposits use /api/book (Phase 4).
 */
export async function POST(request: Request) {
  let body: {
    customerName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    section?: string;
    items?: CheckoutItem[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { customerName, email, phone, address, city, state, items } = body;

  if (!customerName || !email || !phone || !address || !city || !state) {
    return NextResponse.json({ error: "Please fill in your name, contact and delivery details." }, { status: 400 });
  }
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }
  if (!body.section || !SECTIONS.includes(body.section as StoreSection)) {
    return NextResponse.json({ error: "Unknown storefront." }, { status: 400 });
  }
  const section = body.section as StoreSection;
  const brand = brandForSection(section);

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const lineItems: { productId: string; name: string; price: number; size: string | null; quantity: number }[] = [];
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json({ error: "One of the pieces in your bag is no longer available." }, { status: 400 });
    }
    if (product.section !== section) {
      return NextResponse.json({ error: `${product.name} belongs to a different storefront.` }, { status: 400 });
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity." }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `Only ${product.stock} of ${product.name} left in stock.` }, { status: 400 });
    }
    lineItems.push({ productId: product.id, name: product.name, price: product.price, size: item.size, quantity: item.quantity });
  }

  const subtotal = lineItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal;
  const prefix = section === "SANTUS_SABAOTH" ? "SSB" : "SEX";
  const reference = `${prefix}-${Date.now()}-${randomUUID().slice(0, 8)}`;

  const order = await prisma.order.create({
    data: {
      reference,
      type: "PRODUCT",
      brand: section,
      customerName,
      email,
      phone,
      address,
      city,
      state,
      subtotal,
      total,
      status: "PENDING",
      items: {
        create: lineItems.map((i) => ({ productId: i.productId, name: i.name, price: i.price, size: i.size, quantity: i.quantity })),
      },
    },
  });

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : new URL(request.url).origin);

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { error: `Online payment is not switched on yet. Your order reference is ${reference}. Message us on WhatsApp to complete it.` },
      { status: 503 },
    );
  }

  try {
    const transaction = await initializeTransaction({
      email,
      amountNaira: total,
      reference,
      callbackUrl: `${siteUrl}${brandHref(brand, "/order-confirmation")}`,
      metadata: { orderId: order.id, section, type: "PRODUCT" },
    });
    return NextResponse.json({ authorizationUrl: transaction.authorization_url });
  } catch (err) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    const message = err instanceof Error ? err.message : "Payment initialization failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
