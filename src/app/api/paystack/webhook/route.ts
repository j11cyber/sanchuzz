import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { confirmOrderPayment } from "@/lib/orders";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";

  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const signatureValid =
    signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!signatureValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference = event.data?.reference;
    if (reference) {
      await confirmOrderPayment(reference);
    }
  }

  return NextResponse.json({ received: true });
}
