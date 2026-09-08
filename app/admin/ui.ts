import type { Booking, BookingStatus, NoteKind } from "@/app/lib/bookings";

export type { Booking, BookingStatus, NoteKind };

export function money(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format((cents || 0) / 100);
}

export function dayKey(d: Date): string {
  // local YYYY-MM-DD
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function effDate(b: Booking): string | undefined {
  return b.meetingDate || b.preferredDate;
}

export function when(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const STATUS: Record<BookingStatus, { label: string; dot: string; chip: string }> = {
  pending: { label: "Pending", dot: "#b0895a", chip: "bg-gold/15 text-gold-deep" },
  paid: { label: "Confirmed", dot: "#2f7d5b", chip: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelled", dot: "#9a9a9a", chip: "bg-onyx/10 text-onyx/50" },
};

export const KIND: Record<NoteKind, { label: string; chip: string }> = {
  note: { label: "Note", chip: "bg-onyx/8 text-onyx/70" },
  action: { label: "Action", chip: "bg-gold/15 text-gold-deep" },
  preference: { label: "Preference", chip: "bg-taupe-soft text-onyx/70" },
};

export async function api<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string })?.error || `Request failed (${res.status})`);
  return data as T;
}
