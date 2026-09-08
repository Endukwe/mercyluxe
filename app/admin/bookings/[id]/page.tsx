"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, Trash, ArrowLeft, Plus } from "@phosphor-icons/react";
import { api, money, when, STATUS, KIND, type Booking, type NoteKind } from "../../ui";

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [b, setB] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [noteKind, setNoteKind] = useState<NoteKind>("note");
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<{ booking: Booking }>(`/api/admin/bookings/${id}`)
      .then((d) => setB(d.booking))
      .catch((e) => setError(e.message));
  }, [id]);

  async function patch(body: Partial<Booking>) {
    setSaving(true);
    try {
      const d = await api<{ booking: Booking }>(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setB(d.booking);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function addNote() {
    if (!noteText.trim()) return;
    const d = await api<{ booking: Booking }>(`/api/admin/bookings/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ text: noteText, kind: noteKind }),
    });
    setB(d.booking);
    setNoteText("");
  }

  async function delNote(noteId: string) {
    const d = await api<{ booking: Booking }>(`/api/admin/bookings/${id}/notes?noteId=${noteId}`, {
      method: "DELETE",
    });
    setB(d.booking);
  }

  function addTag() {
    const t = tagInput.trim();
    if (!t || !b) return;
    if (!b.tags.includes(t)) patch({ tags: [...b.tags, t] });
    setTagInput("");
  }

  if (error) return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>;
  if (!b) return <p className="text-onyx/50">Loading…</p>;

  const input = "rounded-lg border border-onyx/15 bg-white px-3 py-2 text-sm outline-none focus:border-gold";

  return (
    <div>
      <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-sm text-onyx/50 hover:text-gold">
        <ArrowLeft size={15} /> Back to bookings
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: details + notes */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-4xl font-light">{b.clientName || "Unnamed client"}</h1>
                <button
                  onClick={() => patch({ followUp: !b.followUp })}
                  title="Flag for follow-up"
                  className={b.followUp ? "text-gold" : "text-onyx/25 hover:text-gold"}
                >
                  <Star size={22} weight={b.followUp ? "fill" : "regular"} />
                </button>
              </div>
              <a href={`mailto:${b.clientEmail}`} className="text-sm text-onyx/55 hover:text-gold">
                {b.clientEmail}
              </a>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs ${STATUS[b.status].chip}`}>
              {STATUS[b.status].label}
            </span>
          </div>

          {b.status === "pending" && b.source === "admin" && (
            <div className="mt-5 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-deep">
              Invitation sent — awaiting the client&apos;s deposit. It becomes Confirmed automatically once paid.
            </div>
          )}

          <div className="mt-6 grid gap-4 rounded-2xl border border-onyx/10 bg-white p-6 sm:grid-cols-2">
            <Field label="Service">{b.serviceName}</Field>
            <Field label="Deposit">
              <span className="tabular-nums">{money(b.amountCents)}</span>
            </Field>
            <Field label="Requested date">{b.preferredDate || "—"}</Field>
            <Field label="Booked / added">{when(b.createdAt)}</Field>
            {b.clientNotes && (
              <div className="sm:col-span-2">
                <Field label="Client's note">
                  <span className="text-onyx/70">{b.clientNotes}</span>
                </Field>
              </div>
            )}
          </div>

          {/* Notes timeline */}
          <div className="mt-8">
            <h2 className="font-display text-2xl font-light">Studio notes</h2>
            <p className="mt-1 text-sm text-onyx/45">Meeting notes, action points, and client preferences.</p>

            <div className="mt-4 rounded-2xl border border-onyx/10 bg-white p-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                placeholder="Loves warm neutrals and boucle. Follow up with lighting quote by Friday…"
                className="w-full resize-none rounded-lg border border-onyx/15 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex gap-1.5">
                  {(["note", "action", "preference"] as NoteKind[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => setNoteKind(k)}
                      className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
                        noteKind === k ? "bg-onyx text-ivory" : "bg-onyx/5 text-onyx/60 hover:bg-onyx/10"
                      }`}
                    >
                      {KIND[k].label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={addNote}
                  className="label-luxe flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-[11px] text-onyx hover:bg-gold-bright"
                >
                  <Plus size={14} weight="bold" /> Add
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {(b.adminNotes ?? []).length === 0 && (
                <p className="text-sm text-onyx/40">No notes yet.</p>
              )}
              {(b.adminNotes ?? []).map((n) => (
                <div key={n.id} className="group rounded-xl border border-onyx/10 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] ${KIND[n.kind].chip}`}>
                      {KIND[n.kind].label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-onyx/35">{when(n.createdAt)}</span>
                      <button
                        onClick={() => delNote(n.id)}
                        className="text-onyx/20 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-onyx/80">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: controls */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-onyx/10 bg-white p-6">
            <h3 className="label-luxe text-[10px] text-onyx/40">Status</h3>
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-onyx/15 px-3 py-2 text-sm">
              <span className="h-2 w-2 rounded-full" style={{ background: STATUS[b.status].dot }} />
              {STATUS[b.status].label}
            </div>
            <p className="mt-2.5 text-xs text-onyx/40">
              Set automatically — pending on invite, confirmed once the deposit is paid.
            </p>
          </div>

          <div className="rounded-2xl border border-onyx/10 bg-white p-6">
            <h3 className="label-luxe text-[10px] text-onyx/40">Scheduled meeting</h3>
            <input
              type="date"
              value={b.meetingDate ?? ""}
              onChange={(e) => patch({ meetingDate: e.target.value })}
              className={`${input} mt-3 w-full`}
            />
            <p className="mt-2 text-xs text-onyx/40">Sets the day this booking shows on the calendar.</p>
          </div>

          <div className="rounded-2xl border border-onyx/10 bg-white p-6">
            <h3 className="label-luxe text-[10px] text-onyx/40">Tags</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {b.tags.map((t) => (
                <button
                  key={t}
                  onClick={() => patch({ tags: b.tags.filter((x) => x !== t) })}
                  className="rounded-full bg-taupe-soft px-3 py-1 text-xs text-onyx/70 hover:bg-taupe"
                  title="Remove tag"
                >
                  {t} ✕
                </button>
              ))}
              {b.tags.length === 0 && <span className="text-xs text-onyx/35">No tags</span>}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="VIP, repeat, sage palette…"
                className={`${input} flex-1`}
              />
              <button onClick={addTag} className="rounded-lg bg-onyx px-3 py-2 text-sm text-ivory hover:bg-onyx-soft">
                Add
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label-luxe text-[10px] text-onyx/40">{label}</div>
      <div className="mt-1 text-sm text-onyx">{children}</div>
    </div>
  );
}
