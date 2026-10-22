"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { hsvToHex, readableOn } from "@/lib/colour";
import { LIMITS, STORY_CATEGORIES, useStudio } from "@/store/studio";
import { useCollection } from "@/store/collection";
import { useCart } from "@/store/cart";
import { useHydrated } from "@/components/layout/Providers";
import { checkAvailability } from "@/data/colour-availability";
import { formatPrice, getShopConfig } from "@/data/catalogue";
import { ColourWheel } from "@/components/shop/ColourWheel";
import { ColourControls, InspirationPalettes } from "@/components/shop/ColourControls";
import { PaintBottle } from "@/components/shop/PaintBottle";
import { QtyStepper } from "@/components/layout/CartDrawer";
import { ColourRequestDialog } from "@/components/shop/ColourRequestDialog";
import { ShareDialog } from "@/components/shop/ShareDialog";
import { Button } from "@/components/ui/Button";
import { nameIdeas } from "@/components/shop/nameIdeas";

const STEPS = [
  { title: "Discover", headline: "What colour speaks to you?" },
  { title: "Make it yours", headline: "Every colour deserves a name." },
  { title: "Give it meaning", headline: "What’s the story behind your shade?" },
  { title: "See your creation", headline: "Made by you. Brought to life by ReShade." },
];

const config = getShopConfig();
const EASE = [0.16, 1, 0.3, 1] as const;

export function StudioJourney() {
  const s = useStudio();
  const hydrated = useHydrated();
  const hex = hsvToHex(s.hsv);
  const reduce = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const go = (n: number) => {
    s.setStep(Math.max(0, Math.min(3, n)));
    document.getElementById("studio-steps")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [s.step]);

  const tint = `color-mix(in oklab, ${hex} 16%, #fbf8f2)`;
  const showLabel = s.step >= 1;
  const label = showLabel ? { name: s.name, message: s.message, size: null } : null;

  return (
    <section id="studio" aria-labelledby="studio-heading" className="relative scroll-mt-20 overflow-hidden transition-[background-color] duration-700" style={{ backgroundColor: tint }}>
      <div aria-hidden className="pointer-events-none absolute -right-[20vmax] -top-[20vmax] size-[60vmax] rounded-full opacity-40 blur-3xl transition-[background-color] duration-700" style={{ backgroundColor: hex }} />
      <div className="container-x relative py-20 sm:py-28">
        <div className="mb-10 flex flex-col gap-8 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-red">The colour studio</p>
            <h2 id="studio-heading" className="mt-3 font-display text-headline font-extrabold text-navy">Every colour starts with you.</h2>
            <p className="mt-4 text-lede text-ink-soft">
              Find your perfect shade, give it a name, and watch your bottle come to life. Experiment with millions of colours — your next masterpiece starts here.
            </p>
          </div>
          <div id="studio-steps" className="scroll-mt-24">
            <Progress step={s.step} onStep={go} />
          </div>
        </div>

        <div className={`grid gap-10 ${s.step === 3 ? "" : "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16"}`}>
          {s.step !== 3 && (
            <Stage hex={hex} label={label} name={s.name} />
          )}

          <div className="min-w-0">
            <h3 ref={headingRef} tabIndex={-1} className="font-display text-3xl font-bold text-navy outline-none sm:text-4xl">
              <span className="mr-3 font-sans text-base font-semibold tracking-normal text-red">0{s.step + 1}</span>
              {STEPS[s.step].headline}
            </h3>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="mt-8"
              >
                {s.step === 0 && <StepDiscover />}
                {s.step === 1 && <StepName hex={hex} />}
                {s.step === 2 && <StepStory />}
                {s.step === 3 && hydrated && <StepReveal hex={hex} onEdit={go} />}
              </motion.div>
            </AnimatePresence>

            {s.step < 3 && (
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
                {s.step > 0 ? (
                  <Button variant="ghost" onClick={() => go(s.step - 1)}>← Back</Button>
                ) : (
                  <span className="text-sm text-ink-soft">Step 1 of 4</span>
                )}
                <div className="flex items-center gap-3">
                  {s.step === 2 && (
                    <Button variant="ghost" onClick={() => go(3)}>Skip this step</Button>
                  )}
                  <Button variant="navy" size="lg" arrow onClick={() => go(s.step + 1)}>
                    {s.step === 0 ? "Make it mine" : s.step === 1 ? "Continue" : "See my creation"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Progress({ step, onStep }: { step: number; onStep: (n: number) => void }) {
  return (
    <nav aria-label="Studio progress">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {STEPS.map((st, i) => (
          <li key={st.title} className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onStep(i)}
              aria-current={i === step ? "step" : undefined}
              className={`group flex items-center gap-2 whitespace-nowrap rounded-full py-1.5 pl-1.5 pr-3 text-sm font-semibold transition ${
                i === step ? "bg-navy text-white" : i < step ? "bg-white/80 text-navy hover:bg-white" : "text-ink-soft hover:bg-white/60"
              }`}
            >
              <span className={`grid size-7 place-items-center rounded-full text-xs ${i === step ? "bg-yellow text-navy" : i < step ? "bg-green text-white" : "bg-ink/10"}`}>
                {i < step ? "✓" : i + 1}
              </span>
              <span className={i === step ? "" : "hidden sm:inline"}>{st.title}</span>
            </button>
            {i < STEPS.length - 1 && <span aria-hidden className={`h-px w-3 sm:w-6 ${i < step ? "bg-green" : "bg-ink/15"}`} />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Live preview: bottle, big swatch and a paint swipe. Sticky on large screens. */
function Stage({ hex, label, name }: { hex: string; label: { name: string; message: string; size: null } | null; name: string }) {
  const ink = readableOn(hex);
  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      {/* Compact sticky preview on phones so the bottle stays visible while using the wheel */}
      <div className="sticky top-[5.25rem] z-20 -mx-2 flex items-center gap-4 rounded-3xl bg-paper/85 p-3 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)] backdrop-blur-md lg:hidden">
        <div className="w-14 shrink-0"><PaintBottle hex={hex} label={label} shadow={false} /></div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-2xl italic leading-tight">{name || "Your colour"}</p>
          <p className="font-mono text-sm text-ink-soft">{hex}</p>
        </div>
        <div className="size-12 shrink-0 rounded-2xl ring-1 ring-black/10 transition-colors duration-300" style={{ background: hex }} />
      </div>

      <div className="relative hidden lg:block">
        <div className="relative mx-auto aspect-[4/5] max-w-[30rem] overflow-hidden rounded-[2.5rem] bg-white/50 ring-1 ring-ink/5">
          <svg aria-hidden viewBox="0 0 400 500" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <defs>
              <filter id="stage-rough"><feTurbulence type="fractalNoise" baseFrequency="0.02 0.6" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="14" /></filter>
            </defs>
            <path d="M-20 360 C 80 300, 180 420, 260 350 S 380 300, 430 330" fill="none" stroke={hex} strokeWidth="90" strokeLinecap="round" filter="url(#stage-rough)" opacity="0.9" style={{ transition: "stroke 0.4s" }} />
          </svg>
          <div className="absolute inset-x-0 bottom-[6%] top-[6%] flex justify-center">
            <PaintBottle hex={hex} label={label} tilt priority className="h-full w-auto" />
          </div>
          <div className="absolute bottom-5 left-5 rounded-full px-4 py-2 font-mono text-sm font-medium shadow-lg transition-colors duration-300" style={{ background: hex, color: ink }}>
            {hex}
          </div>
          <span className="absolute right-5 top-5 rounded-full bg-white/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-soft">Digital preview</span>
        </div>
        <p className="mx-auto mt-4 max-w-[30rem] text-center text-xs text-ink-soft">Move your pointer over the bottle to inspect it. On-screen colour is a simulation — physical paint may vary.</p>
      </div>
    </div>
  );
}

function StepDiscover() {
  const { hsv, setHsv } = useStudio();
  return (
    <div className="space-y-10">
      <div className="grid items-start gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-12">
        <div className="mx-auto w-full max-w-[22rem] sm:max-w-none">
          <ColourWheel value={hsv} onChange={setHsv} />
          <p className="mt-3 text-center text-xs text-ink-soft">Drag around the wheel. Keyboard: arrows adjust hue &amp; saturation, Page Up/Down brightness.</p>
        </div>
        <ColourControls />
      </div>
      <InspirationPalettes />
    </div>
  );
}

function StepName({ hex }: { hex: string }) {
  const { name, setName, message, setMessage } = useStudio();
  const id = useId();
  const [seed, setSeed] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- seed intentionally re-rolls the suggestions
  const ideas = useMemo(() => nameIdeas(hex), [hex, seed]);
  return (
    <div className="space-y-8">
      <div>
        <label htmlFor={`${id}-name`} className="block text-sm font-semibold">Give your colour a name</label>
        <input
          id={`${id}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={LIMITS.name}
          placeholder="Sunset Bloom"
          autoComplete="off"
          className="mt-3 w-full border-b-2 border-ink/20 bg-transparent pb-2 font-serif text-5xl italic text-ink outline-none transition placeholder:text-ink/25 focus:border-navy sm:text-6xl"
          aria-describedby={`${id}-name-count`}
        />
        <div className="mt-2 flex items-center justify-between text-xs text-ink-soft">
          <span>Your name appears on the label, right on the bottle.</span>
          <span id={`${id}-name-count`} aria-live="polite">{name.length}/{LIMITS.name}</span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-ink-soft">Need an idea?</span>
          {ideas.map((idea) => (
            <button key={idea} type="button" onClick={() => setName(idea)} className="rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-medium ring-1 ring-ink/10 transition hover:bg-white hover:ring-navy/40">
              {idea}
            </button>
          ))}
          <button type="button" onClick={() => setSeed((n) => n + 1)} className="rounded-full px-2 py-1.5 text-sm font-semibold text-navy underline-offset-4 hover:underline" aria-label="Suggest different names">
            ↻ More
          </button>
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-msg`} className="block text-sm font-semibold">
          A short personal message <span className="font-normal text-ink-soft">(optional)</span>
        </label>
        <input
          id={`${id}-msg`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={LIMITS.message}
          placeholder="For Mum, who taught me to paint"
          className="field mt-3"
          aria-describedby={`${id}-msg-help`}
        />
        <p id={`${id}-msg-help`} className="mt-2 text-xs text-ink-soft">
          {message.length}/{LIMITS.message} · Printed in small type beneath your colour name.
        </p>
      </div>
      <p className="rounded-2xl bg-white/60 p-4 text-xs leading-relaxed text-ink-soft ring-1 ring-ink/5">
        This is a design preview. Any physical label will also carry the required product, ingredient and safety information, and personalised packaging is only produced where ReShade has confirmed it’s available.
      </p>
    </div>
  );
}

function StepStory() {
  const { storyCategory, setStoryCategory, story, setStory } = useStudio();
  const id = useId();
  return (
    <div className="space-y-8">
      <p className="max-w-xl text-ink-soft">
        Every shade has a story. What’s yours? This step is completely optional — your story stays on this device and is only shared if you choose to include it later.
      </p>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">This colour is inspired by…</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {STORY_CATEGORIES.map((c) => (
            <label key={c.id} className="cursor-pointer">
              <input
                type="radio"
                name="story-category"
                value={c.id}
                checked={storyCategory === c.id}
                onChange={() => setStoryCategory(c.id)}
                onClick={() => storyCategory === c.id && setStoryCategory(null)}
                className="peer sr-only"
              />
              <span className="flex items-center justify-between rounded-2xl border-[1.5px] border-line bg-white/80 px-4 py-3.5 text-[0.95rem] transition peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-navy/25 hover:border-navy/40">
                {c.label}
                <span aria-hidden className="text-lg opacity-60">→</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor={id} className="block text-sm font-semibold">
          What does this colour mean to you? <span className="font-normal text-ink-soft">(optional)</span>
        </label>
        <textarea
          id={id}
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={3}
          maxLength={LIMITS.story}
          placeholder="My grandmother’s garden in the summer."
          className="field mt-3 font-serif text-xl italic"
        />
        <p className="mt-2 text-xs text-ink-soft">{story.length}/{LIMITS.story}</p>
      </div>
    </div>
  );
}

function StepReveal({ hex, onEdit }: { hex: string; onEdit: (step: number) => void }) {
  const s = useStudio();
  const saveToCollection = useCollection((c) => c.save);
  const addToCart = useCart((c) => c.add);
  const [requestOpen, setRequestOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const availability = useMemo(() => checkAvailability(hex), [hex]);
  const ink = readableOn(hex);

  const product = availability.match?.kind === "product" ? availability.match.product : null;
  const variants = product ? product.variants : availability.match?.kind === "formulation" ? config.customShadeVariants : [];
  const variant = variants.find((v) => v.id === s.variantId) ?? variants[0] ?? null;
  const messageAllowed = product ? product.personalisation.message : true;
  const story = STORY_CATEGORIES.find((c) => c.id === s.storyCategory);
  const displayName = s.name.trim() || "Your colour";

  const save = () => {
    const id = saveToCollection({ hex, name: s.name, message: s.message, storyCategory: s.storyCategory, story: s.story }, s.editingId);
    useStudio.setState({ editingId: id });
    setSaved(true);
    setTimeout(() => setSaved(false), 2600);
  };

  const add = () => {
    if (!variant) return;
    addToCart({
      productId: product?.id ?? "custom",
      variantId: variant.id,
      qty: s.qty,
      hex: product?.hex ?? hex,
      name: s.name.trim() || product?.name || "Custom shade",
      message: messageAllowed ? s.message.trim() : "",
      personalised: Boolean(s.name.trim()),
    });
  };

  return (
    <div>
      {/* Cinematic reveal */}
      <div className="relative overflow-hidden rounded-[2.5rem] px-6 py-12 sm:px-12 sm:py-16" style={{ background: `radial-gradient(120% 90% at 30% 20%, color-mix(in oklab, ${hex} 30%, #fff) 0%, color-mix(in oklab, ${hex} 70%, #001838) 100%)` }}>
        <motion.svg aria-hidden viewBox="0 0 1000 300" preserveAspectRatio="none" className="absolute inset-x-0 top-1/2 h-[55%] w-full -translate-y-1/2">
          <defs>
            <filter id="reveal-rough"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.5" numOctaves="3" seed="9" /><feDisplacementMap in="SourceGraphic" scale="26" /></filter>
          </defs>
          <motion.path d="M-40 170 C 200 60, 420 260, 620 140 S 900 90, 1040 160" fill="none" stroke={hex} strokeWidth="150" strokeLinecap="round" filter="url(#reveal-rough)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }} />
        </motion.svg>
        <div className="relative grid items-center gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <motion.div initial={{ opacity: 0, y: 60, scale: 0.9, rotate: -4 }} animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} transition={{ duration: 1.2, delay: 0.3, ease: EASE }} className="mx-auto w-[min(17rem,62vw)]">
            <PaintBottle hex={hex} label={{ name: s.name, message: messageAllowed ? s.message : "", size: variant?.size ?? null }} tilt priority />
          </motion.div>
          <div style={{ color: ink, textShadow: ink === "#FFFFFF" ? "0 1px 18px rgba(0,0,0,0.35)" : "none" }}>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.7 }} className="eyebrow">Your creation</motion.p>
            <motion.h4 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.9, ease: EASE }} className="mt-3 break-words font-serif text-6xl italic leading-[0.9] tracking-normal sm:text-7xl lg:text-8xl">
              {displayName}
            </motion.h4>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 1.1 }} className="mt-4 font-mono text-sm">{hex} · Created by you</motion.p>
            {(s.story || story) && (
              <motion.blockquote initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="mt-6 max-w-md border-l-2 border-current/40 pl-4">
                {story && <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-75">{story.label}</p>}
                {s.story && <p className="mt-1 font-serif text-2xl italic leading-snug">“{s.story}”</p>}
              </motion.blockquote>
            )}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-8 flex flex-wrap gap-2">
              {[
                { label: "Edit colour", step: 0 },
                { label: "Edit name", step: 1 },
                { label: "Edit story", step: 2 },
              ].map((e) => (
                <button key={e.label} type="button" onClick={() => onEdit(e.step)} className="rounded-full border-[1.5px] border-current/40 px-4 py-2 text-sm font-semibold transition hover:bg-current/10">
                  {e.label}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Configuration + purchase/request */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_-35px_rgba(0,24,56,0.45)] sm:p-8">
          <AvailabilityBadge status={availability.status} reason={availability.reason} />

          {availability.status === "available" && variant ? (
            <div className="mt-6 space-y-6">
              <fieldset>
                <legend className="mb-3 text-sm font-semibold">Bottle size</legend>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <label key={v.id} className="cursor-pointer">
                      <input type="radio" name="variant" className="peer sr-only" checked={variant.id === v.id} onChange={() => s.setVariant(v.id)} />
                      <span className="flex flex-col rounded-2xl border-[1.5px] border-line px-4 py-3 text-sm transition peer-checked:border-navy peer-checked:ring-2 peer-checked:ring-navy/15 peer-focus-visible:ring-4">
                        <span className="font-semibold">{v.size}</span>
                        <span className="text-ink-soft">{formatPrice(v.priceCents, config.currency)}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="mb-2 text-sm font-semibold">Quantity</p>
                  <QtyStepper value={s.qty} onChange={s.setQty} label="Quantity" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-ink-soft">Total</p>
                  <motion.p key={`${variant.id}-${s.qty}`} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl font-bold text-navy">
                    {formatPrice(variant.priceCents != null ? variant.priceCents * s.qty : null, config.currency)}
                  </motion.p>
                </div>
              </div>
              {!messageAllowed && s.message && <p className="text-sm text-ink-soft">Personal messages aren’t offered for this paint, so your message won’t be printed.</p>}
              <Button variant="primary" size="lg" arrow className="w-full" onClick={add} disabled={variant.priceCents == null}>
                Add my colour to cart
              </Button>
            </div>
          ) : availability.status === "request" ? (
            <div className="mt-6 space-y-5">
              <p className="text-ink-soft">
                We can’t promise every digital colour can be made from recovered cosmetic pigments, so custom shades are reviewed by the ReShade team first. Send us your creation and we’ll let you know if — and how — we can make it. No payment is taken until feasibility, pricing and fulfilment are confirmed.
              </p>
              <Button variant="primary" size="lg" arrow className="w-full" onClick={() => setRequestOpen(true)}>
                Request this custom shade
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <p className="text-ink-soft">Try adjusting the colour — nearby shades may be possible.</p>
              <Button variant="navy" onClick={() => onEdit(0)}>Adjust my colour</Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-[2rem] bg-navy p-6 text-white sm:p-8">
          <p className="font-display text-2xl font-bold">Keep it. Share it.</p>
          <p className="text-sm text-white/70">Save your creation to come back to later — no account needed — or share it with the world.</p>
          <div className="mt-auto flex flex-col gap-2 pt-4">
            <Button variant="primary" onClick={save}>
              {saved ? "✓ Saved to My Colour Collection" : s.editingId ? "Update in my collection" : "Save to My Colour Collection"}
            </Button>
            <Button variant="outline-light" onClick={() => setShareOpen(true)}>Share my colour</Button>
            <button type="button" onClick={() => { s.resetAll(); onEdit(0); }} className="mt-1 text-sm text-white/70 underline-offset-4 hover:text-white hover:underline">
              Start a new colour
            </button>
          </div>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-green">Made personal. Inspired by sustainability — every ReShade paint begins with discarded cosmetic pigments.</p>

      <ColourRequestDialog open={requestOpen} onClose={() => setRequestOpen(false)} hex={hex} colourName={s.name} message={s.message} story={s.story} />
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} hex={hex} name={s.name} message={s.message} story={s.story} />
    </div>
  );
}

export function AvailabilityBadge({ status, reason }: { status: "available" | "request" | "unavailable"; reason: string }) {
  const map = {
    available: { label: "Available", cls: "bg-green-soft text-green", dot: "bg-green" },
    request: { label: "Request custom colour", cls: "bg-yellow-soft text-navy", dot: "bg-yellow" },
    unavailable: { label: "Unavailable", cls: "bg-red-soft text-red", dot: "bg-red" },
  }[status];
  return (
    <div>
      <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ${map.cls}`}>
        <span aria-hidden className={`size-2 rounded-full ${map.dot}`} />
        {map.label}
      </span>
      <p className="mt-3 text-sm text-ink-soft">{reason}</p>
    </div>
  );
}
