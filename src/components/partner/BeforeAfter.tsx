"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";

/** Drag (or use arrow keys) to reveal paint where there was waste. */
export function BeforeAfter({ before, after, beforeLabel, afterLabel }: { before: { src: string; alt: string }; after: { src: string; alt: string }; beforeLabel: string; afterLabel: string }) {
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();

  // Gentle intro sweep hints that the image is interactive
  useEffect(() => {
    if (reduce || touched) return;
    let frame = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 2200);
      setPos(50 + Math.sin(p * Math.PI * 2) * 18 * (1 - p));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    const delay = setTimeout(() => (frame = requestAnimationFrame(tick)), 1200);
    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(frame);
    };
  }, [reduce, touched]);

  const fromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTouched(true);
    setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }} className="relative">
      <div
        className="relative aspect-[4/5] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[2.5rem] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)] sm:aspect-square"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && fromPointer(e)}
      >
        <Image src={after.src} alt={after.alt} fill priority sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before.src} alt={before.alt} fill priority sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">{beforeLabel}</span>
        <span className="absolute right-4 top-4 rounded-full bg-yellow px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-navy">{afterLabel}</span>
        <div aria-hidden className="absolute inset-y-0 w-1 -translate-x-1/2 bg-white shadow-[0_0_20px_rgba(0,0,0,0.4)]" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-xl">⇆</span>
        </div>
      </div>
      <label htmlFor={id} className="sr-only">Compare unwanted makeup with finished paint</label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => {
          setTouched(true);
          setPos(Number(e.target.value));
        }}
        className="sr-only"
      />
    </motion.div>
  );
}
