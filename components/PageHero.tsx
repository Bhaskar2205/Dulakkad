"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { photoCredit, type Photo } from "@/lib/site";
import { RiseText } from "./Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

export default function PageHero({
  eyebrow,
  title,
  accent,
  lede,
  image,
  alt = "",
  photo,
  children,
}: {
  eyebrow: string;
  title: string;
  /** Second line of the title, set in italic sunrise gradient. */
  accent?: string;
  lede?: string;
  image?: string;
  alt?: string;
  /** A stock photo from `photos`; takes the place of `image` and `alt`. */
  photo?: Photo;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  // On phones the photo starts as a Rajasthani arch window, and scrolling walks you through it.
  const arch = useTransform(
    scrollYProgress,
    [0, 0.4],
    ["inset(11% 6% 24% 6% round 999px 999px 28px 28px)", "inset(0% 0% 0% 0% round 0px 0px 0px 0px)"],
  );

  return (
    <section ref={ref} className="relative flex min-h-[92svh] items-end overflow-hidden pt-32 pb-14 sm:pb-20 md:min-h-[88svh]">
      <motion.div style={{ ["--arch" as string]: arch }} className="absolute inset-0 max-md:[clip-path:var(--arch)]">
        <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
          <Image src={photo?.src ?? image ?? ""} alt={photo?.alt ?? alt} fill priority sizes="100vw" className="object-cover" {...(photo && photoCredit(photo))} />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#0b0919_4%,rgba(11,9,25,0.55)_45%,rgba(11,9,25,0.35)_100%)]" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="shell relative">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease }} className="eyebrow">
          {eyebrow}
        </motion.p>
        <h1 className="display mt-4 text-[15vw] font-semibold sm:text-8xl lg:text-9xl">
          <RiseText text={title} onLoad delay={0.2} />
          {accent && (
            <>
              <br />
              <RiseText text={accent} onLoad delay={0.4} className="text-sunrise italic" />
            </>
          )}
        </h1>
        {lede && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease }}
            className="mt-6 max-w-2xl text-lg text-cream/85"
          >
            {lede}
          </motion.p>
        )}
        {children && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.85, ease }} className="mt-8">
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
