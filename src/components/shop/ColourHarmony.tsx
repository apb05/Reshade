"use client";

import { motion } from "motion/react";
import { HARMONY_LABELS, harmony, hsvToHex, readableOn, type HarmonyKind } from "@/lib/colour";
import { useStudio } from "@/store/studio";

const KINDS: HarmonyKind[] = ["complementary", "analogous", "triadic", "monochromatic"];

export function ColourHarmony() {
  const { hsv, setHsv } = useStudio();
  const baseHex = hsvToHex(hsv);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {KINDS.map((kind, k) => {
        const colours = harmony(hsv, kind);
        return (
          <motion.div
            key={kind}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: k * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="min-w-0 rounded-[1.75rem] bg-white p-5 shadow-[0_18px_50px_-30px_rgba(0,24,56,0.35)]"
          >
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
              <h3 className="font-display text-xl font-bold">{HARMONY_LABELS[kind].title}</h3>
              <p className="text-xs text-ink-soft sm:text-right">{HARMONY_LABELS[kind].blurb}</p>
            </div>
            <ul className="flex h-28 gap-1.5 sm:h-32">
              {colours.map((c, i) => {
                const hex = hsvToHex(c);
                const current = hex === baseHex;
                return (
                  <li key={`${kind}-${i}`} className="flex-1 transition-[flex] duration-500 ease-[var(--ease-out-expo)] hover:flex-[1.7] focus-within:flex-[1.7]">
                    <button
                      type="button"
                      onClick={() => setHsv(c)}
                      className="group relative flex h-full w-full items-end overflow-hidden rounded-2xl p-2 text-left transition-colors duration-500"
                      style={{ background: hex, color: readableOn(hex) }}
                      aria-label={`Load ${hex} into the colour wheel${current ? " (current colour)" : ""}`}
                    >
                      <span className="font-mono text-[0.68rem] font-medium tracking-wide opacity-0 transition-opacity group-hover:opacity-90 group-focus-visible:opacity-90">{hex}</span>
                      {current && <span aria-hidden className="absolute right-2 top-2 size-2 rounded-full bg-current" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
}
