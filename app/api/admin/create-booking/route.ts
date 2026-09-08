import { NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";
import { getService } from "@/app/lib/services";
import { createDepositCheckout } from "@/app/lib/checkout";
import { newBookingId, saveBooking, updateBooking, type Booking } from "@/app/lib/bookings";
import { sendPaymentLinkEmail } from "@/app/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 });
  }

  let body: {
    serviceId?: string;
    name?: string;
    email?: string;
    preferredDate?: string;
    message?: string;
    adminNote?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const service = body.serviceId ? getService(body.serviceId) : undefined;
  if (!service) return NextResponse.json({ error: "Choose a valid service." }, { status: 400 });
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ error: "A valid client email is required." }, { status: 400 });
  }

  const id = newBookingId();
  const now = Date.now();

  const booking: Booking = {
    id,
    status: "pending",
    service: service.id,
    serviceName: service.name,
    clientName: body.name ?? "",
    clientEmail: body.email,
    amountCents: service.depositCents,
    preferredDate: body.preferredDate || undefined,
    adminNotes: body.adminNote?.trim()
      ? [{ id: newBookingId(), text: body.adminNote.trim().slice(0, 2000), kind: "note", createdAt: now }]
      : [],
    tags: [],
    followUp: false,
    source: "admin",
    createdAt: now,
  };

  try {
    await saveBooking(booking);
  } catch (e) {
    console.error("[admin] save pending booking failed:", e);
    return NextResponse.json({ error: "Could not save booking (storage)." }, { status: 500 });
  }

  let url: string | null = null;
  try {
    const session = await createDepositCheckout({
      service,
      email: body.email,
      name: body.name,
      preferredDate: body.preferredDate,
      bookingId: id,
      source: "admin",
    });
    url = session.url;
    await updateBooking(id, { stripeSessionId: session.id });
  } catch (e) {
    console.error("[admin] checkout create failed:", e);
    return NextResponse.json({ error: "Could not create payment link." }, { status: 500 });
  }

  const emailRes = url
    ? await sendPaymentLinkEmail({
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        serviceName: service.name,
        amountCents: service.depositCents,
        url,
        message: body.message?.trim() || undefined,
      })
    : { ok: false, error: "No payment URL." };

  return NextResponse.json({
    ok: true,
    bookingId: id,
    url,
    emailed: emailRes.ok,
    emailError: emailRes.ok ? undefined : emailRes.error,
  });
}
