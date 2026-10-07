import Image from "next/image";
import Link from "next/link";
import type { Trek } from "@/lib/types";
import { Arrow } from "./Icons";

export default function TrekCard({ trek, priority = false }: { trek: Trek; priority?: boolean }) {
  return (
    <Link href={`/treks/${trek.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-dusk">
      <Image
        src={trek.cover}
        alt={`${trek.name} trek, ${trek.dateLabel}`}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
        className="object-cover transition-transform duration-[1200ms] ease-trail group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />

      <div className="absolute top-4 left-4 rounded-2xl bg-night/70 px-3 py-2 text-center leading-none backdrop-blur">
        <span className="display block text-2xl font-semibold">{trek.day}</span>
        <span className="mt-1 block text-[0.65rem] tracking-[0.2em] text-saffron uppercase">
          {trek.month} {trek.year.slice(2)}
        </span>
      </div>
      {trek.isFuture && (
        <span className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-glacier px-3 py-1.5 text-xs font-medium text-night">
          <span className="size-1.5 animate-pulse-soft rounded-full bg-night" /> Booking open
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-xs tracking-[0.2em] text-cream/70 uppercase">
          {trek.location} · {trek.priceLabel}
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <h3 className="display text-3xl font-semibold">{trek.name}</h3>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream text-night transition-all duration-500 ease-trail group-hover:-rotate-45 group-hover:bg-saffron">
            <Arrow />
          </span>
        </div>
      </div>
    </Link>
  );
}
