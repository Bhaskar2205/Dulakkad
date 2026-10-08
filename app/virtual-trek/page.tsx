import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/Icons";
import JoinCTA from "@/components/JoinCTA";
import { Reveal, RiseText } from "@/components/Reveal";
import VirtualTrek from "@/components/VirtualTrek";

export const metadata: Metadata = {
  title: "Feel Trek Virtually",
  description: "Scroll your way up a real climb, frame by frame, from the trailhead to the summit. Then come do it for real with Dulakkad Treks.",
  openGraph: { images: ["/virtual-trek/wide/150.webp"] },
};

const real = [
  ["The air", "Cool before sunrise, and it smells of dust and wild grass."],
  ["The company", "A tribe that waits for you at every turn of the trail."],
  ["The breakfast", "A steaming cup of coffee and a bowl of Maggi at the top."],
];

export default function VirtualTrekPage() {
  return (
    <>
      <VirtualTrek />

      <section className="shell py-24 sm:py-32">
        <Reveal>
          <p className="eyebrow">What a screen cannot give you</p>
        </Reveal>
        <h2 className="display mt-4 max-w-4xl text-5xl font-semibold sm:text-7xl">
          <RiseText text="That was the view." /> <RiseText text="The feeling is up there." className="text-sunrise italic" delay={0.15} />
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {real.map(([title, body], i) => (
            <Reveal key={title} delay={i * 0.08} className="h-full">
              <div className="card h-full p-7 sm:p-8">
                <span className="display text-sunrise text-5xl font-semibold">{i + 1}</span>
                <h3 className="display mt-4 text-3xl font-semibold">{title}</h3>
                <p className="mt-2 text-mist">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <Link href="/treks" className="btn btn-sun">
            Pick a real Saturday <Arrow />
          </Link>
          <p className="text-xs text-mist/70">Virtual trek scenes are illustrative footage, not filmed on a Dulakkad trail.</p>
        </Reveal>
      </section>

      <JoinCTA />
    </>
  );
}
