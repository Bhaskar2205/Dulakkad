"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Gallery({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, images.length]);

  return (
    <>
      <div className="columns-2 gap-3 sm:gap-4 lg:columns-3">
        {images.map((src, i) => (
          <motion.button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.8, ease, delay: (i % 3) * 0.08 }}
            className={`group relative mb-3 block w-full overflow-hidden rounded-2xl bg-dusk sm:mb-4 ${i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"}`}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
          >
            <Image
              src={src}
              alt={`${name} trek, photo ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 30vw, 46vw"
              className="object-cover transition-transform duration-[1200ms] ease-trail group-hover:scale-110"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${name} photo ${open + 1}`}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-night/95 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease }}
              className="relative h-[80svh] w-full max-w-5xl"
            >
              <Image src={images[open]} alt={`${name} trek, photo ${open + 1}`} fill sizes="100vw" className="object-contain" />
            </motion.div>
            <button type="button" autoFocus className="btn btn-ghost absolute top-4 right-4 bg-night/60" onClick={() => setOpen(null)}>
              Close
            </button>
            {images.length > 1 && (
              <div className="absolute bottom-5 flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="btn btn-ghost bg-night/60" onClick={() => setOpen((open - 1 + images.length) % images.length)}>
                  Prev
                </button>
                <span className="text-sm text-mist tabular-nums">
                  {open + 1} / {images.length}
                </span>
                <button type="button" className="btn btn-ghost bg-night/60" onClick={() => setOpen((open + 1) % images.length)}>
                  Next
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
