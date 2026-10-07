import Image from "next/image";
import Link from "next/link";
import HeroSunrise from "@/components/HeroSunrise";
import HorizontalTrails from "@/components/HorizontalTrails";
import { Arrow } from "@/components/Icons";
import JoinCTA from "@/components/JoinCTA";
import NextTrek from "@/components/NextTrek";
import { Counter, Parallax, Reveal, RiseText, ScrollWords } from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import { photoCredit, photos } from "@/lib/site";
import { getNext, getTestimonials, getTrails, getTreks } from "@/lib/treks";

export const revalidate = 600;

const marquee = ["Saturday sunrises", "Aravalli ridgelines", "Summit coffee & Maggi", "Forgotten forts", "Pink City panoramas", "A tribe on the trail"];

export default async function Home() {
  const treks = await getTreks();
  const trails = getTrails(treks);
  const next = getNext(treks);
  const testimonials = getTestimonials();
  const prices = treks.map((t) => t.price).filter((p): p is number => p !== null);

  return (
    <>
      <HeroSunrise />

      {/* Marquee */}
      <div className="border-y border-white/10 bg-night py-5">
        <div className="overflow-hidden">
          <div className="flex w-max animate-marquee items-center">
            {[...marquee, ...marquee].map((item, i) => (
              <span key={i} aria-hidden={i >= marquee.length} className="display flex items-center gap-8 pr-8 text-2xl italic sm:text-3xl">
                {item}
                <span className="size-2 rotate-45 bg-saffron" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Manifesto */}
      <section className="shell py-24 sm:py-36">
        <Reveal>
          <p className="eyebrow">The Dulakkad story</p>
        </Reveal>
        <ScrollWords
          className="display mt-6 max-w-5xl text-4xl font-medium sm:text-6xl lg:text-7xl"
          text="At Dulakkad Treks, we believe the best views aren’t just seen — they’re shared."
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <Reveal>
            <p className="max-w-xl text-lg text-mist">
              Our community was born from a simple Saturday morning routine: chasing sunrises across the rugged landscapes of Rajasthan. What began as a
              personal escape has grown into a thriving tribe of wanderers, heritage explorers and dreamers.
            </p>
            <Link href="/about" className="btn btn-ghost mt-8">
              Read our story <Arrow />
            </Link>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Treks hosted", node: <Counter to={treks.length} /> },
                { label: "Trails explored", node: <Counter to={trails.length} /> },
                { label: "Rating out of 5", node: <Counter to={5} decimals={1} /> },
                { label: "Treks start at", node: <Counter to={Math.min(...prices.filter((p) => p > 0))} prefix="₹" /> },
              ].map((stat) => (
                <div key={stat.label} className="border-t border-white/15 pt-4">
                  <dd className="display text-sunrise text-5xl font-semibold sm:text-6xl">{stat.node}</dd>
                  <dt className="mt-2 text-xs tracking-[0.2em] text-mist uppercase">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Next trek */}
      {next && (
        <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
          <div aria-hidden className="absolute -top-40 -right-40 size-[38rem] rounded-full bg-rose/20 blur-[120px]" />
          <div className="shell relative">
            <NextTrek trek={next.trek} announced={next.announced} />
          </div>
        </section>
      )}

      {/* Trails */}
      <HorizontalTrails trails={trails}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Trails we walk</p>
            <h2 className="display mt-3 text-5xl font-semibold sm:text-7xl">
              Hidden in the <span className="text-sunrise italic">Aravallis</span>
            </h2>
          </div>
          <Link href="/packages" className="btn btn-ghost">
            All packages <Arrow />
          </Link>
        </div>
      </HorizontalTrails>

      {/* Ritual */}
      <section className="shell py-24 sm:py-36">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="eyebrow">The Saturday ritual</p>
            </Reveal>
            <h2 className="display mt-4 text-5xl font-semibold sm:text-6xl">
              <RiseText text="Hard climbs." /> <RiseText text="Great conversations." className="text-sunrise italic" delay={0.1} />{" "}
              <RiseText text="Breakfast with a view." delay={0.2} />
            </h2>
            <Reveal delay={0.2}>
              <Parallax className="relative mt-10 aspect-[4/3] rounded-[2rem]">
                <Image
                  src={photos.ritual.src}
                  alt={photos.ritual.alt}
                  fill
                  sizes="(min-width: 1024px) 44vw, 92vw"
                  className="object-cover"
                  {...photoCredit(photos.ritual)}
                />
              </Parallax>
            </Reveal>
          </div>
          <ol className="space-y-5">
            {[
              ["Before first light", "We meet while the city is still asleep and start climbing in the cool, quiet dark."],
              ["The climb", "Rocky paths, narrow ridges and natural trails. Beginner friendly, never boring, always together."],
              ["Summit sunrise", "The first light hits the Pink City. Forts, lakes and endless hills, all from above."],
              ["Mountaintop breakfast", "A steaming cup of coffee and a bowl of Maggi at the top. The ultimate weekend reset."],
            ].map(([title, body], i) => (
              <Reveal key={title} delay={i * 0.05}>
                <li className="card flex gap-5 p-6 sm:p-8">
                  <span className="display text-sunrise text-5xl font-semibold">{i + 1}</span>
                  <div>
                    <h3 className="display text-2xl font-semibold sm:text-3xl">{title}</h3>
                    <p className="mt-2 text-mist">{body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Community voices */}
      <section className="bg-ink py-24 sm:py-32">
        <div className="shell mb-12">
          <Reveal>
            <p className="eyebrow">Community voices</p>
          </Reveal>
          <h2 className="display mt-4 text-5xl font-semibold sm:text-7xl">
            <RiseText text="Trekkers" /> <RiseText text="feedback" className="text-sunrise italic" delay={0.1} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-xl text-mist">Read what our community has to say about their adventures with Dulakkad Treks.</p>
          </Reveal>
        </div>
        <Testimonials items={testimonials} />
      </section>

      <JoinCTA />
    </>
  );
}
