import { getShopConfig } from "@/data/catalogue";

export function DemoBanner() {
  if (getShopConfig().mode !== "demo") return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[55] bg-red py-1.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white">
      Shop demo mode — test products &amp; test prices only. No real orders.
    </div>
  );
}
