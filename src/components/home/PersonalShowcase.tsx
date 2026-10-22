"use client";

import { motion } from "motion/react";
import { PaintBottle } from "@/components/shop/PaintBottle";
import { LinkButton } from "@/components/ui/Button";
import { RevealWords, Reveal } from "@/components/ui/Motion";

const EXAMPLES = [
  { hex: "#E86A5A", name: "Grandma’s Garden" },
  { hex: "#2E5E8C", name: "First Apartment" },
  { hex: "#E9B949", name: "Saturday Light" },
  { hex: "#3F7D5A", name: "Fern Story" },
  { hex: "#B04A7A", name: "Peony Hour" },
];

export function PersonalShowcase() {
  return (
    <section aria-labelledby="personal-title" className="relative overflow-hidden bg-cream py-24 sm:py-32">
      <div className="container-x text-center">
        <p className="eyebrow text-red">Personal by design</p>
        <h2 id="personal-title" className="mx-auto mt-4 max-w-4xl font-display text-display font-extrabold text-navy">
          <RevealWords text="Not just another colour." />{" "}
          <span className="font-serif font-normal italic tracking-normal text-red"><RevealWords text="Your colour." delay={0.2} /></span>
        </h2>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-2xl text-lede text-ink-soft">
            Choose a shade, give it a name and a meaning, and see it on your own ReShade bottle. Paint you help create — inspired by giving discarded cosmetics a second life.
          </p>
        </Reveal>
      </div>
      <ul className="container-x mt-14 grid max-w-6xl grid-cols-3 items-end gap-3 sm:grid-cols-5 sm:gap-6" aria-label="Example personalised bottles">
        {EXAMPLES.map((e, i) => (
          <motion.li
            key={e.name}
            className={i > 2 ? "hidden sm:block" : ""}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: i % 2 ? 24 : 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: (i % 2 ? 24 : 0) - 12, rotate: i % 2 ? 2 : -2 }}
          >
            <PaintBottle hex={e.hex} label={{ name: e.name }} alt={`Example bottle personalised as “${e.name}”`} />
          </motion.li>
        ))}
      </ul>
      <p className="mt-10 text-center text-xs text-ink-soft">Illustrative examples. Digital previews — physical paint may vary.</p>
      <div className="mt-8 flex justify-center">
        <LinkButton href="/shop#studio" variant="navy" size="lg" arrow>Design Your Own</LinkButton>
      </div>
    </section>
  );
}
