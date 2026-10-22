"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { drawBottle, fontFamily, loadBottleImages } from "@/lib/bottle-canvas";

const W = 1080;
const H = 1350;

/**
 * Builds a 4:5 social image entirely on the device. Name is included by
 * default; personal message and colour story are opt-in, never automatic.
 */
export function ShareDialog({ open, onClose, hex, name, message, story }: { open: boolean; onClose: () => void; hex: string; name: string; message: string; story: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [opts, setOpts] = useState({ name: true, message: false, story: false });
  const renderKey = JSON.stringify([hex, name, message, story, opts]);
  const [readyKey, setReadyKey] = useState("");
  const ready = readyKey === renderKey;
  const [note, setNote] = useState("");
  const [canShareFiles, setCanShareFiles] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const [imgs] = await Promise.all([loadBottleImages(), document.fonts?.ready]);
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;
      const ctx = canvas.getContext("2d")!;
      render(ctx, imgs, hex, opts.name ? name : "", opts.message ? message : "", opts.story ? story : "");
      setReadyKey(renderKey);
      try {
        const probe = new File([new Blob()], "x.png", { type: "image/png" });
        setCanShareFiles(Boolean(navigator.canShare?.({ files: [probe] })));
      } catch {
        setCanShareFiles(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, hex, name, message, story, opts, renderKey]);

  const fileName = `reshade-${(name || hex).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "colour"}.png`;
  const toBlob = () => new Promise<Blob | null>((r) => canvasRef.current?.toBlob(r, "image/png"));

  const download = async () => {
    const blob = await toBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setNote("Image downloaded.");
  };

  const share = async () => {
    const blob = await toBlob();
    if (!blob) return;
    try {
      await navigator.share({ files: [new File([blob], fileName, { type: "image/png" })], title: name || "My ReShade colour", text: "Your Colour. Your Creation. — ReShade" });
    } catch (e) {
      if ((e as Error).name !== "AbortError") setNote("Sharing isn’t supported here — try downloading instead.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Share my colour" wide>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="relative overflow-hidden rounded-2xl bg-cream ring-1 ring-ink/5">
          <canvas ref={canvasRef} width={W} height={H} className={`block h-auto w-full transition-opacity ${ready ? "opacity-100" : "opacity-0"}`} role="img" aria-label="Preview of your shareable colour card" />
          {!ready && <p className="absolute inset-0 grid place-items-center text-sm text-ink-soft">Creating your image…</p>}
        </div>
        <div className="flex flex-col">
          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-semibold">Choose what to include</legend>
            {(
              [
                { key: "name", label: "Colour name", value: name, disabled: !name },
                { key: "message", label: "Personal message", value: message, disabled: !message },
                { key: "story", label: "Colour story", value: story, disabled: !story },
              ] as const
            ).map((o) => (
              <label key={o.key} className={`flex items-start gap-3 rounded-2xl bg-white p-3.5 text-sm ring-1 ring-ink/5 ${o.disabled ? "opacity-50" : "cursor-pointer"}`}>
                <input type="checkbox" className="mt-0.5 size-5 accent-[#00265c]" disabled={o.disabled} checked={opts[o.key] && !o.disabled} onChange={(e) => setOpts((p) => ({ ...p, [o.key]: e.target.checked }))} />
                <span className="min-w-0">
                  <span className="font-semibold">{o.label}</span>
                  <span className="block truncate text-ink-soft">{o.value || "Not added"}</span>
                </span>
              </label>
            ))}
          </fieldset>
          <p className="mt-3 text-xs text-ink-soft">Your message and story are private by default. The image is generated on your device and isn’t uploaded anywhere.</p>
          <div className="mt-auto flex flex-col gap-2 pt-6">
            {canShareFiles && <Button variant="navy" onClick={share} disabled={!ready}>Share…</Button>}
            <Button variant="primary" onClick={download} disabled={!ready} arrow>Download image</Button>
            <p aria-live="polite" className="min-h-5 text-center text-sm text-green">{note}</p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

function render(ctx: CanvasRenderingContext2D, imgs: Awaited<ReturnType<typeof loadBottleImages>>, hex: string, name: string, message: string, story: string) {
  const serif = fontFamily("--font-instrument", "Georgia, serif");
  const display = fontFamily("--font-bricolage", "sans-serif");
  const sans = fontFamily("--font-inter", "sans-serif");
  ctx.clearRect(0, 0, W, H);

  // Warm paper ground with a colour wash
  ctx.fillStyle = "#f6f1e7";
  ctx.fillRect(0, 0, W, H);
  const wash = ctx.createRadialGradient(W * 0.3, H * 0.42, 50, W * 0.3, H * 0.42, W * 0.9);
  wash.addColorStop(0, hex + "55");
  wash.addColorStop(1, hex + "00");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, W, H);

  // Brush sweep
  ctx.save();
  ctx.strokeStyle = hex;
  ctx.lineCap = "round";
  for (let i = 0; i < 70; i++) {
    const off = (i / 70 - 0.5) * 230;
    ctx.globalAlpha = 0.25 + ((i * 37) % 10) / 16;
    ctx.lineWidth = 2 + ((i * 13) % 7);
    ctx.beginPath();
    ctx.moveTo(-40, 820 + off);
    ctx.bezierCurveTo(300, 640 + off, 640, 960 + off, 1120, 700 + off * 0.8);
    ctx.stroke();
  }
  ctx.restore();

  // Bottle
  const bw = 360;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 30;
  drawBottle(ctx, imgs, hex, 110, 300, bw, { name, message, size: null });
  ctx.restore();

  // Top brand bar
  ctx.drawImage(imgs.logo, 80, 70, 130, 130);
  ctx.fillStyle = "#00265c";
  ctx.font = `600 22px ${sans}`;
  ctx.textAlign = "right";
  ctx.fillText("RESHADE COLOURS", W - 80, 120);
  ctx.fillStyle = "#4a4a52";
  ctx.font = `400 22px ${sans}`;
  ctx.fillText("Paint from repurposed cosmetic pigments", W - 80, 156);
  ctx.textAlign = "left";

  // Right column text
  const x = 560;
  let y = 470;
  ctx.fillStyle = "#4a4a52";
  ctx.font = `600 22px ${sans}`;
  ctx.fillText("MY COLOUR", x, y);
  y += 30;
  ctx.fillStyle = "#17171a";
  const title = name || "A shade of my own";
  let size = 112;
  ctx.font = `italic 400 ${size}px ${serif}`;
  const lines = wrapLines(ctx, title, W - x - 70);
  if (lines.length > 2) {
    size = 84;
    ctx.font = `italic 400 ${size}px ${serif}`;
  }
  for (const l of wrapLines(ctx, title, W - x - 70).slice(0, 3)) {
    y += size * 0.92;
    ctx.fillText(l, x, y);
  }
  y += 50;
  ctx.fillStyle = hex;
  ctx.beginPath();
  ctx.roundRect(x, y, 64, 64, 32);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#17171a";
  ctx.font = `500 34px ui-monospace, Menlo, monospace`;
  ctx.fillText(hex, x + 84, y + 44);
  y += 110;
  if (story) {
    ctx.fillStyle = "#17171a";
    ctx.font = `italic 400 40px ${serif}`;
    for (const l of wrapLines(ctx, `“${story}”`, W - x - 70).slice(0, 5)) {
      ctx.fillText(l, x, y);
      y += 46;
    }
  }

  // Footer tagline band
  ctx.fillStyle = "#00265c";
  ctx.fillRect(0, H - 170, W, 170);
  const bands = ["#d00000", "#f8bc24", "#007c20"];
  bands.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect((W / 3) * i, H - 170, W / 3, 10);
  });
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 64px ${display}`;
  ctx.fillText("Your Colour.", 80, H - 72);
  ctx.fillStyle = "#f8bc24";
  const w1 = ctx.measureText("Your Colour. ").width;
  ctx.fillText("Your Creation.", 80 + w1, H - 72);
  ctx.fillStyle = "rgba(23,23,26,0.5)";
  ctx.font = `400 20px ${sans}`;
  ctx.textAlign = "right";
  ctx.fillText("Digital colour preview — physical paint may vary", W - 80, H - 200);
  ctx.textAlign = "left";
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, max: number) {
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
  return lines;
}
