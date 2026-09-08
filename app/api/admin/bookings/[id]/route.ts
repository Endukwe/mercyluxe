import { NextResponse } from "next/server";
import { getBooking, updateBooking, type Booking } from "@/app/lib/bookings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ booking });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: Partial<Booking>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Only allow a safe subset of fields to be edited by the admin.
  // NOTE: `status` is intentionally NOT editable here - it is system-owned
  // (pending on invite, paid via the Stripe webhook) so payment state can't be
  // corrupted by a manual override.
  const patch: Partial<Booking> = {};
  if (typeof body.meetingDate === "string") patch.meetingDate = body.meetingDate || undefined;
  if (Array.isArray(body.tags)) patch.tags = body.tags.slice(0, 20).map(String);
  if (typeof body.followUp === "boolean") patch.followUp = body.followUp;

  const updated = await updateBooking(id, patch);
  if (!updated) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ booking: updated });
}
