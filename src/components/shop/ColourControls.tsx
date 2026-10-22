"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { hexToHsv, hsvToHex, hsvToRgb, rgbToHsl, surpriseColour, readableOn, type HSV } from "@/lib/colour";
import { useStudio } from "@/store/studio";
import { useHydrated } from "@/components/layout/Providers";

export const INSPIRATION_PALETTES = [
  { name: "ReShade originals", note: "Shades from our prototype paints", colours: ["#F2646B", "#F5BC2A", "#12706C", "#D1902A", "#C9473B", "#5A2340"] },
  { name: "Sunset bloom", note: "Warm, glowing, golden hour", colours: ["#FF7A59", "#FFB35C", "#F25C7A", "#C2408F", "#6B3FA0"] },
  { name: "Garden after rain", note: "Fresh greens and soft petals", colours: ["#2F6B3E", "#7FB069", "#C9E4B4", "#E8A0B4", "#F4D35E"] },
  { name: "Coastline", note: "Sea glass, sand and storm", colours: ["#0B4F6C", "#20A4C4", "#9AD1D4", "#E9D8B4", "#4A5859"] },
  { name: "Studio neutrals", note: "Quiet, grounded, timeless", colours: ["#F2EDE4", "#D8C8B0", "#A68A6D", "#6B5446", "#2E2A27"] },
];

function Slider({
  label,
  value,
  max,
  unit,
  track,
  thumb,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  track: string;
  thumb: string;
  onChange: (n: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between text-sm">
        <label htmlFor={id} className="font-semibold">{label}</label>
        <span className="tabular-nums text-ink-soft">{Math.round(value)}{unit}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={max}
        step={1}
        value={Math.round(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-track"
        style={{ ["--track" as string]: track, ["--thumb" as string]: thumb }}
      />
    </div>
  );
}

export function HexInput({ hex, onCommit }: { hex: string; onCommit: (hsv: HSV) => void }) {
  const id = useId();
  const [draft, setDraft] = useState(hex);
  const [focused, setFocused] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const text = focused ? draft : hex;
  const setText = setDraft;
  const tryCommit = (v: string, final = false) => {
    const hsv = hexToHsv(v);
    if (hsv) {
      setInvalid(false);
      onCommit(hsv);
    } else if (final) setInvalid(true);
  };
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">HEX code</label>
      <div className="relative">
        <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-ink-soft">#</span>
        <input
          id={id}
          value={text.replace(/^#/, "")}
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          maxLength={7}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-err` : undefined}
          onFocus={() => {
            setDraft(hex);
            setFocused(true);
          }}
          onBlur={(e) => {
            setFocused(false);
            tryCommit(e.target.value, true);
          }}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9a-f#]/gi, "").toUpperCase();
            setText(v);
            if (v.replace("#", "").length === 6) tryCommit(v);
          }}
          onKeyDown={(e) => e.key === "Enter" && tryCommit((e.target as HTMLInputElement).value, true)}
          className="field pl-8 font-mono uppercase tracking-wider"
        />
      </div>
      {invalid && <p id={`${id}-err`} className="mt-1.5 text-sm text-red">Use 3 or 6 hex digits, e.g. F2646B.</p>}
    </div>
  );
}

export function ColourControls() {
  const { hsv, setHsv, favourites, toggleFavourite, resetColour } = useStudio();
  const hydrated = useHydrated();
  const hex = hsvToHex(hsv);
  const rgb = hsvToRgb(hsv);
  const hsl = rgbToHsl(rgb);
  const isFav = favourites.includes(hex);
  const pureHue = hsvToHex({ h: hsv.h, s: 1, v: 1 });
  const fullSat = hsvToHex({ h: hsv.h, s: hsv.s, v: 1 });
  const keepHue = (c: HSV): HSV => (c.s < 0.005 ? { ...c, h: hsv.h } : c);

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <Slider
          label="Hue"
          value={hsv.h}
          max={359}
          unit="°"
          thumb={pureHue}
          track="linear-gradient(90deg,#f00,#ff0 16.6%,#0f0 33.3%,#0ff 50%,#00f 66.6%,#f0f 83.3%,#f00)"
          onChange={(h) => setHsv({ ...hsv, h })}
        />
        <Slider
          label="Saturation"
          value={hsv.s * 100}
          max={100}
          unit="%"
          thumb={hex}
          track={`linear-gradient(90deg, ${hsvToHex({ h: hsv.h, s: 0, v: hsv.v })}, ${hsvToHex({ h: hsv.h, s: 1, v: hsv.v })})`}
          onChange={(s) => setHsv({ ...hsv, s: s / 100 })}
        />
        <Slider
          label="Brightness"
          value={hsv.v * 100}
          max={100}
          unit="%"
          thumb={hex}
          track={`linear-gradient(90deg, #000, ${fullSat})`}
          onChange={(v) => setHsv({ ...hsv, v: v / 100 })}
        />
      </div>

      <div className="space-y-3">
        <HexInput hex={hex} onCommit={(c) => setHsv(keepHue(c))} />
        <dl className="flex flex-wrap gap-x-6 gap-y-1 rounded-2xl bg-white/70 px-4 py-2.5 text-sm ring-1 ring-ink/5">
          <div className="flex gap-2 whitespace-nowrap"><dt className="font-semibold">RGB</dt><dd className="tabular-nums text-ink-soft">{rgb.r}, {rgb.g}, {rgb.b}</dd></div>
          <div className="flex gap-2 whitespace-nowrap"><dt className="font-semibold">HSL</dt><dd className="tabular-nums text-ink-soft">{Math.round(hsl.h)}°, {Math.round(hsl.s * 100)}%, {Math.round(hsl.l * 100)}%</dd></div>
        </dl>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setHsv(surpriseColour())} className="inline-flex h-11 items-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-navy-deep">
          <span aria-hidden>✦</span> Surprise me
        </button>
        <button
          type="button"
          onClick={() => toggleFavourite(hex)}
          aria-pressed={hydrated ? isFav : false}
          className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-navy/15 px-5 text-sm font-semibold text-navy transition hover:border-navy/40"
        >
          <svg aria-hidden viewBox="0 0 24 24" className={`size-4 ${hydrated && isFav ? "fill-red stroke-red" : "fill-none stroke-current"}`} strokeWidth="2"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>
          {hydrated && isFav ? "Saved" : "Save colour"}
        </button>
        <button type="button" onClick={resetColour} className="inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold text-ink-soft underline-offset-4 hover:underline">
          Reset
        </button>
      </div>

      {hydrated && favourites.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold">Your saved colours</p>
          <ul className="flex flex-wrap gap-2">
            <AnimatePresence initial={false}>
              {favourites.map((f) => (
                <motion.li key={f} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <button
                    type="button"
                    onClick={() => setHsv(hexToHsv(f)!)}
                    className={`grid size-10 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-paper transition hover:scale-110 ${f === hex ? "ring-navy" : "ring-transparent"}`}
                    style={{ background: f, color: readableOn(f) }}
                    aria-label={`Use saved colour ${f}`}
                  >
                    {f === hex && <span aria-hidden className="text-xs">●</span>}
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </div>
  );
}

export function InspirationPalettes() {
  const { hsv, setHsv } = useStudio();
  const hex = hsvToHex(hsv);
  return (
    <div>
      <p className="mb-3 text-sm font-semibold">Need inspiration? Start from a palette.</p>
      <ul className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {INSPIRATION_PALETTES.map((p) => (
          <li key={p.name} className="w-48 shrink-0 rounded-2xl bg-white/80 p-3 ring-1 ring-ink/5">
            <p className="text-sm font-semibold">{p.name}</p>
            <p className="mb-2 text-xs text-ink-soft">{p.note}</p>
            <div className="flex overflow-hidden rounded-xl">
              {p.colours.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setHsv(hexToHsv(c)!)}
                  className={`h-10 flex-1 transition-[flex] duration-300 hover:flex-[1.8] focus-visible:flex-[1.8] ${c === hex ? "flex-[1.8]" : ""}`}
                  style={{ background: c }}
                  aria-label={`Use ${c} from ${p.name}`}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
