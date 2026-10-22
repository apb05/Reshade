"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { RevealWords } from "@/components/ui/Motion";
import { asset } from "@/lib/asset";

const STAGES = [
  {
    n: "01",
    title: "Recover",
    body: "We work with cosmetic businesses to source suitable unwanted, expired and unsellable makeup — product that would otherwise be discarded.",
    img: asset("/images/stage-makeup.jpg"),
    alt: "Pressed blush compacts with crumbled powder",
    colour: "#d00000",
  },
  {
    n: "02",
    title: "Repurpose",
    body: "Recoverable pigments are explored and processed, then worked into a usable paint. Not every product is suitable — testing tells us which are.",
    img: asset("/images/stage-paste.jpg"),
    alt: "Crushed pink pigment worked into a smooth paint on a glass slab with a palette knife",
    colour: "#f8bc24",
  },
  {
    n: "03",
    title: "Create",
    body: "The finished paint goes to artists, who test it, explore it and use it creatively — giving forgotten pigments a second life on canvas.",
    img: asset("/images/stage-bottle.jpg"),
    alt: "Pink paint spooned into a jar beside a finished ReShade bottle",
    colour: "#3fb75c",
  },
];

export function Transformation() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="transform-title" className="relative bg-navy text-white">
      <div className="container-x py-24 sm:py-32">
        <div className="max-w-3xl">
          <p className="eyebrow text-yellow">The transformation</p>
          <h2 id="transform-title" className="mt-4 font-display text-display font-extrabold">
            <RevealWords text="From makeup to masterpiece." />
          </h2>
        </div>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-2 lg:gap-20">
          <div className="hidden lg:block">
            <div className="sticky top-28 aspect-square overflow-hidden rounded-[2.5rem]">
              <AnimatePresence initial={false}>
                <motion.div key={active} className="absolute inset-0" initial={{ clipPath: "circle(0% at 50% 100%)" }} animate={{ clipPath: "circle(150% at 50% 100%)" }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}>
                  <Image src={STAGES[active].img} alt={STAGES[active].alt} fill sizes="45vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-5 left-5 flex gap-2">
                {STAGES.map((s, i) => (
                  <span key={s.n} className="h-1.5 rounded-full transition-all duration-500" style={{ width: i === active ? 40 : 14, background: i === active ? s.colour : "rgba(255,255,255,0.5)" }} />
                ))}
              </div>
            </div>
          </div>

          <ol className="space-y-6 lg:space-y-[28vh] lg:py-[12vh]">
            {STAGES.map((s, i) => (
              <li key={s.n} ref={(el) => { refs.current[i] = el; }} data-i={i} className={`transition-opacity duration-500 lg:opacity-30 ${active === i ? "lg:!opacity-100" : ""}`}>
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-[2rem] lg:hidden">
                  <Image src={s.img} alt={s.alt} fill sizes="100vw" className="object-cover" />
                </div>
                <p className="font-display text-7xl font-extrabold leading-none sm:text-8xl" style={{ color: s.colour }}>{s.n}</p>
                <h3 className="mt-4 font-display text-4xl font-bold sm:text-5xl">{s.title}</h3>
                <p className="mt-4 max-w-md text-lede text-white/75">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-16 max-w-2xl text-sm text-white/55">Not every cosmetic product can be turned into paint. Suitability depends on the product type and condition, and ReShade is still validating quality and consistency.</p>
      </div>
    </section>
  );
}
