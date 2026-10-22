import Image from "next/image";
import Link from "next/link";
import { CountUp, Reveal, RevealWords } from "@/components/ui/Motion";
import { PaintStroke } from "@/components/ui/PaintStroke";
import { statById } from "@/data/impact";
import { asset } from "@/lib/asset";

export function ImpactHome() {
  const diverted = statById("diverted");
  const produced = statById("produced");
  const reached = statById("reached");
  const suppliers = statById("suppliers");
  return (
    <section aria-labelledby="impact-title" className="grain relative overflow-hidden bg-cream py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow text-red">Impact so far</p>
            <h2 id="impact-title" className="mt-4 font-display text-display font-extrabold text-navy">
              <RevealWords text="Small pigments." />
              <span className="relative block">
                <RevealWords text="Big impact." delay={0.15} className="relative z-10" />
                <PaintStroke className="absolute -bottom-1 left-0 -z-0 h-6 w-[min(30rem,80%)] sm:h-9" color="var(--color-yellow)" />
              </span>
            </h2>
          </div>
          <Reveal>
            <Link href="/our-impact" className="group inline-flex items-center gap-2 font-semibold text-navy">
              See the full impact report
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          <Reveal className="relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-navy p-8 text-white sm:p-12 lg:col-span-7 lg:row-span-2">
            <p className="eyebrow relative z-10 text-yellow">Cosmetic products diverted</p>
            <div className="relative z-10 mt-10">
              <CountUp value={diverted.value} suffix={diverted.suffix} className="block font-display text-[clamp(5rem,15vw,12rem)] font-extrabold leading-[0.85] tracking-tighter" />
              <p className="mt-6 max-w-md text-lede text-white/75">{diverted.detail}</p>
            </div>
            <Image src={asset("/images/texture-yellow-paint.png")} alt="" width={700} height={717} aria-hidden className="pointer-events-none absolute -bottom-40 -right-32 w-80 opacity-80 sm:w-96" />
          </Reveal>

          <Reveal delay={0.08} className="rounded-[2.5rem] bg-white p-8 lg:col-span-5">
            <CountUp value={produced.value} suffix={produced.suffix} className="block font-display text-7xl font-extrabold tracking-tighter text-red sm:text-8xl" />
            <p className="mt-3 font-display text-xl font-bold">{produced.label}</p>
            <p className="mt-1 text-ink-soft">{produced.detail}</p>
          </Reveal>

          <Reveal delay={0.12} className="grid grid-cols-[1fr_auto] items-end gap-4 rounded-[2.5rem] bg-green p-8 text-white lg:col-span-5">
            <div>
              <CountUp value={reached.value} suffix={reached.suffix} className="block font-display text-7xl font-extrabold tracking-tighter sm:text-8xl" />
              <p className="mt-3 font-display text-xl font-bold">{reached.label}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative min-h-72 overflow-hidden rounded-[2.5rem] lg:col-span-5">
            <Image src={asset("/images/jars-open.jpg")} alt="Open jars of ReShade paint in teal, ochre, red, plum and brown" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.14} className="flex flex-col justify-end rounded-[2.5rem] border-2 border-navy/10 p-8 lg:col-span-7">
            <CountUp value={suppliers.value} className="block font-display text-7xl font-extrabold tracking-tighter text-navy sm:text-8xl" />
            <p className="mt-3 max-w-md font-display text-xl font-bold">{suppliers.label}</p>
            <p className="mt-1 max-w-lg text-ink-soft">Engagement through supplier outreach — not formal partnerships.</p>
          </Reveal>
        </div>
        <p className="mt-8 text-sm text-ink-soft">Figures as reported in ReShade’s Info Session and Enactus Humber pitch presentations.</p>
      </div>
    </section>
  );
}
