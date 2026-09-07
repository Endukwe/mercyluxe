import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Sprig } from "./components/Sprig";
import { Monogram } from "./components/Monogram";
import { HeroParallax } from "./components/HeroParallax";
import { Reveal, RevealGroup, RevealItem } from "./components/Reveal";
import { ux, PHOTO } from "./lib/images";

// NOTE ON IMAGERY: curated Unsplash placeholders (see app/lib/images.ts).
// Swap each src for real Mercy Luxe project photography before launch.

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[100dvh] items-end overflow-hidden">
        <HeroParallax
          image="/hero.jpg"
          depth="/hero-depth.jpg?v=3"
          alt="A sunlit, elevated living space styled by Mercy Luxe"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/85 via-onyx/25 to-onyx/40" />
        {/* radial vignette for depth toward the corners */}
        <div className="absolute inset-0 [background:radial-gradient(110%_80%_at_20%_100%,rgb(20_17_13/0.55),transparent_55%)]" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-24 lg:px-10 lg:pb-32">
          <Reveal className="max-w-3xl">
            <div className="mb-7 flex items-center gap-4">
              <Sprig className="h-8 w-auto" />
              <span className="label-luxe text-[11px] text-taupe">Columbus, Ohio</span>
            </div>
            <h1 className="font-display text-6xl font-light leading-[0.98] text-balance text-ivory sm:text-7xl lg:text-[5.5rem]">
              Elevated spaces.
              <br />
              <span className="italic text-foil">Meaningful experiences.</span>
            </h1>
            <p className="mt-7 max-w-md text-pretty text-base leading-relaxed text-ivory/80">
              A design studio for luxury interiors, hospitality, and the soft life. Curated for legacy.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className="label-luxe inline-flex items-center gap-2 rounded-full bg-ivory px-7 py-4 text-[11px] text-onyx transition-transform duration-200 hover:bg-white active:scale-[0.97]"
              >
                Book a Consultation <ArrowRight size={15} weight="bold" />
              </Link>
              <Link
                href="/interiors"
                className="label-luxe inline-flex items-center gap-2 rounded-full border border-ivory/40 px-7 py-4 text-[11px] text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                Explore the Studio
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- MANIFESTO ---------- */}
      <section className="ambient-warm bg-ivory py-32 lg:py-44">
        <Reveal className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <p className="label-luxe text-[11px] text-gold">The Mercy Luxe Ethos</p>
          <p className="font-display mt-9 text-3xl font-light leading-[1.28] text-balance text-onyx sm:text-4xl lg:text-[2.9rem]">
            We design for the moments that matter. Rooms that hold a family&apos;s story, spaces that
            welcome a guest like an old friend, and a life that feels as considered as it looks.
          </p>
          <div className="rule-gold mx-auto mt-14 w-40" />
          <p className="font-display mt-8 text-xl italic text-gold-deep">
            Designed for Life. Curated for Legacy.
          </p>
        </Reveal>
      </section>

      {/* ---------- DISCIPLINES (bento, 3 cells) ---------- */}
      <section className="bg-ivory-deep py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="mb-16 max-w-2xl">
            <p className="label-luxe text-[11px] text-gold">What We Do</p>
            <h2 className="font-display mt-5 text-4xl font-light leading-[1.08] text-balance text-onyx sm:text-5xl">
              Three disciplines, one standard of care
            </h2>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2 md:grid-rows-2 lg:h-[660px]">
            <DisciplineCard
              className="md:row-span-2"
              tall
              href="/interiors"
              eyebrow="Interiors"
              title="Homes designed to be lived in"
              copy="Full-service residential design, from architectural detail to the final styled shelf."
              src={ux(PHOTO.intWarmLiving, 1200)}
            />
            <DisciplineCard
              href="/hospitality"
              eyebrow="Hospitality"
              title="Spaces guests remember"
              copy="Boutique hotels and rentals engineered for five-star reviews."
              src={ux(PHOTO.hosWoodPanel, 1400)}
            />
            <DisciplineCard
              href="/lifestyle"
              eyebrow="Lifestyle"
              title="The soft life, styled"
              copy="Editorial styling and the Soft Life Summer collection."
              src={ux(PHOTO.lifHat, 1400)}
            />
          </div>
        </div>
      </section>

      {/* ---------- APPROACH (vertical rhythm, no cards) ---------- */}
      <section className="ambient-warm-dark bg-onyx py-28 text-ivory lg:py-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="mb-16 max-w-xl">
            <p className="label-luxe text-[11px] text-gold">The Approach</p>
            <h2 className="font-display mt-5 text-4xl font-light leading-[1.08] text-balance sm:text-5xl">
              A quietly rigorous process
            </h2>
          </Reveal>

          <RevealGroup className="divide-y divide-ivory/10 border-t border-ivory/10">
            {APPROACH.map((step, i) => (
              <RevealItem key={step.title}>
                <div className="group grid grid-cols-1 gap-4 py-9 transition-colors duration-300 md:grid-cols-12 md:items-baseline md:gap-6">
                  <span className="font-display col-span-1 text-2xl tabular-nums text-gold transition-transform duration-300 md:group-hover:translate-x-1">
                    0{i + 1}
                  </span>
                  <h3 className="font-display col-span-4 text-2xl font-light transition-colors duration-300 group-hover:text-gold-bright lg:col-span-3">
                    {step.title}
                  </h3>
                  <p className="col-span-7 max-w-2xl text-pretty leading-relaxed text-ivory/70 lg:col-span-8">
                    {step.copy}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------- FEATURED WORK (gallery grid) ---------- */}
      <section className="bg-ivory py-24 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display max-w-xl text-4xl font-light leading-[1.08] text-balance text-onyx sm:text-5xl">
              Selected work
            </h2>
            <Link
              href="/interiors"
              className="label-luxe group inline-flex items-center gap-2 text-[11px] text-gold-deep transition-colors hover:text-gold"
            >
              View the portfolio
              <ArrowUpRight
                size={15}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Reveal>

          <RevealGroup className="grid grid-cols-2 gap-4 md:grid-cols-12 md:grid-rows-2 md:h-[660px]">
            {[
              { key: "gallery-a", photo: PHOTO.intLeatherOttoman, span: "col-span-2 md:col-span-5 md:row-span-2" },
              { key: "gallery-b", photo: PHOTO.intSectionalArt, span: "col-span-2 md:col-span-7" },
              { key: "gallery-c", photo: PHOTO.detLeatherSofa, span: "col-span-1 md:col-span-4" },
              { key: "gallery-d", photo: PHOTO.intBrightWindows, span: "col-span-1 md:col-span-3" },
            ].map(({ key, photo, span }) => (
              <RevealItem key={key} className={span}>
                <figure className="group relative aspect-[4/5] overflow-hidden bg-taupe shadow-luxe transition-shadow duration-500 hover:shadow-luxe-lg md:aspect-auto md:h-full">
                  <Image
                    src={ux(photo, 1100)}
                    alt="Mercy Luxe project"
                    fill
                    sizes="(max-width:768px) 50vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-onyx/0 transition-colors duration-500 group-hover:bg-onyx/10" />
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------- SOFT LIFE SUMMER (editorial split) ---------- */}
      <section className="bg-taupe-soft">
        <div className="mx-auto grid max-w-[1400px] items-stretch lg:grid-cols-2">
          <div className="flex items-center px-6 py-24 lg:px-16 lg:py-40">
            <Reveal>
              <p className="label-luxe text-[11px] text-gold-deep">Ready-to-Wear</p>
              <h2 className="font-display mt-5 text-4xl font-light leading-[1.05] text-balance text-onyx sm:text-5xl">
                Soft Life Summer
              </h2>
              <p className="mt-6 max-w-md text-pretty leading-relaxed text-onyx/70">
                A seasonal capsule for the way our clients actually live. The same eye for texture and
                ease that shapes our interiors, translated into what you wear.
              </p>
              <Link
                href="/lifestyle"
                className="label-luxe mt-9 inline-flex items-center gap-2 rounded-full border border-onyx px-7 py-4 text-[11px] text-onyx transition-colors hover:bg-onyx hover:text-ivory"
              >
                Discover the collection <ArrowRight size={15} weight="bold" />
              </Link>
            </Reveal>
          </div>
          <div className="relative min-h-[420px] lg:min-h-full">
            <Image
              src={ux(PHOTO.lifBouquet, 1200)}
              alt="Soft Life Summer ready-to-wear styling"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIAL ---------- */}
      <section className="ambient-warm bg-ivory py-32 lg:py-40">
        <Reveal className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <Monogram className="mx-auto h-16 w-auto" />
          <blockquote className="font-display mt-9 text-[1.7rem] font-light italic leading-[1.35] text-balance text-onyx sm:text-3xl lg:text-[2.15rem]">
            &ldquo;They didn&apos;t just decorate a house. They understood how our family wanted to feel
            in it, and built every room around that.&rdquo;
          </blockquote>
          <div className="rule-gold mx-auto mt-10 w-24" />
          <figcaption className="label-luxe mt-6 text-[11px] text-gold-deep">
            Adaeze &amp; Marcus Whitfield <span className="text-onyx/40">- Bexley Residence</span>
          </figcaption>
        </Reveal>
      </section>

      {/* ---------- CTA BAND ---------- */}
      <section className="ambient-warm-dark bg-onyx py-28 text-ivory lg:py-36">
        <Reveal className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h2 className="font-display text-4xl font-light leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
            Let&apos;s design something worth keeping
          </h2>
          <p className="mx-auto mt-7 max-w-lg text-pretty leading-relaxed text-ivory/70">
            Consultations begin with a deposit credited toward your project. Tell us about your space
            and we&apos;ll be in touch within two business days.
          </p>
          <Link
            href="/book"
            className="label-luxe mt-10 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-[11px] text-onyx transition-transform duration-200 hover:bg-gold-bright active:scale-[0.97]"
          >
            Book a Consultation <ArrowRight size={15} weight="bold" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}

const APPROACH = [
  {
    title: "Discover",
    copy: "We begin with how you live. A discovery session uncovers the rhythms, memories, and ambitions your space needs to hold.",
  },
  {
    title: "Design",
    copy: "Concept, palette, and plans come together into a single, coherent vision you can see and feel before a thing is moved.",
  },
  {
    title: "Curate",
    copy: "We source with intention, mixing heritage pieces and custom fabrication so nothing in the room is accidental.",
  },
  {
    title: "Reveal",
    copy: "Installation and final styling, handled end to end, so you walk into a finished space and simply feel at home.",
  },
];

function DisciplineCard({
  href,
  eyebrow,
  title,
  copy,
  src,
  className = "",
  tall = false,
}: {
  href: string;
  eyebrow: string;
  title: string;
  copy: string;
  src: string;
  className?: string;
  tall?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex overflow-hidden shadow-luxe transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-luxe-lg ${tall ? "min-h-[320px]" : "min-h-[300px]"} ${className}`}
    >
      <Image
        src={src}
        alt={title}
        fill
        sizes="(max-width:768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-onyx/25 to-transparent" />
      <div className="relative z-10 mt-auto p-8">
        <p className="label-luxe text-[11px] text-gold">{eyebrow}</p>
        <h3 className="font-display mt-3 text-2xl font-light leading-[1.1] text-balance text-ivory sm:text-3xl">
          {title}
        </h3>
        <p className="mt-2.5 max-w-sm text-pretty text-sm leading-relaxed text-ivory/75">{copy}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[11px] text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="label-luxe">Explore</span>
          <ArrowRight size={13} weight="bold" />
        </span>
      </div>
    </Link>
  );
}
