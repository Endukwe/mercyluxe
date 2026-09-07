import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { House, Armchair, Heart, Key, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Monogram } from "../components/Monogram";
import { Reveal, RevealGroup, RevealItem } from "../components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mercy Luxe is a Columbus, Ohio studio for luxury interiors, hospitality, and lifestyle. Rooted in family, built for legacy.",
};

const VALUES = [
  { icon: House, title: "Elevated Hospitality", copy: "Every space should welcome you the way a gracious host would." },
  { icon: Armchair, title: "Timeless Design", copy: "We design past the trend cycle, for rooms that age with grace." },
  { icon: Heart, title: "Family Focused", copy: "Homes are built around the people and rituals that fill them." },
  { icon: Key, title: "Legacy & Lifestyle", copy: "We create spaces meant to be passed on, not replaced." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[70dvh] items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1583329550487-0fa300a4cd1a?q=80&w=2000&auto=format&fit=crop"
          alt="Mercy Luxe studio"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/85 via-onyx/25 to-onyx/30" />
        {/* radial vignette for depth toward the corners */}
        <div className="absolute inset-0 [background:radial-gradient(110%_80%_at_20%_100%,rgb(20_17_13/0.5),transparent_55%)]" />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
          <Reveal className="max-w-2xl">
            <p className="label-luxe text-[11px] text-gold">Our Story</p>
            <h1 className="font-display mt-6 text-5xl font-light leading-[1.0] text-balance text-ivory sm:text-6xl lg:text-[4.75rem]">
              Rooted in family, built for legacy
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="bg-ivory py-24 lg:py-36">
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 lg:grid-cols-2 lg:px-10">
          <Reveal>
            <Monogram className="h-16 w-auto" />
            <h2 className="font-display mt-6 text-3xl font-light leading-[1.2] text-balance text-onyx sm:text-4xl">
              Mercy Luxe began with a simple belief: the spaces we live in shape the lives we lead.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-onyx/70 lg:pt-4">
            <p className="text-pretty leading-relaxed">
              Founded in Columbus, Ohio, our studio brings a hospitality sensibility to residential
              design, and a residential warmth to hospitality. The result is work that feels personal
              at any scale, whether it is a family home, a boutique hotel, or a seasonal collection.
            </p>
            <p className="text-pretty leading-relaxed">
              We are intentional to a fault. We would rather do fewer projects beautifully than many
              projects quickly, and we treat every budget with the same care and candor. What we make
              is meant to last, and meant to be handed down.
            </p>
            <p className="font-display text-xl italic text-gold-deep">
              Luxury in every detail. Intentional by design.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="ambient-warm-dark bg-onyx py-24 text-ivory lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="mb-14 max-w-xl">
            <h2 className="font-display text-4xl font-light leading-[1.08] text-balance sm:text-5xl">
              What we hold to
            </h2>
          </Reveal>
          <RevealGroup className="grid gap-px overflow-hidden rounded-2xl border border-ivory/10 bg-ivory/10 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <RevealItem
                key={v.title}
                className="group bg-onyx p-8 transition-colors duration-300 hover:bg-onyx-soft lg:p-9"
              >
                <v.icon
                  size={30}
                  weight="light"
                  className="text-gold transition-transform duration-300 group-hover:-translate-y-0.5"
                />
                <h3 className="font-display mt-5 text-xl font-light">{v.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-ivory/65">{v.copy}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="ambient-warm bg-ivory py-28 lg:py-36">
        <Reveal className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h2 className="font-display text-4xl font-light leading-[1.05] text-balance text-onyx sm:text-5xl lg:text-6xl">
            Work with the studio
          </h2>
          <p className="mx-auto mt-7 max-w-lg text-pretty leading-relaxed text-onyx/70">
            We take on a limited number of projects each season. Reserve a consultation to begin the
            conversation.
          </p>
          <Link
            href="/book"
            className="label-luxe mt-10 inline-flex items-center gap-2 rounded-full bg-onyx px-8 py-4 text-[11px] text-ivory transition-transform duration-200 hover:bg-onyx-soft active:scale-[0.97]"
          >
            Book a Consultation <ArrowRight size={15} weight="bold" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
