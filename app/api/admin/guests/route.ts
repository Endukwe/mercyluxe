import { NextResponse } from "next/server";
import { listGuests, hasGuestIds } from "@/app/lib/guests";
import { PLATFORMS } from "@/app/lib/guestPlatforms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Neutralise spreadsheet formula injection (=, +, -, @, tab, CR) and quote.
// Newlines (multi-line addresses) are flattened so each record stays one row.
function csvCell(v: unknown): string {
  let s = String(v ?? "").replace(/\r?\n/g, ", ");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const guests = await listGuests();

  if (url.searchParams.get("format") === "csv") {
    const optedOnly = url.searchParams.get("optedIn") === "1";
    const rows = guests.filter((g) => !optedOnly || g.marketingOptIn);
    const header = [
      "Name", "Email", "Phone", "Address", "Platform", "Reservation", "Check-in", "Check-out", "Guests",
      "Emergency name", "Emergency phone", "Emergency address", "Marketing opt-in", "Submitted",
    ];
    const lines = [
      header.map(csvCell).join(","),
      ...rows.map((g) =>
        [
          g.fullName, g.email, g.phone, g.address, PLATFORMS[g.platform] ?? g.platform, g.reservationCode,
          g.checkIn, g.checkOut, g.guests, g.emergencyName, g.emergencyPhone, g.emergencyAddress,
          g.marketingOptIn ? "yes" : "no", new Date(g.createdAt).toISOString(),
        ].map(csvCell).join(",")
      ),
    ];
    return new NextResponse(lines.join("\r\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="mercyluxe-guests${optedOnly ? "-opted-in" : ""}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const ids = await hasGuestIds(guests.map((g) => g.id));
  return NextResponse.json({ guests: guests.map((g) => ({ ...g, hasId: !!ids[g.id] })) });
}
