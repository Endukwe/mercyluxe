import { NextResponse } from "next/server";
import { listBookings } from "@/app/lib/bookings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const bookings = await listBookings();
  return NextResponse.json({ bookings });
}
