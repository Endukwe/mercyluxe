"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CircleNotch, Lock, Warning } from "@phosphor-icons/react";
import { SERVICES, getService, formatPrice } from "../lib/services";

export function BookingForm() {
  const params = useSearchParams();
  const canceled = params.get("canceled") === "1";
  const initial = params.get("service") ?? SERVICES[0].id;

  const [serviceId, setServiceId] = useState(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = getService(serviceId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please tell us your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, name, email, preferredDate, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
        return;
      }
      throw new Error("No checkout URL returned.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-onyx/15 bg-white px-4 py-3 text-onyx placeholder:text-onyx/35 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/25";
  const labelCls = "label-luxe mb-2 block text-[10px] text-onyx/60";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {canceled && (
        <div className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-deep">
          Your checkout was canceled. No charge was made, your details are still here.
        </div>
      )}

      {/* Service selection */}
      <fieldset>
        <legend className={labelCls}>Select a service</legend>
        <div className="grid gap-3">
          {SERVICES.map((s) => {
            const active = s.id === serviceId;
            return (
              <label
                key={s.id}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border px-4 py-3 transition-colors ${
                  active ? "border-gold bg-gold/8" : "border-onyx/12 bg-white hover:border-onyx/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="service"
                    value={s.id}
                    checked={active}
                    onChange={() => setServiceId(s.id)}
                    className="sr-only"
                  />
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full border ${
                      active ? "border-gold" : "border-onyx/30"
                    }`}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-gold" />}
                  </span>
                  <span>
                    <span className="block font-display text-lg text-onyx">{s.name}</span>
                    <span className="label-luxe text-[10px] text-onyx/45">{s.discipline}</span>
                  </span>
                </div>
                <span className="font-display shrink-0 text-lg tabular-nums text-gold-deep">
                  {formatPrice(s.depositCents)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>Full name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Adaeze Whitfield" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@email.com" autoComplete="email" />
        </div>
      </div>

      <div>
        <label htmlFor="date" className={labelCls}>Preferred start (optional)</label>
        <input id="date" type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className={inputCls} />
      </div>

      <div>
        <label htmlFor="notes" className={labelCls}>Tell us about your space (optional)</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className={`${inputCls} resize-none`} placeholder="Rooms, timeline, style you are drawn to..." />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          <Warning size={18} weight="fill" className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="rule-gold my-1 opacity-50" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="label-luxe block text-[10px] text-onyx/50">Deposit today</span>
          <span className="font-display text-3xl tabular-nums text-onyx">
            {selected ? formatPrice(selected.depositCents) : "-"}
          </span>
          <span className="ml-2 text-sm text-onyx/50">credited to your project</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="label-luxe inline-flex items-center gap-2 rounded-full bg-onyx px-8 py-4 text-[11px] text-ivory transition-transform duration-200 hover:bg-onyx-soft active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <CircleNotch size={16} weight="bold" className="animate-spin" /> Redirecting
            </>
          ) : (
            <>
              <Lock size={15} weight="fill" /> Reserve &amp; Pay Deposit
            </>
          )}
        </button>
      </div>

      <p className="flex items-center gap-2 text-xs text-onyx/45">
        <Lock size={13} weight="fill" /> Secure payment by Stripe. You will be redirected to complete checkout.
      </p>
    </form>
  );
}
