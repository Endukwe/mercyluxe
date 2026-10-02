import type { Metadata } from "next";
import { Monogram } from "../components/Monogram";
import { GuestForm } from "../components/GuestForm";

// Private page sent directly to rental guests. Intentionally not linked from
// the site, not in the sitemap, and disallowed in robots.
export const metadata: Metadata = {
  title: "Guest Registration",
  robots: { index: false, follow: false },
};

export default function GuestRegistrationPage() {
  return (
    <section className="bg-ivory pt-[72px]">
      <div className="mx-auto grid max-w-[1400px] gap-0 lg:grid-cols-[1fr_1.2fr]">
        <aside className="ambient-warm-dark bg-onyx px-6 py-16 text-ivory lg:px-14 lg:py-28">
          <div className="lg:sticky lg:top-28">
            <Monogram className="h-16 w-auto" onDark />
            <h1 className="font-display mt-6 text-4xl font-light leading-[1.05] text-balance sm:text-5xl">
              Guest registration
            </h1>
            <p className="mt-5 max-w-sm text-pretty leading-relaxed text-ivory/70">
              Welcome. Please complete the short form below ahead of your stay. It takes about two
              minutes.
            </p>
            <p className="font-display mt-12 text-lg italic text-gold">We look forward to hosting you.</p>
          </div>
        </aside>

        <div className="px-6 py-16 lg:px-14 lg:py-28">
          <GuestForm />
        </div>
      </div>
    </section>
  );
}
