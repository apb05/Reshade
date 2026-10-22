"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCart, type CartLine } from "@/store/cart";
import { findVariant, formatPrice, getShopConfig } from "@/data/catalogue";
import { PaintBottle } from "@/components/shop/PaintBottle";
import { Button } from "@/components/ui/Button";
import { useHydrated, useServerFlags } from "@/components/layout/Providers";

const config = getShopConfig();

export function linePrice(line: CartLine) {
  const found = findVariant(config, line.productId, line.variantId);
  return { variant: found?.variant ?? null, unit: found?.variant.priceCents ?? null };
}

function QtyStepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white" role="group" aria-label={label}>
      <button type="button" className="grid size-9 place-items-center rounded-full text-lg text-navy hover:bg-navy/5 disabled:opacity-30" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        −
      </button>
      <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" className="grid size-9 place-items-center rounded-full text-lg text-navy hover:bg-navy/5 disabled:opacity-30" onClick={() => onChange(value + 1)} disabled={value >= 99} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
export { QtyStepper };

export function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, lastAdded, dismissAdded } = useCart();
  const hydrated = useHydrated();
  const { checkoutEnabled } = useServerFlags();
  const panelRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<{ kind: "idle" | "loading" | "error"; message?: string }>({ kind: "idle" });

  const priced = lines.map((l) => ({ line: l, ...linePrice(l) }));
  const allPriced = priced.length > 0 && priced.every((p) => p.unit != null);
  const subtotal = allPriced ? priced.reduce((n, p) => n + (p.unit ?? 0) * p.line.qty, 0) : null;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, setOpen]);

  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(dismissAdded, 6000);
    return () => clearTimeout(t);
  }, [lastAdded, dismissAdded]);

  async function checkout() {
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map(({ productId, variantId, qty, hex, name, message, personalised }) => ({ productId, variantId, qty, hex, name, message, personalised })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      setStatus({ kind: "error", message: data.error ?? "Checkout couldn’t start. Please try again." });
    } catch {
      setStatus({ kind: "error", message: "Network error — please check your connection and try again." });
    }
  }

  const added = lastAdded ? linePrice(lastAdded) : null;

  return (
    <>
      {/* Add-to-cart confirmation */}
      <AnimatePresence>
        {hydrated && lastAdded && !open && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-4 right-4 z-[60] w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-20px_rgba(0,24,56,0.5)]"
          >
            <div className="flex gap-4 p-4">
              <div className="relative w-16 shrink-0 rounded-2xl p-1" style={{ background: `${lastAdded.hex}22` }}>
                <PaintBottle hex={lastAdded.hex} shadow={false} label={lastAdded.personalised ? { name: lastAdded.name, size: added?.variant?.size } : null} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="eyebrow text-green">Added to your cart</p>
                <p className="mt-1 truncate font-serif text-2xl italic leading-tight">{lastAdded.name}</p>
                {lastAdded.personalised && <p className="text-sm text-ink-soft">Created by you.</p>}
                <p className="mt-1 text-sm text-ink-soft">
                  {added?.variant?.size} · Qty {lastAdded.qty} · {formatPrice(added?.unit != null ? added.unit * lastAdded.qty : null, config.currency)}
                </p>
              </div>
              <button type="button" onClick={dismissAdded} className="self-start rounded-full p-1 text-ink-soft hover:bg-ink/5" aria-label="Dismiss">
                <svg aria-hidden viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            <button type="button" onClick={() => setOpen(true)} className="flex w-full items-center justify-center gap-2 bg-navy py-3 text-sm font-semibold text-white hover:bg-navy-deep">
              View cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[70]">
            <motion.div className="absolute inset-0 bg-navy-deep/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
              className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-2xl outline-none"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <h2 id="cart-title" className="font-display text-2xl font-bold">Your cart</h2>
                <button type="button" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full hover:bg-ink/5" aria-label="Close cart">
                  <svg aria-hidden viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5L5 15" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {config.mode === "demo" && (
                  <p className="mb-4 rounded-2xl bg-red-soft px-4 py-3 text-sm font-medium text-red">Demo mode: test products and test prices only. No real orders are placed.</p>
                )}
                {lines.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="font-serif text-3xl italic">Your cart is waiting for colour.</p>
                    <p className="mx-auto mt-3 max-w-xs text-ink-soft">Design a shade of your own in the colour studio, then make it yours.</p>
                    <Link href="/shop#studio" onClick={() => setOpen(false)} className="mt-6 inline-block font-semibold text-navy underline decoration-yellow decoration-4 underline-offset-4">
                      Create my paint
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-line">
                    {priced.map(({ line, variant, unit }) => (
                      <li key={line.key} className="flex gap-4 py-5">
                        <div className="w-20 shrink-0 rounded-2xl p-1.5" style={{ background: `${line.hex}1f` }}>
                          <PaintBottle hex={line.hex} shadow={false} label={line.personalised ? { name: line.name, message: line.message, size: variant?.size } : null} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate font-serif text-2xl italic leading-tight">{line.name || "Untitled shade"}</p>
                              {line.personalised && <p className="text-sm text-ink-soft">Created by you.</p>}
                            </div>
                            <button type="button" onClick={() => remove(line.key)} className="shrink-0 text-sm text-ink-soft underline underline-offset-2 hover:text-red">
                              Remove<span className="sr-only"> {line.name}</span>
                            </button>
                          </div>
                          <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
                            <span className="inline-block size-3 rounded-full ring-1 ring-black/10" style={{ background: line.hex }} />
                            {line.hex} · {variant?.size ?? "Size unavailable"}
                          </p>
                          {line.message && <p className="mt-1 text-sm italic text-ink-soft">“{line.message}”</p>}
                          <div className="mt-3 flex items-center justify-between">
                            <QtyStepper value={line.qty} onChange={(n) => setQty(line.key, n)} label={`Quantity for ${line.name}`} />
                            <span className="font-semibold">{formatPrice(unit != null ? unit * line.qty : null, config.currency)}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {lines.length > 0 && (
                <div className="border-t border-line bg-white px-6 py-5">
                  <p className="mb-4 flex items-start gap-2 text-sm text-green">
                    <span aria-hidden>●</span>
                    Your creation supports our mission to give discarded cosmetic pigments a second life.
                  </p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-ink-soft">Subtotal</span>
                    <span className="font-display text-2xl font-bold">{formatPrice(subtotal, config.currency)}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">Shipping and taxes are calculated at checkout.</p>
                  {checkoutEnabled && allPriced ? (
                    <Button variant="primary" size="lg" className="mt-4 w-full" onClick={checkout} disabled={status.kind === "loading"} arrow>
                      {status.kind === "loading" ? "Opening secure checkout…" : "Secure checkout"}
                    </Button>
                  ) : (
                    <div className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm text-ink-soft">
                      <strong className="text-ink">Checkout isn’t live yet.</strong> ReShade is still finalising its products and prices. Your cart is saved on this device.
                    </div>
                  )}
                  {status.kind === "error" && (
                    <p role="alert" className="mt-3 text-sm font-medium text-red">{status.message}</p>
                  )}
                  <p className="mt-3 text-center text-xs text-ink-soft">Payments are handled by Stripe. ReShade never sees or stores your card details.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
