import { NextResponse } from "next/server";
import { getGuest, deleteGuest, hasGuestIds } from "@/app/lib/guests";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ID_RE = /^[0-9a-f-]{36}$/i;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ID_RE.test(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const guest = await getGuest(id);
  if (!guest) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const ids = await hasGuestIds([id]);
  return NextResponse.json({ guest: { ...guest, hasId: !!ids[id] } });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ID_RE.test(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await deleteGuest(id);
  return NextResponse.json({ ok: true });
}
