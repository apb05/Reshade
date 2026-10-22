"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

export function SuccessPanel({ title, children, onReset, resetLabel = "Send another" }: { title: string; children: ReactNode; onReset?: () => void; resetLabel?: string }) {
  return (
    <motion.div role="status" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[2rem] bg-white p-8 text-center shadow-[0_20px_60px_-30px_rgba(0,24,56,0.4)] sm:p-12">
      <motion.div className="mx-auto grid size-20 place-items-center rounded-full bg-green text-white" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}>
        <svg aria-hidden viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.5 }} />
        </svg>
      </motion.div>
      <h3 className="mt-6 font-display text-3xl font-bold text-navy">{title}</h3>
      <div className="mx-auto mt-3 max-w-md text-ink-soft">{children}</div>
      {onReset && (
        <button type="button" onClick={onReset} className="mt-6 font-semibold text-navy underline decoration-yellow decoration-4 underline-offset-4">
          {resetLabel}
        </button>
      )}
    </motion.div>
  );
}
