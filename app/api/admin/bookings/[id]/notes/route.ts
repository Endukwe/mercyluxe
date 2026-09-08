import { NextResponse } from "next/server";
import { addNote, deleteNote, type NoteKind } from "@/app/lib/bookings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS: NoteKind[] = ["note", "action", "preference"];

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let text = "";
  let kind: NoteKind = "note";
  try {
    const body = await req.json();
    text = String(body.text ?? "").trim();
    if (KINDS.includes(body.kind)) kind = body.kind;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!text) return NextResponse.json({ error: "Note text is required." }, { status: 400 });

  const booking = await addNote(id, text.slice(0, 2000), kind);
  if (!booking) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ booking });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const noteId = url.searchParams.get("noteId") ?? "";
  if (!noteId) return NextResponse.json({ error: "noteId required." }, { status: 400 });
  const booking = await deleteNote(id, noteId);
  if (!booking) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ booking });
}
