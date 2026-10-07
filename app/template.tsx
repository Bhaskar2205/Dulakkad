"use client";

import { motion } from "motion/react";

/** Re-mounts on every navigation: a dawn-coloured curtain lifts off the new page. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] origin-top bg-[linear-gradient(to_bottom,#0b0919,#3a2650_60%,#e2607f)]"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />
      {children}
    </>
  );
}
