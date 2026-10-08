"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

const icons: Record<string, React.ReactNode> = {
  "/": <path d="M4 11.500 12 4l8 7.500M6.500 10v9.500h11V10" />,
  "/about": (
    <>
      <circle cx="12" cy="12" r="8.500" />
      <path d="m15.500 8.500-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  "/treks": <path d="M2.500 19.500 9 7l4 7 2.500-3.500 6 9h-19ZM9 7l-1.500 3" />,
  "/packages": (
    <>
      <path d="M7 8.500V7a5 5 0 0 1 10 0v1.500M6 8.500h12a1.500 1.500 0 0 1 1.500 1.500v8a2.500 2.500 0 0 1-2.500 2.500H7A2.500 2.500 0 0 1 4.500 18v-8A1.500 1.500 0 0 1 6 8.500Z" />
      <path d="M9 14h6" />
    </>
  ),
  "/virtual-trek": (
    <>
      <rect x="3.500" y="5" width="17" height="14" rx="3.500" />
      <path d="m10.500 9.500 4 2.500-4 2.500v-5Z" />
    </>
  ),
};

const short: Record<string, string> = { "/": "Home", "/about": "About", "/treks": "Treks", "/packages": "Packages", "/virtual-trek": "Virtual" };

/** App-style navigation for phones: always under the thumb. */
export default function MobileDock() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-50 animate-dock-in px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <ul className="mx-auto flex max-w-sm items-stretch justify-between rounded-[1.75rem] border border-white/10 bg-night/90 p-1.5 shadow-[0_-8px_40px_rgba(226,96,127,0.25)]">
        {nav.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => navigator.vibrate?.(8)}
                className={`relative flex h-14 flex-col items-center justify-center gap-1 rounded-[1.4rem] text-[0.6rem] font-medium tracking-wide transition-colors ${
                  active ? "text-night" : "text-cream/70"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="dock-pill"
                    className="absolute inset-0 rounded-[1.4rem] bg-gradient-to-br from-saffron via-dawn to-rose"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <motion.svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="relative size-5"
                  animate={active ? { y: [0, -5, 0] } : { y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {icons[item.href]}
                </motion.svg>
                <span className="relative">{short[item.href] ?? item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
