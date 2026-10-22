"use client";

import { useState } from "react";
import { colourRequestSchema } from "@/lib/schemas";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { TextField, TextArea, Consent, Honeypot, FormStatus } from "@/components/forms/Fields";
import { Turnstile } from "@/components/forms/Turnstile";
import { SuccessPanel } from "@/components/forms/SuccessPanel";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { PaintBottle } from "@/components/shop/PaintBottle";
import { QtyStepper } from "@/components/layout/CartDrawer";

export function ColourRequestDialog({ open, onClose, hex, colourName, message, story }: { open: boolean; onClose: () => void; hex: string; colourName: string; message: string; story: string }) {
  const [qty, setQty] = useState(1);
  const [includeStory, setIncludeStory] = useState(false);
  const { submit, errors, state, clearError, reset, setTurnstileToken } = useFormSubmit("/api/colour-request", colourRequestSchema);
  const close = () => {
    onClose();
    if (state.kind === "success") reset();
  };

  return (
    <Dialog open={open} onClose={close} title={state.kind === "success" ? "Request sent" : "Request this custom shade"}>
      {state.kind === "success" ? (
        <SuccessPanel title={`${colourName || hex} is on its way to our team.`}>
          We’ll review whether this shade can be made from recovered cosmetic pigments and email you with what’s possible. Nothing is charged unless you later confirm an order.
        </SuccessPanel>
      ) : (
        <form
          noValidate
          className="relative space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            submit(
              {
                name: fd.get("name"),
                email: fd.get("email"),
                colourName,
                hex,
                quantity: qty,
                notes: [message ? `Label message: “${message}”` : "", String(fd.get("notes") ?? "")].filter(Boolean).join("\n"),
                includeStory,
                story: includeStory ? story : "",
                consent: fd.get("consent") === "on",
              },
              String(fd.get("fax") ?? ""),
            );
          }}
        >
          <Honeypot />
          <div className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink/5">
            <div className="w-14 shrink-0"><PaintBottle hex={hex} shadow={false} label={{ name: colourName, message }} /></div>
            <div className="min-w-0">
              <p className="truncate font-serif text-2xl italic">{colourName || "Untitled shade"}</p>
              <p className="font-mono text-sm text-ink-soft">{hex}</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Your name" name="name" required autoComplete="name" error={errors.name} onInput={() => clearError("name")} />
            <TextField label="Email" name="email" type="email" required autoComplete="email" error={errors.email} onInput={() => clearError("email")} />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">How many bottles would you like?</p>
            <QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, Math.min(99, n)))} label="Bottles requested" />
          </div>
          <TextArea label="Anything else we should know?" name="notes" rows={3} maxLength={800} placeholder="Finish, intended surface, deadline…" />
          {story && (
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-cream p-4 text-sm">
              <input type="checkbox" checked={includeStory} onChange={(e) => setIncludeStory(e.target.checked)} className="mt-0.5 size-5 accent-[#00265c]" />
              <span>
                Include my colour story with this request <span className="text-ink-soft">(optional)</span>
                <span className="mt-1 block font-serif text-lg italic text-ink-soft">“{story}”</span>
              </span>
            </label>
          )}
          <Consent error={errors.consent} onInput={() => clearError("consent")}>
            I agree that ReShade may contact me about this colour request.
          </Consent>
          <Turnstile onToken={setTurnstileToken} />
          <FormStatus state={state} />
          <Button type="submit" variant="primary" size="lg" arrow className="w-full" disabled={state.kind === "submitting"}>
            {state.kind === "submitting" ? "Sending…" : "Send my colour request"}
          </Button>
          <p className="text-center text-xs text-ink-soft">This is a request, not an order. No payment is taken.</p>
        </form>
      )}
    </Dialog>
  );
}
