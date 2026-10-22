/**
 * Colour maths for the ReShade colour studio.
 * HSV is the single source of truth for the wheel (hue = angle,
 * saturation = radius, value = brightness slider). Everything else
 * (HEX, RGB, HSL, harmonies, perceptual distance) is derived from it.
 */

export type HSV = { h: number; s: number; v: number }; // h 0–360, s/v 0–1
export type RGB = { r: number; g: number; b: number }; // 0–255
export type HSL = { h: number; s: number; l: number }; // h 0–360, s/l 0–1

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
export const wrapHue = (h: number) => ((h % 360) + 360) % 360;

export function hsvToRgb({ h, s, v }: HSV): RGB {
  const f = (n: number) => {
    const k = (n + wrapHue(h) / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return { r: Math.round(f(5) * 255), g: Math.round(f(3) * 255), b: Math.round(f(1) * 255) };
}

export function rgbToHsv({ r, g, b }: RGB, fallbackHue = 0): HSV {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = fallbackHue;
  if (d !== 0) {
    if (max === rr) h = 60 * (((gg - bb) / d) % 6);
    else if (max === gg) h = 60 * ((bb - rr) / d + 2);
    else h = 60 * ((rr - gg) / d + 4);
  }
  return { h: wrapHue(h), s: max === 0 ? 0 : d / max, v: max };
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const { h } = rgbToHsv({ r, g, b });
  return { h, s, l };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + wrapHue(h) / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}

export const rgbToHex = ({ r, g, b }: RGB) =>
  "#" + [r, g, b].map((n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0")).join("").toUpperCase();

/** Accepts "#abc", "abc", "#aabbcc" or "aabbcc". Returns null if invalid. */
export function parseHex(input: string): RGB | null {
  let s = input.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(s)) s = s.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(s)) return null;
  const n = parseInt(s, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export const hsvToHex = (c: HSV) => rgbToHex(hsvToRgb(c));
export const hexToHsv = (hex: string, fallbackHue = 0): HSV | null => {
  const rgb = parseHex(hex);
  return rgb ? rgbToHsv(rgb, fallbackHue) : null;
};

/** WCAG relative luminance */
export function luminance({ r, g, b }: RGB) {
  const ch = (c: number) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

/** Pick ink that stays legible on top of a colour. */
export const readableOn = (hex: string) => {
  const rgb = parseHex(hex);
  return rgb && luminance(rgb) > 0.4 ? "#17171A" : "#FFFFFF";
};

// ── Perceptual distance (CIE76 in Lab — good enough for matching swatches) ──
function rgbToLab({ r, g, b }: RGB) {
  const lin = (c: number) => {
    const x = c / 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  const R = lin(r), G = lin(g), B = lin(b);
  const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return { L: 116 * f(Y) - 16, a: 500 * (f(X) - f(Y)), b: 200 * (f(Y) - f(Z)) };
}

export function deltaE(hexA: string, hexB: string) {
  const a = parseHex(hexA), b = parseHex(hexB);
  if (!a || !b) return Infinity;
  const A = rgbToLab(a), B = rgbToLab(b);
  return Math.hypot(A.L - B.L, A.a - B.a, A.b - B.b);
}

// ── Harmonies ──
export type HarmonyKind = "complementary" | "analogous" | "triadic" | "monochromatic";

export const HARMONY_LABELS: Record<HarmonyKind, { title: string; blurb: string }> = {
  complementary: { title: "Complementary", blurb: "Opposites on the wheel — maximum contrast and energy." },
  analogous: { title: "Analogous", blurb: "Neighbours that flow into each other, calm and cohesive." },
  triadic: { title: "Triadic", blurb: "Three evenly spaced hues — bold, balanced, playful." },
  monochromatic: { title: "Monochromatic", blurb: "One hue explored from light tint to deep shade." },
};

export function harmony(base: HSV, kind: HarmonyKind): HSV[] {
  const at = (dh: number, s = base.s, v = base.v): HSV => ({ h: wrapHue(base.h + dh), s: clamp(s), v: clamp(v) });
  switch (kind) {
    case "complementary":
      return [base, at(180), at(180, base.s * 0.55, Math.min(1, base.v + 0.12)), at(0, base.s * 0.5, Math.min(1, base.v + 0.15))];
    case "analogous":
      return [at(-60), at(-30), base, at(30), at(60)];
    case "triadic":
      return [base, at(120), at(240)];
    case "monochromatic":
      return [
        at(0, base.s * 0.25, Math.min(1, base.v + 0.35)),
        at(0, base.s * 0.55, Math.min(1, base.v + 0.18)),
        base,
        at(0, Math.min(1, base.s + 0.1), base.v * 0.7),
        at(0, Math.min(1, base.s + 0.15), base.v * 0.45),
      ];
  }
}

/** A loose, human colour-family name used for filtering and friendly copy. */
export type ColourFamily = "reds" | "pinks" | "oranges" | "yellows" | "greens" | "blues" | "purples" | "neutrals" | "browns";

export function colourFamily(hex: string): ColourFamily {
  const rgb = parseHex(hex);
  if (!rgb) return "neutrals";
  const { h, s, v } = rgbToHsv(rgb);
  if (s < 0.14 || v < 0.12) return "neutrals";
  if (h >= 15 && h < 45 && v < 0.62) return "browns";
  if (h < 12 || h >= 345) return s < 0.55 && v > 0.75 ? "pinks" : "reds";
  if (h >= 300) return "pinks";
  if (h < 40) return "oranges";
  if (h < 68) return "yellows";
  if (h < 170) return "greens";
  if (h < 250) return "blues";
  return "purples";
}

/** Gently random but always paintable-looking colour for "Surprise me". */
export function surpriseColour(): HSV {
  return { h: Math.random() * 360, s: 0.35 + Math.random() * 0.55, v: 0.45 + Math.random() * 0.5 };
}
