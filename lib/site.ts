export const site = {
  name: "Dulakkad Treks",
  short: "Dulakkad",
  tagline: "Explore. Summit. Repeat.",
  description:
    "Escape the ordinary. Saturday sunrise hikes, curated adventures and unforgettable memories in the Aravalli hills around Jaipur.",
  whatsappGroup: "https://chat.whatsapp.com/IpVXySLpKgjCPaXrwargwX?mode=gi_t",
  whatsappNumber: "919928900857",
  instagram: "https://www.instagram.com/dulak_kad/",
  facebook: "https://www.facebook.com/share/17ayJDcjTQ/?mibextid=wwXIfr",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/treks", label: "Our Next Treks" },
  { href: "/packages", label: "Packages" },
  { href: "/virtual-trek", label: "Feel Trek Virtually" },
];

export function whatsapp(text: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const founder = {
  name: "Rishabh Pareek",
  role: "Founder",
  bio: "The visionary behind the tribe. Always pushing the group to conquer new heights.",
};

/**
 * Landscape photos from Wikimedia Commons, used under the licence named in each credit.
 * The credit is not printed on the page: it rides behind the image (see photoCredit)
 * and is also written into each file's own metadata in /public/hero.
 */
export const photos = {
  about: {
    src: "/hero/about.jpg",
    alt: "Jaipur city at sunrise seen from Nahargarh Fort",
    credit: "Hemant.kumar06 · CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:View_of_Jaipur_city_from_Nahargarh_Fort_0325_sunrise_effects.jpg",
  },
  treks: {
    src: "/hero/treks.jpg",
    alt: "A fort wall climbing the green Amer hills near Jaipur",
    credit: "vineet kaul · CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Amer_Hills_-_Jaipur.jpg",
  },
  packages: {
    src: "/hero/packages.jpg",
    alt: "Aravalli hills and fort walls seen from Jaigarh Fort, Amer",
    credit: "Jakub Hałun · CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Jaigarh_Fort,_Amer,_Jaipur,_20191218_1615_9418.jpg",
  },
  ritual: {
    src: "/hero/ritual.jpg",
    alt: "Sunrise over the Aravalli ridge above Jaipur",
    credit: "MIRZA AAMIR · CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Sunrise_in_the_pink_city.jpg",
  },
};

export type Photo = (typeof photos)[keyof typeof photos];

/** Attributes that keep a photo's credit attached to its <img> without showing it. */
export function photoCredit(photo: Photo) {
  return {
    title: `Photo: ${photo.credit}, via Wikimedia Commons`,
    "data-credit": photo.credit,
    "data-source": photo.href,
  };
}
