import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Monogram } from "./Monogram";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { SERVICES, formatPrice } from "../lib/services";

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export type DisciplineContent = {
  discipline: "Interiors" | "Hospitality" | "Lifestyle";
  kicker: string;
  title: string;
  intro: string;
  heroSeed: string;
  /** Optional explicit hero image URL. Falls back to the picsum heroSeed. */
  heroImage?: string;
  offerings: { title: string; copy: string }[];
  /** Optional explicit offering image URLs, one per offering. Falls back to picsum. */
  offeringImages?: string[];
  gallerySeeds: string[];
  /** Optional explicit gallery image URLs. Falls back to gallerySeeds (picsum). */
  galleryImages?: string[];
};

export function DisciplinePage({ content }: { content: DisciplineContent }) {
  const services = SERVICES.filter((s) => s.discipline === content.discipline);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[80dvh] items-end overflow-hidden">
        <Image
          src={content.heroImage ?? img(content.heroSeed, 2000, 1600)}
          alt={content.title}
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
            <p className="label-luxe text-[11px] text-gold">{content.kicker}</p>
            <h1 className="font-display mt-6 text-5xl font-light leading-[1.0] text-balance text-ivory sm:text-6xl lg:text-[4.75rem]">
              {content.title}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Intro */}
      <section className="ambient-warm bg-ivory py-28 lg:py-40">
        <Reveal className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <Monogram className="mx-auto h-16 w-auto" />
          <p className="font-display mt-9 text-2xl font-light leading-[1.32] text-balance text-onyx sm:text-3xl">
            {content.intro}
          </p>
        </Reveal>
      </section>

      {/* Offerings - zigzag, max 2 in a row before a break */}
      <section className="bg-ivory-deep py-8">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          {content.offerings.map((o, i) => (
            <Reveal key={o.title}>
              <div
                className={`grid items-center gap-10 border-b border-onyx/10 py-16 lg:grid-cols-2 lg:gap-20 ${
                  i % 2 === 1 ? "lg:[&>figure]:order-2" : ""
                }`}
              >
                <figure className="group relative aspect-[4/3] overflow-hidden bg-taupe shadow-luxe transition-shadow duration-500 hover:shadow-luxe-lg">
                  <Image
                    src={content.offeringImages?.[i] ?? img(`${content.heroSeed}-offer-${i}`, 1200, 900)}
                    alt={o.title}
                    fill
                    sizes="(max-width:1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </figure>
                <div>
                  <span className="font-display text-3xl tabular-nums text-gold">0{i + 1}</span>
                  <h2 className="font-display mt-3 text-3xl font-light leading-[1.08] text-balance text-onyx sm:text-4xl">
                    {o.title}
                  </h2>
                  <p className="mt-4 max-w-md text-pretty leading-relaxed text-onyx/70">{o.copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="mb-14">
            <h2 className="font-display text-4xl font-light leading-[1.08] text-balance text-onyx sm:text-5xl">
              From the portfolio
            </h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {content.gallerySeeds.map((seed, i) => (
              <RevealItem key={seed} className={i === 0 ? "col-span-2 row-span-2 md:col-span-2" : ""}>
                <figure className="group relative aspect-square overflow-hidden bg-taupe shadow-luxe transition-shadow duration-500 hover:shadow-luxe-lg">
                  <Image
                    src={content.galleryImages?.[i] ?? img(seed, 1000, 1000)}
                    alt="Mercy Luxe project"
                    fill
                    sizes="(max-width:768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-onyx/0 transition-colors duration-500 group-hover:bg-onyx/10" />
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Services + deposits */}
      <section className="ambient-warm-dark bg-onyx py-24 text-ivory lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="mb-14 max-w-xl">
            <p className="label-luxe text-[11px] text-gold">Engage the Studio</p>
            <h2 className="font-display mt-5 text-4xl font-light leading-[1.08] text-balance sm:text-5xl">
              Ways to work together
            </h2>
            <p className="mt-5 text-pretty text-ivory/70">
              Each engagement begins with a deposit, credited in full toward your project.
            </p>
          </Reveal>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-ivory/10 bg-ivory/10 md:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.id}
                className="group flex flex-col justify-between gap-6 bg-onyx p-8 transition-colors duration-300 hover:bg-onyx-soft lg:p-10"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl font-light">{s.name}</h3>
                    <span className="font-display shrink-0 text-2xl tabular-nums text-gold">
                      {formatPrice(s.depositCents)}
                    </span>
                  </div>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-ivory/70">{s.blurb}</p>
                  <p className="label-luxe mt-4 text-[10px] text-ivory/40">{s.duration}</p>
                </div>
                <Link
                  href={`/book?service=${s.id}`}
                  className="label-luxe inline-flex items-center gap-2 self-start rounded-full border border-gold px-6 py-3 text-[11px] text-gold transition-colors hover:bg-gold hover:text-onyx"
                >
                  Reserve <ArrowRight size={14} weight="bold" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
