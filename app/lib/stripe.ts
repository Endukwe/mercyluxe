import Stripe from "stripe";

// Server-only Stripe client. STRIPE_SECRET_KEY must be set in the environment.
// This module must never be imported into a Client Component.

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key
  ? new Stripe(key, { apiVersion: "2024-12-18.acacia" })
  : null;

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
