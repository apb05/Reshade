"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, type ReactNode } from "react";

/** Accessible modal: focus is trapped inside, Escape closes, focus returns on close. */
export function Dialog({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>("input,select,textarea,button")?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && ref.current) {
        const els = [...ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([tabindex="-1"]),select,textarea,[tabindex="0"]')];
        if (!els.length) return;
        const [first, last] = [els[0], els[els.length - 1]];
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] bg-paper p-6 shadow-2xl sm:rounded-[2rem] sm:p-8 ${wide ? "sm:max-w-4xl" : "sm:max-w-xl"}`}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 id={id} className="font-display text-2xl font-bold text-navy sm:text-3xl">{title}</h2>
              <button type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-ink/5" aria-label="Close dialog">
                <svg aria-hidden viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
