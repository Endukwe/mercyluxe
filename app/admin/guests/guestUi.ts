import type { Guest } from "@/app/lib/guests";

export type GuestRow = Guest & { hasId: boolean };

export function idStatus(g: GuestRow): { label: string; chip: string } {
  if (!g.hasId) return { label: "Removed", chip: "bg-onyx/10 text-onyx/50" };
  const days = Math.max(0, Math.ceil((g.idExpiresAt - Date.now()) / 86_400_000));
  return { label: `On file · ${days}d left`, chip: "bg-emerald-100 text-emerald-800" };
}
