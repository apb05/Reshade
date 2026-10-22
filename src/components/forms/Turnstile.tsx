"use client";

import { useEffect, useRef } from "react";
import { useServerFlags } from "@/components/layout/Providers";

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; remove: (id: string) => void };
  }
}

/** Renders Cloudflare Turnstile only when it has been configured. */
export function Turnstile({ onToken }: { onToken: (token: string | undefined) => void }) {
  const { turnstileSiteKey } = useServerFlags();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!turnstileSiteKey || !ref.current) return;
    let widgetId: string | undefined;
    const el = ref.current;
    const render = () => {
      if (window.turnstile && el && !widgetId) {
        widgetId = window.turnstile.render(el, { sitekey: turnstileSiteKey, callback: onToken, "expired-callback": () => onToken(undefined), theme: "light" });
      }
    };
    if (window.turnstile) render();
    else {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    }
    return () => {
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [turnstileSiteKey, onToken]);
  if (!turnstileSiteKey) return null;
  return <div ref={ref} />;
}
