import { NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";
import { rateLimit, clientIp } from "@/app/lib/rateLimit";
import { validateGuest, sniffImage, ID_MAX_BYTES } from "@/app/lib/guestValidation";
import { PLATFORMS } from "@/app/lib/guestPlatforms";
import { newGuestId, saveGuest, saveGuestId, ID_TTL_SECONDS, type Guest } from "@/app/lib/guests";
import { sendGuestEmails } from "@/app/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 3000; // bots submit instantly
const MAX_FILL_MS = 1000 * 60 * 60 * 6; // stale/replayed form

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const o = new URL(origin);
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    if (host && o.host === host) return true;
    const site = process.env.NEXT_PUBLIC_SITE_URL;
    if (site) {
      const s = new URL(site);
      // Accept apex and www variants of the configured site.
      const strip = (h: string) => h.replace(/^www\./, "");
      return strip(o.host) === strip(s.host);
    }
  } catch {
    return false;
  }
  return false;
}

export async function POST(req: Request) {
  if (!redis) {
    return NextResponse.json({ error: "Registration is temporarily unavailable." }, { status: 503 });
  }
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  }

  // Reject oversized bodies before parsing (image cap + generous room for fields).
  const len = Number(req.headers.get("content-length") || 0);
  if (len > ID_MAX_BYTES + 64_000) {
    return NextResponse.json({ error: "Upload is too large." }, { status: 413 });
  }

  const rl = await rateLimit(`guest:${clientIp(req)}`, 10, 60 * 60);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Spam traps: honeypot must be empty; form must not be filled impossibly fast.
  const honeypot = form.get("website");
  const startedAt = Number(form.get("startedAt"));
  const elapsed = Date.now() - startedAt;
  if ((typeof honeypot === "string" && honeypot.length > 0) || !Number.isFinite(startedAt) || elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
    // Look successful so bots learn nothing; store nothing.
    return NextResponse.json({ ok: true });
  }

  const fields: Record<string, unknown> = {};
  for (const k of ["fullName", "email", "phone", "address", "platform", "reservationCode", "checkIn", "checkOut", "guests", "emergencyName", "emergencyPhone", "emergencyAddress", "marketingOptIn"]) {
    const v = form.get(k);
    fields[k] = typeof v === "string" ? v : "";
  }
  const result = validateGuest(fields);
  if (!result.ok) {
    return NextResponse.json({ error: result.error, field: result.field }, { status: 400 });
  }

  const file = form.get("idPhoto");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Please add a photo of your ID.", field: "idPhoto" }, { status: 400 });
  }
  if (file.size > ID_MAX_BYTES) {
    return NextResponse.json({ error: "ID photo is too large. Please try another photo.", field: "idPhoto" }, { status: 400 });
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!sniffImage(bytes)) {
    return NextResponse.json({ error: "ID must be a photo (JPEG, PNG or WebP).", field: "idPhoto" }, { status: 400 });
  }

  const now = Date.now();
  const guest: Guest = {
    id: newGuestId(),
    ...result.data,
    idExpiresAt: now + ID_TTL_SECONDS * 1000,
    createdAt: now,
  };

  try {
    await saveGuestId(guest.id, Buffer.from(bytes).toString("base64"));
    await saveGuest(guest);
  } catch (err) {
    console.error("[guest] storage error:", err);
    return NextResponse.json({ error: "Could not save your registration. Please try again." }, { status: 500 });
  }

  try {
    await sendGuestEmails({ ...guest, platformLabel: PLATFORMS[guest.platform] });
  } catch (err) {
    console.error("[guest] email error:", err);
  }

  return NextResponse.json({ ok: true });
}
