"use client";

import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "p" | "span" | "figure";
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

/** Editorial headline reveal: each word rises out of a mask. */
export function RevealWords({ text, className, delay = 0, as: Tag = "span" }: { text: string; className?: string; delay?: number; as?: ElementType }) {
  const words = text.split(" ");
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "105%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.9, delay: delay + i * 0.06, ease: EASE }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

export function CountUp({ value, prefix = "", suffix = "", className }: { value: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, { duration: 2, ease: EASE, onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value, reduce]);
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {prefix}
        {value.toLocaleString("en-CA")}
        {suffix}
      </span>
      <span aria-hidden className="tabular-nums">
        {prefix}
        {display.toLocaleString("en-CA")}
        {suffix}
      </span>
    </span>
  );
}

/** Wraps content and drifts it vertically as the section scrolls past. */
export function Parallax({ children, amount = 80, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [amount, -amount]), { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: reduce ? 0 : y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Subtle pointer-follow tilt for product shots. */
export function useTilt(strength = 10) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * strength * 2);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * strength);
  };
  const onPointerLeave = () => {
    rx.set(0);
    ry.set(0);
  };
  return { style: { rotateX: srx, rotateY: sry }, handlers: { onPointerMove, onPointerLeave }, rx, ry };
}
