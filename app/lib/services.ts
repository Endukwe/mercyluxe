// Bookable services and their consultation deposit amounts.
// Deposits are charged via Stripe Checkout and credited toward the project.
// Amounts are in USD cents (Stripe's smallest currency unit).

export type Service = {
  id: string;
  name: string;
  discipline: "Interiors" | "Hospitality" | "Lifestyle";
  blurb: string;
  depositCents: number;
  duration: string;
};

export const SERVICES: Service[] = [
  {
    id: "residential-interiors",
    name: "Residential Interiors",
    discipline: "Interiors",
    blurb: "Full-home and single-room design, from concept to final styling.",
    depositCents: 25000,
    duration: "90-minute discovery session",
  },
  {
    id: "interiors-consult",
    name: "Design Consultation",
    discipline: "Interiors",
    blurb: "A focused working session for palette, layout, and sourcing direction.",
    depositCents: 15000,
    duration: "60-minute session",
  },
  {
    id: "hospitality-spaces",
    name: "Hospitality & Commercial",
    discipline: "Hospitality",
    blurb: "Boutique hotels, short-term rentals, and guest-facing spaces that convert.",
    depositCents: 50000,
    duration: "Scoping call + site review",
  },
  {
    id: "str-styling",
    name: "Short-Term Rental Styling",
    discipline: "Hospitality",
    blurb: "Turnkey design and styling built for five-star guest reviews.",
    depositCents: 30000,
    duration: "Property walk-through",
  },
  {
    id: "lifestyle-styling",
    name: "Lifestyle & Event Styling",
    discipline: "Lifestyle",
    blurb: "Editorial styling for gatherings, seasonal moments, and brand shoots.",
    depositCents: 20000,
    duration: "Concept session",
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
