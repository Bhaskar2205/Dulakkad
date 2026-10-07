"use client";

import { motion, useScroll, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Trek } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

/** Every trek so far, oldest first, along a trail that draws itself as you scroll. */
export default function Timeline({ treks }: { treks: Trek[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <ol ref={ref} className="relative mx-auto max-w-4xl">
      <div aria-hidden className="absolute top-0 bottom-0 left-[11px] w-px bg-white/10 md:left-1/2" />
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="absolute top-0 bottom-0 left-[11px] w-px origin-top bg-gradient-to-b from-saffron via-dawn to-rose md:left-1/2"
      />

      {treks.map((trek, i) => {
        const right = i % 2 === 1;
        return (
          <li key={trek.id} className="relative pb-10 pl-10 last:pb-0 md:grid md:grid-cols-2 md:gap-14 md:pl-0">
            <motion.span
              aria-hidden
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -35% 0px" }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="absolute top-6 left-0 grid size-[23px] place-items-center rounded-full border border-saffron bg-night md:left-1/2 md:-ml-[11.5px]"
            >
              <span className="size-2 rounded-full bg-saffron" />
            </motion.span>

            <motion.div
              initial={{ opacity: 0, x: right ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 0.9, ease }}
              className={right ? "md:col-start-2" : "md:text-right"}
            >
              <Link href={`/treks/${trek.slug}`} className={`card group flex items-center gap-4 p-3 transition-colors hover:border-saffron/60 ${right ? "" : "md:flex-row-reverse"}`}>
                <span className="relative size-20 shrink-0 overflow-hidden rounded-2xl sm:size-24">
                  <Image src={trek.cover} alt="" fill sizes="96px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs tracking-[0.2em] text-saffron uppercase">{trek.dateLabel}</span>
                  <span className="display mt-1 block text-2xl font-semibold sm:text-3xl">{trek.name}</span>
                  <span className="mt-1 block text-sm text-mist">
                    Led by {trek.leader} · {trek.priceLabel}
                  </span>
                </span>
              </Link>
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}
