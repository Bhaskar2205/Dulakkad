"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Trek } from "@/lib/types";
import TrekCard from "./TrekCard";

const ease = [0.22, 1, 0.36, 1] as const;

export default function TrekArchive({ treks }: { treks: Trek[] }) {
  const trails = [...new Map(treks.map((t) => [t.trailSlug, t.name])).entries()];
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? treks : treks.filter((t) => t.trailSlug === filter);

  return (
    <div>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by trail">
        {[["all", "All trails"] as const, ...trails].map(([slug, name]) => (
          <button
            key={slug}
            type="button"
            onClick={() => setFilter(slug)}
            aria-pressed={filter === slug}
            className={`relative min-h-11 shrink-0 rounded-full border px-5 text-sm transition-colors ${
              filter === slug ? "border-transparent text-night" : "border-white/15 text-cream/80 hover:border-saffron"
            }`}
          >
            {filter === slug && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-saffron" transition={{ duration: 0.45, ease }} />}
            <span className="relative">{name}</span>
          </button>
        ))}
      </div>

      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((trek) => (
            <motion.div
              key={trek.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.5, ease }}
            >
              <TrekCard trek={trek} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
