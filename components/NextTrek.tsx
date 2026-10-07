import Image from "next/image";
import Link from "next/link";
import { site, whatsapp } from "@/lib/site";
import type { Trek } from "@/lib/types";
import Countdown from "./Countdown";
import { Arrow, WhatsApp } from "./Icons";
import { Parallax, Reveal, RiseText } from "./Reveal";

/** Large spotlight for the next (or, between announcements, the latest) trek. */
export default function NextTrek({ trek, announced }: { trek: Trek; announced: boolean }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      <Reveal className="relative">
        <Parallax className="relative aspect-[4/5] rounded-[2rem] sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image src={trek.cover} alt={`${trek.name} trek`} fill sizes="(min-width: 1024px) 48vw, 92vw" className="object-cover" />
        </Parallax>
        <div className="absolute -right-2 -bottom-5 rotate-3 rounded-2xl bg-saffron px-5 py-3 text-night shadow-2xl sm:-right-5">
          <span className="display block text-4xl leading-none font-semibold">{trek.priceLabel}</span>
          <span className="text-xs tracking-[0.2em] uppercase">per trekker</span>
        </div>
      </Reveal>

      <div>
        <Reveal>
          <p className="eyebrow flex items-center gap-2">
            <span className={`size-2 rounded-full ${announced ? "animate-pulse-soft bg-glacier" : "bg-mist"}`} />
            {announced ? "Up next" : "Latest from the trail"}
          </p>
        </Reveal>
        <h2 className="display mt-4 text-5xl font-semibold sm:text-7xl">
          <RiseText text={trek.name} />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-3 text-lg text-saffron">
            {announced ? `${trek.weekday}, ${trek.dateLabel}` : `Last listed for ${trek.dateLabel}`} · {trek.location}
          </p>
          <p className="mt-5 max-w-xl text-mist">{trek.excerpt}</p>
        </Reveal>

        <Reveal delay={0.2} className="mt-8">
          {announced ? (
            <Countdown date={trek.date} />
          ) : (
            <p className="card p-5 text-cream/85">
              The next Saturday trail is announced in the WhatsApp community first. Join the tribe and you will hear about it before anyone else.
            </p>
          )}
        </Reveal>

        <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-3">
          {announced ? (
            <a
              href={whatsapp(`Hi Dulakkad! I'd like to book a spot for the ${trek.name} trek on ${trek.dateLabel}.`)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sun"
            >
              <WhatsApp /> Book my spot
            </a>
          ) : (
            <a href={site.whatsappGroup} target="_blank" rel="noreferrer" className="btn btn-sun">
              <WhatsApp /> Join the tribe
            </a>
          )}
          <Link href={`/treks/${trek.slug}`} className="btn btn-ghost">
            Trail details <Arrow />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
