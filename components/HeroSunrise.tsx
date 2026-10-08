"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { site } from "@/lib/site";
import { Arrow, WhatsApp } from "./Icons";
import Stars from "./Stars";
import { useTilt } from "./useTilt";

const ease = [0.22, 1, 0.36, 1] as const;
const title = site.short.split("");

/**
 * One ridge line. The dawn-coloured shape sits underneath and a night-coloured
 * copy fades out above it, so the sunrise is pure opacity and transform work
 * that stays smooth on phones.
 */
function Ridge({
  night,
  dawn,
  dark,
  x,
  y,
  children,
}: {
  night: MotionValue<number>;
  dawn: string;
  dark: string;
  x: MotionValue<number>;
  y?: MotionValue<string>;
  children: React.ReactNode;
}) {
  const svg = { viewBox: "0 0 1440 600", preserveAspectRatio: "xMidYMax slice", className: "absolute inset-0 size-full" } as const;
  return (
    <motion.div aria-hidden style={{ x, y }} className="absolute -inset-x-10 bottom-0 h-[58svh] will-change-transform">
      <svg {...svg} fill={dawn}>
        {children}
      </svg>
      {dark !== dawn && (
        <motion.svg {...svg} fill={dark} style={{ opacity: night }}>
          {children}
        </motion.svg>
      )}
    </motion.div>
  );
}

/**
 * The page opens before first light. Scrolling brings the sun up over the
 * Aravalli ridge, the way a Saturday with the tribe actually goes. Tilting the
 * phone (or moving the mouse) shifts the layers against each other.
 */
export default function HeroSunrise() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const tilt = useTilt();

  const night = useTransform(p, [0.05, 0.75], [1, 0]);
  const stars = useTransform(p, [0, 0.5], [1, 0]);
  const sunY = useTransform(p, [0, 0.9], ["46vh", "0vh"]);
  const sunScale = useTransform(p, [0, 0.9], [0.8, 1.1]);
  const glow = useTransform(p, [0.15, 0.9], [0, 1]);
  const moonY = useTransform(p, [0, 0.5], ["0vh", "30vh"]);

  const farY = useTransform(p, [0, 1], ["0%", "-10%"]);
  const midY = useTransform(p, [0, 1], ["0%", "-5%"]);

  const skyX = useTransform(tilt.x, [-1, 1], [14, -14]);
  const skyY = useTransform(tilt.y, [-1, 1], [10, -10]);
  const sunX = useTransform(tilt.x, [-1, 1], [-10, 10]);
  const farX = useTransform(tilt.x, [-1, 1], [8, -8]);
  const midX = useTransform(tilt.x, [-1, 1], [16, -16]);
  const nearX = useTransform(tilt.x, [-1, 1], [26, -26]);
  const frontX = useTransform(tilt.x, [-1, 1], [38, -38]);

  const introOpacity = useTransform(p, [0.12, 0.38], [1, 0]);
  const introY = useTransform(p, [0, 0.4], ["0vh", "-14vh"]);
  const outroOpacity = useTransform(p, [0.55, 0.82], [0, 1]);
  const outroY = useTransform(p, [0.55, 0.85], ["6vh", "0vh"]);
  const outroEvents = useTransform(p, (v) => (v > 0.6 ? "auto" : "none"));
  const hint = useTransform(p, [0, 0.08], [1, 0]);

  return (
    <section ref={ref} className="relative h-[240svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Sky: dawn underneath, night fading away on top. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#2a1f4a_0%,#6b3a6e_32%,#e2607f_58%,#ffb067_76%,#ffd89a_100%)]" />
        <motion.div style={{ opacity: night }} className="absolute inset-0 bg-[linear-gradient(to_bottom,#05040f_0%,#100c28_55%,#231a44_100%)]" />
        <motion.div style={{ opacity: stars, x: skyX, y: skyY }} className="absolute -inset-6">
          <Stars className="size-full" />
          <motion.div
            style={{ y: moonY }}
            className="absolute top-[12svh] right-[14%] size-12 rounded-full shadow-[inset_-10px_-6px_0_0_#f7ecdd] drop-shadow-[0_0_18px_rgba(247,236,221,0.45)] sm:size-16"
          />
        </motion.div>

        {/* Sun */}
        <motion.div style={{ y: sunY, x: sunX, scale: sunScale }} className="absolute top-[56%] left-1/2 -ml-[13vmin] size-[26vmin] will-change-transform sm:top-[46%]">
          <motion.div
            style={{ opacity: glow }}
            className="absolute -inset-[130%] rounded-full bg-[radial-gradient(closest-side,rgba(255,216,154,0.55),rgba(245,138,102,0.22)_45%,transparent_72%)]"
          />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_40%,#fff6dc,#ffd27a_55%,#ffae5e)] shadow-[0_0_80px_20px_rgba(255,190,110,0.55)]" />
        </motion.div>

        {/* Ridges, far to near */}
        <Ridge night={night} dawn="#a0627f" dark="#1c1636" x={farX} y={farY}>
          <path d="M-80 380 80 350l80 15 100-65 80 30 90-60 90 40 100-60 80 40 100-50 100 60 80-30 100 50 100-40 100 50 80-30 160 40v260H-80Z" />
        </Ridge>
        <Ridge night={night} dawn="#5b3460" dark="#161029" x={midX} y={midY}>
          <path d="M-80 470 100 410l90 20 110-70 80 40 90-50 90 70 120-50 80-40 80 50 120 20 100-50 100 60 100-30 100 50 160-30v250H-80Z" />
          {/* A fort on the ridge, as every Jaipur skyline has one. */}
          <path d="M718 352v-26h8v8h8v-8h8v8h8v-20h6v-8h4v-8h4v8h4v8h6v20h8v-8h8v8h8v-8h8v8h8v-8h8v34Z" />
        </Ridge>
        <Ridge night={night} dawn="#2a1a3d" dark="#0f0b20" x={nearX}>
          <path d="M-80 540 120 480l120 30 120-60 100 40 140-20 120 50 140-40 140 30 120-50 120 40 100-30 180 40v130H-80Z" />
        </Ridge>
        <Ridge night={night} dawn="#0b0919" dark="#0b0919" x={frontX}>
          <path d="M-80 580 240 556l340-8h280l180 22 480 12v18H-80Z" />
          {/* The tribe, walking the last stretch. */}
          {[628, 664, 698, 736, 772, 806].map((hx, i) => (
            <g key={hx} transform={`translate(${hx} ${548 - (i % 2)})`}>
              <circle cx="0" cy="-25" r="3.6" />
              <path d="M-3.400-20h6.800l1.800 12-3 .400-1 7.600h-2.800l-.600-7.600-3-.400Z" />
              <path d="M-5.800-19h3v8h-3z" />
            </g>
          ))}
          <path d="M826 548v-34h1.600v34Zm1.600-34 13 4.500-13 5Z" />
        </Ridge>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-night to-transparent" />

        {/* Before first light */}
        <motion.div style={{ opacity: introOpacity, y: introY }} className="absolute inset-x-0 top-[17svh] px-5 text-center">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease }} className="eyebrow">
            Jaipur · Saturday sunrise hikes
          </motion.p>
          <h1 className="display mt-4 text-[19vw] leading-[0.9] font-semibold sm:text-[15vw] lg:text-[12.5rem]" aria-label={site.name}>
            <span aria-hidden className="inline-flex overflow-hidden pb-[0.08em]">
              {title.map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: "115%", rotate: 8 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 1.1, delay: 0.3 + i * 0.055, ease }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease }}
            className="mx-auto mt-5 max-w-xl text-base text-cream/80 sm:text-lg"
          >
            Escape the ordinary. Discover breathtaking trails, curated adventures and unforgettable memories in the mountains.
          </motion.p>
        </motion.div>

        {/* First light */}
        <motion.div style={{ opacity: outroOpacity, y: outroY, pointerEvents: outroEvents }} className="absolute inset-x-0 top-[13svh] px-5 text-center">
          <p className="eyebrow !text-cream">First light over the Pink City</p>
          <p className="display mt-4 text-[13vw] font-semibold text-cream italic sm:text-7xl lg:text-8xl">
            Explore. Summit. <span className="text-saffron">Repeat.</span>
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/treks" className="btn bg-night text-cream hover:bg-cream hover:text-night">
              See the next trek <Arrow />
            </Link>
            <a href={site.whatsappGroup} target="_blank" rel="noreferrer" className="btn border border-night/40 bg-white/20 text-night backdrop-blur hover:bg-white/50">
              <WhatsApp /> Join the tribe
            </a>
          </div>
        </motion.div>

        <motion.div style={{ opacity: hint }} className="absolute inset-x-0 bottom-28 flex flex-col items-center gap-3 text-cream/75 lg:bottom-7">
          <span className="text-[0.7rem] tracking-[0.3em] uppercase">Scroll to bring the sun up</span>
          <span className="relative h-10 w-px overflow-hidden bg-white/20">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-saffron"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
