"use client";

import { motion, useReducedMotion } from "motion/react";
import { PaintBottle } from "@/components/shop/PaintBottle";
import { LinkButton } from "@/components/ui/Button";
import { PigmentBlobs } from "@/components/ui/PaintStroke";

const BOTTLES = [
  { hex: "#F2646B", name: "Sunset Bloom", rot: -8, y: 30, s: 0.82 },
  { hex: "#12706C", name: "Harbour Hour", rot: -3, y: 6, s: 0.92 },
  { hex: "#F5BC2A", name: "Marigold", rot: 0, y: 0, s: 1 },
  { hex: "#5A2340", name: "Velvet Plum", rot: 4, y: 10, s: 0.9 },
  { hex: "#1F4FBF", name: "Cobalt Dream", rot: 9, y: 34, s: 0.8 },
];

export function ShopHero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden bg-cream pt-32 sm:pt-36">
      <PigmentBlobs colors={["#F2646B", "#F8BC24", "#12706C", "#1F4FBF"]} className="opacity-50" />
      <div className="container-x relative grid items-center gap-12 pb-16 lg:grid-cols-[1.05fr_1fr] lg:pb-24">
        <div>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="eyebrow text-red">
            Your colour · Your name · Your creation
          </motion.p>
          <h1 className="mt-5 font-display text-display font-extrabold text-navy">
            <motion.span className="block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}>
              A colour that’s
            </motion.span>
            <motion.span className="block font-serif font-normal italic tracking-normal text-red" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              entirely yours.
            </motion.span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 max-w-xl text-lede text-ink-soft">
            Create a shade that reflects you. Choose your colour, give it a name, and make it your own — all while giving discarded cosmetics a second life.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-9 flex flex-wrap gap-3">
            <LinkButton href="#studio" variant="primary" size="lg" arrow>Create My Paint</LinkButton>
            <LinkButton href="#colours" variant="outline" size="lg">Explore ReShade</LinkButton>
          </motion.div>
        </div>

        <div className="relative mx-auto flex h-[22rem] w-full max-w-xl items-end justify-center sm:h-[28rem]" aria-label="Five ReShade bottles, each personalised with a different colour and name" role="img">
          {BOTTLES.map((b, i) => (
            <motion.div
              key={b.name}
              className="-mx-[2.5%] w-[22%]"
              style={{ zIndex: i === 2 ? 5 : 5 - Math.abs(i - 2) }}
              initial={{ opacity: 0, y: 120, rotate: 0 }}
              animate={reduce ? { opacity: 1, y: b.y, rotate: b.rot, scale: b.s } : { opacity: 1, y: [b.y, b.y - 10, b.y], rotate: b.rot, scale: b.s }}
              transition={{ opacity: { delay: 0.4 + i * 0.1, duration: 0.6 }, rotate: { delay: 0.4 + i * 0.1, duration: 1 }, scale: { duration: 0 }, y: reduce ? { delay: 0.4 + i * 0.1 } : { delay: 0.4 + i * 0.1, duration: 5 + i, repeat: Infinity, ease: "easeInOut" } }}
            >
              <PaintBottle hex={b.hex} label={{ name: b.name }} priority={i === 2} alt="" />
            </motion.div>
          ))}
        </div>
      </div>
      <div aria-hidden className="relative overflow-hidden border-y border-ink/10 bg-paper py-4">
        <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-10 whitespace-nowrap font-display text-2xl font-bold text-navy/80">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Make it yours", "Give your colour a name", "Every shade has a story", "Made personal", "Inspired by sustainability", "Your next masterpiece starts here"].map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center gap-10">
                {t}
                <span className="inline-block size-3 rounded-full" style={{ background: ["#d00000", "#f8bc24", "#007c20"][i % 3] }} />
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
