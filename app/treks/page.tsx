import type { Metadata } from "next";
import JoinCTA from "@/components/JoinCTA";
import NextTrek from "@/components/NextTrek";
import PageHero from "@/components/PageHero";
import { Reveal, RiseText } from "@/components/Reveal";
import TrekArchive from "@/components/TrekArchive";
import TrekCard from "@/components/TrekCard";
import { photos } from "@/lib/site";
import { getNext, getTreks } from "@/lib/treks";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Our Next Treks",
  description: "Upcoming Saturday sunrise treks around Jaipur with Dulakkad, plus every trail the tribe has walked so far.",
};

export default async function Treks() {
  const treks = await getTreks();
  const next = getNext(treks);
  const alsoComing = treks.filter((t) => t.isFuture && t.id !== next?.trek.id).reverse();
  const past = treks.filter((t) => !t.isFuture && (next?.announced || t.id !== next?.trek.id));

  return (
    <>
      <PageHero
        eyebrow="Our next treks"
        title="Where we climb"
        accent="next"
        lede="Fresh trails, announced every week. Pick a Saturday, lace up, and meet the tribe before first light."
        photo={photos.treks}
      />

      {next && (
        <section className="shell py-20 sm:py-28">
          <NextTrek trek={next.trek} announced={next.announced} />
        </section>
      )}

      {alsoComing.length > 0 && (
        <section className="shell pb-24">
          <h2 className="display text-4xl font-semibold sm:text-6xl">
            <RiseText text="Also on the calendar" />
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {alsoComing.map((trek, i) => (
              <Reveal key={trek.id} delay={i * 0.06}>
                <TrekCard trek={trek} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="bg-ink py-24 sm:py-32">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">The logbook</p>
          </Reveal>
          <h2 className="display mt-4 mb-10 text-5xl font-semibold sm:text-7xl">
            <RiseText text="Summits we have" /> <RiseText text="already shared" className="text-sunrise italic" delay={0.1} />
          </h2>
          <TrekArchive treks={past} />
        </div>
      </section>

      <JoinCTA />
    </>
  );
}
