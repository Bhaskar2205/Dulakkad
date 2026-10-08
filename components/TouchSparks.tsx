"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type Spark = { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string; spin: number };

const colors = ["#ffb85c", "#f58a66", "#e2607f", "#f7ecdd", "#ff4f9a"];

/**
 * Stardust under the finger. Touch screens only: every tap bursts and every
 * swipe leaves a trail. The canvas idles (no frames drawn) when nothing is alive.
 */
export default function TouchSparks() {
  const ref = useRef<HTMLCanvasElement>(null);
  // On the virtual trek a swipe is already driving a full-screen film, so only taps sparkle there.
  const pathname = usePathname();
  const trail = useRef(true);
  trail.current = pathname !== "/virtual-trek";

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (!window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let sparks: Spark[] = [];
    let frame = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const star = (s: Spark) => {
      const r = s.size * s.life;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.spin * (1 - s.life) * 4);
      ctx.globalAlpha = Math.min(1, s.life * 1.4);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const radius = i % 2 ? r * 0.35 : r;
        const angle = (i * Math.PI) / 4;
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparks = sparks.filter((s) => s.life > 0.03);
      for (const s of sparks) {
        s.x += s.vx;
        s.y += s.vy;
        s.vy -= 0.02;
        s.vx *= 0.97;
        s.life *= 0.955;
        star(s);
      }
      frame = sparks.length ? requestAnimationFrame(loop) : 0;
      if (!frame) canvas.style.display = "none";
    };

    const emit = (x: number, y: number, count: number, force: number) => {
      for (let i = 0; i < count && sparks.length < 90; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * force;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.6,
          life: 1,
          size: 3 + Math.random() * 5,
          color: colors[(Math.random() * colors.length) | 0],
          spin: Math.random() - 0.5,
        });
      }
      if (!frame) {
        canvas.style.display = "block";
        frame = requestAnimationFrame(loop);
      }
    };

    const onStart = (e: TouchEvent) => emit(e.touches[0].clientX, e.touches[0].clientY, 9, 3.2);
    const onMove = (e: TouchEvent) => {
      const now = performance.now();
      if (!trail.current || now - last < 45) return;
      last = now;
      emit(e.touches[0].clientX, e.touches[0].clientY, 1, 1.1);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden style={{ display: "none" }} className="pointer-events-none fixed inset-0 z-[75] size-full" />;
}
