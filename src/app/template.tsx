"use client";

import { motion } from "motion/react";

/** Soft page-to-page transition: content lifts in while a paint wipe clears. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] origin-top bg-navy"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      >
        <div className="absolute inset-x-0 bottom-0 flex h-2">
          <span className="flex-1 bg-red" />
          <span className="flex-1 bg-yellow" />
          <span className="flex-1 bg-green" />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}>
        {children}
      </motion.div>
    </>
  );
}
