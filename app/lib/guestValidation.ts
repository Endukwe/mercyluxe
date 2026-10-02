import { PLATFORMS, type Platform } from "./guestPlatforms";

// Validation for the guest registration form. Pure (no Node APIs) so the same
// rules run in the browser for instant feedback and on the server as the real
// gate. Never trust the client copy - the API route always re-validates.

export type GuestInput = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  platform: Platform;
  reservationCode: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  emergencyName: string;
  emergencyPhone: string;
  emergencyAddress: string;
  marketingOptIn: boolean;
};

export type ValidationResult =
  | { ok: true; data: GuestInput }
  | { ok: false; error: string; field?: keyof GuestInput };

const DAY = 86_400_000;

// Remove control / zero-width / bidi-override characters, collapse whitespace.
function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v
    .replace(/[\u0000-\u001F\u007F-\u009F​-‏‪-‮⁠-⁩﻿]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max + 1); // +1 so over-length input is still detectable
}

function parseDate(v: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const [y, m, d] = v.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d);
  const dt = new Date(t);
  // Reject rollovers like 2026-02-31.
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return t;
}

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}' .-]*$/u;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const PHONE_RE = /^\+?[0-9 ()-]+$/;
const CODE_RE = /^[A-Za-z0-9-]{3,40}$/;
// Free-text postal address: letters, numbers, common punctuation and newlines.
const ADDRESS_RE = /^[\p{L}\p{M}\p{N} '&.,#()/\n-]+$/u;

// Like clean() but keeps newlines, so multi-line addresses survive.
function cleanMultiline(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F​-‏‪-‮⁠-⁩﻿]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim()
    .slice(0, max + 1);
}

export function validateGuest(raw: Record<string, unknown>, now = Date.now()): ValidationResult {
  const fullName = clean(raw.fullName, 100);
  if (fullName.length < 2 || fullName.length > 100 || !NAME_RE.test(fullName))
    return { ok: false, field: "fullName", error: "Please enter your full name (letters only)." };

  const email = clean(raw.email, 254).toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email))
    return { ok: false, field: "email", error: "Please enter a valid email address." };

  const phone = clean(raw.phone, 25);
  const digits = phone.replace(/\D/g, "");
  if (!PHONE_RE.test(phone) || digits.length < 7 || digits.length > 15)
    return { ok: false, field: "phone", error: "Please enter a valid phone number, including country code if outside the US." };

  const address = cleanMultiline(raw.address, 250);
  if (address.length < 5 || address.length > 250 || !ADDRESS_RE.test(address))
    return { ok: false, field: "address", error: "Please enter your home address." };

  const platform = clean(raw.platform, 20) as Platform;
  if (!Object.prototype.hasOwnProperty.call(PLATFORMS, platform))
    return { ok: false, field: "platform", error: "Please choose where you booked." };

  const reservationCode = clean(raw.reservationCode, 40).toUpperCase();
  if (!CODE_RE.test(reservationCode))
    return { ok: false, field: "reservationCode", error: "Reservation code should be 3–40 letters, numbers or dashes." };

  const checkIn = clean(raw.checkIn, 10);
  const checkOut = clean(raw.checkOut, 10);
  const ci = parseDate(checkIn);
  const co = parseDate(checkOut);
  if (ci === null) return { ok: false, field: "checkIn", error: "Please enter a valid check-in date." };
  if (co === null) return { ok: false, field: "checkOut", error: "Please enter a valid check-out date." };
  if (ci < now - 60 * DAY || ci > now + 730 * DAY)
    return { ok: false, field: "checkIn", error: "Check-in date looks out of range." };
  if (co <= ci) return { ok: false, field: "checkOut", error: "Check-out must be after check-in." };
  if (co - ci > 365 * DAY) return { ok: false, field: "checkOut", error: "Stay length looks out of range." };

  const guestsRaw = typeof raw.guests === "number" ? String(raw.guests) : clean(raw.guests, 3);
  if (!/^\d{1,2}$/.test(guestsRaw))
    return { ok: false, field: "guests", error: "Please enter the number of guests (1–20)." };
  const guests = Number(guestsRaw);
  if (guests < 1 || guests > 20)
    return { ok: false, field: "guests", error: "Please enter the number of guests (1–20)." };

  const emergencyName = clean(raw.emergencyName, 100);
  if (emergencyName.length < 2 || emergencyName.length > 100 || !NAME_RE.test(emergencyName))
    return { ok: false, field: "emergencyName", error: "Please enter your emergency contact's name." };

  const emergencyPhone = clean(raw.emergencyPhone, 25);
  const emDigits = emergencyPhone.replace(/\D/g, "");
  if (!PHONE_RE.test(emergencyPhone) || emDigits.length < 7 || emDigits.length > 15)
    return { ok: false, field: "emergencyPhone", error: "Please enter a valid emergency contact phone number." };

  const emergencyAddress = cleanMultiline(raw.emergencyAddress, 250);
  if (emergencyAddress.length < 5 || emergencyAddress.length > 250 || !ADDRESS_RE.test(emergencyAddress))
    return { ok: false, field: "emergencyAddress", error: "Please enter your emergency contact's address." };

  // Strict: only an explicit true / "true" counts as consent.
  const marketingOptIn = raw.marketingOptIn === true || raw.marketingOptIn === "true";

  return {
    ok: true,
    data: {
      fullName, email, phone, address, platform, reservationCode, checkIn, checkOut, guests,
      emergencyName, emergencyPhone, emergencyAddress, marketingOptIn,
    },
  };
}

// Image limits shared by client (compression target) and server (hard cap).
export const ID_MAX_BYTES = 1_500_000;
export const ID_TARGET_BYTES = 700_000;
export const ID_MAX_EDGE = 1600;

// Sniff the real file type from its first bytes - never trust the
// browser-supplied MIME type or filename.
export function sniffImage(bytes: Uint8Array): "jpeg" | "png" | "webp" | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  )
    return "png";
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  )
    return "webp";
  return null;
}
