import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { stripe } from "@/app/lib/stripe";
import { Monogram } from "../../components/Monogram";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  robots: { index: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let clientName = "";
  let serviceName = "";
  let paid = false;

  // Confirm the session server-side so we only celebrate real, paid bookings.
  if (session_id && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      paid = session.payment_status === "paid";
      clientName = (session.metadata?.clientName as string) || "";
      serviceName = (session.metadata?.serviceName as string) || "";
    } catch {
      // fall through to generic confirmation
    }
  }

  return (
    <section className="ambient-warm flex min-h-[100dvh] items-center justify-center bg-ivory px-6 py-32">
      <div className="mx-auto max-w-xl text-center">
        <Monogram className="mx-auto h-16 w-auto" />
        <CheckCircle size={44} weight="light" className="mx-auto mt-8 text-gold" />
        <h1 className="font-display mt-6 text-4xl font-light leading-[1.05] text-balance text-onyx sm:text-5xl">
          {paid ? "Your consultation is reserved" : "Thank you"}
        </h1>
        <p className="mx-auto mt-6 max-w-md text-pretty leading-relaxed text-onyx/70">
          {clientName ? `${clientName.split(" ")[0]}, ` : ""}
          {serviceName
            ? `your deposit for ${serviceName} has been received. `
            : "your request has been received. "}
          We&apos;ll be in touch within two business days to schedule your session. A receipt is on its
          way to your inbox.
        </p>
        <Link
          href="/"
          className="label-luxe mt-10 inline-block rounded-full bg-onyx px-8 py-4 text-[11px] text-ivory transition-transform duration-200 hover:bg-onyx-soft active:scale-[0.97]"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}
