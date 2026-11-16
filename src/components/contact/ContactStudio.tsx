"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { RevealWords, Reveal, useTilt } from "@/components/ui/Motion";
import { PaintStroke, PigmentBlobs } from "@/components/ui/PaintStroke";
import { asset } from "@/lib/asset";

/** Topics presented as paint chips. Picking one tints the postcard and pre-fills the email. */
const SHADES = [
  {
    id: "artist",
    shade: "Artist Red",
    topic: "Artist collaboration",
    blurb: "Test our paint, share feedback, make something.",
    starter: "Hi ReShade, I’m an artist and I’d love to try your paint. Here’s a bit about my work:",
    hex: "#d00000",
    ink: "#ffffff",
  },
  {
    id: "partner",
    shade: "Partner Yellow",
    topic: "Business partnership",
    blurb: "Expired or unwanted makeup products to give a second life.",
    starter: "Hi ReShade, our business has expired or unwanted makeup products. Here’s roughly what we have:",
    hex: "#f8bc24",
    ink: "#00265c",
  },
  {
    id: "volunteer",
    shade: "Volunteer Green",
    topic: "Volunteering",
    blurb: "Outreach, research or communications.",
    starter: "Hi ReShade, I’d like to volunteer. I can help with:",
    hex: "#007c20",
    ink: "#ffffff",
  },
  {
    id: "hello",
    shade: "Hello Navy",
    topic: "General question",
    blurb: "Ideas, questions, or just saying hi.",
    starter: "Hi ReShade,",
    hex: "#00265c",
    ink: "#ffffff",
  },
] as const;

const BURST = ["#d00000", "#f8bc24", "#007c20", "#00265c", "#f2646b", "#12706c", "#c99068", "#5a2340"];

export function ContactStudio({ email }: { email: string }) {
  const [pick, setPick] = useState<(typeof SHADES)[number]>(SHADES[0]);
  const [copied, setCopied] = useState(0);
  const tilt = useTilt(8);

  const mailto = `mailto:${email}?subject=${encodeURIComponent(pick.topic)}&body=${encodeURIComponent(pick.starter + "\n\n")}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied((n) => n + 1);
    } catch {
      /* Clipboard unavailable; the mailto link still works. */
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="grain relative overflow-hidden bg-cream pb-24 pt-36 sm:pb-32 sm:pt-44">
        <PigmentBlobs colors={["rgba(248,188,36,0.35)", "rgba(208,0,0,0.12)", "rgba(0,124,32,0.12)"]} />
        <div className="container-x relative grid items-center gap-16 lg:grid-cols-[1fr_1fr] lg:gap-12">
          {/* Copy + swatches */}
          <div>
            <p className="eyebrow text-red">Contact</p>
            <h1 className="mt-5 font-display text-mega font-extrabold uppercase text-navy">
              <RevealWords text="Drop us" />
              <span className="block">
                <RevealWords text="a" delay={0.12} />{" "}
                <span className="relative inline-block font-serif font-normal normal-case italic text-red">
                  <RevealWords text="line." delay={0.2} />
                  <PaintStroke className="absolute -bottom-1 left-0 h-4 w-full sm:h-6" color="var(--color-yellow)" delay={0.9} />
                </span>
              </span>
            </h1>
            <Reveal delay={0.25}>
              <p className="mt-8 max-w-md text-lede text-ink-soft">
                No forms, no fuss. Pick a shade for what’s on your mind and we’ll set up the email for you.
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <fieldset className="mt-10">
                <legend className="eyebrow text-navy">What’s on your mind?</legend>
                <div role="radiogroup" className="mt-4 grid grid-cols-2 gap-3">
                  {SHADES.map((s) => {
                    const on = s.id === pick.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setPick(s)}
                        className={`group relative overflow-hidden rounded-2xl bg-white text-left shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)] ring-1 transition duration-300 hover:-translate-y-1 ${on ? "-translate-y-1 ring-2 ring-navy" : "ring-ink/5"}`}
                      >
                        <span className="relative block h-14 transition-[height] duration-500 group-hover:h-16" style={{ background: s.hex }}>
                          <AnimatePresence>
                            {on && (
                              <motion.span
                                initial={{ scale: 0, rotate: -30 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0 }}
                                className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-white text-sm font-bold text-navy"
                                aria-hidden
                              >
                                ✓
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                        <span className="block px-4 pb-4 pt-3">
                          <span className="block font-display text-base font-bold text-navy sm:text-lg">{s.shade}</span>
                          <span className="mt-0.5 block text-xs text-ink-soft sm:text-sm">{s.topic}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </Reveal>
          </div>

          {/* Postcard */}
          <Reveal delay={0.2} className="[perspective:1400px]">
            <motion.div
              {...tilt.handlers}
              style={tilt.style}
              className="relative mx-auto max-w-xl rotate-[-2deg] rounded-[1.75rem] bg-paper p-6 shadow-[0_50px_100px_-30px_rgba(0,38,92,0.45)] ring-1 ring-ink/5 [transform-style:preserve-3d] sm:p-9"
            >
              {/* Airmail edge tinted by the chosen shade */}
              <motion.div
                aria-hidden
                className="absolute inset-x-0 top-0 h-3 rounded-t-[1.75rem]"
                animate={{ background: `repeating-linear-gradient(-45deg, ${pick.hex} 0 14px, transparent 14px 28px)` }}
                transition={{ duration: 0.5 }}
              />

              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="eyebrow text-ink-soft">Postcard</p>
                  <p className="mt-2 font-serif text-3xl italic text-navy sm:text-4xl">Hello, ReShade.</p>
                </div>
                {/* Stamp + postmark */}
                <div className="relative shrink-0">
                  <div className="relative size-20 rotate-3 bg-white p-1.5 shadow-md [mask:radial-gradient(circle_at_4px_4px,transparent_3px,#000_3.5px)_-4px_-4px/8px_8px] sm:size-24">
                    <motion.div className="relative size-full overflow-hidden" animate={{ backgroundColor: pick.hex }} transition={{ duration: 0.5 }}>
                      <Image src={asset("/images/bottle-pink.png")} alt="" fill sizes="96px" className="object-contain p-1.5" />
                    </motion.div>
                  </div>
                  <svg aria-hidden viewBox="0 0 100 100" className="absolute -bottom-8 -left-12 size-24 animate-[spin_30s_linear_infinite] text-navy/40">
                    <defs>
                      <path id="pm" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
                    </defs>
                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" strokeWidth="1" />
                    <text fontSize="9.5" fontWeight="700" letterSpacing="2.4" fill="currentColor">
                      <textPath href="#pm">BEAUTY WASTE · REIMAGINED ·</textPath>
                    </text>
                  </svg>
                </div>
              </div>

              <dl className="mt-10 space-y-5">
                <div className="border-b border-dashed border-line pb-3">
                  <dt className="eyebrow text-ink-soft">To</dt>
                  <dd className="mt-1 break-all font-display text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">{email}</dd>
                </div>
                <div className="border-b border-dashed border-line pb-3">
                  <dt className="eyebrow text-ink-soft">Subject</dt>
                  <dd className="relative mt-1 h-8 overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={pick.id}
                        initial={{ y: 28, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -28, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 font-serif text-2xl italic text-ink"
                      >
                        {pick.topic}
                      </motion.span>
                    </AnimatePresence>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink-soft">Message</dt>
                  <dd className="relative mt-1 min-h-[4.5rem]">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.p
                        key={pick.id}
                        initial={{ opacity: 0, filter: "blur(6px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(6px)" }}
                        transition={{ duration: 0.3 }}
                        className="font-serif text-xl italic leading-snug text-ink-soft"
                      >
                        {pick.starter}
                        <span aria-hidden className="ml-0.5 inline-block h-5 w-0.5 translate-y-1 animate-pulse bg-red" />
                      </motion.p>
                    </AnimatePresence>
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <motion.a
                  href={mailto}
                  className="inline-flex h-14 items-center gap-2 rounded-full px-8 font-semibold tracking-tight shadow-[0_14px_30px_-12px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
                  animate={{ backgroundColor: pick.hex, color: pick.ink }}
                  transition={{ duration: 0.4 }}
                >
                  Send it <span aria-hidden>→</span>
                </motion.a>
                <button
                  type="button"
                  onClick={copy}
                  className="relative inline-flex h-14 items-center rounded-full border-2 border-navy/80 px-6 font-semibold text-navy transition hover:bg-navy hover:text-white"
                >
                  <span aria-live="polite">{copied ? "Copied ✓" : "Copy email"}</span>
                  {/* Pigment burst on copy */}
                  <AnimatePresence>
                    {copied > 0 && (
                      <span key={copied} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
                        {BURST.map((c, i) => {
                          const a = (i / BURST.length) * Math.PI * 2;
                          return (
                            <motion.span
                              key={i}
                              className="absolute size-2.5 rounded-full"
                              style={{ background: c }}
                              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                              animate={{ x: Math.cos(a) * 70, y: Math.sin(a) * 50, scale: 0.4, opacity: 0 }}
                              transition={{ duration: 0.7, ease: "easeOut" }}
                            />
                          );
                        })}
                      </span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
              <p className="mt-4 text-sm text-ink-soft">{pick.blurb}</p>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* Email marquee */}
      <a href={`mailto:${email}`} aria-label={`Email ${email}`} className="group block overflow-hidden bg-navy py-6 text-white sm:py-8">
        <div aria-hidden className="flex w-max animate-[marquee_28s_linear_infinite] group-hover:[animation-play-state:paused]">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="flex items-center gap-8 pr-8 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
                  <span className="transition-colors group-hover:text-yellow">{email}</span>
                  <span className="font-serif font-normal italic text-yellow">say hello</span>
                  <span className="size-4 rounded-full" style={{ background: BURST[i % BURST.length] }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </a>
    </>
  );
}
