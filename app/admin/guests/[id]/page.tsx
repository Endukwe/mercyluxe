"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash } from "@phosphor-icons/react";
import { api, when } from "../../ui";
import { PLATFORMS } from "@/app/lib/guestPlatforms";
import { idStatus, type GuestRow } from "../guestUi";

export default function GuestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [g, setG] = useState<GuestRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ guest: GuestRow }>(`/api/admin/guests/${id}`)
      .then((d) => setG(d.guest))
      .catch((e) => setError(e.message));
  }, [id]);

  async function removeId() {
    if (!confirm("Delete this ID photo now? This cannot be undone.")) return;
    setBusy(true);
    try {
      await api(`/api/admin/guests/${id}/id-image`, { method: "DELETE" });
      setG((p) => (p ? { ...p, hasId: false } : p));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function removeGuest() {
    if (!confirm("Delete this guest record and ID photo permanently?")) return;
    setBusy(true);
    try {
      await api(`/api/admin/guests/${id}`, { method: "DELETE" });
      router.replace("/admin/guests");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setBusy(false);
    }
  }

  if (error) return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>;
  if (!g) return <p className="text-onyx/50">Loading…</p>;

  const s = idStatus(g);
  const rows: [string, string][] = [
    ["Email", g.email],
    ["Phone", g.phone],
    ["Address", g.address],
    ["Booked via", PLATFORMS[g.platform] ?? g.platform],
    ["Reservation", g.reservationCode],
    ["Check-in", g.checkIn],
    ["Check-out", g.checkOut],
    ["Guests", String(g.guests)],
    ["Emergency contact", g.emergencyName],
    ["Emergency phone", g.emergencyPhone],
    ["Emergency address", g.emergencyAddress],
    ["Marketing", g.marketingOptIn ? "Opted in" : "Not opted in"],
    ["Submitted", when(g.createdAt)],
  ];

  return (
    <div>
      <Link href="/admin/guests" className="mb-6 inline-flex items-center gap-2 text-sm text-onyx/50 hover:text-gold">
        <ArrowLeft size={15} /> Back to guests
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="font-display text-4xl font-light">{g.fullName}</h1>
          <dl className="mt-6 divide-y divide-onyx/5 rounded-2xl border border-onyx/10 bg-white">
            {rows.map(([k, v]) => (
              <div key={k} className="flex gap-4 px-5 py-3 text-sm">
                <dt className="w-32 shrink-0 text-[11px] uppercase tracking-wider text-onyx/40">{k}</dt>
                <dd className="whitespace-pre-line break-words text-onyx/80">{v}</dd>
              </div>
            ))}
          </dl>
          <button
            onClick={removeGuest}
            disabled={busy}
            className="mt-6 flex items-center gap-2 rounded-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash size={15} /> Delete guest record
          </button>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="label-luxe text-[11px] text-onyx/60">Photo ID</h2>
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs ${s.chip}`}>{s.label}</span>
          </div>
          {g.hasId ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/admin/guests/${g.id}/id-image`}
                alt={`Photo ID for ${g.fullName}`}
                className="w-full rounded-2xl border border-onyx/10 bg-white object-contain"
              />
              <button
                onClick={removeId}
                disabled={busy}
                className="mt-4 flex items-center gap-2 rounded-full bg-onyx/5 px-4 py-2 text-sm text-onyx/70 hover:bg-onyx/10 disabled:opacity-50"
              >
                <Trash size={15} /> Delete ID photo now
              </button>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-onyx/15 py-16 text-center text-sm text-onyx/45">
              ID photo removed (auto-deleted 30 days after submission, or deleted manually).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
