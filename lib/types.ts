export type Trek = {
  id: string;
  slug: string;
  trailSlug: string;
  name: string;
  date: string;
  dateLabel: string;
  day: string;
  month: string;
  year: string;
  weekday: string;
  /** Listed as upcoming by the organisers. */
  upcoming: boolean;
  /** The date has not passed yet. */
  isFuture: boolean;
  price: number | null;
  priceLabel: string;
  location: string;
  leader: string;
  description: string;
  excerpt: string;
  cover: string;
  gallery: string[];
  videos: string[];
  meetingLocation: string;
};

export type Trail = {
  slug: string;
  name: string;
  cover: string;
  images: string[];
  excerpt: string;
  editions: number;
  fromLabel: string;
  lastRun: string;
  latestSlug: string;
};

export type Testimonial = {
  id: string;
  name: string;
  message: string;
  rating?: string;
};
