import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { initializeTransaction } from "@/lib/paystack";

type CheckoutItem = { productId: string; size: string | null; quantity: number };

export async function POST(request: Request) {
  let body: {
    customerName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    items?: CheckoutItem[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { customerName, email, phone, address, city, state, items } = body;

  if (!customerName || !email || !phone || !address || !city || !state) {
    return NextResponse.json({ error: "Missing required customer details" }, { status: 400 });
  }
  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Server recomputes totals from the database — never trust client-submitted prices.
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const lineItems: { productId: string; name: string; price: number; size: string | null; quantity: number }[] = [];
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
    }
    if (item.quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `${product.name} does not have enough stock` },
        { status: 400 },
      );
    }
    lineItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: item.size,
      quantity: item.quantity,
    });
  }

  const subtotal = lineItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal;
  const reference = `SNZ-${Date.now()}-${randomUUID().slice(0, 8)}`;

  const order = await prisma.order.create({
    data: {
      reference,
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
        create: lineItems.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          size: i.size,
          quantity: i.quantity,
        })),
      },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  try {
    const transaction = await initializeTransaction({
      email,
      amountNaira: total,
      reference,
      callbackUrl: `${siteUrl}/order-confirmation`,
      metadata: { orderId: order.id },
    });
    return NextResponse.json({ authorizationUrl: transaction.authorization_url });
  } catch (err) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    const message = err instanceof Error ? err.message : "Payment initialization failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
