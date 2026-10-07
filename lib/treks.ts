import fs from "node:fs";
import path from "node:path";
import snapshot from "@/data/treks.snapshot.json";
import testimonialData from "@/data/testimonials.json";
import type { Testimonial, Trail, Trek } from "./types";

type RawTrek = {
  id: string;
  name?: string;
  date?: string;
  status?: string;
  price?: string;
  location?: string;
  leader?: string;
  description?: string;
  image?: string;
  images?: string[];
  videos?: string[];
  meetingLocation?: string;
};

const TZ = "Asia/Kolkata";

const localImages = new Set(
  fs.existsSync(path.join(process.cwd(), "public", "treks"))
    ? fs.readdirSync(path.join(process.cwd(), "public", "treks")).map((f) => f.replace(/\.\w+$/, ""))
    : [],
);

/** Photos downloaded into /public/treks are served locally; anything newer comes from Drive. */
function image(url: string) {
  const id = url.match(/\/d\/([\w-]+)/)?.[1];
  if (id && localImages.has(id)) return `/treks/${id}.jpg`;
  return id ? `https://lh3.googleusercontent.com/d/${id}=w1400` : url;
}

const kebab = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Some listings were pasted with a search-result title on top; drop those lines. */
function cleanDescription(text: string) {
  const lines = text.replace(/\r/g, "").split("\n");
  while (lines.length && (/^\s*\d*\s*$/.test(lines[0]) || /\|\s*JaipurThruMyLens/i.test(lines[0]))) lines.shift();
  return lines.join("\n").trim();
}

function excerptOf(text: string) {
  const first = text.split("\n").find((l) => l.trim().length > 80) ?? text;
  if (first.length <= 190) return first.trim();
  return first.slice(0, 190).replace(/\s+\S*$/, "") + "…";
}

function leaderName(raw: string) {
  const name = raw.trim();
  if (/^rishab/i.test(name)) return "Rishabh Pareek";
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : "Team Dulakkad";
}

function fmt(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", { timeZone: TZ, ...options }).format(date);
}

function normalise(raw: RawTrek, today: string): Trek | null {
  if (!raw.name || !raw.date || !/^\d{4}-\d{2}-\d{2}$/.test(raw.date)) return null;
  const when = new Date(`${raw.date}T06:00:00+05:30`);
  const name = raw.name.trim();
  const amount = Number(raw.price);
  const price = raw.price && !Number.isNaN(amount) ? amount : null;
  const description = cleanDescription(raw.description ?? "");
  const gallery = [...new Set([raw.image, ...(raw.images ?? [])].filter(Boolean) as string[])].map(image);
  const location = (raw.location ?? "Jaipur").trim();

  return {
    id: raw.id,
    slug: `${kebab(name)}-${raw.date}`,
    trailSlug: kebab(name),
    name,
    date: raw.date,
    dateLabel: fmt(when, { day: "numeric", month: "long", year: "numeric" }),
    day: fmt(when, { day: "2-digit" }),
    month: fmt(when, { month: "short" }),
    year: fmt(when, { year: "numeric" }),
    weekday: fmt(when, { weekday: "long" }),
    upcoming: raw.status === "upcoming",
    isFuture: raw.date >= today,
    price,
    priceLabel: price === null ? (raw.price?.trim() || "On request") : price === 0 ? "Free" : `₹${price}`,
    location: location.charAt(0).toUpperCase() + location.slice(1),
    leader: leaderName(raw.leader ?? ""),
    description,
    excerpt: excerptOf(description),
    cover: gallery[0] ?? "/hero/treks.jpg",
    gallery,
    videos: raw.videos ?? [],
    meetingLocation: raw.meetingLocation?.trim() ?? "",
  };
}

type FirestoreValue = Record<string, unknown>;

function unwrap(value: FirestoreValue): unknown {
  const [kind, inner] = Object.entries(value)[0] ?? [];
  if (kind === "arrayValue") return ((inner as { values?: FirestoreValue[] }).values ?? []).map(unwrap);
  if (kind === "mapValue") {
    const fields = (inner as { fields?: Record<string, FirestoreValue> }).fields ?? {};
    return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, unwrap(v)]));
  }
  return inner;
}

async function fetchLive(): Promise<RawTrek[] | null> {
  const project = process.env.FIREBASE_PROJECT_ID;
  const key = process.env.FIREBASE_WEB_API_KEY;
  if (!project || !key) return null;
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/treks?pageSize=300&key=${key}`,
      { next: { revalidate: 600 }, signal: AbortSignal.timeout(6000) },
    );
    if (!res.ok) return null;
    const body = (await res.json()) as { documents?: { name: string; fields?: Record<string, FirestoreValue> }[] };
    if (!body.documents?.length) return null;
    return body.documents.map((doc) => ({
      id: doc.name.split("/").pop()!,
      ...(Object.fromEntries(Object.entries(doc.fields ?? {}).map(([k, v]) => [k, unwrap(v)])) as Omit<RawTrek, "id">),
    }));
  } catch {
    return null;
  }
}

/** All treks, newest first. */
export async function getTreks(): Promise<Trek[]> {
  const raw = (await fetchLive()) ?? (snapshot as RawTrek[]);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
  return raw
    .map((r) => normalise(r, today))
    .filter((t): t is Trek => t !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * The trek to spotlight. `announced` is false when nothing with a future date
 * is listed yet, in which case we fall back to the latest listing.
 */
export function getNext(treks: Trek[]): { trek: Trek; announced: boolean } | null {
  const future = treks.filter((t) => t.isFuture).sort((a, b) => a.date.localeCompare(b.date));
  if (future[0]) return { trek: future[0], announced: true };
  const fallback = treks.find((t) => t.upcoming) ?? treks[0];
  return fallback ? { trek: fallback, announced: false } : null;
}

/** Unique trails, each with every photo from all of its editions. */
export function getTrails(treks: Trek[]): Trail[] {
  const groups = new Map<string, Trek[]>();
  for (const trek of treks) groups.set(trek.trailSlug, [...(groups.get(trek.trailSlug) ?? []), trek]);

  return [...groups.entries()].map(([slug, list]) => {
    const richest = [...list].sort((a, b) => b.description.length - a.description.length)[0];
    const prices = list.map((t) => t.price).filter((p): p is number => p !== null);
    const min = prices.length ? Math.min(...prices) : null;
    return {
      slug,
      name: list[0].name.replace(/\s+trek$/i, ""),
      cover: list[0].cover,
      images: [...new Set(list.flatMap((t) => t.gallery))],
      excerpt: richest.excerpt,
      editions: list.length,
      fromLabel: min === null ? "On request" : min === 0 ? "Free" : `₹${min}`,
      lastRun: `${list[0].month} ${list[0].year}`,
      latestSlug: list[0].slug,
    };
  });
}

export function getTestimonials(): Testimonial[] {
  return (testimonialData as Testimonial[]).map((t) => ({
    id: t.id,
    name: t.name.trim(),
    message: t.message.trim(),
    rating: t.rating,
  }));
}
