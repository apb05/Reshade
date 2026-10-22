"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Creation } from "@/store/studio";

type CollectionState = {
  items: Creation[];
  save: (c: Omit<Creation, "id" | "createdAt" | "updatedAt">, id?: string | null) => string;
  rename: (id: string, name: string) => void;
  duplicate: (id: string) => void;
  remove: (id: string) => void;
};

const uid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now() + Math.random()));

export const useCollection = create<CollectionState>()(
  persist(
    (set, get) => ({
      items: [],
      save: (c, id) => {
        const now = new Date().toISOString();
        const existing = id ? get().items.find((i) => i.id === id) : undefined;
        if (existing) {
          set({ items: get().items.map((i) => (i.id === id ? { ...i, ...c, updatedAt: now } : i)) });
          return existing.id;
        }
        const created: Creation = { ...c, id: uid(), createdAt: now, updatedAt: now };
        set({ items: [created, ...get().items].slice(0, 60) });
        return created.id;
      },
      rename: (id, name) =>
        set({ items: get().items.map((i) => (i.id === id ? { ...i, name: name.slice(0, 28), updatedAt: new Date().toISOString() } : i)) }),
      duplicate: (id) => {
        const src = get().items.find((i) => i.id === id);
        if (!src) return;
        const now = new Date().toISOString();
        const copy: Creation = { ...src, id: uid(), name: `${src.name || "Untitled"} (copy)`.slice(0, 28), createdAt: now, updatedAt: now };
        const idx = get().items.findIndex((i) => i.id === id);
        const items = [...get().items];
        items.splice(idx + 1, 0, copy);
        set({ items });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
    }),
    { name: "reshade-collection", version: 1, storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
