import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/app/lib/stripe";
import { sendBookingEmails } from "@/app/lib/email";
import { claimEvent, releaseEvent } from "@/app/lib/dedupe";

// Stripe webhook receiver. Verifies the signature against the raw request body,
// then acts on completed checkouts. Must run on the Node.js runtime and must
// read the raw body (not JSON) so signature verification works.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret) {
    console.error("[webhook] Stripe not configured (STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET).");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // Idempotency: claim this event id so retries / duplicate deliveries are
  // processed exactly once. If we don't win the claim, it's already handled.
  const claimed = await claimEvent(event.id);
  if (!claimed) {
    console.log(`[webhook] Duplicate event ${event.id} skipped.`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Only act on paid sessions.
      if (session.payment_status === "paid") {
        const clientEmail =
          session.customer_email || session.customer_details?.email || "";
        const meta = session.metadata ?? {};

        if (clientEmail) {
          await sendBookingEmails({
            clientName: meta.clientName || session.customer_details?.name || "",
            clientEmail,
            serviceName: meta.serviceName || "Consultation",
            amountCents: session.amount_total ?? 0,
            preferredDate: meta.preferredDate || undefined,
            notes: meta.notes || undefined,
          });
        } else {
          console.warn("[webhook] checkout.session.completed had no client email; skipping emails.");
        }
      }
    }
    // Other event types (payment_intent.succeeded, refunds, etc.) can be handled here later.
  } catch (err) {
    // Release the claim so Stripe's retry can reprocess this event, then return
    // 500 so Stripe knows to retry.
    console.error("[webhook] Handler error:", err);
    await releaseEvent(event.id);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
