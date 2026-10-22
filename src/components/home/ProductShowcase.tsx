"use client";

import Image from "next/image";
import { useRef } from "react";
import { Reveal, RevealWords } from "@/components/ui/Motion";
import { asset } from "@/lib/asset";

const SHOTS = [
  { src: asset("/images/bottle-pink-table.jpg"), alt: "A coral pink ReShade bottle on a table with more paint bottles blurred behind", w: 1470, h: 980, caption: "Coral pink prototype" },
  { src: asset("/images/paint-pots-overhead.jpg"), alt: "Overhead view of open paint pots in blues, greens, reds and yellows", w: 1490, h: 983, caption: "Testing colour range" },
  { src: asset("/images/stage-bottle.jpg"), alt: "Pink paint being spooned into a jar beside a ReShade bottle", w: 560, h: 560, caption: "Bottling a batch" },
  { src: asset("/images/bottles-trio.jpg"), alt: "Three ReShade bottles in blue, pink and grey, tied with twine and kraft tags", w: 383, h: 388, caption: "The ReShade bottle" },
  { src: asset("/images/lab-testing.jpg"), alt: "A student in a lab coat and gloves testing a sample", w: 800, h: 451, caption: "Product testing" },
];

const FOCUS = ["Quality", "Consistency", "Colour range", "Price", "Ease of use"];

export function ProductShowcase() {
  const scroller = useRef<HTMLUListElement>(null);
  const nudge = (dir: number) => scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.7, behavior: "smooth" });

  return (
    <section aria-labelledby="product-title" className="overflow-hidden bg-paper py-24 sm:py-32">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow text-red">The product</p>
          <h2 id="product-title" className="mt-4 font-display text-display font-extrabold text-navy">
            <RevealWords text="Colour with a story." />
          </h2>
        </div>
        <Reveal>
          <p className="text-lede text-ink-soft">
            Every ReShade paint begins as makeup someone no longer wanted. We’re developing and testing our paints directly with artists, refining what matters most to them before preparing for a wider market.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {FOCUS.map((f) => (
              <li key={f} className="rounded-full border border-navy/15 px-4 py-1.5 text-sm font-medium text-navy">{f}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="relative mt-14">
        <ul ref={scroller} className="no-scrollbar flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-5 overflow-x-auto px-[var(--gutter)] pb-4" aria-label="ReShade product photography">
          {SHOTS.map((s, i) => (
            <li key={s.src} className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[34vw]">
              <figure>
                <div className={`group relative overflow-hidden rounded-[2rem] ${i % 2 ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                  <Image src={s.src} alt={s.alt} fill sizes="(min-width:1024px) 34vw, 78vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                </div>
                <figcaption className="mt-3 flex items-center gap-3 text-sm text-ink-soft">
                  <span className="font-mono text-xs text-red">0{i + 1}</span>
                  {s.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <div className="container-x mt-6 flex items-center justify-between gap-4">
          <p className="max-w-lg text-sm text-ink-soft">ReShade paints are in active development and not yet commercially certified.</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => nudge(-1)} className="grid size-12 place-items-center rounded-full border-2 border-navy/15 text-navy transition hover:bg-navy hover:text-white" aria-label="Previous photos">←</button>
            <button type="button" onClick={() => nudge(1)} className="grid size-12 place-items-center rounded-full border-2 border-navy/15 text-navy transition hover:bg-navy hover:text-white" aria-label="Next photos">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
