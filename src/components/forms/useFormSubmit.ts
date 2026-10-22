"use client";

import { useEffect, useRef, useState } from "react";
import type { z } from "zod";
import { fieldErrors } from "@/lib/schemas";

const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string; notConfigured?: boolean };

/**
 * Validates in the browser with the same schema the server uses, then posts.
 * Success is shown ONLY when the server confirms delivery.
 */
export function useFormSubmit<S extends z.ZodType>(endpoint: string, schema: S) {
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>();

  async function submit(data: unknown, honeypot: string) {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      setState({ kind: "error", message: "Please check the highlighted fields." });
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return false;
    }
    setErrors({});
    setState({ kind: "submitting" });
    if (STATIC_EXPORT) return submitStatic(endpoint, parsed.data, honeypot);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: parsed.data, guard: { fax: honeypot, startedAt: startedAt.current, turnstileToken } }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        setState({ kind: "success" });
        return true;
      }
      if (body.fields) setErrors(body.fields);
      setState({ kind: "error", message: body.error ?? "Something went wrong. Please try again.", notConfigured: body.code === "not_configured" });
    } catch {
      setState({ kind: "error", message: "Network error — please check your connection and try again." });
    }
    return false;
  }

  /**
   * Static hosting (GitHub Pages) has no API routes. Submissions go straight to a
   * hosted form service (e.g. Formspree) set in NEXT_PUBLIC_FORM_ENDPOINT, or —
   * if none is configured — the visitor is told plainly that nothing was sent.
   */
  async function submitStatic(apiPath: string, data: unknown, honeypot: string) {
    if (honeypot) {
      setState({ kind: "success" });
      return true;
    }
    if (!FORM_ENDPOINT) {
      setState({ kind: "error", message: "This form isn’t connected to an inbox yet, so your message was not sent. Please try again later.", notConfigured: true });
      return false;
    }
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ form: apiPath.replace("/api/", ""), ...(data as object) }),
      });
      if (res.ok) {
        setState({ kind: "success" });
        return true;
      }
      setState({ kind: "error", message: "We couldn’t deliver your message right now. Please try again shortly." });
    } catch {
      setState({ kind: "error", message: "Network error — please check your connection and try again." });
    }
    return false;
  }

  const clearError = (name: string) => errors[name] && setErrors(({ [name]: _, ...rest }) => rest);
  const reset = () => {
    setState({ kind: "idle" });
    startedAt.current = Date.now();
  };

  return { submit, errors, state, clearError, reset, setTurnstileToken };
}
