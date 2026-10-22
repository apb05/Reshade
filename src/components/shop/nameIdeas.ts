import { colourFamily, hexToHsv, type ColourFamily } from "@/lib/colour";

const WORDS: Record<ColourFamily, string[]> = {
  reds: ["Ember", "Cherry", "Poppy", "Ruby", "Lantern", "Cinnabar"],
  pinks: ["Petal", "Blush", "Rosewater", "Peony", "Sorbet", "Flamingo"],
  oranges: ["Apricot", "Marmalade", "Saffron", "Tangerine", "Copper", "Paprika"],
  yellows: ["Marigold", "Honey", "Sunbeam", "Buttercup", "Lemon", "Goldleaf"],
  greens: ["Fern", "Moss", "Juniper", "Sage", "Olive Grove", "Matcha"],
  blues: ["Harbour", "Cobalt", "Lagoon", "Denim", "Glacier", "Midnight"],
  purples: ["Violet", "Plum", "Iris", "Lilac", "Amethyst", "Heather"],
  neutrals: ["Linen", "Pebble", "Driftwood", "Ash", "Chalk", "Graphite"],
  browns: ["Cocoa", "Chestnut", "Toffee", "Cinnamon", "Walnut", "Clay"],
};
const LIGHT = ["Morning", "Soft", "Whisper", "Dawn", "Cloud"];
const DARK = ["Velvet", "Night", "Deep", "Dusk", "Storm"];
const ENDINGS = ["Bloom", "Hour", "Dream", "Garden", "Season", "Glow", "Story", "Daze"];

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export function nameIdeas(hex: string, n = 3): string[] {
  const fam = colourFamily(hex);
  const hsv = hexToHsv(hex);
  const out = new Set<string>();
  let guard = 0;
  while (out.size < n && guard++ < 40) {
    const base = pick(WORDS[fam]);
    const r = Math.random();
    if (hsv && hsv.v > 0.85 && hsv.s < 0.5 && r < 0.4) out.add(`${pick(LIGHT)} ${base}`);
    else if (hsv && hsv.v < 0.45 && r < 0.4) out.add(`${pick(DARK)} ${base}`);
    else out.add(r < 0.75 ? `${base} ${pick(ENDINGS)}` : base);
  }
  return [...out];
}
