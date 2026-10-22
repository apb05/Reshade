import type { Metadata } from "next";
import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { CountUp, Reveal, RevealWords } from "@/components/ui/Motion";
import { PaintStroke } from "@/components/ui/PaintStroke";
import { PartnerCTA } from "@/components/home/PartnerCTA";
import { STATS, statById } from "@/data/impact";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Our Impact",
  description: "ReShade’s reported impact so far — cosmetic products diverted, paint produced, people reached and suppliers engaged — and the goals ahead.",
};

/** Colours observed in ReShade prototype paint batches (sampled from product photography). */
const RECOVERED_SHADES = [
  { hex: "#F2646B", name: "Coral pink" },
  { hex: "#F5BC2A", name: "Golden yellow" },
  { hex: "#D1902A", name: "Ochre" },
  { hex: "#C9473B", name: "Terracotta" },
  { hex: "#12706C", name: "Deep teal" },
  { hex: "#5A2340", name: "Plum" },
  { hex: "#C99068", name: "Warm nude" },
  { hex: "#5B3A2E", name: "Cocoa" },
];

const AREAS = [
  {
    eyebrow: "Cosmetic waste diversion",
    stat: "diverted",
    title: "Makeup redirected, not thrown out.",
    body: "Unwanted, expired and unsellable cosmetic products have been diverted toward pigment recovery — products that would otherwise have been discarded.",
    img: asset("/images/stage-makeup.jpg"),
    alt: "Unwanted pressed blush compacts",
  },
  {
    eyebrow: "Paint production",
    stat: "produced",
    title: "Hundreds of prototype paints.",
    body: "Recovered pigments have been turned into bottles and jars of paint during product development. These are prototypes, made while we validate quality and consistency — not industrial-scale manufacturing.",
    img: asset("/images/jars-open.jpg"),
    alt: "Open jars of ReShade paint",
  },
  {
    eyebrow: "Community engagement",
    stat: "reached",
    title: "People, not just products.",
    body: "Through outreach and community events, ReShade has directly reached thousands of people with a simple idea: cosmetic waste can become something creative.",
    img: asset("/images/paint-night.jpg"),
    alt: "Participants painting at easels during a community paint night",
  },
  {
    eyebrow: "Supplier relationships",
    stat: "suppliers",
    title: "Businesses engaged in greener practice.",
    body: "Local retailers, cosmetic brands and salons have been engaged through supplier outreach. We’re building ongoing relationships and exploring partnerships with businesses that generate cosmetic waste at scale.",
    img: asset("/images/bottle-pink-event.jpg"),
    alt: "A pink ReShade bottle at an event",
  },
] as const;

export default function ImpactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy pb-24 pt-36 text-white sm:pt-44">
        <div className="container-x">
          <p className="eyebrow text-yellow">Our impact</p>
          <h1 className="mt-5 max-w-5xl font-display text-mega font-extrabold uppercase">
            <RevealWords text="Small pigments." />
            <span className="block text-yellow"><RevealWords text="Big impact." delay={0.2} /></span>
          </h1>
          <Reveal delay={0.3}>
            <p className="mt-8 max-w-2xl text-lede text-white/80">What ReShade has achieved so far, what we’re still testing, and where we’re aiming next — reported plainly, with sources.</p>
          </Reveal>

          <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-white/15 pt-12 md:grid-cols-3">
            {STATS.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.05}>
                <dt className="order-2 mt-2 text-white/75">{s.label}</dt>
                <dd className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {AREAS.map((a, i) => {
        const stat = statById(a.stat);
        return (
          <section key={a.eyebrow} aria-labelledby={`area-${i}`} className={`${i % 2 ? "bg-cream" : "bg-paper"} py-20 sm:py-28`}>
            <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <Reveal className={`relative aspect-[4/3] overflow-hidden rounded-[2.5rem] ${i % 2 ? "lg:order-2" : ""}`}>
                <Image src={a.img} alt={a.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
              </Reveal>
              <div>
                <p className="eyebrow text-red">{a.eyebrow}</p>
                <p className="mt-4 font-display text-[clamp(4rem,10vw,8rem)] font-extrabold leading-none tracking-tighter text-navy">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 font-semibold text-ink">{stat.label}</p>
                <h2 id={`area-${i}`} className="mt-8 font-display text-3xl font-bold text-navy sm:text-4xl">{a.title}</h2>
                <Reveal><p className="mt-4 max-w-lg text-lede text-ink-soft">{a.body}</p></Reveal>
                <p className="mt-6 text-xs text-ink-soft">Source: {stat.source}</p>
              </div>
            </div>
          </section>
        );
      })}

      {/* Creative experimentation */}
      <section aria-labelledby="experiment-title" className="grain bg-paper py-24 sm:py-32">
        <div className="container-x">
          <p className="eyebrow text-red">Creative experimentation</p>
          <h2 id="experiment-title" className="mt-4 max-w-4xl font-display text-display font-extrabold text-navy">
            <RevealWords text="What recovered pigments can become." />
          </h2>
          <Reveal>
            <p className="mt-6 max-w-2xl text-lede text-ink-soft">
              Early trials tested different makeup types — powders and liquids — for paint suitability. These are some of the colours that have appeared in prototype batches so far. Each new supplier and each new trial could widen the palette.
            </p>
          </Reveal>
          <ul className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {RECOVERED_SHADES.map((c, i) => (
              <Reveal as="li" key={c.hex} delay={i * 0.05}>
                <div className="aspect-[3/4] rounded-[1.5rem] shadow-[inset_0_-40px_60px_-30px_rgba(0,0,0,0.25)]" style={{ background: c.hex }} />
                <p className="mt-2 text-sm font-semibold">{c.name}</p>
                <p className="font-mono text-xs text-ink-soft">{c.hex}</p>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-xs text-ink-soft">Colours sampled from photographs of prototype paints; on-screen colour is approximate. Colour range is still being validated.</p>
          <div className="mt-10">
            <LinkButton href="/shop#studio" variant="navy" arrow>Imagine your own shade</LinkButton>
          </div>
        </div>
      </section>

      {/* Achievements vs goals */}
      <section aria-labelledby="goals-title" className="bg-navy py-24 text-white sm:py-32">
        <div className="container-x">
          <p className="eyebrow text-yellow">Long-term sustainability objectives</p>
          <h2 id="goals-title" className="mt-4 max-w-3xl font-display text-display font-extrabold"><RevealWords text="Done so far. Still to do." /></h2>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal className="rounded-[2.5rem] bg-white p-8 text-ink sm:p-10">
              <p className="inline-flex items-center gap-2 rounded-full bg-green-soft px-3 py-1 text-sm font-semibold text-green"><span aria-hidden className="size-2 rounded-full bg-green" /> Achieved</p>
              <ul className="mt-8 space-y-5">
                {[
                  "Early experiments turning expired makeup samples into paint prototypes",
                  "Testing of powders and liquids for paint suitability",
                  "1,500+ cosmetic products diverted",
                  "500+ bottles and jars of paint produced",
                  "2,000+ people directly reached",
                  "150 suppliers engaged in green business practices",
                ].map((t) => (
                  <li key={t} className="flex gap-3"><span aria-hidden className="mt-1 text-green">✓</span>{t}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="relative overflow-hidden rounded-[2.5rem] border-2 border-dashed border-white/30 p-8 sm:p-10">
              <p className="inline-flex items-center gap-2 rounded-full bg-yellow px-3 py-1 text-sm font-semibold text-navy"><span aria-hidden className="size-2 rounded-full bg-navy" /> Goals</p>
              <ul className="mt-8 space-y-5 text-white/90">
                {[
                  "Validate paint quality, consistency and colour range",
                  "Validate artist demand — including repeat demand",
                  "Launch one artist project per month",
                  "Develop a consistent, market-ready product, packaging and labels",
                  "Scale manufacturing through strategic partnerships",
                  "Advance packaging recovery",
                ].map((t) => (
                  <li key={t} className="flex gap-3"><span aria-hidden className="mt-1 text-yellow">○</span>{t}</li>
                ))}
              </ul>
              <PaintStroke className="absolute -bottom-2 right-6 h-6 w-40" color="var(--color-yellow)" variant={2} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Reporting note */}
      <section aria-labelledby="note-title" className="bg-cream py-16">
        <div className="container-x">
          <div className="max-w-3xl rounded-[2rem] bg-white p-8">
            <h2 id="note-title" className="font-display text-2xl font-bold text-navy">A note on how we report</h2>
            <p className="mt-3 text-ink-soft">
              Figures on this page come from ReShade’s Info Session and Enactus Humber pitch presentations. Our presentations report revenue for different periods, so we don’t show a single revenue figure here. We don’t claim specific carbon, landfill or environmental savings — we haven’t measured them yet. Figures will be updated as new results are verified.
            </p>
          </div>
        </div>
      </section>

      <PartnerCTA />
    </>
  );
}
