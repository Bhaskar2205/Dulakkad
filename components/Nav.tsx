"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/lib/site";
import { Peak, WhatsApp } from "./Icons";
import SideMenu from "./SideMenu";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Nav() {
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > 160 && y > previous);
    setSolid(y > 40);
  });

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {/* How far up the page you have climbed. */}
      <motion.div aria-hidden style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[52] h-[3px] origin-left bg-gradient-to-r from-saffron via-dawn to-rose" />

      <motion.header className="fixed inset-x-0 top-0 z-50" animate={{ y: hidden ? "-110%" : 0 }} transition={{ duration: 0.5, ease }}>
        <div className="shell pt-3 sm:pt-4">
          <div
            className={`flex h-14 items-center justify-between rounded-full pr-[3.75rem] pl-4 transition-all duration-500 sm:pl-6 md:pr-2 ${
              solid ? "border border-white/10 bg-night/75 shadow-2xl shadow-black/30 md:backdrop-blur-xl" : "border border-transparent"
            }`}
          >
            <Link href="/" className="flex items-center gap-2 text-cream" aria-label={`${site.name} home`}>
              <Peak />
              <span className="display text-xl font-semibold">{site.short}</span>
            </Link>

            {/* Phones get the sidebar (SideMenu) and the dock at the bottom of the screen instead. */}
            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                    isActive(item.href) ? "text-night" : "text-cream/80 hover:text-cream"
                  }`}
                >
                  {isActive(item.href) && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-saffron" transition={{ duration: 0.5, ease }} />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              ))}
            </nav>

            <a href={site.whatsappGroup} target="_blank" rel="noreferrer" className="btn btn-ghost !min-h-10 !px-3 sm:!px-4">
              <WhatsApp className="size-4" /> <span className="max-sm:sr-only">Join the tribe</span>
            </a>
          </div>
        </div>
      </motion.header>

      <SideMenu />
    </>
  );
}
