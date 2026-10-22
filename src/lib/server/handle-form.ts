import "server-only";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { fieldErrors } from "@/lib/schemas";
import { guard } from "@/lib/server/guard";
import { deliver, DeliveryNotConfigured, type Submission } from "@/lib/server/deliver";

/** Shared request pipeline: parse → spam guard → validate → deliver. */
export async function handleForm<S extends z.ZodType>(req: Request, schema: S, toSubmission: (data: z.output<S>) => Submission) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Unsupported content type." }, { status: 415 });
  }
  const text = await req.text();
  if (text.length > 20_000) return NextResponse.json({ error: "Submission too large." }, { status: 413 });
  let body: { data?: unknown; guard?: unknown };
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const g = await guard(req, body.guard);
  if (!g.ok) return g.silent ? NextResponse.json({ ok: true }) : NextResponse.json({ error: g.error }, { status: g.status });

  const parsed = schema.safeParse(body.data);
  if (!parsed.success) return NextResponse.json({ error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) }, { status: 422 });

  try {
    await deliver(toSubmission(parsed.data));
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof DeliveryNotConfigured) {
      return NextResponse.json(
        { error: "This form isn’t connected to an inbox yet, so your message was not sent. Please try again later.", code: "not_configured" },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "We couldn’t deliver your message right now. Please try again shortly." }, { status: 502 });
  }
}
