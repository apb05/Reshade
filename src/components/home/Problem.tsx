"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal, RevealWords } from "@/components/ui/Motion";
import { asset } from "@/lib/asset";

/** Editorial split screen. As you scroll, discarded makeup is wiped away to reveal paint. */
export function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 30%"] });
  const wipe = useTransform(scrollYProgress, [0.25, 0.75], [100, 0]);
  const clip = useTransform(wipe, (v) => `inset(0 0 ${v}% 0)`);
  const labelOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);

  return (
    <section id="discover" aria-labelledby="problem-title" className="grain scroll-mt-16 bg-paper">
      <div ref={ref} className="grid lg:min-h-[100svh] lg:grid-cols-2">
        <div className="relative min-h-[60svh] overflow-hidden bg-cream lg:sticky lg:top-0 lg:h-[100svh]">
          <Image src={asset("/images/stage-makeup.jpg")} alt="Pressed blush compacts, cracked and crumbled — makeup that would otherwise be thrown away" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          <motion.div className="absolute inset-0" style={{ clipPath: reduce ? "inset(0 0 100% 0)" : clip }}>
            <Image src={asset("/images/stage-paste.jpg")} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
            <span className="eyebrow">Discarded makeup</span>
            <motion.span className="eyebrow text-yellow" style={{ opacity: reduce ? 1 : labelOpacity }}>→ A second life as paint</motion.span>
          </div>
        </div>

        <div className="flex items-center px-[var(--gutter)] py-24 lg:py-40">
          <div className="max-w-xl">
            <p className="eyebrow text-red">The problem</p>
            <h2 id="problem-title" className="mt-4 font-display text-display font-extrabold text-navy">
              <RevealWords text="The beauty industry has a waste problem." />
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-8 text-lede text-ink-soft">
                Millions of cosmetic products and their packaging end up as waste. Unwanted, expired or unsellable makeup is often thrown away — even though much of it still contains pigments that could be useful.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-12 border-l-4 border-yellow pl-6">
                <p className="font-display text-2xl font-bold text-navy">The recycling gap</p>
                <p className="mt-3 text-ink-soft">
                  Most existing cosmetic-waste programs focus on recycling the <em>packaging</em>. ReShade explores something different: giving the makeup itself a new purpose.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8">
                <div>
                  <dt className="eyebrow text-ink-soft">Typical focus</dt>
                  <dd className="mt-2 font-display text-xl font-bold">Packaging recovery</dd>
                </div>
                <div>
                  <dt className="eyebrow text-green">ReShade’s focus</dt>
                  <dd className="mt-2 font-display text-xl font-bold text-green">The pigments inside</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
