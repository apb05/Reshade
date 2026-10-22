import "server-only";
import { guardSchema } from "@/lib/schemas";

const MIN_FILL_MS = 2500;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export type GuardResult = { ok: true } | { ok: false; status: number; error: string; silent?: boolean };

/**
 * Layered spam protection for public forms:
 *  1. honeypot field humans never see
 *  2. minimum fill time (bots submit instantly)
 *  3. per-IP rate limit (in-memory; use a shared store such as Upstash/Redis for multi-instance hosting)
 *  4. Cloudflare Turnstile verification when TURNSTILE_SECRET_KEY is configured
 */
export async function guard(req: Request, raw: unknown): Promise<GuardResult> {
  const parsed = guardSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, status: 400, error: "Invalid submission." };
  const { fax, startedAt, turnstileToken } = parsed.data;

  // Pretend success to bots so they don't adapt, but deliver nothing.
  if (fax) return { ok: false, status: 200, error: "", silent: true };
  if (Date.now() - startedAt < MIN_FILL_MS) return { ok: false, status: 200, error: "", silent: true };

  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "local").trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return { ok: false, status: 429, error: "Too many submissions — please try again in a few minutes." };
  recent.push(now);
  hits.set(ip, recent);

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (secret && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    if (!turnstileToken) return { ok: false, status: 400, error: "Please complete the verification check." };
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: turnstileToken, remoteip: ip }),
    }).catch(() => null);
    const data = (await res?.json().catch(() => null)) as { success?: boolean } | null;
    if (!data?.success) return { ok: false, status: 400, error: "Verification failed — please try again." };
  }
  return { ok: true };
}
