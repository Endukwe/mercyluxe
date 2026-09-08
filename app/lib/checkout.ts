import { stripe, getSiteUrl } from "./stripe";
import type { Service } from "./services";

// Shared Stripe Checkout Session builder for booking deposits. Used by the
// public booking form and by admin-created bookings. The deposit amount always
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
          unit_amount: opts.service.depositCents,
          product_data: {
            name: `${opts.service.name} - Booking Deposit`,
            description: "Credited toward your Mercy Luxe project. Fully refundable within 48 hours.",
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
