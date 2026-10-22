/**
 * ReShade product catalogue — THE single place to configure what can be sold.
 *
 * ⚠️  No confirmed catalogue, sizes or prices were supplied with the source
 * presentations. Everything below is therefore marked `status: "development"`
 * with `priceCents: null`. Development products are shown so visitors can see
 * real prototype shades, but they cannot be added to the cart or bought.
 *
 * To launch a product: set `status: "available"`, give each variant a real
 * `priceCents`, and (optionally) a `stripePriceId`. Prices are re-read on the
 * server at checkout, so the browser can never change what a customer pays.
 *
 * Setting NEXT_PUBLIC_SHOP_MODE=demo swaps in the clearly-labelled TEST
 * catalogue at the bottom of this file so the cart and Stripe test checkout
 * can be exercised end to end.
 */
import type { ColourFamily } from "@/lib/colour";
import { asset } from "@/lib/asset";

export type Variant = {
  id: string;
  label: string;
  /** Customer-facing size description, e.g. "50 ml bottle" */
  size: string;
  priceCents: number | null;
  stripePriceId?: string;
};

export type Product = {
  id: string;
  name: string;
  hex: string;
  family: ColourFamily;
  description: string;
  /** Real product photo, when one exists. Otherwise the recoloured bottle render is used. */
  photo?: { src: string; alt: string };
  status: "available" | "development";
  availability: "in_stock" | "limited" | "sold_out" | "not_for_sale";
  variants: Variant[];
  /** Which personalisation services are offered for this product. */
  personalisation: { label: boolean; message: boolean };
};

export type ShopConfig = {
  mode: "live" | "demo";
  currency: string;
  products: Product[];
  /** Sizes offered for a confirmed custom-shade formulation (see colour-availability.ts). */
  customShadeVariants: Variant[];
};

const DEV_NOTE = "Prototype shade from ReShade’s product development. Not yet for sale.";

const DEVELOPMENT_PRODUCTS: Product[] = [
  {
    id: "coral-pink",
    name: "Coral Pink",
    hex: "#F2646B",
    family: "pinks",
    description: DEV_NOTE,
    photo: { src: asset("/images/bottle-pink.png"), alt: "ReShade bottle filled with coral pink paint, tied with twine and a kraft tag" },
    status: "development",
    availability: "not_for_sale",
    variants: [],
    personalisation: { label: false, message: false },
  },
  {
    id: "golden-yellow",
    name: "Golden Yellow",
    hex: "#F5BC2A",
    family: "yellows",
    description: DEV_NOTE,
    photo: { src: asset("/images/bottle-yellow.png"), alt: "ReShade bottle filled with golden yellow paint, tied with twine and a kraft tag" },
    status: "development",
    availability: "not_for_sale",
    variants: [],
    personalisation: { label: false, message: false },
  },
  { id: "deep-teal", name: "Deep Teal", hex: "#12706C", family: "greens", description: DEV_NOTE, status: "development", availability: "not_for_sale", variants: [], personalisation: { label: false, message: false } },
  { id: "ochre", name: "Ochre", hex: "#D1902A", family: "oranges", description: DEV_NOTE, status: "development", availability: "not_for_sale", variants: [], personalisation: { label: false, message: false } },
  { id: "terracotta", name: "Terracotta Red", hex: "#C9473B", family: "reds", description: DEV_NOTE, status: "development", availability: "not_for_sale", variants: [], personalisation: { label: false, message: false } },
  { id: "plum", name: "Plum", hex: "#5A2340", family: "purples", description: DEV_NOTE, status: "development", availability: "not_for_sale", variants: [], personalisation: { label: false, message: false } },
  { id: "warm-nude", name: "Warm Nude", hex: "#C99068", family: "browns", description: DEV_NOTE, status: "development", availability: "not_for_sale", variants: [], personalisation: { label: false, message: false } },
  { id: "cocoa", name: "Cocoa", hex: "#5B3A2E", family: "browns", description: DEV_NOTE, status: "development", availability: "not_for_sale", variants: [], personalisation: { label: false, message: false } },
];

/* ───────────────────────── TEST / DEMO DATA ─────────────────────────
 * Clearly fake $1–$3 prices so nobody mistakes them for real pricing.
 * Only loaded when NEXT_PUBLIC_SHOP_MODE=demo.
 * ─────────────────────────────────────────────────────────────────── */
const DEMO_VARIANTS: Variant[] = [
  { id: "demo-small", label: "Small (TEST)", size: "Test size A", priceCents: 100 },
  { id: "demo-large", label: "Large (TEST)", size: "Test size B", priceCents: 300 },
];

const DEMO_PRODUCTS: Product[] = DEVELOPMENT_PRODUCTS.map((p, i) => ({
  ...p,
  description: "TEST PRODUCT — demo mode only. Not a real ReShade listing.",
  status: "available",
  availability: i === 5 ? "sold_out" : i === 2 ? "limited" : "in_stock",
  variants: DEMO_VARIANTS.map((v) => ({ ...v, id: `${p.id}-${v.id}` })),
  personalisation: { label: true, message: i % 2 === 0 },
}));

export function getShopConfig(): ShopConfig {
  const demo = process.env.NEXT_PUBLIC_SHOP_MODE === "demo";
  return {
    mode: demo ? "demo" : "live",
    currency: (process.env.NEXT_PUBLIC_SHOP_CURRENCY || "cad").toLowerCase(),
    products: demo ? DEMO_PRODUCTS : DEVELOPMENT_PRODUCTS,
    customShadeVariants: demo ? DEMO_VARIANTS.map((v) => ({ ...v, id: `custom-${v.id}` })) : [],
  };
}

export const isPurchasable = (p: Product) =>
  p.status === "available" && p.availability !== "sold_out" && p.availability !== "not_for_sale" && p.variants.some((v) => v.priceCents != null);

export function findVariant(config: ShopConfig, productId: string, variantId: string) {
  if (productId === "custom") {
    const variant = config.customShadeVariants.find((v) => v.id === variantId);
    return variant ? { product: null, variant } : null;
  }
  const product = config.products.find((p) => p.id === productId);
  const variant = product?.variants.find((v) => v.id === variantId);
  return product && variant ? { product, variant } : null;
}

export function formatPrice(cents: number | null | undefined, currency = "cad") {
  if (cents == null) return "Price to be confirmed";
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}
