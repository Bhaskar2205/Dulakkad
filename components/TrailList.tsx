"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { whatsapp } from "@/lib/site";
import type { Trail } from "@/lib/types";
import { Arrow } from "./Icons";

const ease = [0.22, 1, 0.36, 1] as const;

/** Trail price list. With a mouse, a photo of the trail follows the cursor over each row. */
export default function TrailList({ trails }: { trails: Trail[] }) {
  const [active, setActive] = useState<number | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const box = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - box.left);
        y.set(e.clientY - box.top);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-white/10">
        {trails.map((trail, i) => (
          <motion.li
            key={trail.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.7, ease, delay: 0.04 * i }}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            className="group border-b border-white/10"
          >
            <div className="grid grid-cols-[4rem_1fr] items-center gap-x-4 gap-y-3 py-5 sm:grid-cols-[5rem_1fr_auto] lg:grid-cols-[3rem_1.2fr_1fr_auto] lg:gap-x-8 lg:py-7">
              <span className="display hidden text-xl text-mist lg:block">{String(i + 1).padStart(2, "0")}</span>
              <span className="relative size-16 overflow-hidden rounded-2xl sm:size-20 lg:hidden">
                <Image src={trail.cover} alt="" fill sizes="80px" className="object-cover" />
              </span>
              <div className="min-w-0">
                <h3 className="display text-3xl font-semibold transition-transform duration-500 ease-trail group-hover:translate-x-2 group-hover:text-saffron sm:text-4xl lg:text-5xl">
                  {trail.name}
                </h3>
                <p className="mt-1 text-sm text-mist">
                  {trail.editions} {trail.editions === 1 ? "edition" : "editions"} so far · last walked {trail.lastRun}
                </p>
              </div>
              <p className="col-span-2 line-clamp-2 text-sm text-cream/70 sm:col-span-3 lg:col-span-1">{trail.excerpt}</p>
              <div className="col-span-2 flex items-center justify-between gap-4 sm:col-span-3 lg:col-span-1 lg:flex-col lg:items-end">
                <span>
                  <span className="text-xs tracking-[0.2em] text-mist uppercase">from </span>
                  <span className="display text-3xl font-semibold text-saffron">{trail.fromLabel}</span>
                </span>
                <span className="flex gap-2">
                  <Link href={`/treks/${trail.latestSlug}`} className="btn btn-ghost !min-h-11 !px-4">
                    Details
                  </Link>
                  <a
                    href={whatsapp(`Hi Dulakkad! When is the next ${trail.name} trek? I'd like to join.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sun !min-h-11 !px-4"
                  >
                    Ask <Arrow />
                  </a>
                </span>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <motion.div style={{ x, y }} aria-hidden className="pointer-events-none absolute top-0 left-0 z-10 hidden lg:block">
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={trails[active].slug}
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: active % 2 ? 4 : -4 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.45, ease }}
              className="absolute -top-40 left-8 h-72 w-56 overflow-hidden rounded-3xl border-4 border-cream shadow-2xl shadow-black/60"
            >
              <Image src={trails[active].cover} alt="" fill sizes="224px" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
