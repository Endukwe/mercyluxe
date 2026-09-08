"use client";

import { useState } from "react";
import Link from "next/link";
import { PaperPlaneTilt, Check, Copy, Warning } from "@phosphor-icons/react";
import { SERVICES } from "@/app/lib/services";
import { money } from "../ui";

type Result = { bookingId: string; url: string | null; emailed: boolean; emailError?: string };

export default function NewBookingPage() {
  const [serviceId, setServiceId] = useState(SERVICES[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const service = SERVICES.find((s) => s.id === serviceId)!;
  const input = "w-full rounded-lg border border-onyx/15 bg-white px-4 py-3 text-onyx outline-none focus:border-gold";
  const label = "label-luxe mb-2 block text-[10px] text-onyx/50";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, name, email, preferredDate, message, adminNote }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not create booking.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <Check size={26} weight="bold" />
        </div>
        <h1 className="font-display mt-6 text-3xl font-light">Invitation created</h1>
        <p className="mt-2 text-sm text-onyx/55">
          {result.emailed
            ? `A payment link was emailed to ${email}. The booking confirms automatically once paid.`
            : "Booking saved, but the email could not be sent — share the link below manually."}
        </p>
        {!result.emailed && result.emailError && (
          <p className="mx-auto mt-3 max-w-md rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {result.emailError}
          </p>
        )}
        {result.url && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-onyx/15 bg-white p-2">
            <span className="flex-1 truncate px-2 text-left text-sm text-onyx/60">{result.url}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result.url!);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="flex items-center gap-1.5 rounded-md bg-onyx px-3 py-2 text-xs text-ivory hover:bg-onyx-soft"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <Link href={`/admin/bookings/${result.bookingId}`} className="label-luxe rounded-full bg-onyx px-6 py-3 text-[11px] text-ivory hover:bg-onyx-soft">
            View booking
          </Link>
          <button
            onClick={() => {
              setResult(null);
              setName("");
              setEmail("");
              setPreferredDate("");
              setMessage("");
              setAdminNote("");
            }}
            className="label-luxe rounded-full border border-onyx/20 px-6 py-3 text-[11px] text-onyx hover:bg-onyx/5"
          >
            Create another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-4xl font-light">New booking for a client</h1>
      <p className="mt-2 text-sm text-onyx/55">
        We&apos;ll email the client a secure payment link. When they pay the deposit, the booking is
        confirmed and added to the calendar, with confirmation emails sent automatically.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-6">
        <div>
          <span className={label}>Service</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <label
                key={s.id}
                className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                  serviceId === s.id ? "border-gold bg-gold/8" : "border-onyx/12 bg-white hover:border-onyx/30"
                }`}
              >
                <span>
                  <input type="radio" name="svc" className="sr-only" checked={serviceId === s.id} onChange={() => setServiceId(s.id)} />
                  <span className="block text-sm font-medium">{s.name}</span>
                  <span className="label-luxe text-[10px] text-onyx/40">{s.discipline}</span>
                </span>
                <span className="font-display tabular-nums text-gold-deep">{money(s.depositCents)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="n">Client name</label>
            <input id="n" value={name} onChange={(e) => setName(e.target.value)} className={input} placeholder="Adaeze Whitfield" />
          </div>
          <div>
            <label className={label} htmlFor="e">Client email</label>
            <input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} placeholder="client@email.com" />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="d">Proposed date (optional)</label>
          <input id="d" type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className={input} />
        </div>

        <div>
          <label className={label} htmlFor="m">Message to client (optional)</label>
          <textarea id="m" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={`${input} resize-none`} placeholder="Lovely meeting you at the showhouse — here's the link to hold your date." />
        </div>

        <div>
          <label className={label} htmlFor="an">Private note (optional, studio only)</label>
          <input id="an" value={adminNote} onChange={(e) => setAdminNote(e.target.value)} className={input} placeholder="Referred by Bexley project" />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
            <Warning size={18} weight="fill" className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-onyx/50">
            Deposit: <span className="font-display text-lg tabular-nums text-onyx">{money(service.depositCents)}</span>
          </span>
          <button
            type="submit"
            disabled={loading}
            className="label-luxe flex items-center gap-2 rounded-full bg-onyx px-7 py-4 text-[11px] text-ivory hover:bg-onyx-soft disabled:opacity-60"
          >
            <PaperPlaneTilt size={15} weight="fill" /> {loading ? "Sending" : "Send payment link"}
          </button>
        </div>
      </form>
    </div>
  );
}
