"use client";

import { useEffect, useState } from "react";

/** Counts down to 6 am IST on the trek date, roughly when the climb starts. */
export default function Countdown({ date }: { date: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(`${date}T06:00:00+05:30`).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [date]);

  const parts = [
    ["Days", left === null ? null : Math.floor(left / 86_400_000)],
    ["Hours", left === null ? null : Math.floor(left / 3_600_000) % 24],
    ["Minutes", left === null ? null : Math.floor(left / 60_000) % 60],
    ["Seconds", left === null ? null : Math.floor(left / 1000) % 60],
  ] as const;

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" role="timer" aria-label="Time until the trek">
      {parts.map(([label, value]) => (
        <div key={label} className="card px-2 py-3 text-center">
          <span className="display block text-3xl font-semibold tabular-nums sm:text-4xl">{value === null ? "--" : String(value).padStart(2, "0")}</span>
          <span className="mt-1 block text-[0.6rem] tracking-[0.2em] text-mist uppercase">{label}</span>
        </div>
      ))}
    </div>
  );
}
