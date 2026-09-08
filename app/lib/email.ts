import { Resend } from "resend";
import { formatPrice } from "./services";

// Server-only email helper. Sends a booking confirmation to the client and a
// notification to the studio. If RESEND_API_KEY is not set, it logs and no-ops
// so the webhook still succeeds in development.

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Verified sender domain in Resend, e.g. "Mercy Luxe <hello@mercyluxe.com>".
// Falls back to Resend's shared onboarding sender for quick testing.
const FROM = process.env.BOOKING_FROM_EMAIL || "Mercy Luxe <onboarding@resend.dev>";
const STUDIO = process.env.STUDIO_EMAIL || "hello@mercyluxe.com";

export type BookingDetails = {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  amountCents: number;
  preferredDate?: string;
  notes?: string;
};

const GOLD = "#b0895a";
const ONYX = "#14110d";
const IVORY = "#f5f0e8";

function shell(inner: string): string {
  return `
  <div style="margin:0;padding:0;background:${IVORY};font-family:Georgia,'Times New Roman',serif;color:${ONYX};">
    <div style="max-width:560px;margin:0 auto;padding:40px 28px;">
      <div style="text-align:center;padding-bottom:24px;">
        <div style="font-size:13px;letter-spacing:6px;color:${GOLD};text-transform:uppercase;">Mercy Luxe</div>
        <div style="font-size:11px;letter-spacing:3px;color:${ONYX};opacity:.6;text-transform:uppercase;margin-top:8px;">
          Interiors &nbsp;|&nbsp; Hospitality &nbsp;|&nbsp; Lifestyle
        </div>
      </div>
      <div style="height:1px;background:linear-gradient(90deg,transparent,${GOLD},transparent);margin-bottom:32px;"></div>
      ${inner}
      <div style="height:1px;background:linear-gradient(90deg,transparent,${GOLD},transparent);margin:32px 0 20px;"></div>
      <p style="font-size:12px;color:${ONYX};opacity:.5;text-align:center;line-height:1.6;">
        Mercy Luxe &middot; Columbus, Ohio<br/>
        Designed for Life. Curated for Legacy.
      </p>
    </div>
  </div>`;
}

function detailRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:8px 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};width:140px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;font-size:15px;color:${ONYX};">${value}</td>
  </tr>`;
}

function clientHtml(b: BookingDetails): string {
  const first = b.clientName.trim().split(" ")[0] || "there";
  return shell(`
    <h1 style="font-size:30px;font-weight:normal;line-height:1.2;margin:0 0 16px;">Your consultation is reserved</h1>
    <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">
      ${first}, thank you. We've received your deposit and we're looking forward to it. A member of the
      studio will be in touch within two business days to schedule your session.
    </p>
    <table style="width:100%;border-collapse:collapse;margin:8px 0 24px;">
      ${detailRow("Service", b.serviceName)}
      ${detailRow("Deposit paid", formatPrice(b.amountCents))}
      ${b.preferredDate ? detailRow("Preferred start", b.preferredDate) : ""}
    </table>
    <p style="font-size:14px;line-height:1.6;opacity:.7;margin:0;">
      Your deposit is credited in full toward your project and is refundable within 48 hours. Questions?
      Simply reply to this email.
    </p>
  `);
}

function paymentLinkHtml(opts: {
  clientName: string;
  serviceName: string;
  amountCents: number;
  url: string;
  message?: string;
}): string {
  const first = opts.clientName.trim().split(" ")[0] || "there";
  return shell(`
    <h1 style="font-size:30px;font-weight:normal;line-height:1.2;margin:0 0 16px;">Reserve your consultation</h1>
    <p style="font-size:16px;line-height:1.6;margin:0 0 20px;">
      ${first}, we've set aside a place for you. To confirm your ${opts.serviceName} consultation,
      please complete the deposit below. It's credited in full toward your project.
    </p>
    ${
      opts.message
        ? `<p style="font-size:15px;line-height:1.6;margin:0 0 20px;padding:14px 16px;background:#efe8db;border-radius:8px;">${opts.message}</p>`
        : ""
    }
    <table style="width:100%;border-collapse:collapse;margin:8px 0 24px;">
      ${detailRow("Service", opts.serviceName)}
      ${detailRow("Deposit", formatPrice(opts.amountCents))}
    </table>
    <a href="${opts.url}" style="display:inline-block;background:${ONYX};color:${IVORY};text-decoration:none;padding:14px 28px;border-radius:999px;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Complete your booking</a>
    <p style="font-size:13px;line-height:1.6;opacity:.6;margin:22px 0 0;">
      Or paste this link into your browser:<br/><span style="color:${GOLD};word-break:break-all;">${opts.url}</span>
    </p>
  `);
}

export async function sendPaymentLinkEmail(opts: {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  amountCents: number;
  url: string;
  message?: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set - cannot send payment link.");
    return { ok: false, error: "Email is not configured (RESEND_API_KEY)." };
  }
  const res = await resend.emails.send({
    from: FROM,
    to: opts.clientEmail,
    subject: `Complete your Mercy Luxe ${opts.serviceName} booking`,
    html: paymentLinkHtml(opts),
    replyTo: STUDIO,
  });
  if (res.error) {
    console.error("[email] payment link REJECTED by Resend:", JSON.stringify(res.error));
    return { ok: false, error: JSON.stringify(res.error) };
  }
  console.log(`[email] payment link sent, id=${res.data?.id}`);
  return { ok: true };
}

function studioHtml(b: BookingDetails): string {
  return shell(`
    <h1 style="font-size:26px;font-weight:normal;line-height:1.2;margin:0 0 16px;">New booking received</h1>
    <table style="width:100%;border-collapse:collapse;margin:8px 0 8px;">
      ${detailRow("Client", b.clientName || "-")}
      ${detailRow("Email", b.clientEmail)}
      ${detailRow("Service", b.serviceName)}
      ${detailRow("Deposit", formatPrice(b.amountCents))}
      ${b.preferredDate ? detailRow("Preferred start", b.preferredDate) : ""}
      ${b.notes ? detailRow("Notes", b.notes) : ""}
    </table>
  `);
}

export async function sendBookingEmails(b: BookingDetails): Promise<void> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set - skipping emails. Booking:", {
      client: b.clientEmail,
      service: b.serviceName,
      amount: b.amountCents,
    });
    return;
  }

  // Send both; don't let one failure block the other.
  // NOTE: resend.emails.send() resolves with { data, error } and does NOT throw
  // on API errors - the failure lives in `error`. We must inspect it, or sends
  // fail silently.
  const send = (opts: Parameters<typeof resend.emails.send>[0], label: string) =>
    resend.emails
      .send(opts)
      .then((res) => {
        if (res.error) {
          console.error(`[email] ${label} REJECTED by Resend:`, JSON.stringify(res.error));
        } else {
          console.log(`[email] ${label} sent, id=${res.data?.id}`);
        }
      })
      .catch((err) => {
        console.error(`[email] ${label} threw:`, err);
      });

  console.log(`[email] sending from="${FROM}" client="${b.clientEmail}" studio="${STUDIO}"`);
  await Promise.all([
    send(
      {
        from: FROM,
        to: b.clientEmail,
        subject: "Your Mercy Luxe consultation is reserved",
        html: clientHtml(b),
        replyTo: STUDIO,
      },
      "client"
    ),
    send(
      {
        from: FROM,
        to: STUDIO,
        subject: `New booking: ${b.serviceName} - ${b.clientName || b.clientEmail}`,
        html: studioHtml(b),
        replyTo: b.clientEmail,
      },
      "studio"
    ),
  ]);
}
