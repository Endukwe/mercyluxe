// Booking platforms a guest can choose. Client-safe (no server imports).
export const PLATFORMS = {
  airbnb: "Airbnb",
  vrbo: "Vrbo",
  booking: "Booking.com",
  direct: "Direct",
  other: "Other",
} as const;

export type Platform = keyof typeof PLATFORMS;
