import { redis } from "./redis";
import { randomUUID } from "crypto";

// Booking storage on Upstash Redis (reuses the same instance as webhook dedupe).
// Layout:
//   booking:{id}          -> Booking JSON
//   bookings:index        -> ZSET (score = createdAt ms, member = id) for listing

export type BookingStatus = "pending" | "paid" | "cancelled";
export type NoteKind = "note" | "action" | "preference";

export type AdminNote = {
  id: string;
  text: string;
  kind: NoteKind;
  createdAt: number;
};

export type Booking = {
  id: string;
  status: BookingStatus;
  service: string;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  amountCents: number;
  preferredDate?: string; // YYYY-MM-DD, what the client asked for
  meetingDate?: string; // YYYY-MM-DD, what the studio actually scheduled
  clientNotes?: string; // free text the client left at booking
  adminNotes: AdminNote[];
  tags: string[];
  followUp: boolean;
  source: "web" | "admin";
  stripeSessionId?: string;
  createdAt: number;
  paidAt?: number;
};

export function newBookingId(): string {
  return randomUUID();
}

// Date used for the calendar: the scheduled meeting if set, else the request.
export function effectiveDate(b: Booking): string | undefined {
  return b.meetingDate || b.preferredDate;
}

export async function saveBooking(b: Booking): Promise<void> {
  if (!redis) throw new Error("Storage not configured (UPSTASH_REDIS_REST_URL).");
  await redis.set(`booking:${b.id}`, b);
  await redis.zadd("bookings:index", { score: b.createdAt, member: b.id });
}

export async function getBooking(id: string): Promise<Booking | null> {
  if (!redis) return null;
  return (await redis.get<Booking>(`booking:${id}`)) ?? null;
}

export async function listBookings(limit = 500): Promise<Booking[]> {
  if (!redis) return [];
  const ids = (await redis.zrange<string[]>("bookings:index", 0, limit - 1, { rev: true })) ?? [];
  if (ids.length === 0) return [];
  const rows = await redis.mget<Booking[]>(...ids.map((id) => `booking:${id}`));
  return rows.filter((b): b is Booking => !!b);
}

export async function updateBooking(
  id: string,
  patch: Partial<Booking>
): Promise<Booking | null> {
  const cur = await getBooking(id);
  if (!cur) return null;
  const next = { ...cur, ...patch };
  await saveBooking(next);
  return next;
}

export async function addNote(
  id: string,
  text: string,
  kind: NoteKind
): Promise<Booking | null> {
  const cur = await getBooking(id);
  if (!cur) return null;
  const note: AdminNote = { id: randomUUID(), text, kind, createdAt: Date.now() };
  cur.adminNotes = [note, ...(cur.adminNotes ?? [])];
  await saveBooking(cur);
  return cur;
}

export async function deleteNote(id: string, noteId: string): Promise<Booking | null> {
  const cur = await getBooking(id);
  if (!cur) return null;
  cur.adminNotes = (cur.adminNotes ?? []).filter((n) => n.id !== noteId);
  await saveBooking(cur);
  return cur;
}

// Create/complete a booking from a paid Stripe Checkout Session. If a pending
// record already exists (admin-created) it is upgraded to paid; otherwise a new
// paid record is created (public web booking).
export async function upsertPaidBooking(input: {
  bookingId: string;
  stripeSessionId: string;
  service: string;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  amountCents: number;
  preferredDate?: string;
  clientNotes?: string;
  source: "web" | "admin";
}): Promise<Booking> {
  const existing = await getBooking(input.bookingId);
  const now = Date.now();
  const b: Booking = existing
    ? {
        ...existing,
        status: "paid",
        paidAt: now,
        stripeSessionId: input.stripeSessionId,
        amountCents: input.amountCents || existing.amountCents,
      }
    : {
        id: input.bookingId,
        status: "paid",
        service: input.service,
        serviceName: input.serviceName,
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        amountCents: input.amountCents,
        preferredDate: input.preferredDate,
        clientNotes: input.clientNotes,
        adminNotes: [],
        tags: [],
        followUp: false,
        source: input.source,
        stripeSessionId: input.stripeSessionId,
        createdAt: now,
        paidAt: now,
      };
  await saveBooking(b);
  return b;
}
