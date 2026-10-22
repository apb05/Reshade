"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { hsvToHex, hsvToRgb, wrapHue, type HSV } from "@/lib/colour";

/**
 * HSV colour wheel. Hue = angle (0° red at the top, clockwise),
 * saturation = distance from the centre. Brightness (value) is controlled
 * separately and previewed by darkening the disc.
 *
 * Mouse, touch and pen all use pointer events with capture, so dragging
 * keeps working outside the disc. Keyboard: ←/→ hue, ↑/↓ saturation,
 * PageUp/PageDown brightness; hold Shift for bigger steps.
 */
export function ColourWheel({ value, onChange, className = "" }: { value: HSV; onChange: (c: HSV) => void; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);
  useLayoutEffect(() => {
    valueRef.current = value;
  });

  // Paint the hue/saturation disc at device resolution.
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = Math.round(wrap.clientWidth * dpr);
    if (!size) return;
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(size, size);
    const r = size / 2;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - r + 0.5, dy = y - r + 0.5;
        const d = Math.hypot(dx, dy);
        const i = (y * size + x) * 4;
        if (d > r) continue;
        const h = wrapHue((Math.atan2(dx, -dy) * 180) / Math.PI);
        const { r: R, g: G, b: B } = hsvToRgb({ h, s: Math.min(1, d / r), v: 1 });
        img.data[i] = R;
        img.data[i + 1] = G;
        img.data[i + 2] = B;
        img.data[i + 3] = d > r - 1.2 ? Math.round(255 * (r - d) / 1.2) : 255; // anti-aliased rim
      }
    }
    ctx.putImageData(img, 0, 0);
  }, []);

  useEffect(() => {
    draw();
    const ro = new ResizeObserver(draw);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [draw]);

  const fromPointer = (e: React.PointerEvent) => {
    const rect = wrapRef.current!.getBoundingClientRect();
    const dx = e.clientX - rect.left - rect.width / 2;
    const dy = e.clientY - rect.top - rect.height / 2;
    const h = wrapHue((Math.atan2(dx, -dy) * 180) / Math.PI);
    const s = Math.min(1, Math.hypot(dx, dy) / (rect.width / 2));
    onChange({ h, s, v: valueRef.current.v });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const big = e.shiftKey;
    const c = { ...valueRef.current };
    switch (e.key) {
      case "ArrowRight": c.h = wrapHue(c.h + (big ? 10 : 1)); break;
      case "ArrowLeft": c.h = wrapHue(c.h - (big ? 10 : 1)); break;
      case "ArrowUp": c.s = Math.min(1, c.s + (big ? 0.1 : 0.01)); break;
      case "ArrowDown": c.s = Math.max(0, c.s - (big ? 0.1 : 0.01)); break;
      case "PageUp": c.v = Math.min(1, c.v + 0.05); break;
      case "PageDown": c.v = Math.max(0, c.v - 0.05); break;
      case "Home": c.h = 0; break;
      case "End": c.h = 359; break;
      default: return;
    }
    e.preventDefault();
    onChange(c);
  };

  const angle = (value.h * Math.PI) / 180;
  const tx = 50 + Math.sin(angle) * value.s * 50;
  const ty = 50 - Math.cos(angle) * value.s * 50;
  const hex = hsvToHex(value);

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-square touch-none select-none rounded-full ${className}`}
      role="slider"
      tabIndex={0}
      aria-label="Colour wheel"
      aria-roledescription="colour wheel"
      aria-valuemin={0}
      aria-valuemax={359}
      aria-valuenow={Math.round(value.h)}
      aria-valuetext={`Hue ${Math.round(value.h)} degrees, saturation ${Math.round(value.s * 100)} percent, brightness ${Math.round(value.v * 100)} percent, ${hex}`}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        (e.currentTarget as HTMLElement).focus({ preventScroll: true });
        fromPointer(e);
      }}
      onPointerMove={(e) => {
        if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) fromPointer(e);
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full rounded-full shadow-[0_30px_70px_-30px_rgba(0,0,0,0.55),inset_0_0_0_1px_rgba(0,0,0,0.06)]" aria-hidden />
      {/* Brightness preview */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-black transition-opacity duration-150" style={{ opacity: 1 - value.v }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/25" />
      {/* Thumb */}
      <div
        aria-hidden
        className="pointer-events-none absolute size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3.5px] border-white shadow-[0_0_0_1px_rgba(0,0,0,0.25),0_8px_20px_rgba(0,0,0,0.35)] transition-[width,height] duration-200 sm:size-10"
        style={{ left: `${tx}%`, top: `${ty}%`, background: hex }}
      />
    </div>
  );
}
