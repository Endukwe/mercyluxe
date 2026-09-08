import { NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";
import { getService } from "@/app/lib/services";
import { createDepositCheckout } from "@/app/lib/checkout";
import { newBookingId } from "@/app/lib/bookings";

export const runtime = "nodejs";

type Body = {
  serviceId?: string;
  name?: string;
  email?: string;
  preferredDate?: string;
  notes?: string;
};

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Payments are not configured. Set STRIPE_SECRET_KEY in your environment." },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { serviceId, name, email, preferredDate, notes } = body;

  // Validate the service server-side. The deposit amount comes from our own
  // catalog, never from the client, so it cannot be tampered with.
  const service = serviceId ? getService(serviceId) : undefined;
  if (!service) {
    return NextResponse.json({ error: "Please choose a valid service." }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  try {
    const session = await createDepositCheckout({
      service,
      email,
      name,
      preferredDate,
      notes,
      bookingId: newBookingId(),
      source: "web",
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
