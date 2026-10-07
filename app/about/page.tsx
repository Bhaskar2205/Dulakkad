import type { Metadata } from "next";
import Image from "next/image";
import JoinCTA from "@/components/JoinCTA";
import PageHero from "@/components/PageHero";
import { Parallax, Reveal, RiseText, ScrollWords } from "@/components/Reveal";
import Timeline from "@/components/Timeline";
import { founder, photos } from "@/lib/site";
import { getTreks } from "@/lib/treks";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "About Us",
  description: "Founded in Jaipur by Rishabh Pareek, Dulakkad Treks is a tribe of wanderers, heritage explorers and dreamers chasing Saturday sunrises.",
};

export default async function About() {
  const treks = await getTreks();
  const chronological = [...treks].reverse();
  const groupShot = treks.find((t) => t.gallery.length > 2)?.gallery[0] ?? photos.about.src;

  return (
    <>
      <PageHero
        eyebrow="Our legacy · Founded in Jaipur"
        title="The Dulakkad"
        accent="story"
        lede="Chasing sunrises since the very first hike."
        photo={photos.about}
      />

      <section className="shell py-24 sm:py-32">
        <ScrollWords
          className="display max-w-5xl text-4xl font-medium sm:text-6xl"
          text="What began as a personal escape has grown into a thriving tribe of wanderers, heritage explorers, and dreamers."
        />
        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Parallax className="relative aspect-[4/5] rounded-[2rem]">
              <Image src={groupShot} alt="The Dulakkad tribe after a trek" fill sizes="(min-width: 1024px) 44vw, 92vw" className="object-cover" />
            </Parallax>
          </Reveal>
          <div className="space-y-6 text-lg text-mist lg:pt-10">
            <Reveal>
              <p>
                At Dulakkad Treks, we believe the best views aren’t just seen — they’re shared. Founded by Rishabh Pareek, our community was born from a
                simple Saturday morning routine: chasing sunrises across the rugged landscapes of Rajasthan.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                We specialize in Saturday sunrise hikes, where the climb is hard, the conversations are great, and the reward is always a perfect
                mountaintop breakfast and a view that stays with you forever.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <figure className="card relative mt-10 p-7 sm:p-10">
                <span aria-hidden className="display text-sunrise absolute -top-8 left-6 text-9xl leading-none">
                  “
                </span>
                <blockquote className="display text-2xl text-cream italic sm:text-3xl">
                  I started Dulakkad to capture that feeling of calm you only get at the summit when the first light hits the Pink City. It’s about
                  escaping the daily grind and finding a family on the trail.
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 text-base">
                  <span className="display grid size-12 place-items-center rounded-full bg-gradient-to-br from-saffron to-rose font-semibold text-night">RP</span>
                  <span>
                    <span className="block font-medium text-cream">Rishabh Pareek</span>
                    <span className="text-sm text-mist">Founder, Dulakkad Treks</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 sm:py-32">
        <div className="shell">
          <div className="mb-16 text-center">
            <Reveal>
              <p className="eyebrow">The trail so far</p>
            </Reveal>
            <h2 className="display mt-4 text-5xl font-semibold sm:text-7xl">
              <RiseText text="Every sunrise," /> <RiseText text="in order" className="text-sunrise italic" delay={0.1} />
            </h2>
          </div>
          <Timeline treks={chronological} />
        </div>
      </section>

      <section className="shell py-24 sm:py-32">
        <Reveal>
          <article className="card group relative grid items-center gap-10 overflow-hidden p-8 sm:p-14 lg:grid-cols-[auto_1fr] lg:gap-16">
            <div
              aria-hidden
              className="absolute -top-32 -right-24 size-96 rounded-full bg-gradient-to-br from-saffron to-rose opacity-20 blur-3xl transition-all duration-1000 group-hover:scale-125 group-hover:opacity-35"
            />
            <div className="relative mx-auto size-44 sm:size-56 lg:mx-0">
              <span aria-hidden className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-saffron/50" />
              <span className="display absolute inset-4 grid place-items-center rounded-full bg-gradient-to-br from-saffron via-dawn to-rose text-6xl font-semibold text-night sm:text-7xl">
                RP
              </span>
            </div>
            <div className="relative text-center lg:text-left">
              <p className="eyebrow">{founder.role}</p>
              <h2 className="display mt-4 text-5xl font-semibold sm:text-7xl">
                <RiseText text="Rishabh" /> <RiseText text="Pareek" className="text-sunrise italic" delay={0.1} />
              </h2>
              <p className="mt-5 max-w-xl text-lg text-mist">{founder.bio}</p>
            </div>
          </article>
        </Reveal>
      </section>

      <JoinCTA />
    </>
  );
}
