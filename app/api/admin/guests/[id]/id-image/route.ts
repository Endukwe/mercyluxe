import { NextResponse } from "next/server";
import { getGuestId, deleteGuestId } from "@/app/lib/guests";
import { sniffImage } from "@/app/lib/guestValidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ID_RE = /^[0-9a-f-]{36}$/i;
const TYPES = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp" } as const;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ID_RE.test(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const b64 = await getGuestId(id);
  if (!b64) return NextResponse.json({ error: "ID photo expired or removed." }, { status: 404 });
  const bytes = Buffer.from(b64, "base64");
  const kind = sniffImage(bytes);
  if (!kind) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": TYPES[kind],
      "Cache-Control": "no-store, private",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
      "Content-Disposition": "inline",
    },
  });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ID_RE.test(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await deleteGuestId(id);
  return NextResponse.json({ ok: true });
}
