"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, DownloadSimple } from "@phosphor-icons/react";
import { api } from "../ui";
import { PLATFORMS } from "@/app/lib/guestPlatforms";
import { idStatus, type GuestRow } from "./guestUi";

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<GuestRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    api<{ guests: GuestRow[] }>("/api/admin/guests")
      .then((d) => setGuests(d.guests))
      .catch((e) => setError(e.message));
  }, []);

  const opted = (guests ?? []).filter((g) => g.marketingOptIn).length;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-light">Guests</h1>
          <p className="mt-1 text-sm text-onyx/50">
            {guests ? `${guests.length} registered · ${opted} opted in to marketing` : "Loading…"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/api/admin/guests?format=csv&optedIn=1" className="flex items-center gap-2 rounded-full bg-onyx/5 px-4 py-2 text-sm text-onyx/70 hover:bg-onyx/10">
            <DownloadSimple size={15} /> Opted-in CSV
          </a>
          <a href="/api/admin/guests?format=csv" className="flex items-center gap-2 rounded-full bg-onyx/5 px-4 py-2 text-sm text-onyx/70 hover:bg-onyx/10">
            <DownloadSimple size={15} /> All CSV
          </a>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-gold/30 bg-gold/8 px-4 py-3 text-sm text-gold-deep">
        Link to send guests: <span className="select-all break-all font-medium">{origin}/guest-registration</span>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

      {guests && guests.length === 0 && (
        <div className="rounded-2xl border border-dashed border-onyx/15 py-20 text-center">
          <p className="font-display text-2xl text-onyx/60">No guest registrations yet</p>
          <p className="mt-2 text-sm text-onyx/40">Completed guest forms will appear here.</p>
        </div>
      )}

      {guests && guests.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-onyx/10 bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-onyx/10 text-left text-[11px] uppercase tracking-wider text-onyx/40">
                <th className="px-5 py-3 font-medium">Guest</th>
                <th className="px-5 py-3 font-medium">Space</th>
                <th className="px-5 py-3 font-medium">Stay</th>
                <th className="px-5 py-3 font-medium">Booked via</th>
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g) => {
                const s = idStatus(g);
                return (
                  <tr key={g.id} className="border-b border-onyx/5 last:border-0 hover:bg-ivory/60">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/guests/${g.id}`} className="font-medium text-onyx hover:text-gold-deep">
                        {g.fullName}
                      </Link>
                      <div className="text-xs text-onyx/45">
                        {g.email}
                        {g.marketingOptIn && (
                          <span className="ml-2 text-[10px] uppercase tracking-wide text-gold-deep">opted in</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-onyx/75">{g.space}</td>
                    <td className="px-5 py-3.5 tabular-nums text-onyx/75">
                      {g.checkIn} → {g.checkOut}
                    </td>
                    <td className="px-5 py-3.5 text-onyx/75">
                      {PLATFORMS[g.platform] ?? g.platform}
                      <div className="text-xs text-onyx/45">{g.reservationCode}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs ${s.chip}`}>{s.label}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/admin/guests/${g.id}`} className="text-onyx/30 hover:text-gold">
                        <ArrowRight size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="px-5 py-2 text-[11px] text-onyx/35">
            Newest first · ID photos delete automatically 30 days after submission.
          </p>
        </div>
      )}
    </div>
  );
}
