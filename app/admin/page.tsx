"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star, ArrowRight } from "@phosphor-icons/react";
import { api, money, when, effDate, STATUS, type Booking, type BookingStatus } from "./ui";

const FILTERS: (BookingStatus | "all")[] = ["all", "pending", "paid", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  useEffect(() => {
    api<{ bookings: Booking[] }>("/api/admin/bookings")
      .then((d) => setBookings(d.bookings))
      .catch((e) => setError(e.message));
  }, []);

  const counts = useMemo(() => {
    const c = { all: 0, pending: 0, paid: 0, cancelled: 0 } as Record<string, number>;
    (bookings ?? []).forEach((b) => {
      c.all++;
      c[b.status]++;
    });
    return c;
  }, [bookings]);

  const rows = (bookings ?? []).filter((b) => filter === "all" || b.status === filter);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-light">Bookings</h1>
          <p className="mt-1 text-sm text-onyx/50">
            {bookings ? `${counts.all} total · ${counts.paid} confirmed · ${counts.pending} pending` : "Loading…"}
          </p>
        </div>
        <Link
          href="/admin/new"
          className="label-luxe rounded-full bg-onyx px-6 py-3 text-[11px] text-ivory transition-colors hover:bg-onyx-soft"
        >
          New Booking
        </Link>
      </div>

      <div className="mb-5 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm capitalize transition-colors ${
              filter === f ? "bg-onyx text-ivory" : "bg-onyx/5 text-onyx/60 hover:bg-onyx/10"
            }`}
          >
            {f} {f !== "all" && <span className="opacity-60">{counts[f]}</span>}
          </button>
        ))}
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      {bookings && rows.length === 0 && (
        <div className="rounded-2xl border border-dashed border-onyx/15 py-20 text-center">
          <p className="font-display text-2xl text-onyx/60">No bookings here yet</p>
          <p className="mt-2 text-sm text-onyx/40">Paid bookings and admin invites will appear in this list.</p>
        </div>
      )}

      {rows.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-onyx/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-onyx/10 text-left text-[11px] uppercase tracking-wider text-onyx/40">
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Deposit</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-b border-onyx/5 last:border-0 hover:bg-ivory/60">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/bookings/${b.id}`} className="group flex items-center gap-2">
                      {b.followUp && <Star size={13} weight="fill" className="text-gold" />}
                      <span className="font-medium text-onyx group-hover:text-gold-deep">
                        {b.clientName || "—"}
                      </span>
                    </Link>
                    <div className="text-xs text-onyx/45">{b.clientEmail}</div>
                  </td>
                  <td className="px-5 py-3.5 text-onyx/75">{b.serviceName}</td>
                  <td className="px-5 py-3.5 text-onyx/75">{effDate(b) || <span className="text-onyx/30">—</span>}</td>
                  <td className="px-5 py-3.5 tabular-nums text-onyx/75">{money(b.amountCents)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${STATUS[b.status].chip}`}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS[b.status].dot }} />
                      {STATUS[b.status].label}
                    </span>
                    {b.source === "admin" && (
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-onyx/30">invited</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/admin/bookings/${b.id}`} className="text-onyx/30 hover:text-gold">
                      <ArrowRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-5 py-2 text-[11px] text-onyx/35">Newest first · click a row to view notes and details.</p>
        </div>
      )}
    </div>
  );
}
