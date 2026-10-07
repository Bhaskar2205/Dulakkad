import { site } from "@/lib/site";
import { Instagram, WhatsApp } from "./Icons";
import { Reveal, RiseText } from "./Reveal";
import Ridges from "./Ridges";

const embers = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${20 + ((i * 53) % 55)}%`,
  delay: `${(i * 0.7) % 9}s`,
  size: 3 + (i % 3) * 2,
}));

export default function JoinCTA() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(90%_70%_at_50%_100%,#f58a66_0%,#e2607f_22%,#3a2650_55%,#0b0919_85%)] pt-28 pb-56 text-center sm:pt-36 sm:pb-72">
      {embers.map((e, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute animate-drift rounded-full bg-saffron blur-[1px]"
          style={{ left: e.left, top: e.top, width: e.size, height: e.size, animationDelay: e.delay }}
        />
      ))}
      <div className="shell relative z-10">
        <Reveal>
          <p className="eyebrow !text-cream">Join the tribe</p>
        </Reveal>
        <h2 className="display mx-auto mt-5 max-w-4xl text-5xl font-semibold sm:text-7xl lg:text-8xl">
          <RiseText text="This Saturday," /> <RiseText text="meet us at the top." className="italic" delay={0.15} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-cream/85">
            The climb is hard, the conversations are great, and the reward is always a perfect mountaintop breakfast and a view that stays with you forever.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={site.whatsappGroup} target="_blank" rel="noreferrer" className="btn bg-night px-8 text-cream hover:bg-cream hover:text-night">
              <WhatsApp /> Join on WhatsApp
            </a>
            <a href={site.instagram} target="_blank" rel="noreferrer" className="btn border border-cream/50 text-cream hover:bg-cream hover:text-night">
              <Instagram /> Follow the trail
            </a>
          </div>
        </Reveal>
      </div>
      <Ridges className="absolute inset-x-0 bottom-0 h-48 w-full sm:h-64" />
    </section>
  );
}
