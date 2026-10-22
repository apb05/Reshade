import Image from "next/image";
import { Reveal, RevealWords, Parallax } from "@/components/ui/Motion";
import { PaintStroke } from "@/components/ui/PaintStroke";
import { asset } from "@/lib/asset";

export function Creativity() {
  return (
    <section aria-labelledby="creativity-title" className="grain relative overflow-hidden bg-paper py-24 sm:py-32">
      <div className="container-x grid items-center gap-16 lg:grid-cols-2">
        <div className="relative order-2 h-[32rem] sm:h-[38rem] lg:order-1">
          <Parallax amount={40} className="absolute left-0 top-0 h-[78%] w-[78%] overflow-hidden rounded-[2.5rem]">
            <Image src={asset("/images/paint-pots-overhead.jpg")} alt="Overhead view of open paint pots in a rainbow of colours" fill sizes="(min-width:1024px) 40vw, 80vw" className="scale-110 object-cover" />
          </Parallax>
          <Reveal delay={0.2} className="absolute bottom-0 right-0 w-[55%] rotate-3 bg-white p-3 pb-12 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]">
            <figure>
              <div className="relative aspect-[279/179]">
                <Image src={asset("/images/paint-night.jpg")} alt="Participants painting at easels during a community paint night" fill sizes="30vw" className="object-cover" />
              </div>
              <figcaption className="absolute bottom-3 left-3 right-3 font-serif text-lg italic text-ink-soft">Community paint night</figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="order-1 lg:order-2">
          <p className="eyebrow text-red">Creativity meets sustainability</p>
          <h2 id="creativity-title" className="mt-4 font-display text-display font-extrabold text-navy">
            <RevealWords text="Made for creativity." />
            <span className="block text-green"><RevealWords text="Inspired by change." delay={0.15} /></span>
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-8 text-lede text-ink-soft">
              Artists are where ReShade starts. They use paints and pigments every day, so they’re the right people to tell us what works. We’re testing and refining our paints with them — on colour, quality, consistency, price and ease of use.
            </p>
            <p className="mt-5 text-lede text-ink-soft">
              Environmental responsibility and artistic expression aren’t opposites. A colour that was nearly thrown away can end up in someone’s best work.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="relative mt-10 rounded-[2rem] bg-cream p-6">
              <PaintStroke className="absolute -top-3 left-6 h-5 w-32" color="var(--color-red)" variant={1} />
              <p className="eyebrow text-navy">What’s next</p>
              <p className="mt-2 font-display text-2xl font-bold text-navy">One artist project per month.</p>
              <p className="mt-2 text-ink-soft">Our goal: collaborate with an artist each month to test ReShade and gather feedback on quality, colours, usability and applications. Artists are needed — get in touch.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
