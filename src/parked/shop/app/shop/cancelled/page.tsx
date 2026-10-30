import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Checkout cancelled", robots: { index: false } };

export default function CancelledPage() {
  return (
    <section className="grain grid min-h-[80dvh] place-items-center bg-cream px-6 pt-28 text-center">
      <div className="max-w-xl">
        <p className="eyebrow text-red">Checkout cancelled</p>
        <h1 className="mt-4 font-display text-display font-extrabold text-navy">Your colours are still here.</h1>
        <p className="mt-4 text-lede text-ink-soft">No payment was taken. Your cart and creations are saved on this device whenever you’re ready.</p>
        <div className="mt-8"><LinkButton href="/shop" variant="navy" arrow>Return to the studio</LinkButton></div>
      </div>
    </section>
  );
}
