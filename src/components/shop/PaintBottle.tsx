"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTilt } from "@/components/ui/Motion";
import { PersonalLabel, type LabelContent } from "@/components/shop/PersonalLabel";
import { asset } from "@/lib/asset";

/**
 * A real photograph of a ReShade bottle, split into layers so the paint can be
 * recoloured live while the glass highlights, shadows, cap, twine, kraft tag
 * and original label stay exactly as photographed.
 *
 *   1. flat paint colour, clipped to the paint mask
 *   2. shading map (multiply)  → keeps the bottle's real light fall-off
 *   3. specular map  (screen)  → keeps the glass reflections
 *   4. everything that isn't paint (cap, twine, tag, label)
 *
 * Layer geometry comes from public/images/bottle/bottle-geometry.json.
 */
export const BOTTLE = { width: 444, height: 882, label: [24, 501, 261, 763] as const };

const pct = (n: number, of: number) => `${(n / of) * 100}%`;

export function PaintBottle({
  hex,
  label,
  className = "",
  tilt = false,
  shadow = true,
  priority = false,
  alt,
}: {
  hex: string;
  /** When provided, a personalised label is printed over the original one. */
  label?: LabelContent | null;
  className?: string;
  tilt?: boolean;
  shadow?: boolean;
  priority?: boolean;
  alt?: string;
}) {
  const reduce = useReducedMotion();
  const t = useTilt(9);
  const [lx0, ly0, lx1, ly1] = BOTTLE.label;
  const description =
    alt ?? `ReShade paint bottle filled with colour ${hex}${label?.name ? `, labelled “${label.name}”` : ""}`;

  return (
    <div className={`relative ${className}`} style={{ perspective: 900, aspectRatio: `${BOTTLE.width} / ${BOTTLE.height}` }}>
      {shadow && (
        <div
          aria-hidden
          className="absolute -bottom-[3%] left-1/2 h-[6%] w-[70%] -translate-x-[58%] rounded-[50%] bg-black/35 blur-xl transition-colors duration-500"
        />
      )}
      <motion.div
        role="img"
        aria-label={description}
        className="relative h-full w-full touch-pan-y select-none"
        style={{ isolation: "isolate", ...(tilt && !reduce ? t.style : {}), transformStyle: "preserve-3d" }}
        {...(tilt && !reduce ? t.handlers : {})}
      >
        <div
          className="absolute inset-0 transition-[background-color] duration-300 ease-out"
          style={{
            backgroundColor: hex,
            WebkitMaskImage: `url(${asset("/images/bottle/bottle-mask.png")})`,
            maskImage: `url(${asset("/images/bottle/bottle-mask.png")})`,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- layered compositing needs exact, unoptimised pixels */}
        <img src={asset("/images/bottle/bottle-shade.png")} alt="" draggable={false} className="absolute inset-0 h-full w-full mix-blend-multiply" fetchPriority={priority ? "high" : "auto"} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/bottle/bottle-highlight.png")} alt="" draggable={false} className="absolute inset-0 h-full w-full mix-blend-screen" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/images/bottle/bottle-overlay.png")} alt="" draggable={false} className="absolute inset-0 h-full w-full" fetchPriority={priority ? "high" : "auto"} />
        {label && (
          <div
            className="absolute"
            style={{
              containerType: "size",
              left: pct(lx0 - 1, BOTTLE.width),
              top: pct(ly0 - 1, BOTTLE.height),
              width: pct(lx1 - lx0 + 2, BOTTLE.width),
              height: pct(ly1 - ly0 + 2, BOTTLE.height),
            }}
          >
            <PersonalLabel {...label} hex={hex} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
