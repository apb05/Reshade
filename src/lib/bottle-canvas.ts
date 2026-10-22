/**
 * Canvas version of <PaintBottle>, used to render downloadable share images.
 * Mirrors the CSS layer stack: colour → mask → multiply shade → screen
 * highlight → photographed overlay → optional personalised label.
 */
import { BOTTLE } from "@/components/shop/PaintBottle";
import { asset } from "@/lib/asset";

export type BottleImages = Record<"mask" | "shade" | "highlight" | "overlay" | "logo", HTMLImageElement>;

const load = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/** Resolve the next/font family names so canvas text matches the site typography. */
export function fontFamily(variable: "--font-instrument" | "--font-inter" | "--font-bricolage", fallback: string) {
  const v = typeof window !== "undefined" ? getComputedStyle(document.documentElement).getPropertyValue(variable).trim() : "";
  return v ? `${v}, ${fallback}` : fallback;
}

let cache: Promise<BottleImages> | null = null;
export function loadBottleImages() {
  cache ??= Promise.all([
    load(asset("/images/bottle/bottle-mask.png")),
    load(asset("/images/bottle/bottle-shade.png")),
    load(asset("/images/bottle/bottle-highlight.png")),
    load(asset("/images/bottle/bottle-overlay.png")),
    load(asset("/images/logo-reshade-dark.png")),
  ]).then(([mask, shade, highlight, overlay, logo]) => ({ mask, shade, highlight, overlay, logo }));
  return cache;
}

export function drawBottle(
  ctx: CanvasRenderingContext2D,
  imgs: BottleImages,
  hex: string,
  x: number,
  y: number,
  width: number,
  label?: { name: string; message?: string; size?: string | null } | null,
) {
  const height = (width * BOTTLE.height) / BOTTLE.width;
  const off = document.createElement("canvas");
  off.width = Math.round(width);
  off.height = Math.round(height);
  const o = off.getContext("2d")!;
  o.fillStyle = hex;
  o.fillRect(0, 0, off.width, off.height);
  o.globalCompositeOperation = "destination-in";
  o.drawImage(imgs.mask, 0, 0, off.width, off.height);
  o.globalCompositeOperation = "multiply";
  o.drawImage(imgs.shade, 0, 0, off.width, off.height);
  o.globalCompositeOperation = "destination-in";
  o.drawImage(imgs.mask, 0, 0, off.width, off.height);
  o.globalCompositeOperation = "screen";
  o.drawImage(imgs.highlight, 0, 0, off.width, off.height);
  o.globalCompositeOperation = "source-over";
  o.drawImage(imgs.overlay, 0, 0, off.width, off.height);

  if (label) {
    const sans = fontFamily("--font-inter", "sans-serif");
    const serif = fontFamily("--font-instrument", "Georgia, serif");
    const k = width / BOTTLE.width;
    const [lx0, ly0, lx1, ly1] = BOTTLE.label;
    const lx = (lx0 - 1) * k, ly = (ly0 - 1) * k, lw = (lx1 - lx0 + 2) * k, lh = (ly1 - ly0 + 2) * k;
    const cq = lw / 100; // matches the 1cqw unit used by <PersonalLabel>
    o.fillStyle = "#f7f3ea";
    o.fillRect(lx, ly, lw, lh);
    const g = o.createLinearGradient(lx, 0, lx + lw, 0);
    g.addColorStop(0, "rgba(0,0,0,0.12)");
    g.addColorStop(0.12, "rgba(0,0,0,0)");
    g.addColorStop(0.85, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.18)");
    o.fillStyle = g;
    o.fillRect(lx, ly, lw, lh);
    const pad = 8 * cq;
    o.drawImage(imgs.logo, lx + pad, ly + 7 * cq, 26 * cq, 26 * cq);
    o.fillStyle = "#4a4a52";
    o.font = `600 ${4.6 * cq}px ${sans}`;
    o.textAlign = "right";
    o.fillText("RECOVERED", lx + lw - pad, ly + 12 * cq);
    o.fillText("PIGMENT", lx + lw - pad, ly + 17.5 * cq);
    o.textAlign = "left";

    // Bottom-up layout
    let cursor = ly + lh - 6 * cq;
    o.font = `500 ${4.4 * cq}px ${sans}`;
    o.fillText(hex.toUpperCase(), lx + pad, cursor);
    o.textAlign = "right";
    o.fillText((label.size ?? "MADE BY YOU").toUpperCase(), lx + lw - pad, cursor);
    o.textAlign = "left";
    cursor -= 5 * cq;
    o.fillStyle = "rgba(23,23,26,0.15)";
    o.fillRect(lx + pad, cursor, lw - pad * 2, Math.max(1, 0.4 * cq));
    cursor -= 4 * cq;
    if (label.message) {
      o.fillStyle = "#4a4a52";
      o.font = `400 ${5.2 * cq}px ${sans}`;
      wrap(o, label.message, lw - pad * 2, 2).reverse().forEach((line) => {
        o.fillText(line, lx + pad, cursor);
        cursor -= 6.6 * cq;
      });
      cursor -= 1 * cq;
    }
    const name = label.name.trim() || "Your colour";
    const size = (name.length > 14 ? 11.5 : 15) * cq;
    o.fillStyle = "#17171a";
    o.font = `italic 400 ${size}px ${serif}`;
    wrap(o, name, lw - pad * 2, 2).reverse().forEach((line) => {
      o.fillText(line, lx + pad, cursor);
      cursor -= size * 0.95;
    });
    o.fillStyle = hex;
    roundRect(o, lx + pad, cursor - 0.6 * cq, 22 * cq, 1.4 * cq, cq);
  }
  ctx.drawImage(off, x, y);
  return height;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number, maxLines: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > max && line) {
      lines.push(line);
      line = w;
    } else line = t;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "…");
  }
  return lines;
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}
