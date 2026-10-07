"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Footer credit. The name rises in, then keeps shimmering in pink. */
export default function Credit() {
  return (
    <motion.p
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm text-mist"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.18 }}
    >
      <motion.span variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.7, ease }}>
        Crafted and Managed By
      </motion.span>
      <span className="relative inline-block overflow-hidden pb-1.5">
        <motion.span
          className="text-pink-city inline-block animate-shimmer text-base font-semibold tracking-[0.28em] sm:text-lg"
          variants={{ hidden: { y: "120%" }, show: { y: 0 } }}
          transition={{ duration: 0.9, ease }}
        >
          PINK CITY BLOG
        </motion.span>
        <motion.span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-[#ff4f9a]"
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
          transition={{ duration: 1.1, ease, delay: 0.3 }}
        />
      </span>
      <motion.svg
        aria-hidden
        viewBox="0 0 20 20"
        className="size-4 fill-[#ff4f9a]"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M10 17.500s-6.500-4-6.500-8.700A3.600 3.600 0 0 1 10 6.500a3.600 3.600 0 0 1 6.500 2.300c0 4.700-6.500 8.700-6.500 8.700Z" />
      </motion.svg>
    </motion.p>
  );
}
