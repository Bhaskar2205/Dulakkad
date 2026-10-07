"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { Arrow, Facebook, Instagram, Peak, WhatsApp } from "./Icons";
import Ridges from "./Ridges";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Phone sidebar. The menu button floats on its own so it stays on screen even
 * while the header is tucked away during scrolling; the panel slides in from
 * the right and can be swiped back out.
 */
export default function SideMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="side-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="fixed top-[18px] right-7 z-[66] grid size-11 place-items-center rounded-full border border-white/15 bg-night/85 shadow-lg shadow-black/40 sm:top-[22px] sm:right-10"
      >
        <motion.span className="absolute h-[1.5px] w-5 rounded-full bg-cream" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} transition={{ duration: 0.35, ease }} />
        <motion.span className="absolute h-[1.5px] w-5 rounded-full bg-cream" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} transition={{ duration: 0.35, ease }} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              aria-hidden
              className="fixed inset-0 z-[64] bg-night/75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              key="panel"
              id="side-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-[65] flex w-[86vw] max-w-sm flex-col overflow-hidden rounded-l-[2rem] border-l border-white/10 bg-[linear-gradient(to_bottom,#0b0919_0%,#1d1638_45%,#5a2d5f_78%,#e2607f_100%)] shadow-[-30px_0_80px_rgba(0,0,0,0.6)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.55, ease }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.7 }}
              onDragEnd={(_, info) => (info.offset.x > 90 || info.velocity.x > 500) && setOpen(false)}
            >
              {/* A small sunrise at the foot of the menu. */}
              <motion.span
                aria-hidden
                className="absolute bottom-28 left-1/2 -ml-12 size-24 rounded-full bg-[radial-gradient(circle_at_50%_40%,#fff6dc,#ffd27a_55%,#ffae5e)] shadow-[0_0_70px_18px_rgba(255,190,110,0.5)]"
                initial={{ y: 90 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.4, ease, delay: 0.25 }}
              />
              <Ridges className="absolute inset-x-0 bottom-0 h-52 w-full" />

              <div className="relative flex items-center gap-2 px-7 pt-7">
                <Peak className="size-8" />
                <span className="display text-2xl font-semibold">{site.short}</span>
              </div>

              <nav aria-label="Menu" className="relative mt-9 flex-1 overflow-y-auto px-4">
                <p className="eyebrow px-3 pb-3">Where to?</p>
                {nav.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <motion.div key={item.href} initial={{ x: 70, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, ease, delay: 0.16 + i * 0.07 }}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-4 rounded-2xl px-3 py-3.5 active:bg-white/10 ${active ? "bg-white/[0.07]" : ""}`}
                      >
                        <span className="display w-6 text-sm text-mist">{String(i + 1).padStart(2, "0")}</span>
                        <span className={`display text-[1.7rem] leading-none font-semibold whitespace-nowrap ${active ? "text-sunrise italic" : "text-cream"}`}>{item.label}</span>
                        <Arrow className={`ml-auto size-5 ${active ? "text-saffron" : "text-cream/40"}`} />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                className="relative px-7 pt-6 pb-[max(1.75rem,env(safe-area-inset-bottom))]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.5 }}
              >
                <a href={site.whatsappGroup} target="_blank" rel="noreferrer" className="btn btn-sun w-full">
                  <WhatsApp /> Join the tribe on WhatsApp
                </a>
                <div className="mt-5 flex items-center justify-between text-cream/85">
                  <span className="text-[0.7rem] tracking-[0.22em] uppercase">{site.tagline}</span>
                  <span className="flex gap-4">
                    <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                      <Instagram />
                    </a>
                    <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                      <Facebook />
                    </a>
                  </span>
                </div>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
