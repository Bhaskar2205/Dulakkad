"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Trail } from "@/lib/types";
import { Arrow } from "./Icons";

function TrailPanel({ trail, index, className, sizes }: { trail: Trail; index: number; className: string; sizes: string }) {
  return (
    <Link href={`/treks/${trail.latestSlug}`} className={`group relative block overflow-hidden rounded-[2rem] bg-dusk ${className}`}>
      <Image
        src={trail.cover}
        alt={`${trail.name} trail`}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-[1400ms] ease-trail group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-night/40" />
      <span className="display absolute top-5 left-6 text-6xl font-semibold text-cream/25">{String(index + 1).padStart(2, "0")}</span>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-xs tracking-[0.2em] text-saffron uppercase">
          {trail.editions} {trail.editions === 1 ? "edition" : "editions"} · from {trail.fromLabel}
        </p>
        <h3 className="display mt-2 text-4xl font-semibold">{trail.name}</h3>
        <p className="mt-3 line-clamp-3 text-sm text-cream/75">{trail.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm text-cream">
          Walk this trail <Arrow className="size-4 transition-transform duration-500 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}

function DeckCard({ trail, index, total, progress }: { trail: Trail; index: number; total: number; progress: MotionValue<number> }) {
  // While later cards slide over this one, it sinks back and dims.
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - 1 - index) * 0.035]);
  const shade = useTransform(progress, [start, Math.min(1, start + 1.4 / total)], [0, 0.55]);
  const tilt = useTransform(progress, [Math.max(0, start - 1 / total), start], [index % 2 ? 4 : -4, 0]);

  return (
    <div className="sticky pb-6" style={{ top: `calc(5.25rem + ${index * 9}px)` }}>
      <motion.div style={{ scale, rotate: tilt }} className="relative origin-top will-change-transform">
        <TrailPanel trail={trail} index={index} className="h-[62svh] min-h-[420px] w-full shadow-[0_-18px_50px_rgba(0,0,0,0.55)]" sizes="(min-width: 640px) 70vw, 92vw" />
        <motion.div aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 rounded-[2rem] bg-night" />
      </motion.div>
    </div>
  );
}

/** Phones and tablets: a deck of trail cards that stack up as you scroll. */
function Deck({ trails }: { trails: Trail[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.2", "end end"] });
  return (
    <div ref={ref} className="shell mx-auto max-w-2xl">
      {trails.map((trail, i) => (
        <DeckCard key={trail.slug} trail={trail} index={i} total={trails.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}

/**
 * Desktop: the section pins and vertical scroll drives the track sideways.
 * Touch / small screens: the trails become a stacking deck (see Deck).
 */
export default function HorizontalTrails({ trails, children }: { trails: Trail[]; children: React.ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      setPinned(query.matches);
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (track.current) observer.observe(track.current);
    query.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      query.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => (pinned ? -v * distance : 0));
  const bar = useTransform(scrollYProgress, [0, 1], [0.04, 1]);

  if (!pinned) {
    return (
      <section ref={section} className="relative py-20">
        <div className="shell mb-10">{children}</div>
        <Deck trails={trails} />
      </section>
    );
  }

  return (
    <section ref={section} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="shell mb-10">{children}</div>
        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-12">
          {trails.map((trail, i) => (
            <TrailPanel key={trail.slug} trail={trail} index={i} className="h-[68vh] max-h-[640px] w-[30vw] shrink-0" sizes="30vw" />
          ))}
        </motion.div>
        <div className="shell mt-8">
          <div className="h-px w-full bg-white/15">
            <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-saffron" />
          </div>
        </div>
      </div>
    </section>
  );
}
