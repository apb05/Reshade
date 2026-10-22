"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { hexToHsv, hsvToHex, type HSV } from "@/lib/colour";

export const STORY_CATEGORIES = [
  { id: "memory", label: "A favourite memory" },
  { id: "person", label: "A person who inspires me" },
  { id: "occasion", label: "A special occasion" },
  { id: "place", label: "A place I love" },
  { id: "identity", label: "My creative identity" },
  { id: "love", label: "Just because I love this colour" },
] as const;
export type StoryCategory = (typeof STORY_CATEGORIES)[number]["id"];

export const LIMITS = { name: 28, message: 60, story: 160 } as const;

export type Creation = {
  id: string;
  hex: string;
  name: string;
  message: string;
  storyCategory: StoryCategory | null;
  story: string;
  createdAt: string;
  updatedAt: string;
};

export const DEFAULT_HSV: HSV = { h: 352, s: 0.62, v: 0.95 };

type StudioState = {
  hsv: HSV;
  name: string;
  message: string;
  storyCategory: StoryCategory | null;
  story: string;
  step: number;
  variantId: string | null;
  qty: number;
  /** When personalising an existing catalogue paint */
  productId: string | null;
  /** Id of the collection item currently being edited, if any */
  editingId: string | null;
  favourites: string[];
  setHsv: (hsv: HSV) => void;
  setName: (v: string) => void;
  setMessage: (v: string) => void;
  setStoryCategory: (v: StoryCategory | null) => void;
  setStory: (v: string) => void;
  setStep: (n: number) => void;
  setVariant: (id: string | null) => void;
  setQty: (n: number) => void;
  setProduct: (id: string | null) => void;
  toggleFavourite: (hex: string) => void;
  loadCreation: (c: Creation) => void;
  resetColour: () => void;
  resetAll: () => void;
};

const blank = {
  hsv: DEFAULT_HSV,
  name: "",
  message: "",
  storyCategory: null,
  story: "",
  step: 0,
  variantId: null,
  qty: 1,
  productId: null,
  editingId: null,
};

export const useStudio = create<StudioState>()(
  persist(
    (set) => ({
      ...blank,
      favourites: [],
      setHsv: (hsv) => set({ hsv }),
      setName: (name) => set({ name: name.slice(0, LIMITS.name) }),
      setMessage: (message) => set({ message: message.slice(0, LIMITS.message) }),
      setStoryCategory: (storyCategory) => set({ storyCategory }),
      setStory: (story) => set({ story: story.slice(0, LIMITS.story) }),
      setStep: (step) => set({ step }),
      setVariant: (variantId) => set({ variantId }),
      setQty: (qty) => set({ qty: Math.max(1, Math.min(99, Math.round(qty) || 1)) }),
      setProduct: (productId) => set({ productId }),
      toggleFavourite: (hex) =>
        set((s) => ({
          favourites: s.favourites.includes(hex) ? s.favourites.filter((f) => f !== hex) : [hex, ...s.favourites].slice(0, 16),
        })),
      loadCreation: (c) =>
        set({
          hsv: hexHsv(c.hex),
          name: c.name,
          message: c.message,
          storyCategory: c.storyCategory,
          story: c.story,
          editingId: c.id,
          productId: null,
          step: 0,
        }),
      resetColour: () => set({ hsv: DEFAULT_HSV }),
      resetAll: () => set({ ...blank }),
    }),
    {
      name: "reshade-studio",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

function hexHsv(hex: string): HSV {
  return hexToHsv(hex) ?? DEFAULT_HSV;
}

export const useCurrentHex = () => useStudio((s) => hsvToHex(s.hsv));
