"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { Arrow, WhatsApp } from "./Icons";

/** The film is 165 stills in /public/virtual-trek: `wide` (16:9) and `tall` (9:16, for phones). */
const FRAMES = 165;
const last = FRAMES - 1;
const ease = [0.22, 1, 0.36, 1] as const;

/** Where each stage of the climb begins, as a frame number. */
const stages = [
  { from: 8, name: "Base", title: "The first steps", text: "Boots on gravel, poles in hand. Every summit starts on flat ground." },
  { from: 29, name: "Approach", title: "The city falls behind", text: "Dry hills roll out ahead and the trail finds its line." },
  { from: 60, name: "Climb", title: "Rock, scrub and a narrow path", text: "The climb is hard. The conversations are great." },
  { from: 95, name: "Rock face", title: "Look up", text: "Granite in the morning light. That ledge is where we are headed." },
  { from: 120, name: "Last stretch", title: "Almost there", text: "You can see the top from here. Keep moving." },
  { from: 129, name: "Summit", title: "The top", text: "Sun in your face, the whole world below, and someone to share it with." },
];
const FINALE = 153;

const src = (dir: string, i: number) => `/virtual-trek/${dir}/${String(i).padStart(3, "0")}.webp`;

/**
 * A real climb, scrubbed by the scrollbar: the page pins, and scrolling moves
 * through the film from the trailhead to the summit.
 */
export default function VirtualTrek() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  // Inertia: the camera keeps gliding for a moment after the finger or wheel stops.
  const film = useSpring(scrollYProgress, { stiffness: 64, damping: 19, mass: 0.9 });

  const [stage, setStage] = useState(-1); // -1 intro, 0..5 stages, 6 finale
  const [loaded, setLoaded] = useState(0);

  useMotionValueEvent(film, "change", (v) => {
    const frame = v * last;
    const next = frame >= FINALE ? stages.length : stages.reduce((found, s, i) => (frame >= s.from ? i : found), -1);
    setStage((current) => (current === next ? current : next));
  });

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d", { alpha: false, desynchronized: true });
    if (!el || !ctx) return;

    const tall = window.matchMedia("(max-width: 639px) and (orientation: portrait)").matches;
    const dir = tall ? "tall" : "wide";
    const source = tall ? { w: 540, h: 960 } : { w: 1280, h: 720 };

    // Frames are held two ways. `blobs` is every frame, still compressed (a few
    // MB in all). `frames` is the decoded ones: a window around the current
    // position plus an "anchor" every 16th frame, so a fast flick always has
    // something close to show. Decoding happens ahead of the scroll and off the
    // main thread, so drawing never has to wait for it.
    const blobs: (Blob | undefined)[] = new Array(FRAMES);
    const frames = new Map<number, ImageBitmap | HTMLImageElement>();
    const decoding = new Set<number>();
    const REACH = tall ? 12 : 16;
    const isAnchor = (i: number) => i % 16 === 0 || i === last;

    let cancelled = false;
    let painted = "";
    let raf = 0;
    let done = 0;
    let crop = { x: 0, y: 0, w: source.w, h: source.h };
    let shades: CanvasGradient[] = [];

    const toFrame = (blob: Blob): Promise<ImageBitmap | HTMLImageElement> => {
      if ("createImageBitmap" in window) return createImageBitmap(blob);
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve(img);
        };
        img.onerror = reject;
        img.src = url;
      });
    };

    const decode = (i: number) => {
      const blob = blobs[i];
      if (!blob || frames.has(i) || decoding.has(i)) return;
      decoding.add(i);
      toFrame(blob)
        .then((frame) => {
          decoding.delete(i);
          if (cancelled) return;
          frames.set(i, frame);
          if (Math.abs(i - film.get() * last) < 2 || !painted) schedule();
        })
        .catch(() => decoding.delete(i));
    };

    /** Decode what the scroll is about to need, and let go of what it has left behind. */
    const prime = (centre: number) => {
      for (let d = 0; d <= REACH; d++) {
        if (centre + d <= last) decode(centre + d);
        if (d && centre - d >= 0) decode(centre - d);
      }
      if (frames.size < REACH * 2 + 24) return;
      for (const [i, frame] of frames) {
        if (isAnchor(i) || Math.abs(i - centre) <= REACH + 4) continue;
        if ("close" in frame) frame.close();
        frames.delete(i);
      }
    };

    const fit = () => {
      // No point drawing more pixels than the film has: the browser scales the
      // canvas up for free, and a smaller canvas is far cheaper to repaint.
      const scale = Math.min(window.devicePixelRatio || 1, source.w / el.clientWidth, 2);
      el.width = Math.max(1, Math.round(el.clientWidth * scale));
      el.height = Math.max(1, Math.round(el.clientHeight * scale));
      const screenRatio = el.width / el.height;
      const w = Math.min(source.w, source.h * screenRatio);
      const h = Math.min(source.h, source.w / screenRatio);
      crop = { x: (source.w - w) / 2, y: (source.h - h) / 2, w, h };

      // Lens falloff and top/bottom shade, so type stays readable over any frame.
      // Painted into the film rather than stacked on it as extra full-screen layers.
      const reach = Math.hypot(el.width, el.height) * 0.62;
      const vignette = ctx.createRadialGradient(el.width / 2, el.height * 0.45, reach * 0.5, el.width / 2, el.height * 0.45, reach);
      vignette.addColorStop(0, "rgba(5,4,15,0)");
      vignette.addColorStop(1, "rgba(5,4,15,0.55)");
      const floor = ctx.createLinearGradient(0, el.height, 0, el.height * 0.5);
      floor.addColorStop(0, "rgba(11,9,25,0.85)");
      floor.addColorStop(0.5, "rgba(11,9,25,0.3)");
      floor.addColorStop(1, "rgba(11,9,25,0)");
      const sky = ctx.createLinearGradient(0, 0, 0, el.height * 0.16);
      sky.addColorStop(0, "rgba(11,9,25,0.6)");
      sky.addColorStop(1, "rgba(11,9,25,0)");
      shades = [vignette, floor, sky];
      painted = "";
      draw();
    };

    const paint = (frame: ImageBitmap | HTMLImageElement, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.drawImage(frame, crop.x, crop.y, crop.w, crop.h, 0, 0, el.width, el.height);
    };
    const shade = () => {
      ctx.globalAlpha = 1;
      for (const gradient of shades) {
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, el.width, el.height);
      }
    };

    const draw = () => {
      raf = 0;
      const position = film.get() * last;
      const a = Math.floor(position);
      const b = Math.min(last, a + 1);
      const mix = position - a;
      prime(Math.round(position));

      const A = frames.get(a);
      const B = frames.get(b);
      if (A && B) {
        // Dissolve between the two neighbouring frames, so the picture moves
        // with every pixel of scroll instead of jumping a frame at a time.
        const key = `${a}:${mix.toFixed(3)}`;
        if (key === painted) return;
        paint(A, 1);
        if (mix > 0.01) paint(B, mix);
        shade();
        painted = key;
        return;
      }
      // Not decoded yet (page just opened, or a very fast flick): nearest we have.
      const want = Math.round(position);
      for (let d = 0; d < FRAMES; d++) {
        const index = frames.has(want - d) ? want - d : frames.has(want + d) ? want + d : -1;
        if (index < 0) continue;
        const key = `~${index}`;
        if (key !== painted) {
          paint(frames.get(index)!, 1);
          shade();
          painted = key;
        }
        return;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    // Download coarse to fine: every 16th frame first, so the whole climb can
    // be scrubbed within a second or two, then the gaps fill in.
    const order: number[] = [];
    const queued = new Set<number>();
    for (const step of [16, 8, 4, 2, 1]) {
      for (let i = 0; i < FRAMES; i += step) {
        if (!queued.has(i)) {
          queued.add(i);
          order.push(i);
        }
      }
    }
    let cursor = 0;
    const next = () => {
      if (cancelled || cursor >= order.length) return;
      const i = order[cursor++];
      fetch(src(dir, i))
        .then((res) => (res.ok ? res.blob() : Promise.reject(res.status)))
        .then((blob) => {
          if (cancelled) return;
          blobs[i] = blob;
          if (isAnchor(i) || Math.abs(i - film.get() * last) <= REACH) decode(i);
        })
        .catch(() => {})
        .finally(() => {
          done++;
          if (!cancelled && (done % 5 === 0 || done === FRAMES)) setLoaded(done);
          next();
        });
    };
    for (let k = 0; k < 6; k++) next();

    const unsubscribe = film.on("change", schedule);
    window.addEventListener("resize", fit);
    fit();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      unsubscribe();
      window.removeEventListener("resize", fit);
      for (const frame of frames.values()) if ("close" in frame) frame.close();
      frames.clear();
    };
  }, [film]);

  const percent = useTransform(film, (v) => Math.round(v * 100));
  const markerY = useTransform(film, (v) => `${(1 - v) * 100}%`);
  const introOpacity = useTransform(film, [0, 0.04], [1, 0]);
  const active = stage >= 0 && stage < stages.length ? stages[stage] : null;

  return (
    <section ref={section} className="relative h-[700svh] bg-black md:h-[820vh]" aria-label="Virtual trek: scroll to climb from the trailhead to the summit">
      <div className="sticky top-0 h-svh overflow-hidden">
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />

        {/* Intro */}
        <motion.div style={{ opacity: introOpacity }} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow">Feel the trek, virtually</p>
          <h1 className="display mt-4 text-[15vw] font-semibold sm:text-8xl lg:text-9xl">
            Climb it <span className="text-sunrise italic">from here</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-cream/85">Your scroll is your stride. Start at the trailhead and do not stop until the summit.</p>
          <div className="mt-10 flex flex-col items-center gap-3 text-cream/80">
            <span className="text-[0.7rem] tracking-[0.3em] uppercase">Scroll to start climbing</span>
            <span className="relative h-12 w-px overflow-hidden bg-white/25">
              <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-saffron" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
            </span>
          </div>
        </motion.div>

        {/* Stage caption */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-32 sm:px-8 lg:px-12 lg:pb-14">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.5, ease }}
                className="max-w-[78%] sm:max-w-xl"
              >
                <p className="eyebrow">
                  Stage {stage + 1} of {stages.length} · {active.name}
                </p>
                <h2 className="display mt-3 text-4xl font-semibold sm:text-6xl lg:text-7xl">{active.title}</h2>
                <p className="mt-3 text-base text-cream/85 sm:text-lg">{active.text}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Altimeter: base at the bottom, summit at the top */}
        <div className="absolute top-1/2 right-4 flex h-[46svh] -translate-y-1/2 flex-col items-center gap-3 sm:right-8 lg:right-12" aria-hidden>
          <span className="text-[0.6rem] tracking-[0.25em] text-cream/80 uppercase">Summit</span>
          <div className="relative w-px flex-1 bg-white/25">
            <motion.div style={{ scaleY: film }} className="absolute inset-0 origin-bottom bg-gradient-to-t from-saffron via-dawn to-rose" />
            {stages.map((s) => (
              <span key={s.name} className="absolute left-1/2 h-px w-2.5 -translate-x-1/2 bg-white/50" style={{ bottom: `${(s.from / last) * 100}%` }} />
            ))}
            <motion.div style={{ y: markerY }} className="absolute inset-0">
              <span className="absolute top-0 left-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-saffron bg-night/80 text-[0.65rem] font-semibold tabular-nums shadow-[0_0_24px_rgba(255,184,92,0.6)]">
                <motion.span>{percent}</motion.span>
              </span>
            </motion.div>
          </div>
          <span className="text-[0.6rem] tracking-[0.25em] text-cream/80 uppercase">Base</span>
        </div>

        {/* Summit */}
        <AnimatePresence>
          {stage === stages.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-night/55 px-6 text-center"
            >
              <motion.p initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease, delay: 0.1 }} className="eyebrow !text-cream">
                100% · Summit reached
              </motion.p>
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease, delay: 0.2 }}
                className="display mt-4 text-6xl font-semibold sm:text-8xl"
              >
                You made it. <span className="text-sunrise italic">Now feel it for real.</span>
              </motion.h2>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease, delay: 0.45 }}
                className="mt-8 flex flex-wrap justify-center gap-3"
              >
                <Link href="/treks" className="btn btn-sun">
                  See the next trek <Arrow />
                </Link>
                <a href={site.whatsappGroup} target="_blank" rel="noreferrer" className="btn border border-cream/50 bg-night/40 text-cream hover:bg-cream hover:text-night">
                  <WhatsApp /> Join the tribe
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Frames still arriving */}
        <AnimatePresence>
          {loaded < FRAMES && (
            <motion.p
              exit={{ opacity: 0 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-night/70 px-4 py-1.5 text-[0.7rem] tracking-[0.2em] whitespace-nowrap text-cream/85 uppercase"
              role="status"
            >
              Loading the trail · {Math.round((loaded / FRAMES) * 100)}%
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
