"use client";

import { useRef } from "react";
import { partnerSchema, BUSINESS_TYPES, COSMETIC_TYPES, QUANTITIES } from "@/lib/schemas";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { TextField, TextArea, SelectField, CheckboxGroup, Consent, Honeypot, FormStatus } from "@/components/forms/Fields";
import { Turnstile } from "@/components/forms/Turnstile";
import { SuccessPanel } from "@/components/forms/SuccessPanel";
import { Button } from "@/components/ui/Button";

export function PartnerForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { submit, errors, state, clearError, reset, setTurnstileToken } = useFormSubmit("/api/partner-inquiry", partnerSchema);

  if (state.kind === "success") {
    return (
      <SuccessPanel title="Thank you — inquiry received." onReset={reset} resetLabel="Submit another inquiry">
        The ReShade team will review the product types, quantities and condition you’ve described and get back to you about eligibility and next steps. Nothing is collected until both sides have agreed on the details.
      </SuccessPanel>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ok = await submit(
      {
        company: fd.get("company"),
        contactName: fd.get("contactName"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        website: fd.get("website") ?? "",
        businessType: fd.get("businessType") || undefined,
        cosmeticTypes: fd.getAll("cosmeticTypes"),
        quantity: fd.get("quantity") || undefined,
        location: fd.get("location"),
        details: fd.get("details") ?? "",
        consent: fd.get("consent") === "on",
      },
      String(fd.get("fax") ?? ""),
    );
    if (ok) formRef.current?.reset();
  };

  const c = (n: string) => () => clearError(n);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative space-y-6 rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(0,24,56,0.45)] sm:p-10">
      <Honeypot />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Company name" name="company" required autoComplete="organization" error={errors.company} onInput={c("company")} />
        <TextField label="Contact person" name="contactName" required autoComplete="name" error={errors.contactName} onInput={c("contactName")} />
        <TextField label="Business email" name="email" type="email" required autoComplete="email" error={errors.email} onInput={c("email")} />
        <TextField label="Phone number" name="phone" type="tel" required autoComplete="tel" error={errors.phone} onInput={c("phone")} />
        <TextField label="Company website" name="website" type="url" autoComplete="url" placeholder="yourcompany.com" error={errors.website} onInput={c("website")} />
        <SelectField label="Business type" name="businessType" required options={BUSINESS_TYPES} error={errors.businessType} onInput={c("businessType")} />
      </div>
      <CheckboxGroup legend="Type of cosmetics available" name="cosmeticTypes" options={COSMETIC_TYPES} error={errors.cosmeticTypes} onInput={c("cosmeticTypes")} />
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField label="Estimated quantity" name="quantity" required options={QUANTITIES} error={errors.quantity} onInput={c("quantity")} />
        <TextField label="Location" name="location" required autoComplete="address-level2" placeholder="City, Province" error={errors.location} onInput={c("location")} />
      </div>
      <TextArea label="Additional information" name="details" rows={4} maxLength={2000} placeholder="Condition of the products, expiry dates, packaging, how often you have stock to clear…" error={errors.details} onInput={c("details")} />
      <Consent error={errors.consent} onInput={c("consent")}>
        I agree that ReShade may contact me about this partnership inquiry. My details will only be used to respond to this inquiry.
      </Consent>
      <Turnstile onToken={setTurnstileToken} />
      <FormStatus state={state} />
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-soft">Submitting an inquiry doesn’t commit you to anything. Eligibility and transfer arrangements are confirmed together first.</p>
        <Button type="submit" variant="primary" size="lg" arrow disabled={state.kind === "submitting"} className="shrink-0">
          {state.kind === "submitting" ? "Sending…" : "Submit Partnership Inquiry"}
        </Button>
      </div>
    </form>
  );
}
