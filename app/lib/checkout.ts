import { stripe, getSiteUrl } from "./stripe";
import type { Service } from "./services";

// Shared Stripe Checkout Session builder for consultation fees. Used by the
// public booking form and by admin-created bookings. The fee amount always
// comes from the server-side catalog; bookingId ties the session back to our
// stored Booking record so the webhook can complete it.
export async function createDepositCheckout(opts: {
  service: Service;
  email: string;
  name?: string;
  preferredDate?: string;
  notes?: string;
  bookingId: string;
  source: "web" | "admin";
}) {
  if (!stripe) throw new Error("Stripe not configured.");
  const siteUrl = getSiteUrl();

  return stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: opts.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: opts.service.feeCents,
          product_data: {
            name: `${opts.service.name} - Consultation Fee`,
            description: "Mercy Luxe consultation fee.",
          },
        },
      },
    ],
    metadata: {
      bookingId: opts.bookingId,
      source: opts.source,
      serviceId: opts.service.id,
      serviceName: opts.service.name,
      clientName: opts.name ?? "",
      preferredDate: opts.preferredDate ?? "",
      notes: (opts.notes ?? "").slice(0, 480),
    },
    success_url: `${siteUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/book?canceled=1`,
  });
}
