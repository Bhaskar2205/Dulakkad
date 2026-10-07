"use client";

import { useEffect, useRef } from "react";

/** Twinkling night sky on a canvas. Stops drawing while off screen. */
export default function Stars({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: { x: number; y: number; r: number; phase: number; speed: number }[] = [];
    let shooting: { x: number; y: number; life: number } | null = null;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(220, (width * height) / 5200));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        // Denser towards the top, thinning out near the horizon.
        y: Math.random() ** 1.6 * height * 0.8,
        r: Math.random() * 1.2 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 1.4 + 0.4,
      }));
      draw(0);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.phase + (time / 1000) * s.speed));
        ctx.fillStyle = s.r > 1.2 ? "#ffe2b0" : "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (shooting) {
        const { x, y, life } = shooting;
        const tail = ctx.createLinearGradient(x, y, x - 120, y - 46);
        tail.addColorStop(0, `rgba(255,255,255,${life})`);
        tail.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = tail;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 120, y - 46);
        ctx.stroke();
        shooting = life > 0.02 ? { x: x + 9, y: y + 3.5, life: life * 0.96 } : null;
      } else if (Math.random() < 0.003) {
        shooting = { x: Math.random() * width * 0.7, y: Math.random() * height * 0.3, life: 1 };
      }
    };

    const loop = (time: number) => {
      if (visible) draw(time);
      frame = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    resize();
    if (!still) frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
