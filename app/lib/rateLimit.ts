import { redis } from "./redis";

// Fixed-window rate limiter on Upstash Redis. Used to throttle admin login
// attempts so the single shared password can't be brute-forced.
//
// If Upstash is not configured, this fails OPEN (allows the request) and logs a
// warning, so the app still works in development. In production Upstash should
// always be set, so login is always throttled.

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Count one hit against `key` within a `windowSeconds` window. Returns whether
 * the caller is still under `limit`. The window starts on the first hit and the
 * key expires when it ends (sliding by first-hit, not per-request).
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  if (!redis) {
    console.warn("[rateLimit] Upstash not configured - allowing (no throttle).");
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
  }

  const redisKey = `rl:${key}`;
  try {
    const count = await redis.incr(redisKey);
    if (count === 1) {
      // First hit in this window - set the expiry.
      await redis.expire(redisKey, windowSeconds);
    }
    const ttl = await redis.ttl(redisKey);
    const retryAfterSeconds = ttl > 0 ? ttl : windowSeconds;
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      retryAfterSeconds,
    };
  } catch (err) {
    // On a Redis outage, fail open rather than locking out the legitimate admin.
    console.error("[rateLimit] Upstash error, allowing request:", err);
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
  }
}

/** Clear a rate-limit counter, e.g. after a successful login. Best-effort. */
export async function resetRateLimit(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(`rl:${key}`);
  } catch (err) {
    console.error("[rateLimit] Failed to reset:", err);
  }
}

/**
 * Best-effort client IP from proxy headers. Vercel/most hosts set
 * x-forwarded-for; fall back to x-real-ip, then a constant bucket so an
 * unidentifiable client is still globally throttled rather than unlimited.
 */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
