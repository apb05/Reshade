"use client";

import { hsvToHex } from "@/lib/colour";
import { useStudio } from "@/store/studio";
import { PaintCanvas } from "@/components/shop/PaintCanvas";
import { ColourHarmony } from "@/components/shop/ColourHarmony";

export function StudioCanvas() {
  const hsv = useStudio((s) => s.hsv);
  return <PaintCanvas hsv={hsv} hex={hsvToHex(hsv)} />;
}

export function StudioHarmony() {
  return <ColourHarmony />;
}

export function CurrentSwatch() {
  const hex = useStudio((s) => hsvToHex(s.hsv));
  const name = useStudio((s) => s.name);
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium ring-1 ring-ink/10">
      <span aria-hidden className="size-4 rounded-full transition-colors" style={{ background: hex }} />
      {name || hex}
    </span>
  );
}
