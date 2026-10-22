"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

/**
 * Hand-drawn brush stroke that paints itself in when scrolled into view.
 * The turbulence filter roughens the edges so it reads as paint, not vector.
 */
export function PaintStroke({
  color = "var(--color-yellow)",
  className = "",
  variant = 0,
  delay = 0.2,
}: {
  color?: string;
  className?: string;
  variant?: 0 | 1 | 2;
  delay?: number;
}) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const paths = [
    "M8 46 C 90 18, 180 60, 270 34 S 430 22, 492 40",
    "M10 30 C 120 60, 210 6, 320 30 S 450 58, 490 26",
    "M6 40 Q 130 10 250 36 T 494 30",
  ];
  return (
    <svg aria-hidden viewBox="0 0 500 70" preserveAspectRatio="none" className={className}>
      <defs>
        <filter id={`rough-${id}`} x="-5%" y="-40%" width="110%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.9" numOctaves="2" seed={variant + 3} />
          <feDisplacementMap in="SourceGraphic" scale="9" />
        </filter>
      </defs>
      <motion.path
        d={paths[variant]}
        fill="none"
        stroke={color}
        strokeWidth="26"
        strokeLinecap="round"
        filter={`url(#rough-${id})`}
        initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, delay, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}

/** Soft organic pigment blobs used as section backgrounds. */
export function PigmentBlobs({ colors, className = "" }: { colors: string[]; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {colors.map((c, i) => (
        <span
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            background: c,
            width: `${38 + (i % 3) * 12}vmax`,
            height: `${38 + (i % 3) * 12}vmax`,
            left: `${[-12, 58, 20, 70][i % 4]}%`,
            top: `${[-18, -10, 55, 48][i % 4]}%`,
            opacity: 0.55,
            animation: `drift ${18 + i * 4}s ease-in-out ${i * -3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
