"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CaretLeft, CaretRight, Plus } from "@phosphor-icons/react";
import { api, money, dayKey, effDate, STATUS, KIND, type Booking, type NoteKind } from "../ui";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = "January February March April May June July August September October November December".split(" ");

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [selected, setSelected] = useState<string>(() => dayKey(new Date()));

  const load = () =>
    api<{ bookings: Booking[] }>("/api/admin/bookings").then((d) => setBookings(d.bookings));
  useEffect(() => {
    load();
  }, []);

  // group bookings by effective day
  const byDay = useMemo(() => {
    const m = new Map<string, Booking[]>();
    bookings.forEach((b) => {
      const d = effDate(b);
      if (!d) return;
      if (!m.has(d)) m.set(d, []);
      m.get(d)!.push(b);
    });
    return m;
  }, [bookings]);

  const first = new Date(cursor.y, cursor.m, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(dayKey(new Date(cursor.y, cursor.m, d)));

  const move = (delta: number) => {
    const nm = cursor.m + delta;
    setCursor({ y: cursor.y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12 });
  };

  const selectedBookings = byDay.get(selected) ?? [];
  const todayKey = dayKey(new Date());

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-4xl font-light">Calendar</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => move(-1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-onyx/5">
            <CaretLeft size={18} />
          </button>
          <span className="font-display w-44 text-center text-xl">
            {MONTHS[cursor.m]} {cursor.y}
          </span>
          <button onClick={() => move(1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-onyx/5">
            <CaretRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        {/* Month grid */}
        <div className="overflow-hidden rounded-2xl border border-onyx/10 bg-white">
          <div className="grid grid-cols-7 border-b border-onyx/10 text-center text-[11px] uppercase tracking-wider text-onyx/40">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-2.5">{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((key, i) => {
              if (!key) return <div key={i} className="min-h-24 border-b border-r border-onyx/5 bg-ivory/30" />;
              const list = byDay.get(key) ?? [];
              const isToday = key === todayKey;
              const isSel = key === selected;
              const dayNum = Number(key.slice(-2));
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={`min-h-24 border-b border-r border-onyx/5 p-2 text-left align-top transition-colors hover:bg-ivory ${
                    isSel ? "bg-gold/8 ring-1 ring-inset ring-gold/40" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full text-sm ${
                        isToday ? "bg-onyx text-ivory" : "text-onyx/70"
                      }`}
                    >
                      {dayNum}
                    </span>
                    {list.length > 0 && <span className="text-[10px] text-onyx/40">{list.length}</span>}
                  </div>
                  <div className="mt-1 space-y-1">
                    {list.slice(0, 3).map((b) => (
                      <div key={b.id} className="flex items-center gap-1 truncate text-[11px] text-onyx/70">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: STATUS[b.status].dot }} />
                        <span className="truncate">{b.clientName || b.clientEmail}</span>
                      </div>
                    ))}
                    {list.length > 3 && <div className="text-[10px] text-onyx/40">+{list.length - 3} more</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Day panel */}
        <aside>
          <h2 className="font-display text-2xl font-light">
            {new Date(selected + "T00:00:00").toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <p className="mt-1 text-sm text-onyx/45">
            {selectedBookings.length} booking{selectedBookings.length === 1 ? "" : "s"}
          </p>

          <div className="mt-5 space-y-4">
            {selectedBookings.length === 0 && (
              <p className="rounded-xl border border-dashed border-onyx/15 py-10 text-center text-sm text-onyx/40">
                Nothing scheduled this day.
              </p>
            )}
            {selectedBookings.map((b) => (
              <DayCard key={b.id} booking={b} onChange={load} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function DayCard({ booking, onChange }: { booking: Booking; onChange: () => void }) {
  const [text, setText] = useState("");
  const [kind, setKind] = useState<NoteKind>("note");
  const [open, setOpen] = useState(false);

  async function add() {
    if (!text.trim()) return;
    await api(`/api/admin/bookings/${booking.id}/notes`, {
      method: "POST",
      body: JSON.stringify({ text, kind }),
    });
    setText("");
    setOpen(false);
    onChange();
  }

  return (
    <div className="rounded-xl border border-onyx/10 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/admin/bookings/${booking.id}`} className="group">
          <div className="font-medium text-onyx group-hover:text-gold-deep">{booking.clientName || "—"}</div>
          <div className="text-xs text-onyx/45">
            {booking.serviceName} · <span className="tabular-nums">{money(booking.amountCents)}</span>
          </div>
        </Link>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${STATUS[booking.status].chip}`}>
          {STATUS[booking.status].label}
        </span>
      </div>

      {(booking.adminNotes ?? []).slice(0, 2).map((n) => (
        <div key={n.id} className="mt-2 flex gap-2 text-xs text-onyx/60">
          <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] ${KIND[n.kind].chip}`}>{KIND[n.kind].label}</span>
          <span className="truncate">{n.text}</span>
        </div>
      ))}

      {open ? (
        <div className="mt-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            autoFocus
            placeholder="Quick note from the meeting…"
            className="w-full resize-none rounded-lg border border-onyx/15 px-3 py-2 text-sm outline-none focus:border-gold"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex gap-1.5">
              {(["note", "action", "preference"] as NoteKind[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={`rounded-full px-2.5 py-1 text-[11px] capitalize ${
                    kind === k ? "bg-onyx text-ivory" : "bg-onyx/5 text-onyx/60"
                  }`}
                >
                  {KIND[k].label}
                </button>
              ))}
            </div>
            <button onClick={add} className="rounded-full bg-gold px-3 py-1.5 text-[11px] text-onyx hover:bg-gold-bright">
              Save
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-onyx/50 hover:text-gold"
        >
          <Plus size={13} /> Add a note
        </button>
      )}
    </div>
  );
}
