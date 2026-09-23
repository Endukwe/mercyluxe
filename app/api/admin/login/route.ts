import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  checkPassword,
  createSessionToken,
  isAuthConfigured,
  SESSION_MAX_AGE,
} from "@/app/lib/adminAuth";
import { rateLimit, resetRateLimit, clientIp } from "@/app/lib/rateLimit";

export const runtime = "nodejs";

// Brute-force throttle: at most this many login attempts per IP per window.
const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 60 * 15; // 15 minutes

export async function POST(req: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: "Admin is not configured (set ADMIN_PASSWORD and ADMIN_SESSION_SECRET)." },
      { status: 503 }
    );
  }

  const ip = clientIp(req);
  const limit = await rateLimit(`login:${ip}`, MAX_ATTEMPTS, WINDOW_SECONDS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let password = "";
  try {
    ({ password = "" } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  // Successful login - clear this IP's failed-attempt counter.
  await resetRateLimit(`login:${ip}`);

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
