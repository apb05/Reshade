/**
 * Colour-availability rules for the custom colour studio.
 *
 * The digital wheel can show ~16.7 million colours. ReShade's paints are made
 * from recovered cosmetic pigments, and the presentations note that quality,
 * consistency and colour range are still being validated. So a digital colour
 * is never assumed to be producible.
 *
 *  • "available"   — matches a formulation ReShade has confirmed it can make,
 *                    with confirmed sizes and prices → can be bought.
 *  • "request"     — needs a feasibility review → "Request This Custom Shade".
 *  • "unavailable" — matches a rule ReShade has set for shades it cannot make.
 *
 * By default there are NO confirmed formulations and NO exclusion rules, so
 * every custom shade goes to the request path. Add entries as the team
 * validates them.
 */
import { deltaE, hexToHsv, type HSV } from "@/lib/colour";
import { getShopConfig, type Product } from "@/data/catalogue";

export type Availability = "available" | "request" | "unavailable";

export type Formulation = {
  id: string;
  name: string;
  hex: string;
  /** Max CIE76 ΔE from `hex` that still counts as this formulation (≈2.3 is a just-noticeable difference). */
  tolerance: number;
};

export type ExclusionRule = { id: string; reason: string; test: (c: HSV) => boolean };

/** Confirmed, producible custom formulations. Empty until ReShade confirms some. */
const CONFIRMED_FORMULATIONS: Formulation[] = [];

/** Shades ReShade has confirmed it cannot currently produce. Empty by default. */
const EXCLUSION_RULES: ExclusionRule[] = [
  // Example (uncomment once validated by the product team):
  // { id: "fluorescent", reason: "Fluorescent shades can’t yet be made from recovered pigments.", test: (c) => c.s > 0.97 && c.v > 0.97 },
];

/** Demo-only rule so the "unavailable" state can be tested. */
const DEMO_EXCLUSIONS: ExclusionRule[] = [
  { id: "demo-neon", reason: "TEST RULE: ultra-saturated neon shades are flagged unavailable in demo mode.", test: (c) => c.s > 0.95 && c.v > 0.95 },
];

export type AvailabilityResult = {
  status: Availability;
  reason: string;
  /** When available, the catalogue product or formulation it matched. */
  match?: { kind: "product"; product: Product } | { kind: "formulation"; formulation: Formulation };
};

export function checkAvailability(hex: string): AvailabilityResult {
  const config = getShopConfig();
  const hsv = hexToHsv(hex);
  if (!hsv) return { status: "request", reason: "Enter a valid colour." };

  const rules = config.mode === "demo" ? [...EXCLUSION_RULES, ...DEMO_EXCLUSIONS] : EXCLUSION_RULES;
  const blocked = rules.find((r) => r.test(hsv));
  if (blocked) return { status: "unavailable", reason: blocked.reason };

  const formulation = CONFIRMED_FORMULATIONS.find((f) => deltaE(f.hex, hex) <= f.tolerance);
  if (formulation && config.customShadeVariants.some((v) => v.priceCents != null)) {
    return { status: "available", reason: `Matches our confirmed ${formulation.name} formulation.`, match: { kind: "formulation", formulation } };
  }

  // A shade visually indistinguishable from an existing purchasable catalogue paint
  const product = config.products.find(
    (p) => p.status === "available" && p.availability !== "sold_out" && p.personalisation.label && deltaE(p.hex, hex) <= 3,
  );
  if (product) {
    return { status: "available", reason: `This is our ${product.name} — available to personalise.`, match: { kind: "product", product } };
  }

  return {
    status: "request",
    reason: "This shade needs a feasibility review before it can be made from recovered pigments.",
  };
}
