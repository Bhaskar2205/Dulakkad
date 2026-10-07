import type { Metadata } from "next";
import { Arrow, WhatsApp } from "@/components/Icons";
import JoinCTA from "@/components/JoinCTA";
import PageHero from "@/components/PageHero";
import { Reveal, RiseText } from "@/components/Reveal";
import TrailList from "@/components/TrailList";
import { photos, site, whatsapp } from "@/lib/site";
import { getTrails, getTreks } from "@/lib/treks";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Packages",
  description: "Saturday sunrise hikes, private group treks and every Aravalli trail Dulakkad runs around Jaipur, with prices.",
};

const provide = ["A guided trekking experience on raw, unexplored trails", "Hot coffee and freshly made Maggi at the summit", "Great company, amazing photo opportunities and memories for a lifetime"];
const bring = ["A water bottle (1–2 litres to stay hydrated)", "Good-grip hiking or sports shoes for loose gravel", "Comfortable activewear", "A cap or hat, sunglasses and sunscreen", "Your phone or camera for the aerial views"];

export default async function Packages() {
  const treks = await getTreks();
  const trails = getTrails(treks);
  const paid = treks.map((t) => t.price).filter((p): p is number => p !== null && p > 0);
  const range = paid.length ? `₹${Math.min(...paid)} – ₹${Math.max(...paid)}` : "On request";

  const formats = [
    {
      name: "Saturday Sunrise Hike",
      price: range,
      unit: "per trekker, depending on the trail",
      body: "Our signature open-group trek. A new Aravalli trail most Saturdays, guided from the meeting point to the summit and back.",
      points: ["Open to solo trekkers, friends and families", "Beginner-friendly routes", "Summit breakfast on select trails"],
      cta: "See the next trek",
      href: "/treks",
      featured: true,
    },
    {
      name: "Private Tribe Trek",
      price: "On request",
      unit: "your group, your date",
      body: "Bring your own crew — friends, family or a college group — and we will lead a trail just for you.",
      points: ["Pick any trail from the list below", "Flexible date and start time", "Led by the Dulakkad team"],
      cta: "Plan on WhatsApp",
      href: whatsapp("Hi Dulakkad! I'd like to plan a private trek for my group."),
      featured: false,
    },
    {
      name: "Team & Corporate Outing",
      price: "On request",
      unit: "tailored for your team",
      body: "Swap the meeting room for a ridgeline. A sunrise climb is the fastest way we know to turn colleagues into a team.",
      points: ["Trail matched to your group's fitness", "Coordination handled end to end", "Photos and films from the day"],
      cta: "Enquire on WhatsApp",
      href: whatsapp("Hi Dulakkad! I'd like to enquire about a team outing trek."),
      featured: false,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Packages"
        title="Pick your"
        accent="sunrise"
        lede="Simple, honest pricing. Choose how you want to trek, then choose the trail."
        photo={photos.packages}
      />

      <section className="shell py-20 sm:py-28">
        <div className="grid gap-5 lg:grid-cols-3">
          {formats.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1} className="h-full">
              <article
                className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] p-7 transition-transform duration-700 ease-trail hover:-translate-y-2 sm:p-9 ${
                  f.featured ? "bg-gradient-to-br from-saffron via-dawn to-rose text-night" : "card"
                }`}
              >
                {f.featured && <span className="mb-4 w-fit rounded-full bg-night px-3 py-1 text-xs tracking-[0.15em] text-cream uppercase">Most loved</span>}
                <h2 className="display max-w-[12ch] text-4xl font-semibold">{f.name}</h2>
                <p className="mt-6">
                  <span className="display block text-5xl font-semibold">{f.price}</span>
                  <span className={`text-sm ${f.featured ? "text-night/70" : "text-mist"}`}>{f.unit}</span>
                </p>
                <p className={`mt-6 ${f.featured ? "text-night/85" : "text-cream/80"}`}>{f.body}</p>
                <ul className="mt-6 mb-8 space-y-3">
                  {f.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className={`mt-2 size-1.5 shrink-0 rotate-45 ${f.featured ? "bg-night" : "bg-saffron"}`} />
                      {point}
                    </li>
                  ))}
                </ul>
                <a
                  href={f.href}
                  {...(f.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className={`btn mt-auto w-full ${f.featured ? "bg-night text-cream hover:bg-cream hover:text-night" : "btn-ghost"}`}
                >
                  {f.cta} <Arrow />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ink py-24 sm:py-32">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Trail by trail</p>
          </Reveal>
          <h2 className="display mt-4 mb-12 text-5xl font-semibold sm:text-7xl">
            <RiseText text="Choose your" /> <RiseText text="trail" className="text-sunrise italic" delay={0.1} />
          </h2>
          <TrailList trails={trails} />
        </div>
      </section>

      <section className="shell grid gap-5 py-24 sm:py-32 lg:grid-cols-2">
        {[
          ["What we provide", provide],
          ["What you need to bring", bring],
        ].map(([title, items], i) => (
          <Reveal key={title as string} delay={i * 0.1} className="h-full">
            <div className="card h-full p-7 sm:p-10">
              <h2 className="display text-4xl font-semibold">{title}</h2>
              <ul className="mt-6 space-y-4 text-cream/85">
                {(items as string[]).map((item, n) => (
                  <li key={item} className="flex gap-4 border-t border-white/10 pt-4">
                    <span className="display text-saffron">{String(n + 1).padStart(2, "0")}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
        <Reveal className="lg:col-span-2">
          <div className="card flex flex-col items-start justify-between gap-5 p-7 sm:flex-row sm:items-center sm:p-10">
            <p className="display max-w-2xl text-2xl sm:text-3xl">
              Not sure which trail fits you? If you can walk uphill for 20–30 minutes, you are good to go. Ask us anything.
            </p>
            <a href={site.whatsappGroup} target="_blank" rel="noreferrer" className="btn btn-sun shrink-0">
              <WhatsApp /> Chat with the tribe
            </a>
          </div>
        </Reveal>
      </section>

      <JoinCTA />
    </>
  );
}
