import type { Testimonial } from "@/lib/types";
import { Star } from "./Icons";

function Quote({ item }: { item: Testimonial }) {
  return (
    <figure className="card flex w-[82vw] max-w-md shrink-0 flex-col justify-between gap-6 p-6 sm:w-[26rem] sm:p-8">
      <div>
        {item.rating && (
          <div className="mb-4 flex gap-1 text-saffron" aria-label={`${item.rating} out of 5 stars`}>
            {Array.from({ length: Number(item.rating) }, (_, i) => (
              <Star key={i} />
            ))}
          </div>
        )}
        <blockquote className="whitespace-pre-line text-cream/90">{item.message}</blockquote>
      </div>
      <figcaption className="flex items-center gap-3">
        <span className="display grid size-11 place-items-center rounded-full bg-gradient-to-br from-saffron to-rose text-lg font-semibold text-night">
          {item.name.charAt(0).toUpperCase()}
        </span>
        <span>
          <span className="block font-medium">{item.name}</span>
          <span className="text-xs tracking-[0.2em] text-mist uppercase">Trekked with Dulakkad</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Endless wall of trekker feedback. Pauses under the cursor or a finger. */
export default function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-marquee items-stretch gap-5 pr-5 [animation-duration:60s] group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]">
        {items.map((item) => (
          <Quote key={item.id} item={item} />
        ))}
        {/* Duplicate set makes the loop seamless; hidden from assistive tech. */}
        <div aria-hidden className="contents">
          {items.map((item) => (
            <Quote key={`${item.id}-copy`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
