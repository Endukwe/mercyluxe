import { redis } from "./redis";

// Webhook idempotency via Upstash Redis. Stripe can deliver the same event more
// than once (retries, at-least-once delivery); we claim each event id exactly
// once so side effects (emails) run a single time.

// Stripe retries failed webhooks for up to ~3 days. Keep keys a bit longer.
const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Atomically claim a Stripe event id for processing.
 * Returns true if this call won the claim (process the event now),
 * false if the event was already processed (skip it).
 *
 * If Upstash is not configured, returns true (no dedupe) and logs a warning,
 * so the webhook still works in development.
 */
export async function claimEvent(eventId: string): Promise<boolean> {
  if (!redis) {
    console.warn("[dedupe] Upstash not configured - skipping idempotency check.");
    return true;
  }

  try {
    // SET key value NX EX ttl -> "OK" if newly set, null if it already existed.
    const result = await redis.set(`stripe:evt:${eventId}`, "1", {
      nx: true,
      ex: TTL_SECONDS,
    });
    return result === "OK";
  } catch (err) {
    // On a Redis outage, fail open: better to risk a duplicate email than to
    // drop a real booking notification entirely.
    console.error("[dedupe] Upstash error, processing without dedupe:", err);
    return true;
  }
}

/**
 * Release a previously claimed event id. Call this if processing fails after a
 * successful claim, so Stripe's retry can be handled instead of being skipped.
 */
export async function releaseEvent(eventId: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(`stripe:evt:${eventId}`);
  } catch (err) {
    console.error("[dedupe] Failed to release event claim:", err);
  }
}
