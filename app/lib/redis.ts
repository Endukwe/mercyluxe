import { Redis } from "@upstash/redis";

// Single shared Upstash Redis client (same instance used for webhook dedupe and
// booking storage). Null when not configured so features degrade gracefully.
export const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;
