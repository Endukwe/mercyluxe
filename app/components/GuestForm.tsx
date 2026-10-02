"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, CircleNotch, IdentificationCard, Lock, Warning } from "@phosphor-icons/react";
import { PLATFORMS, type Platform } from "../lib/guestPlatforms";
import { validateGuest, ID_MAX_EDGE, ID_TARGET_BYTES, ID_MAX_BYTES } from "../lib/guestValidation";

type Fields = {
  fullName: string;
  email: string;
  phone: string;
  platform: Platform | "";
  reservationCode: string;
  space: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  marketingOptIn: boolean;
};

const EMPTY: Fields = {
  fullName: "",
  email: "",
  phone: "",
  platform: "",
  reservationCode: "",
  space: "",
  checkIn: "",
  checkOut: "",
  guests: "1",
  marketingOptIn: false,
};

// Re-encode the photo as a downscaled JPEG in the browser. This keeps storage
// small, normalises HEIC/PNG/etc. to JPEG, and drops EXIF metadata (GPS etc.).
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("That file couldn't be read as a photo. Please try another.");
  const scale = Math.min(1, ID_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't process the photo.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  for (const q of [0.85, 0.75, 0.65, 0.55, 0.45]) {
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", q));
    if (blob && (blob.size <= ID_TARGET_BYTES || q === 0.45)) {
      if (blob.size > ID_MAX_BYTES) break;
      return blob;
    }
  }
  throw new Error("That photo is too large. Please try another.");
}

export function GuestForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef<number>(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => setF((p) => ({ ...p, [k]: v }));

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") && file.type !== "") {
      setError("Please choose a photo of your ID.");
      e.target.value = "";
      return;
    }
    if (file.size > 25_000_000) {
      setError("That file is too large. Please choose a photo under 25MB.");
      e.target.value = "";
      return;
    }
    setProcessing(true);
    try {
      const blob = await compressImage(file);
      setPhoto(blob);
      setPreview(URL.createObjectURL(blob));
    } catch (err) {
      setPhoto(null);
      setPreview(null);
      e.target.value = "";
      setError(err instanceof Error ? err.message : "Could not read that photo.");
    } finally {
      setProcessing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const v = validateGuest({ ...f, marketingOptIn: f.marketingOptIn });
    if (!v.ok) {
      setError(v.error);
      if (v.field) document.getElementById(v.field)?.focus();
      return;
    }
    if (!photo) {
      setError("Please add a photo of your ID.");
      document.getElementById("idPhoto")?.focus();
      return;
    }

    const body = new FormData();
    Object.entries(v.data).forEach(([k, val]) => body.append(k, String(val)));
    body.append("idPhoto", photo, "id.jpg");
    body.append("website", honeypot);
    body.append("startedAt", String(startedAt.current));

    setLoading(true);
    try {
      const res = await fetch("/api/guest", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-start gap-4 py-10">
        <CheckCircle size={44} weight="light" className="text-gold" />
        <h2 className="font-display text-4xl font-light text-onyx">Thank you, you&rsquo;re all set</h2>
        <p className="max-w-md leading-relaxed text-onyx/60">
          Your registration has been received. A confirmation is on its way to {f.email}.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-onyx/15 bg-white px-4 py-3 text-onyx placeholder:text-onyx/35 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/25";
  const labelCls = "label-luxe mb-2 block text-[10px] text-onyx/60";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="fullName" className={labelCls}>Full name (as shown on ID)</label>
          <input id="fullName" value={f.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputCls} autoComplete="name" maxLength={100} required />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="you@email.com" autoComplete="email" maxLength={254} required />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone</label>
          <input id="phone" type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} placeholder="+1 614 555 0123" autoComplete="tel" maxLength={25} required />
        </div>
      </div>

      <div className="rule-gold my-1 opacity-50" />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="platform" className={labelCls}>Booked through</label>
          <select id="platform" value={f.platform} onChange={(e) => set("platform", e.target.value as Platform)} className={inputCls} required>
            <option value="" disabled>Choose…</option>
            {Object.entries(PLATFORMS).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="reservationCode" className={labelCls}>Reservation code</label>
          <input id="reservationCode" value={f.reservationCode} onChange={(e) => set("reservationCode", e.target.value)} className={`${inputCls} uppercase`} placeholder="HMABC12345" maxLength={40} autoComplete="off" required />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="space" className={labelCls}>Space booked</label>
          <input id="space" value={f.space} onChange={(e) => set("space", e.target.value)} className={inputCls} placeholder="Name of the property" maxLength={120} required />
        </div>
        <div>
          <label htmlFor="checkIn" className={labelCls}>Check-in</label>
          <input id="checkIn" type="date" value={f.checkIn} onChange={(e) => set("checkIn", e.target.value)} className={inputCls} required />
        </div>
        <div>
          <label htmlFor="checkOut" className={labelCls}>Check-out</label>
          <input id="checkOut" type="date" value={f.checkOut} min={f.checkIn || undefined} onChange={(e) => set("checkOut", e.target.value)} className={inputCls} required />
        </div>
        <div>
          <label htmlFor="guests" className={labelCls}>Number of guests</label>
          <input id="guests" type="number" inputMode="numeric" min={1} max={20} step={1} value={f.guests} onChange={(e) => set("guests", e.target.value)} className={inputCls} required />
        </div>
      </div>

      <div className="rule-gold my-1 opacity-50" />

      <div>
        <span className={labelCls}>Photo ID</span>
        <label
          htmlFor="idPhoto"
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-onyx/25 bg-white px-4 py-8 text-center transition-colors hover:border-gold focus-within:border-gold"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="ID preview" className="max-h-56 rounded-md object-contain" />
          ) : (
            <IdentificationCard size={36} weight="light" className="text-gold" />
          )}
          <span className="text-sm text-onyx/70">
            {processing ? "Processing photo…" : preview ? "Tap to choose a different photo" : "Tap to take or upload a photo of your driver's license or passport"}
          </span>
          <input id="idPhoto" type="file" accept="image/*" onChange={onPhoto} className="sr-only" />
        </label>
        <p className="mt-2 flex items-center gap-2 text-xs text-onyx/45">
          <Lock size={12} weight="fill" /> Make sure your name and photo are clear and readable.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-onyx/70">
        <input type="checkbox" checked={f.marketingOptIn} onChange={(e) => set("marketingOptIn", e.target.checked)} className="mt-1 h-4 w-4 accent-[#b0895a]" />
        <span>Keep me in the loop on future stays, offers and news from Mercy Luxe.</span>
      </label>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          <Warning size={18} weight="fill" className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading || processing}
          className="label-luxe inline-flex items-center gap-2 rounded-full bg-onyx px-8 py-4 text-[11px] text-ivory transition-transform duration-200 hover:bg-onyx-soft active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <CircleNotch size={16} weight="bold" className="animate-spin" /> Submitting
            </>
          ) : (
            "Complete registration"
          )}
        </button>
      </div>
    </form>
  );
}
