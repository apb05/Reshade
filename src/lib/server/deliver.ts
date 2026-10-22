import "server-only";
import { createHmac } from "node:crypto";

export class DeliveryNotConfigured extends Error {}

export type Submission = {
  kind: "partner-inquiry" | "contact" | "colour-request";
  subject: string;
  replyTo: string;
  fields: Record<string, string | number | boolean | string[]>;
};

export const deliveryConfigured = () =>
  Boolean(process.env.INQUIRY_WEBHOOK_URL || (process.env.RESEND_API_KEY && process.env.INQUIRY_TO_EMAIL && process.env.INQUIRY_FROM_EMAIL));

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const show = (v: Submission["fields"][string]) => (Array.isArray(v) ? v.join(", ") : String(v));

/**
 * Delivers a validated submission to every configured channel.
 * Succeeds only if at least one channel accepted it — the UI never
 * shows a success message for an inquiry that wasn't delivered.
 */
export async function deliver(sub: Submission) {
  if (!deliveryConfigured()) throw new DeliveryNotConfigured();
  const payload = { ...sub, receivedAt: new Date().toISOString(), source: "reshade-website" };
  const tasks: Promise<void>[] = [];

  if (process.env.INQUIRY_WEBHOOK_URL) {
    const body = JSON.stringify(payload);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.INQUIRY_WEBHOOK_SECRET) headers["X-ReShade-Signature"] = createHmac("sha256", process.env.INQUIRY_WEBHOOK_SECRET).update(body).digest("hex");
    tasks.push(
      fetch(process.env.INQUIRY_WEBHOOK_URL, { method: "POST", headers, body, signal: AbortSignal.timeout(10_000) }).then((r) => {
        if (!r.ok) throw new Error(`Webhook responded ${r.status}`);
      }),
    );
  }

  if (process.env.RESEND_API_KEY && process.env.INQUIRY_TO_EMAIL && process.env.INQUIRY_FROM_EMAIL) {
    const rows = Object.entries(sub.fields)
      .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#555;vertical-align:top"><b>${esc(k)}</b></td><td style="padding:6px 12px">${esc(show(v)).replace(/\n/g, "<br>")}</td></tr>`)
      .join("");
    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.INQUIRY_FROM_EMAIL,
          to: process.env.INQUIRY_TO_EMAIL.split(",").map((s) => s.trim()),
          reply_to: sub.replyTo,
          subject: `[ReShade] ${sub.subject}`,
          html: `<h2 style="font-family:sans-serif">${esc(sub.subject)}</h2><table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows}</table>`,
          text: Object.entries(sub.fields).map(([k, v]) => `${k}: ${show(v)}`).join("\n"),
        }),
        signal: AbortSignal.timeout(10_000),
      }).then((r) => {
        if (!r.ok) throw new Error(`Resend responded ${r.status}`);
      }),
    );
  }

  const results = await Promise.allSettled(tasks);
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  failures.forEach((f) => console.error("[deliver]", sub.kind, f.reason));
  if (failures.length === results.length) throw new Error("All delivery channels failed");
}
