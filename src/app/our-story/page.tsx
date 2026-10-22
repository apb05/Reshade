import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { EnactusLogo } from "@/components/ui/Logo";
import { CountUp, Parallax, Reveal, RevealWords } from "@/components/ui/Motion";
import { PaintStroke } from "@/components/ui/PaintStroke";
import { PartnerCTA } from "@/components/home/PartnerCTA";
import { statById } from "@/data/impact";
import { SITE } from "@/data/site";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How a student-led Enactus Humber Polytechnic initiative began turning expired makeup into paint — the problem, the early experiments, and where ReShade is going next.",
};

const TIMELINE = [
  { phase: "Early experiments", title: "Makeup samples become paint prototypes", body: "The first trials took expired makeup samples and transformed them into early paint prototypes.", tone: "past" },
  { phase: "Testing", title: "Which makeup works?", body: "Different makeup types — powders and liquids — were tested for their suitability as paint.", tone: "past" },
  { phase: "Listening", title: "Conversations with artists", body: "Informal outreach and conversations with artists gauged interest in a paint made from recovered cosmetics.", tone: "past" },
  { phase: "Learning", title: "Lessons that shaped the product", body: "What we learned from early trials shaped the current product direction.", tone: "past" },
  { phase: "Today", title: "Developing the product with artists", body: "ReShade is focused on product development and on how artists use it. Paint quality, consistency, colour range and artist demand are still being validated.", tone: "now" },
  { phase: "Next", title: "One artist project a month", body: "Collaborate with an artist each month to test ReShade and gather feedback on quality, colours, usability and applications.", tone: "goal" },
  { phase: "Next", title: "A consistent, market-ready product", body: "Test paint formats, colours, consistency, containers, labels and branding — then use artist feedback to decide what product, packaging and business model to develop next.", tone: "goal" },
  { phase: "Ambition", title: "Grow through partnership", body: "Seek investment and strategic partnerships to expand manufacturing, validate repeat demand and advance packaging recovery.", tone: "goal" },
] as const;

const TONE = {
  past: { label: "Achieved", dot: "bg-green", chip: "bg-green-soft text-green" },
  now: { label: "In progress", dot: "bg-yellow", chip: "bg-yellow-soft text-navy" },
  goal: { label: "Goal", dot: "bg-white ring-2 ring-navy", chip: "bg-navy/5 text-navy" },
};

export default function StoryPage() {
  const students = statById("students");
  const hours = statById("hours");
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream pb-20 pt-36 sm:pt-44">
        <div className="container-x grid items-end gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow text-red">Our story</p>
            <h1 className="mt-5 font-display text-mega font-extrabold uppercase text-navy">
              <RevealWords text="From makeup" />
              <span className="block">
                <RevealWords text="to" delay={0.15} />{" "}
                <span className="relative inline-block text-red">
                  <RevealWords text="paint." delay={0.25} />
                  <PaintStroke className="absolute -bottom-2 left-0 h-5 w-full sm:h-7" color="var(--color-yellow)" delay={0.9} />
                </span>
              </span>
            </h1>
          </div>
          <Reveal delay={0.4}>
            <p className="text-lede text-ink-soft">
              ReShade transforms expired makeup into usable paint, giving cosmetic waste a second life. It’s a student-led initiative with Enactus Humber Polytechnic, built around a simple idea: reuse the makeup itself, not just the packaging.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Image band */}
      <section aria-hidden className="relative h-[60svh] overflow-hidden">
        <Parallax amount={70} className="absolute inset-0">
          <div className="relative h-[120%] w-full -translate-y-[10%]">
            <Image src={asset("/images/jars-open.jpg")} alt="" fill sizes="100vw" className="object-cover" />
          </div>
        </Parallax>
      </section>

      {/* Problem + opportunity */}
      <section aria-labelledby="why-title" className="bg-paper py-24 sm:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-red">The problem</p>
            <h2 id="why-title" className="mt-4 font-display text-headline font-extrabold text-navy">
              <RevealWords text="Usable pigment, thrown away." />
            </h2>
            <Reveal>
              <p className="mt-6 text-lede text-ink-soft">
                Expired makeup is often thrown away even though it still contains usable pigments and materials. Millions of cosmetic products and their packaging end up as waste.
              </p>
              <p className="mt-5 text-ink-soft">
                Programs at major beauty retailers and brands collect and recycle <em>packaging</em>. Far fewer look for a new use for the makeup inside.
              </p>
            </Reveal>
          </div>
          <div>
            <p className="eyebrow text-green">The opportunity</p>
            <h2 className="mt-4 font-display text-headline font-extrabold text-navy">
              <RevealWords text="A new art material." />
            </h2>
            <Reveal>
              <p className="mt-6 text-lede text-ink-soft">
                ReShade takes expired makeup and repurposes its pigments into paint. That turns a waste stream into something useful — and into something beautiful.
              </p>
              <p className="mt-5 text-ink-soft">
                We started with artists because they use paints and pigments every day. Working directly with them lets us improve the product based on real-world use, then refine it before expanding to a larger consumer market.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Enactus */}
      <section aria-labelledby="enactus-title" className="relative overflow-hidden bg-navy py-24 text-white sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow text-yellow">Our roots</p>
            <h2 id="enactus-title" className="mt-4 font-display text-headline font-extrabold">
              <RevealWords text="Built by students. Driven by impact." />
            </h2>
            <Reveal>
              <p className="mt-6 text-lede text-white/80">
                ReShade is a student-led initiative of Enactus Humber Polytechnic. It combines entrepreneurship with environmental action — tackling cosmetic waste by building a real product.
              </p>
              <a href={SITE.enactus.url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-white/15 px-5 py-4 transition hover:border-white/40">
                <EnactusLogo className="h-10 w-auto" />
                <span className="text-sm text-white/75">Visit enactushumber.com ↗<span className="sr-only"> (opens in a new tab)</span></span>
              </a>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Reveal className="rounded-[2rem] bg-white/5 p-6 ring-1 ring-white/10">
              <CountUp value={students.value} className="block font-display text-6xl font-extrabold text-yellow" />
              <p className="mt-2 text-white/75">{students.label}</p>
            </Reveal>
            <Reveal delay={0.08} className="rounded-[2rem] bg-white/5 p-6 ring-1 ring-white/10">
              <CountUp value={hours.value} suffix={hours.suffix} className="block font-display text-6xl font-extrabold text-yellow" />
              <p className="mt-2 text-white/75">{hours.label}</p>
            </Reveal>
            <p className="col-span-2 text-xs text-white/50">As reported in the Enactus Humber pitch presentation.</p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section aria-labelledby="timeline-title" className="grain bg-cream py-24 sm:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow text-red">The journey</p>
              <h2 id="timeline-title" className="mt-4 font-display text-display font-extrabold text-navy"><RevealWords text="How we got here — and where we’re going." /></h2>
            </div>
            <ul className="flex flex-wrap gap-2 text-xs font-semibold">
              {Object.values(TONE).map((t) => (
                <li key={t.label} className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${t.chip}`}>
                  <span aria-hidden className={`size-2.5 rounded-full ${t.dot}`} />
                  {t.label}
                </li>
              ))}
            </ul>
          </div>
          <ol className="relative mt-16 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-0.5 before:bg-gradient-to-b before:from-green before:via-yellow before:to-navy/30 md:before:left-1/2">
            {TIMELINE.map((t, i) => (
              <li key={t.title} className={`relative mb-12 pl-12 md:mb-16 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-14" : "md:pr-14 md:text-right"}`}>
                <span aria-hidden className={`absolute left-0 top-1.5 size-6 rounded-full border-4 border-cream ${TONE[t.tone].dot} md:top-1.5 ${i % 2 ? "md:-left-3" : "md:-right-3 md:left-auto"}`} />
                <Reveal>
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${TONE[t.tone].chip}`}>
                    {t.phase} · {TONE[t.tone].label}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold text-navy sm:text-3xl">{t.title}</h3>
                  <p className="mt-2 text-ink-soft">{t.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Personal creativity */}
      <section aria-labelledby="personal-title" className="bg-paper py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem]">
            <Image src={asset("/images/paint-pots-overhead.jpg")} alt="Open paint pots in many colours, seen from above" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
          </Reveal>
          <div>
            <p className="eyebrow text-red">Where you come in</p>
            <h2 id="personal-title" className="mt-4 font-display text-headline font-extrabold text-navy">
              <RevealWords text="Transformation is personal." />
            </h2>
            <Reveal>
              <p className="mt-6 text-lede text-ink-soft">
                ReShade exists because something discarded can become something new. The same idea runs through every colour you create with us: you choose a shade, name it, give it meaning — and recovered pigment becomes part of your story.
              </p>
              <LinkButton href="/shop#studio" variant="navy" arrow className="mt-8">Create your colour</LinkButton>
            </Reveal>
          </div>
        </div>
      </section>

      <PartnerCTA />
    </>
  );
}
