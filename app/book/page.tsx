import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Monogram } from "../components/Monogram";
import { BookingForm } from "../components/BookingForm";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Reserve your Mercy Luxe consultation. Deposits are credited toward your project.",
};

const ASSURANCES = [
  "A limited number of projects each season, so your work gets our full attention.",
  "Your deposit is credited in full toward your project.",
  "Fully refundable within 48 hours of booking.",
  "A reply within two business days.",
];

export default function BookPage() {
  return (
    <section className="bg-ivory pt-[72px]">
      <div className="mx-auto grid max-w-[1400px] gap-0 lg:grid-cols-[1fr_1.2fr]">
        {/* Left rail */}
        <aside className="ambient-warm-dark bg-onyx px-6 py-20 text-ivory lg:px-14 lg:py-28">
          <div className="lg:sticky lg:top-28">
            <Monogram className="h-16 w-auto" onDark />
            <h1 className="font-display mt-6 text-4xl font-light leading-[1.05] text-balance sm:text-5xl">
              Reserve your consultation
            </h1>
            <p className="mt-5 max-w-sm text-pretty leading-relaxed text-ivory/70">
              Tell us what you are dreaming up. Your deposit secures your place and is credited toward
              the project itself.
            </p>
            <ul className="mt-10 flex flex-col gap-4">
              {ASSURANCES.map((a) => (
                <li key={a} className="flex items-start gap-3 text-sm text-ivory/80">
                  <CheckCircle size={20} weight="light" className="mt-0.5 shrink-0 text-gold" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
            <p className="font-display mt-12 text-lg italic text-gold">
              Made for the moments that matter.
            </p>
          </div>
        </aside>

        {/* Form */}
        <div className="px-6 py-20 lg:px-14 lg:py-28">
          <Suspense fallback={<div className="text-onyx/50">Loading booking form...</div>}>
            <BookingForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
