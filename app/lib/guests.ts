import { redis } from "./redis";
import { randomUUID } from "crypto";
import type { Platform } from "./guestPlatforms";

// Guest registrations (rental-platform guests) on the shared Upstash Redis.
// Layout:
//   guest:{id}       -> Guest JSON (kept; used for follow-up)
//   guests:index     -> ZSET (score = createdAt ms, member = id) for listing
//   guest-id:{id}    -> base64 JPEG of the photo ID, with a Redis TTL so it
//                       deletes itself automatically (no cleanup job needed)

export const ID_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days from submission

export type Guest = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  platform: Platform;
  reservationCode: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  emergencyName: string;
  emergencyPhone: string;
  emergencyAddress: string;
  marketingOptIn: boolean;
  idExpiresAt: number; // ms; image key expires at (about) this time
  createdAt: number;
};

export function newGuestId(): string {
  return randomUUID();
}

function requireRedis() {
  if (!redis) throw new Error("Storage not configured (UPSTASH_REDIS_REST_URL).");
  return redis;
}

export async function saveGuest(g: Guest): Promise<void> {
  const r = requireRedis();
  await r.set(`guest:${g.id}`, g);
  await r.zadd("guests:index", { score: g.createdAt, member: g.id });
}

export async function getGuest(id: string): Promise<Guest | null> {
  if (!redis) return null;
  return (await redis.get<Guest>(`guest:${id}`)) ?? null;
}

export async function listGuests(limit = 1000): Promise<Guest[]> {
  if (!redis) return [];
  const ids = (await redis.zrange<string[]>("guests:index", 0, limit - 1, { rev: true })) ?? [];
  if (ids.length === 0) return [];
  const rows = await redis.mget<Guest[]>(...ids.map((id) => `guest:${id}`));
  return rows.filter((g): g is Guest => !!g);
}

export async function deleteGuest(id: string): Promise<void> {
  const r = requireRedis();
  await r.del(`guest:${id}`, `guest-id:${id}`);
  await r.zrem("guests:index", id);
}

// The image is stored as a plain base64 string. Upstash's client would try to
// JSON-parse values on read, so it is wrapped in an object.
export async function saveGuestId(id: string, base64: string): Promise<void> {
  await requireRedis().set(`guest-id:${id}`, { b64: base64 }, { ex: ID_TTL_SECONDS });
}

export async function getGuestId(id: string): Promise<string | null> {
  if (!redis) return null;
  const v = await redis.get<{ b64: string }>(`guest-id:${id}`);
  return v?.b64 ?? null;
}

export async function hasGuestIds(ids: string[]): Promise<Record<string, boolean>> {
  const out: Record<string, boolean> = {};
  if (!redis || ids.length === 0) return out;
  const p = redis.pipeline();
  ids.forEach((id) => p.exists(`guest-id:${id}`));
  const res = (await p.exec()) as number[];
  ids.forEach((id, i) => (out[id] = res[i] === 1));
  return out;
}

export async function deleteGuestId(id: string): Promise<void> {
  await requireRedis().del(`guest-id:${id}`);
}
