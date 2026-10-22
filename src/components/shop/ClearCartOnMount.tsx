"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { useHydrated } from "@/components/layout/Providers";

export function ClearCartOnMount() {
  const hydrated = useHydrated();
  useEffect(() => {
    if (hydrated) useCart.getState().clear();
  }, [hydrated]);
  return null;
}
