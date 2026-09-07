import { NextResponse } from "next/server";
import { stripe, getSiteUrl } from "@/app/lib/stripe";
import { getService } from "@/app/lib/services";

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

  const siteUrl = getSiteUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: service.depositCents,
            product_data: {
              name: `${service.name} - Booking Deposit`,
              description: "Credited toward your Mercy Luxe project. Fully refundable within 48 hours.",
            },
          },
        },
      ],
      metadata: {
        serviceId: service.id,
        serviceName: service.name,
        clientName: name ?? "",
        preferredDate: preferredDate ?? "",
        notes: (notes ?? "").slice(0, 480),
      },
      success_url: `${siteUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/book?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
