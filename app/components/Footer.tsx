import Link from "next/link";
import { InstagramLogo, PinterestLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-onyx text-ivory">
      <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="flex flex-col items-center text-center">
          <Logo variant="full" onDark />
          <p className="font-display mt-8 max-w-xl text-2xl italic leading-snug text-taupe">
            Designed for Life. Curated for Legacy.
          </p>
        </div>

        <div className="rule-gold mx-auto my-14 max-w-3xl opacity-60" />

        <div className="grid gap-12 text-center sm:grid-cols-3 sm:text-left">
          <div>
            <p className="label-luxe text-[11px] text-gold">Studio</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-ivory/70">
              <Link href="/interiors" className="hover:text-gold">Interiors</Link>
              <Link href="/hospitality" className="hover:text-gold">Hospitality</Link>
              <Link href="/lifestyle" className="hover:text-gold">Soft Life Summer</Link>
              <Link href="/about" className="hover:text-gold">About</Link>
            </div>
          </div>
          <div>
            <p className="label-luxe text-[11px] text-gold">Visit</p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-ivory/70">
              <span>By appointment</span>
              <span>Columbus, Ohio</span>
              <a href="mailto:hello@mercyluxe.com" className="hover:text-gold">hello@mercyluxe.com</a>
            </div>
          </div>
          <div className="flex flex-col sm:items-start sm:text-left">
            <p className="label-luxe text-[11px] text-gold">Follow</p>
            <div className="mt-4 flex justify-center gap-5 sm:justify-start">
              <a href="https://instagram.com" aria-label="Instagram" className="text-ivory/70 hover:text-gold">
                <InstagramLogo size={22} weight="light" />
              </a>
              <a href="https://pinterest.com" aria-label="Pinterest" className="text-ivory/70 hover:text-gold">
                <PinterestLogo size={22} weight="light" />
              </a>
              <a href="mailto:hello@mercyluxe.com" aria-label="Email" className="text-ivory/70 hover:text-gold">
                <EnvelopeSimple size={22} weight="light" />
              </a>
            </div>
            <Link
              href="/book"
              className="label-luxe mt-8 inline-block rounded-full border border-gold px-6 py-3 text-[11px] text-gold transition-colors hover:bg-gold hover:text-onyx"
            >
              Book a Consultation
            </Link>
          </div>
        </div>

        <p className="label-luxe mt-16 text-center text-[10px] text-ivory/40">
          Luxury in every detail. Intentional by design. Rooted in family.
        </p>
        <p className="mt-4 text-center text-xs text-ivory/40">
          &copy; {new Date().getFullYear()} Mercy Luxe. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
