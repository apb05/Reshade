"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { contactSchema, INQUIRY_TYPES } from "@/lib/schemas";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { TextField, TextArea, SelectField, Consent, Honeypot, FormStatus } from "@/components/forms/Fields";
import { Turnstile } from "@/components/forms/Turnstile";
import { SuccessPanel } from "@/components/forms/SuccessPanel";
import { Button } from "@/components/ui/Button";
import { PARTNER_HREF } from "@/data/site";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState("");
  const { submit, errors, state, clearError, reset, setTurnstileToken } = useFormSubmit("/api/contact", contactSchema);

  if (state.kind === "success") {
    return (
      <SuccessPanel title="Message sent." onReset={reset}>
        Thanks for reaching out — the ReShade team will reply to the email address you provided.
      </SuccessPanel>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ok = await submit(
      { name: fd.get("name"), email: fd.get("email"), inquiryType: fd.get("inquiryType") || undefined, message: fd.get("message"), consent: fd.get("consent") === "on" },
      String(fd.get("fax") ?? ""),
    );
    if (ok) formRef.current?.reset();
  };
  const c = (n: string) => () => clearError(n);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative space-y-6 rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(0,24,56,0.45)] sm:p-10">
      <Honeypot />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Name" name="name" required autoComplete="name" error={errors.name} onInput={c("name")} />
        <TextField label="Email" name="email" type="email" required autoComplete="email" error={errors.email} onInput={c("email")} />
      </div>
      <div onChange={(e) => setType((e.target as unknown as HTMLSelectElement).value)}>
        <SelectField label="Inquiry type" name="inquiryType" required options={INQUIRY_TYPES} error={errors.inquiryType} onInput={c("inquiryType")} />
      </div>
      {type === "Business partnership" && (
        <div className="rounded-2xl border-2 border-yellow bg-yellow-soft/50 p-4 text-sm text-navy">
          <strong>Have cosmetics to supply?</strong> The partnership inquiry form asks for the details our team needs to assess eligibility, so you’ll hear back faster.{" "}
          <Link href={`${PARTNER_HREF}#inquiry`} className="font-semibold underline underline-offset-2">Go to the partner inquiry →</Link>
        </div>
      )}
      <TextArea label="Message" name="message" required rows={6} maxLength={3000} error={errors.message} onInput={c("message")} />
      <Consent error={errors.consent} onInput={c("consent")}>
        I agree that ReShade may contact me about this message. My details will only be used to respond.
      </Consent>
      <Turnstile onToken={setTurnstileToken} />
      <FormStatus state={state} />
      <Button type="submit" variant="navy" size="lg" arrow disabled={state.kind === "submitting"}>
        {state.kind === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
