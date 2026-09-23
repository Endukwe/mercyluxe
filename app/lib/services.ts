// Bookable consultations and their fees.
// Fees are charged via Stripe Checkout. Fees are per-session; the Rental
// Strategy fee is creditable toward a full-service package (see creditNote).
// Amounts are in USD cents (Stripe's smallest currency unit).

export type Service = {
  id: string;
  name: string;
  discipline: "Interiors" | "Hospitality" | "Lifestyle";
  blurb: string;
  feeCents: number;
  duration: string;
  /** Optional note shown with the fee, e.g. credit-toward-package terms. */
  creditNote?: string;
};

export const SERVICES: Service[] = [
  {
    id: "virtual-design-consult",
    name: "Virtual Design Consultation",
    discipline: "Interiors",
    blurb: "Design advice, space feedback and styling recommendations.",
    feeCents: 7500,
    duration: "45 minutes",
  },
  {
    id: "inhome-design-consult",
    name: "In-Home Design Consultation",
    discipline: "Interiors",
    blurb:
      "On-site walkthrough, space planning, design direction and preliminary budget guidance.",
    feeCents: 15000,
    duration: "up to 90 minutes",
  },
  {
    id: "rental-strategy-consult",
    name: "Rental Strategy Consultation",
    discipline: "Hospitality",
    blurb:
      "A private strategy session for a short-, mid- or long-term rental: evaluation, strategy, setup, platforms, pricing and next steps.",
    feeCents: 25000,
    duration: "45–60 minute private session",
    creditNote:
      "The $250 fee is credited toward a qualifying full-service Mercy Luxe package booked within 14 days.",
  },
];

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
