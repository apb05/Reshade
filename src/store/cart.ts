"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartLine = {
  key: string;
  /** Catalogue product id, or "custom" for a confirmed custom formulation */
  productId: string;
  variantId: string;
  qty: number;
  hex: string;
  /** Paint name: the customer's own name for personalised lines, otherwise the catalogue name */
  name: string;
  message: string;
  personalised: boolean;
};

type CartState = {
  lines: CartLine[];
  open: boolean;
  lastAdded: CartLine | null;
  add: (line: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  dismissAdded: () => void;
};

const lineKey = (l: Omit<CartLine, "key" | "qty">) => [l.productId, l.variantId, l.hex, l.name, l.message].join("|");

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      open: false,
      lastAdded: null,
      add: (line) => {
        const key = lineKey(line);
        const existing = get().lines.find((l) => l.key === key);
        const lines = existing
          ? get().lines.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + line.qty) } : l))
          : [...get().lines, { ...line, key }];
        set({ lines, lastAdded: { ...line, key } });
      },
      setQty: (key, qty) =>
        set({ lines: get().lines.map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(99, Math.round(qty) || 1)) } : l)) }),
      remove: (key) => set({ lines: get().lines.filter((l) => l.key !== key) }),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open, lastAdded: open ? null : get().lastAdded }),
      dismissAdded: () => set({ lastAdded: null }),
    }),
    {
      name: "reshade-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
);
