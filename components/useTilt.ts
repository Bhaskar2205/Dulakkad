"use client";

import { useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * A -1..1 lean on each axis: from the phone's gyroscope where the browser
 * hands it over without a prompt (Android), from the mouse on desktop.
 */
export function useTilt() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 18 });
  const y = useSpring(rawY, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rest: { beta: number; gamma: number } | null = null;
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      // However the phone is first held counts as level.
      rest ??= { beta: e.beta, gamma: e.gamma };
      rawX.set(clamp((e.gamma - rest.gamma) / 25));
      rawY.set(clamp((e.beta - rest.beta) / 25));
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rawX.set(clamp((e.clientX / window.innerWidth - 0.5) * 2));
      rawY.set(clamp((e.clientY / window.innerHeight - 0.5) * 2));
    };

    // iOS only shares orientation after a permission dialog; not worth interrupting for.
    const Orientation = (window as { DeviceOrientationEvent?: { requestPermission?: unknown } }).DeviceOrientationEvent;
    if (Orientation && typeof Orientation.requestPermission !== "function") window.addEventListener("deviceorientation", onOrientation);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [rawX, rawY]);

  return { x, y };
}
