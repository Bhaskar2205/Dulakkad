import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Films from "@/components/Films";
import Gallery from "@/components/Gallery";
import { Arrow, WhatsApp } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import { Reveal, RiseText } from "@/components/Reveal";
import TrekCard from "@/components/TrekCard";
import { whatsapp } from "@/lib/site";
import { getTreks } from "@/lib/treks";

export const revalidate = 600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getTreks()).map((trek) => ({ slug: trek.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trek = (await getTreks()).find((t) => t.slug === slug);
  if (!trek) return {};
  return { title: `${trek.name} · ${trek.dateLabel}`, description: trek.excerpt, openGraph: { images: [trek.cover] } };
}

/** Listings are plain text; short lines ending in ":" or "?" are their section headings. */
function Description({ text }: { text: string }) {
  const blocks = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    <div className="space-y-5 text-lg text-cream/80">
      {blocks.map((block, i) =>
        block.length < 70 && /[:?!]$/.test(block) ? (
          <h3 key={i} className="display pt-4 text-3xl font-semibold text-cream">
            {block.replace(/:$/, "")}
          </h3>
        ) : (
          <p key={i}>{block}</p>
        ),
      )}
    </div>
  );
}

export default async function TrekPage({ params }: Props) {
  const { slug } = await params;
  const treks = await getTreks();
  const trek = treks.find((t) => t.slug === slug);
  if (!trek) notFound();

  const more = treks.filter((t) => t.id !== trek.id && t.trailSlug !== trek.trailSlug).slice(0, 3);
  const facts = [
    ["Date", `${trek.weekday}, ${trek.dateLabel}`],
    ["Contribution", trek.priceLabel],
    ["Trek leader", trek.leader],
    ["Location", trek.location],
  ];
  const message = trek.isFuture
    ? `Hi Dulakkad! I'd like to book a spot for the ${trek.name} trek on ${trek.dateLabel}.`
    : `Hi Dulakkad! When is the next ${trek.name} trek? I'd like to join.`;

  return (
    <>
      <PageHero
        eyebrow={trek.isFuture ? `Up next · ${trek.dateLabel}` : `Trek log · ${trek.dateLabel}`}
        title={trek.name}
        lede={`${trek.location} · Led by ${trek.leader}`}
        image={trek.cover}
        alt={`${trek.name} trek`}
      >
        <Link href="/treks" className="inline-flex items-center gap-2 text-sm text-cream/80 hover:text-saffron">
          <Arrow className="size-4 rotate-180" /> All treks
        </Link>
      </PageHero>

      <section className="shell grid gap-12 py-20 lg:grid-cols-[1fr_22rem] lg:gap-20">
        <Reveal>
          <Description text={trek.description} />
        </Reveal>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Reveal delay={0.1}>
            <div className="card p-6 sm:p-8">
              <dl className="divide-y divide-white/10">
                {facts.map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 py-3 first:pt-0">
                    <dt className="text-xs tracking-[0.2em] text-mist uppercase">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <a href={whatsapp(message)} target="_blank" rel="noreferrer" className="btn btn-sun mt-6 w-full">
                <WhatsApp /> {trek.isFuture ? "Book my spot" : "Ask about the next one"}
              </a>
              {trek.meetingLocation && (
                <a href={trek.meetingLocation} target="_blank" rel="noreferrer" className="btn btn-ghost mt-3 w-full">
                  Meeting point on Maps <Arrow />
                </a>
              )}
            </div>
          </Reveal>
        </aside>
      </section>

      {trek.gallery.length > 0 && (
        <section className="shell pb-24">
          <h2 className="display mb-8 text-4xl font-semibold sm:text-6xl">
            <RiseText text="From the" /> <RiseText text="trail" className="text-sunrise italic" delay={0.1} />
          </h2>
          <Gallery images={trek.gallery} name={trek.name} />
        </section>
      )}

      {trek.videos.length > 0 && (
        <section className="shell pb-24">
          <h2 className="display mb-8 text-4xl font-semibold sm:text-6xl">
            <RiseText text="Trail" /> <RiseText text="films" className="text-sunrise italic" delay={0.1} />
          </h2>
          <Films videos={trek.videos} name={trek.name} />
        </section>
      )}

      {more.length > 0 && (
        <section className="bg-ink py-24">
          <div className="shell">
            <h2 className="display mb-8 text-4xl font-semibold sm:text-6xl">
              <RiseText text="More trails" />
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((t, i) => (
                <Reveal key={t.id} delay={i * 0.06}>
                  <TrekCard trek={t} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
