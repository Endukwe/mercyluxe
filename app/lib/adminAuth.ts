// Lightweight single-admin auth. A correct ADMIN_PASSWORD mints a signed,
// expiring session token (HMAC-SHA256 with ADMIN_SESSION_SECRET) stored in an
// httpOnly cookie. No accounts, no DB. Works in both the Edge middleware and
// Node route handlers (Web Crypto only).

export const ADMIN_COOKIE = "ml_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return toHex(sig);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function secret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || null;
}

export function isAuthConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD && !!process.env.ADMIN_SESSION_SECRET;
}

export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && input.length === pw.length && timingSafeEqual(input, pw);
}

export async function createSessionToken(): Promise<string> {
  const s = secret();
  if (!s) throw new Error("ADMIN_SESSION_SECRET not set");
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const sig = await hmac(s, String(exp));
  return `${exp}.${sig}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const s = secret();
  if (!s || !token) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const exp = Number(token.slice(0, dot));
  const sig = token.slice(dot + 1);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = await hmac(s, String(exp));
  return timingSafeEqual(sig, expected);
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
