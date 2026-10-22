"use client";

import { useId, type ReactNode } from "react";

type Base = { label: string; name: string; error?: string; hint?: string; required?: boolean; className?: string };

function Wrap({ id, label, error, hint, required, className = "", children }: Base & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-red" aria-hidden> *</span> : <span className="font-normal text-ink-soft"> (optional)</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-soft">{hint}</p>}
      {error && <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-red">{error}</p>}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) => (error ? `${id}-err` : hint ? `${id}-hint` : undefined);

export function TextField({ type = "text", autoComplete, placeholder, onInput, ...p }: Base & { type?: string; autoComplete?: string; placeholder?: string; onInput?: () => void }) {
  const id = useId();
  return (
    <Wrap {...p} id={id}>
      <input id={id} name={p.name} type={type} autoComplete={autoComplete} placeholder={placeholder} className="field" aria-invalid={p.error ? true : undefined} aria-required={p.required} aria-describedby={describedBy(id, p.error, p.hint)} onInput={onInput} />
    </Wrap>
  );
}

export function TextArea({ rows = 5, placeholder, maxLength, onInput, ...p }: Base & { rows?: number; placeholder?: string; maxLength?: number; onInput?: () => void }) {
  const id = useId();
  return (
    <Wrap {...p} id={id}>
      <textarea id={id} name={p.name} rows={rows} maxLength={maxLength} placeholder={placeholder} className="field resize-y" aria-invalid={p.error ? true : undefined} aria-required={p.required} aria-describedby={describedBy(id, p.error, p.hint)} onInput={onInput} />
    </Wrap>
  );
}

export function SelectField({ options, placeholder = "Select…", defaultValue = "", onInput, ...p }: Base & { options: readonly string[]; placeholder?: string; defaultValue?: string; onInput?: () => void }) {
  const id = useId();
  return (
    <Wrap {...p} id={id}>
      <div className="relative">
        <select id={id} name={p.name} defaultValue={defaultValue} className="field appearance-none pr-10" aria-invalid={p.error ? true : undefined} aria-required={p.required} aria-describedby={describedBy(id, p.error, p.hint)} onInput={onInput}>
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>
      </div>
    </Wrap>
  );
}

export function CheckboxGroup({ legend, name, options, error, onInput }: { legend: string; name: string; options: readonly string[]; error?: string; onInput?: () => void }) {
  const id = useId();
  return (
    <fieldset aria-describedby={error ? `${id}-err` : undefined} aria-invalid={error ? true : undefined}>
      <legend className="mb-3 text-sm font-semibold">{legend}<span className="text-red" aria-hidden> *</span></legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input type="checkbox" name={name} value={o} className="peer sr-only" onInput={onInput} />
            <span className="inline-flex rounded-full border-[1.5px] border-line bg-white px-4 py-2 text-sm transition peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-navy/25 hover:border-navy/40">
              {o}
            </span>
          </label>
        ))}
      </div>
      {error && <p id={`${id}-err`} className="mt-2 text-sm font-medium text-red">{error}</p>}
    </fieldset>
  );
}

export function Consent({ name = "consent", error, children, onInput }: { name?: string; error?: string; children: ReactNode; onInput?: () => void }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
        <input id={id} name={name} type="checkbox" className="mt-0.5 size-5 shrink-0 accent-[#00265c]" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} onInput={onInput} />
        <span>{children}</span>
      </label>
      {error && <p id={`${id}-err`} className="mt-1.5 pl-8 text-sm font-medium text-red">{error}</p>}
    </div>
  );
}

/** Off-screen field that only bots fill in. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name="fax" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormStatus({ state }: { state: { kind: string; message?: string; notConfigured?: boolean } }) {
  if (state.kind !== "error") return null;
  return (
    <div role="alert" className={`rounded-2xl px-4 py-3 text-sm ${state.notConfigured ? "bg-yellow-soft text-navy" : "bg-red-soft text-red"}`}>
      <strong className="font-semibold">{state.notConfigured ? "Not sent. " : ""}</strong>
      {state.message}
    </div>
  );
}
