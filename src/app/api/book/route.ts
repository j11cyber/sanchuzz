import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { initializeTransaction, isPaystackConfigured } from "@/lib/paystack";
import { BRANDS, brandHref } from "@/lib/brands";
import { newBookingReference } from "@/lib/bookings";
import { depositOf, isFormat, isOccasion, type BookRequest, type BookResponse } from "@/lib/booking-options";

const MAX = 200;
const clean = (v: unknown, max = MAX) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Create a Booking for a Sartorial Executive service.
 *
 * pay=false  -> Booking saved as ENQUIRY; the client hands off to WhatsApp.
 * pay=true   -> Booking saved, a SERVICE_DEPOSIT Order is created for the
 *               deposit (price * depositPercent), Paystack is initialised and
 *               the client is sent to the hosted checkout. The return URL is
 *               /sartorial-executive/booking-confirmation, and the webhook
 *               also confirms. If Paystack is not configured, the booking is
 *               still saved and the response says payment is unavailable; no
 *               order is created, so nothing is left pending forever.
 */
export async function POST(request: Request) {
  let body: Partial<BookRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email);
  const phone = clean(body.phone, 40);
  const serviceSlug = clean(body.serviceSlug, 80);
  const occasion = isOccasion(body.occasion) ? body.occasion : null;
  const format = isFormat(body.format) ? body.format : null;
  const notes = clean(body.notes, 2000) || null;
  const checkupRef = clean(body.checkupRef, 40) || null;
  const pay = body.pay === true;

  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Please give your name, email and phone number." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email address does not look right." }, { status: 400 });
  }

  const service = await prisma.serviceItem.findUnique({ where: { slug: serviceSlug } });
  if (!service || !service.active) {
    return NextResponse.json({ error: "That treatment is not available to book." }, { status: 400 });
  }

  let preferredDate: Date | null = null;
  if (body.preferredDate) {
    const d = new Date(String(body.preferredDate));
    if (!Number.isNaN(d.getTime())) preferredDate = d;
  }

  const checkup = checkupRef ? await prisma.checkupSubmission.findUnique({ where: { patientRef: checkupRef }, select: { id: true } }) : null;

  const depositAmount = depositOf(service);
  const balance = service.price - depositAmount;
  const reference = await newBookingReference();

  const booking = await prisma.booking.create({
    data: {
      reference,
      customerName: name,
      email,
      phone,
      serviceId: service.id,
      occasion,
      preferredDate,
      format,
      notes,
      status: "ENQUIRY",
      depositAmount,
      checkupId: checkup?.id ?? null,
    },
  });

  const base: BookResponse = {
    bookingReference: booking.reference,
    serviceName: service.name,
    price: service.price,
    depositAmount,
    balance,
  };

  if (!pay) {
    return NextResponse.json(base);
  }

  if (!isPaystackConfigured()) {
    return NextResponse.json({
      ...base,
      paymentUnavailable: true,
      message: `Online deposits are not switched on yet. Your booking ${booking.reference} is saved. Send it to us on WhatsApp and we will take the deposit by transfer.`,
    } satisfies BookResponse);
  }

  const orderReference = `SED-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const order = await prisma.order.create({
    data: {
      reference: orderReference,
      type: "SERVICE_DEPOSIT",
      brand: "SARTORIAL_EXECUTIVE",
      customerName: name,
      email,
      phone,
      subtotal: depositAmount,
      total: depositAmount,
      status: "PENDING",
      booking: { connect: { id: booking.id } },
    },
  });

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : new URL(request.url).origin);

  try {
    const transaction = await initializeTransaction({
      email,
      amountNaira: depositAmount,
      reference: orderReference,
      callbackUrl: `${siteUrl}${brandHref(BRANDS.sartorial, "/booking-confirmation")}`,
      metadata: { orderId: order.id, bookingId: booking.id, bookingReference: booking.reference, type: "SERVICE_DEPOSIT" },
    });
    return NextResponse.json({ ...base, authorizationUrl: transaction.authorization_url } satisfies BookResponse);
  } catch (err) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    const message = err instanceof Error ? err.message : "Payment initialisation failed";
    return NextResponse.json({ ...base, paymentUnavailable: true, message: `${message}. Your booking ${booking.reference} is saved; message us on WhatsApp to arrange the deposit.` } satisfies BookResponse, {
      status: 200,
    });
  }
}
