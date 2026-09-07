# Mercy Luxe

Brand website for **Mercy Luxe** — a Columbus, Ohio studio for luxury interiors, hospitality, and lifestyle. Built with Next.js (App Router), Tailwind v4, Motion, and Stripe for consultation-deposit payments.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** — design tokens in `app/globals.css`
- **Motion** (`motion/react`) — scroll reveals, nav, mobile menu
- **Stripe Checkout** — booking deposits, server-validated
- **Fonts** — Cormorant Garamond (display) + Jost (UI), via `next/font`

## Pages

| Route | Purpose |
|---|---|
| `/` | Home — hero, ethos, disciplines, process, work, collection, testimonial |
| `/interiors` | Residential interiors + services/deposits |
| `/hospitality` | Hospitality & commercial + services/deposits |
| `/lifestyle` | Lifestyle & Soft Life Summer + services/deposits |
| `/about` | Studio story + values |
| `/book` | Booking form → Stripe Checkout |
| `/book/success` | Post-payment confirmation (server-verified) |

## Getting started

```bash
npm install
cp .env.example .env.local   # then paste your real Stripe keys
npm run dev
```

Open http://localhost:3000

## Payment setup (Stripe)

Payments are **booking deposits**. The amount is defined per service in
[`app/lib/services.ts`](app/lib/services.ts) and is charged server-side, so the
client can never tamper with the price.

1. Create a Stripe account at https://dashboard.stripe.com
2. Copy your keys from https://dashboard.stripe.com/apikeys
3. Put them in `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
4. Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

### How the flow works

1. Client submits the form on `/book` → `POST /api/checkout`
2. Server ([`app/api/checkout/route.ts`](app/api/checkout/route.ts)) validates the
   service, looks up the deposit amount from the catalog, and creates a Stripe
   Checkout Session.
3. Client is redirected to Stripe's hosted checkout.
4. On success, Stripe redirects to `/book/success?session_id=...`, which
   re-verifies `payment_status` server-side before confirming.

### Webhook + booking emails

Bookings are confirmed reliably by a Stripe webhook, not the success redirect.
On `checkout.session.completed`, [`app/api/webhook/route.ts`](app/api/webhook/route.ts)
verifies the signature, then [`app/lib/email.ts`](app/lib/email.ts) sends two
branded emails via [Resend](https://resend.com): a confirmation to the client and
a notification to the studio. If `RESEND_API_KEY` is unset, emails are logged and
skipped so dev still works.

**Local testing** with the Stripe CLI:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

`stripe listen` prints a `whsec_...` secret. Put it in `.env.local` as
`STRIPE_WEBHOOK_SECRET`, then trigger a real test checkout from `/book` (card
`4242 4242 4242 4242`) or fire a sample event:

```bash
stripe trigger checkout.session.completed
```

**Production:** in the Stripe Dashboard, add a webhook endpoint at
`https://your-domain.com/api/webhook` listening for `checkout.session.completed`,
copy its signing secret into `STRIPE_WEBHOOK_SECRET`, and set `RESEND_API_KEY`,
`BOOKING_FROM_EMAIL` (a domain verified in Resend), and `STUDIO_EMAIL`.

### Webhook idempotency (Upstash)

Stripe delivers at least once, so the same event can arrive more than once.
[`app/lib/dedupe.ts`](app/lib/dedupe.ts) claims each `event.id` atomically in
Upstash Redis (`SET key NX EX`), so emails fire exactly once:

- **New event** wins the claim and is processed.
- **Duplicate** finds the claim already set and is skipped (returns `200`).
- If the handler throws, the claim is **released** and a `500` is returned so
  Stripe retries and reprocesses.
- If Upstash is **unset**, dedupe is skipped (fails open) so dev still works.

Setup: create a Redis database at [console.upstash.com](https://console.upstash.com),
then copy its REST URL and token into `.env.local`:

```
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

Claims expire after 7 days (longer than Stripe's ~3-day retry window).

## Editing content

- **Services & deposit amounts** — `app/lib/services.ts`
- **Colors / fonts / tokens** — `app/globals.css`
- **Copy** — inline in each page under `app/`

## Images

All imagery uses `picsum.photos` placeholders with descriptive seeds. **Replace
every image `src` with real Mercy Luxe photography before launch** (search the
codebase for `picsum.photos`). The brand logo (leaf sprig) is real inline SVG in
`app/components/Sprig.tsx`.

## Deploy

Deploy to **Vercel**: push to a Git repo, import into Vercel, and add the three
environment variables in the project settings. `NEXT_PUBLIC_SITE_URL` should be
your production domain.
