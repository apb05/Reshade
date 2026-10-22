"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { hsvToRgb, rgbToHex, type HSV } from "@/lib/colour";

const W = 1200;
const H = 720;

const SURFACES = [
  { id: "white", label: "White canvas" },
  { id: "black", label: "Black canvas" },
  { id: "paper", label: "Warm paper" },
  { id: "linen", label: "Neutral canvas" },
] as const;
type Surface = (typeof SURFACES)[number]["id"];

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function paintSurface(ctx: CanvasRenderingContext2D, surface: Surface) {
  const rnd = seeded(7);
  const base = { white: "#fdfdfb", black: "#141416", paper: "#eee2c8", linen: "#d8d1c3" }[surface];
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);
  if (surface === "paper") {
    // fibres + mottling
    for (let i = 0; i < 2600; i++) {
      ctx.fillStyle = `rgba(${rnd() > 0.5 ? "120,90,50" : "255,250,240"},${0.04 + rnd() * 0.06})`;
      const x = rnd() * W, y = rnd() * H, l = 4 + rnd() * 18;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rnd() * Math.PI);
      ctx.fillRect(0, 0, l, 0.8);
      ctx.restore();
    }
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, W * 0.75);
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(1, "rgba(120,80,30,0.16)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  if (surface === "linen" || surface === "white" || surface === "black") {
    // canvas weave
    const light = surface === "black" ? "255,255,255" : "255,255,255";
    const dark = surface === "black" ? "0,0,0" : "70,55,35";
    const strength = surface === "linen" ? 1 : 0.45;
    for (let y = 0; y < H; y += 3) {
      ctx.fillStyle = `rgba(${y % 6 ? light : dark},${(0.05 + rnd() * 0.05) * strength})`;
      ctx.fillRect(0, y, W, 1.4);
    }
    for (let x = 0; x < W; x += 3) {
      ctx.fillStyle = `rgba(${x % 6 ? dark : light},${(0.04 + rnd() * 0.05) * strength})`;
      ctx.fillRect(x, 0, 1.4, H);
    }
  }
}

type Bristle = { off: number; width: number; colour: string; alpha: number; dry: number };

function makeBristles(hsv: HSV, size: number): Bristle[] {
  const n = Math.max(10, Math.min(46, Math.round(size * 0.85)));
  return Array.from({ length: n }, () => {
    const jitter = (Math.random() - 0.5) * 0.12;
    const c = hsvToRgb({ h: hsv.h + (Math.random() - 0.5) * 4, s: Math.min(1, Math.max(0, hsv.s + jitter)), v: Math.min(1, Math.max(0, hsv.v + jitter * 0.9)) });
    return {
      off: (Math.random() - 0.5) * size,
      width: 1 + Math.random() * (size / 10),
      colour: rgbToHex(c),
      alpha: 0.55 + Math.random() * 0.4,
      dry: 0.4 + Math.random() * 1.2,
    };
  });
}

export function PaintCanvas({ hsv, hex }: { hsv: HSV; hex: string }) {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const paintRef = useRef<HTMLCanvasElement>(null);
  const [surface, setSurface] = useState<Surface>("paper");
  const [size, setSize] = useState(34);
  const [hasPaint, setHasPaint] = useState(false);
  const stroke = useRef<{ last: { x: number; y: number }; bristles: Bristle[]; travelled: number } | null>(null);

  useEffect(() => {
    const ctx = bgRef.current?.getContext("2d");
    if (ctx) paintSurface(ctx, surface);
  }, [surface]);

  const toCanvas = (e: React.PointerEvent) => {
    const r = paintRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  };

  const segment = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }, pressure = 0.6) => {
      const ctx = paintRef.current?.getContext("2d");
      const s = stroke.current;
      if (!ctx || !s) return;
      const dx = to.x - from.x, dy = to.y - from.y;
      const len = Math.hypot(dx, dy);
      if (len < 0.5) return;
      const nx = -dy / len, ny = dx / len;
      s.travelled += len;
      const taper = Math.min(1, s.travelled / (size * 1.2));
      const scale = (0.7 + pressure * 0.6) * (0.45 + 0.55 * taper);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      // body of the stroke: heavy while the brush is loaded, thinning as it runs dry
      const body = Math.max(0, 1 - s.travelled / (size * 70));
      ctx.globalAlpha = 0.5 * body + 0.06;
      ctx.strokeStyle = hex;
      ctx.lineWidth = size * 0.8 * scale;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      // individual bristles drying out at different rates → dry-brush texture
      for (const b of s.bristles) {
        const load = Math.max(0, 1 - (s.travelled * b.dry) / (size * 48));
        if (load <= 0.02 || Math.random() > 0.35 + load) continue;
        ctx.globalAlpha = b.alpha * (0.25 + load * 0.75) * (0.7 + Math.random() * 0.3);
        ctx.strokeStyle = b.colour;
        ctx.lineWidth = b.width * scale * (0.8 + Math.random() * 0.4);
        const o = b.off * scale;
        const j = (Math.random() - 0.5) * 1.2;
        ctx.beginPath();
        ctx.moveTo(from.x + nx * (o + j), from.y + ny * (o + j));
        ctx.lineTo(to.x + nx * (o - j), to.y + ny * (o - j));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
    [hex, size],
  );

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = toCanvas(e);
    stroke.current = { last: p, bristles: makeBristles(hsv, size), travelled: 0 };
    segment(p, { x: p.x + 0.6, y: p.y + 0.6 }, e.pressure || 0.6);
    setHasPaint(true);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!stroke.current) return;
    const events = "getCoalescedEvents" in e.nativeEvent ? e.nativeEvent.getCoalescedEvents() : [];
    const points = events.length ? events.map((ev) => { const r = paintRef.current!.getBoundingClientRect(); return { x: ((ev.clientX - r.left) / r.width) * W, y: ((ev.clientY - r.top) / r.height) * H, p: ev.pressure }; }) : [{ ...toCanvas(e), p: e.pressure }];
    for (const pt of points) {
      segment(stroke.current.last, pt, pt.p || 0.6);
      stroke.current.last = pt;
    }
  };
  const end = () => (stroke.current = null);

  /** Paints a sample sweep so visitors see the effect immediately. */
  const sampleStroke = useCallback(() => {
    const pts: { x: number; y: number }[] = [];
    const y0 = H * (0.3 + Math.random() * 0.4);
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      pts.push({ x: W * (0.12 + t * 0.76), y: y0 + Math.sin(t * Math.PI * 1.4) * H * 0.12 });
    }
    stroke.current = { last: pts[0], bristles: makeBristles(hsv, size * 1.6), travelled: 0 };
    for (let i = 1; i < pts.length; i++) segment(pts[i - 1], pts[i], 0.9);
    stroke.current = null;
    setHasPaint(true);
  }, [hsv, segment, size]);

  const clear = () => {
    paintRef.current?.getContext("2d")?.clearRect(0, 0, W, H);
    setHasPaint(false);
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)] ring-1 ring-ink/10">
        <canvas ref={bgRef} width={W} height={H} className="block h-auto w-full" aria-hidden />
        <canvas
          ref={paintRef}
          width={W}
          height={H}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
          role="img"
          aria-label={`Painting surface: ${SURFACES.find((s) => s.id === surface)?.label}. Drag to paint with ${hex}.`}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
        {!hasPaint && (
          <div className={`pointer-events-none absolute inset-0 grid place-items-center text-center ${surface === "black" ? "text-white/70" : "text-ink/55"}`}>
            <p className="font-serif text-2xl italic sm:text-3xl">Drag anywhere to paint</p>
          </div>
        )}
        <span className={`pointer-events-none absolute bottom-3 left-3 rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${surface === "black" ? "bg-white/10 text-white/80" : "bg-white/70 text-ink-soft"}`}>
          Digital colour simulation
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Surface</legend>
          {SURFACES.map((s) => (
            <label key={s.id} className="cursor-pointer">
              <input type="radio" name="surface" value={s.id} checked={surface === s.id} onChange={() => setSurface(s.id)} className="peer sr-only" />
              <span className="flex items-center gap-2 rounded-full border-[1.5px] border-line bg-white px-3.5 py-2 text-sm transition peer-checked:border-navy peer-checked:ring-2 peer-checked:ring-navy/15 peer-focus-visible:ring-4 peer-focus-visible:ring-navy/30">
                <span aria-hidden className="size-4 rounded-full ring-1 ring-black/15" style={{ background: { white: "#fdfdfb", black: "#141416", paper: "#eee2c8", linen: "#d8d1c3" }[s.id] }} />
                {s.label}
              </span>
            </label>
          ))}
        </fieldset>
        <label className="flex items-center gap-3 text-sm font-semibold">
          Brush
          <input type="range" min={12} max={70} value={size} onChange={(e) => setSize(Number(e.target.value))} className="range-track w-32" style={{ ["--track" as string]: `linear-gradient(90deg, ${hex}55, ${hex})`, ["--thumb" as string]: hex }} />
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={sampleStroke} className="h-10 rounded-full bg-navy px-4 text-sm font-semibold text-white hover:bg-navy-deep">Paint a sample stroke</button>
          <button type="button" onClick={clear} className="h-10 rounded-full border-2 border-navy/15 px-4 text-sm font-semibold text-navy hover:border-navy/40">Reset canvas</button>
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-soft">
        This is a digital simulation. Physical paint can look different depending on pigment, lighting, surface and finish.
      </p>
    </div>
  );
}
