"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useMotionValue } from "motion/react";
import { useRef } from "react";
import { LinkButton } from "@/components/ui/Button";
import { PARTNER_HREF } from "@/data/site";
import { asset } from "@/lib/asset";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bottleY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const blobX = useTransform(smx, (v) => v * -24);
  const blobY = useTransform(smy, (v) => v * -24);
  const bottleRot = useTransform(smx, (v) => v * 4);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy pb-16 pt-32 text-white sm:pt-36"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      {/* Macro paint photograph, deeply toned into the navy */}
      <motion.div aria-hidden className="absolute inset-0 -z-10" style={{ scale: reduce ? 1.05 : photoScale }}>
        <Image src={asset("/images/jars-open.jpg")} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_75%_45%,rgba(0,38,92,0.25),rgba(0,24,56,0.92)_70%)]" />
      </motion.div>

      <div className="container-x relative grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <motion.div style={{ y: reduce ? 0 : textY }} className="relative z-10">
          <motion.p className="eyebrow text-yellow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }}>
            ReShade Colours · with Enactus Humber
          </motion.p>
          <h1 className="mt-6 font-display text-mega font-extrabold uppercase">
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.4, ease: EASE }}>
                Beauty waste.
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block text-yellow" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.55, ease: EASE }}>
                Reimagined.
              </motion.span>
            </span>
          </h1>
          <motion.p className="mt-7 max-w-xl text-lede text-white/80" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9, ease: EASE }}>
            Transforming discarded cosmetics into paint. Giving forgotten pigments a second life through creativity, innovation and sustainability.
          </motion.p>
          <motion.div className="mt-10 flex flex-wrap gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.9, ease: EASE }}>
            <LinkButton href={PARTNER_HREF} variant="primary" size="lg" arrow>Become a Partner</LinkButton>
            <LinkButton href="#discover" variant="outline-light" size="lg">Discover ReShade</LinkButton>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[34rem] lg:h-[40rem]">
          <motion.div aria-hidden className="absolute left-1/2 top-1/2 w-[115%] -translate-x-1/2 -translate-y-1/2" style={{ x: blobX, y: blobY }} initial={{ opacity: 0, scale: 0.6, rotate: -20 }} animate={{ opacity: 0.95, scale: 1, rotate: 0 }} transition={{ duration: 1.6, delay: 0.3, ease: EASE }}>
            <Image src={asset("/images/texture-yellow-paint.png")} alt="" width={700} height={717} className="h-auto w-full" priority />
          </motion.div>
          <motion.div
            className="absolute inset-x-0 bottom-0 top-0 flex justify-center"
            style={{ y: reduce ? 0 : bottleY, rotate: reduce ? 0 : bottleRot }}
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
          >
            <Image
              src={asset("/images/bottle-pink.png")}
              alt="A ReShade bottle of coral pink paint made from recovered cosmetic pigments, tied with twine and a kraft tag"
              width={444}
              height={882}
              priority
              sizes="(min-width:1024px) 22rem, 60vw"
              className="h-full w-auto object-contain drop-shadow-[0_50px_60px_rgba(0,0,0,0.55)]"
            />
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#discover"
        aria-label="Scroll to discover ReShade"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/60 sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/20">
          <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-yellow" animate={reduce ? {} : { y: ["-100%", "200%"] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        </span>
      </motion.a>
      <div aria-hidden className="absolute inset-x-0 bottom-0 flex h-1.5">
        <span className="flex-1 bg-red" />
        <span className="flex-1 bg-yellow" />
        <span className="flex-1 bg-green" />
      </div>
    </section>
  );
}
