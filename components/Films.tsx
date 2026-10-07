"use client";

import { useState } from "react";

/** Drive-hosted clips. The player only loads once someone asks for it. */
export default function Films({ videos, name }: { videos: string[]; name: string }) {
  const [loaded, setLoaded] = useState<number[]>([]);

  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {videos.map((src, i) => (
        <div key={src} className="card relative aspect-[9/16] w-[62vw] shrink-0 snap-center overflow-hidden sm:w-auto">
          {loaded.includes(i) ? (
            <iframe src={src} title={`${name} film ${i + 1}`} allow="autoplay; fullscreen" className="absolute inset-0 size-full" />
          ) : (
            <button
              type="button"
              onClick={() => setLoaded((l) => [...l, i])}
              className="group absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(226,96,127,0.5),transparent)]"
            >
              <span className="grid size-16 place-items-center rounded-full bg-saffron text-night transition-transform duration-500 ease-trail group-hover:scale-110">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="ml-0.5 size-6">
                  <path d="M6 4v12l10-6L6 4Z" />
                </svg>
              </span>
              <span className="text-xs tracking-[0.25em] text-cream/80 uppercase">Play film {i + 1}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
