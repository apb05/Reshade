"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { getShopConfig, formatPrice, isPurchasable, type Product } from "@/data/catalogue";
import { hexToHsv, type ColourFamily } from "@/lib/colour";
import { useStudio } from "@/store/studio";
import { useCart } from "@/store/cart";
import { PaintBottle } from "@/components/shop/PaintBottle";
import { Button } from "@/components/ui/Button";

const config = getShopConfig();
const FAMILY_LABEL: Record<ColourFamily, string> = {
  reds: "Reds", pinks: "Pinks", oranges: "Oranges", yellows: "Yellows", greens: "Greens", blues: "Blues", purples: "Purples", neutrals: "Neutrals", browns: "Browns",
};
const AVAILABILITY: Record<Product["availability"], { label: string; cls: string }> = {
  in_stock: { label: "In stock", cls: "bg-green-soft text-green" },
  limited: { label: "Limited", cls: "bg-yellow-soft text-navy" },
  sold_out: { label: "Sold out", cls: "bg-red-soft text-red" },
  not_for_sale: { label: "In development · Not for sale", cls: "bg-ink/5 text-ink-soft" },
};

export function ProductGallery() {
  const [filter, setFilter] = useState<ColourFamily | "all">("all");
  const families = useMemo(() => [...new Set(config.products.map((p) => p.family))], []);
  const products = config.products.filter((p) => filter === "all" || p.family === filter);
  const hasDevelopment = config.products.some((p) => p.status === "development");

  return (
    <div>
      {hasDevelopment && (
        <p className="mb-8 max-w-3xl rounded-2xl border-l-4 border-yellow bg-white/70 px-5 py-4 text-sm text-ink-soft">
          <strong className="text-ink">These are development examples.</strong> They show real prototype shades from ReShade’s paint development and can’t be purchased yet. Sizes, prices and availability will appear here once the catalogue is confirmed.
        </p>
      )}
      <div role="group" aria-label="Filter by colour family" className="no-scrollbar -mx-1 mb-8 flex gap-2 overflow-x-auto px-1 pb-1">
        {(["all", ...families] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${filter === f ? "bg-navy text-white" : "bg-white text-ink-soft ring-1 ring-ink/10 hover:text-navy hover:ring-navy/30"}`}
          >
            {f === "all" ? "All colours" : FAMILY_LABEL[f]}
          </button>
        ))}
      </div>
      <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {products.map((p) => (
            <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35 }}>
              <ProductCard product={p} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const [variantId, setVariantId] = useState(p.variants[0]?.id ?? "");
  const variant = p.variants.find((v) => v.id === variantId) ?? p.variants[0];
  const add = useCart((s) => s.add);
  const purchasable = isPurchasable(p);
  const canPersonalise = purchasable && p.personalisation.label;

  const openInStudio = () => {
    const hsv = hexToHsv(p.hex);
    if (!hsv) return;
    useStudio.setState({ hsv, productId: p.id, step: canPersonalise ? 1 : 0, editingId: null, name: "", message: "" });
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_50px_-32px_rgba(0,24,56,0.45)] transition-shadow duration-500 hover:shadow-[0_30px_70px_-30px_rgba(0,24,56,0.5)]">
      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: `linear-gradient(160deg, color-mix(in oklab, ${p.hex} 18%, #fbf8f2), color-mix(in oklab, ${p.hex} 38%, #f6f1e7))` }}>
        <div className="absolute inset-x-0 bottom-[7%] top-[8%] flex justify-center transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2 group-hover:scale-[1.03]">
          {p.photo ? (
            <Image src={p.photo.src} alt={p.photo.alt} width={444} height={882} className="h-full w-auto object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.3)]" sizes="(min-width: 1024px) 15vw, 40vw" />
          ) : (
            <PaintBottle hex={p.hex} className="h-full w-auto" alt={`ReShade bottle in ${p.name} (${p.hex}), digitally coloured preview`} />
          )}
        </div>
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[0.7rem] font-semibold ${AVAILABILITY[p.availability].cls}`}>{AVAILABILITY[p.availability].label}</span>
        {!p.photo && <span className="absolute bottom-3 right-3 rounded-full bg-white/75 px-2.5 py-1 text-[0.65rem] font-medium text-ink-soft">Digital preview</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <span aria-hidden className="size-6 shrink-0 rounded-full ring-1 ring-black/10" style={{ background: p.hex }} />
          <h3 className="font-display text-xl font-bold">{p.name}</h3>
        </div>
        <p className="mt-1 font-mono text-xs text-ink-soft">{p.hex}</p>
        <p className="mt-3 text-sm text-ink-soft">{p.description}</p>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div><dt className="text-xs text-ink-soft">Size</dt><dd className="font-medium">{variant?.size ?? "To be confirmed"}</dd></div>
          <div><dt className="text-xs text-ink-soft">Price</dt><dd className="font-medium">{formatPrice(variant?.priceCents ?? null, config.currency)}</dd></div>
        </dl>
        <div className="mt-auto space-y-2 pt-5">
          {purchasable && variant ? (
            <>
              {p.variants.length > 1 && (
                <label className="block text-xs font-semibold">
                  <span className="sr-only">Size for {p.name}</span>
                  <select value={variantId} onChange={(e) => setVariantId(e.target.value)} className="field !py-2 text-sm">
                    {p.variants.map((v) => <option key={v.id} value={v.id}>{v.size} — {formatPrice(v.priceCents, config.currency)}</option>)}
                  </select>
                </label>
              )}
              <Button variant="navy" className="w-full" onClick={() => add({ productId: p.id, variantId: variant.id, qty: 1, hex: p.hex, name: p.name, message: "", personalised: false })}>
                Add to cart<span className="sr-only"> — {p.name}</span>
              </Button>
            </>
          ) : (
            <Button variant="navy" className="w-full" disabled>
              {p.availability === "sold_out" ? "Sold out" : "Not yet available"}
            </Button>
          )}
          <button type="button" onClick={openInStudio} className="w-full rounded-full py-2 text-sm font-semibold text-navy underline decoration-yellow decoration-[3px] underline-offset-4 transition hover:decoration-navy">
            {canPersonalise ? "Love this shade? Make it yours." : "Love this shade? Start a custom request from it."}
          </button>
        </div>
      </div>
    </article>
  );
}
