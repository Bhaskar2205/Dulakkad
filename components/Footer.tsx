import Link from "next/link";
import { nav, site } from "@/lib/site";
import Credit from "./Credit";
import { Facebook, Instagram, Peak, WhatsApp } from "./Icons";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-night">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Peak className="size-9" />
            <span className="display text-3xl font-semibold">{site.name}</span>
          </Link>
          <p className="mt-4 max-w-sm text-mist">Curating adventures and redefining wilderness. Founded in Jaipur, chasing sunrises since the very first hike.</p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          <span className="eyebrow">Explore</span>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="w-fit text-cream/80 transition-colors hover:text-saffron">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <span className="eyebrow">Find us</span>
          <a href={site.whatsappGroup} target="_blank" rel="noreferrer" className="flex w-fit items-center gap-2 text-cream/80 transition-colors hover:text-saffron">
            <WhatsApp /> WhatsApp community
          </a>
          <a href={site.instagram} target="_blank" rel="noreferrer" className="flex w-fit items-center gap-2 text-cream/80 transition-colors hover:text-saffron">
            <Instagram /> @dulak_kad
          </a>
          <a href={site.facebook} target="_blank" rel="noreferrer" className="flex w-fit items-center gap-2 text-cream/80 transition-colors hover:text-saffron">
            <Facebook /> Facebook
          </a>
        </div>
      </div>

      <div aria-hidden className="display pointer-events-none overflow-hidden text-center text-[22vw] leading-[0.8] font-semibold whitespace-nowrap text-white/[0.04] select-none">
        {site.short}
      </div>

      <div className="shell border-t border-white/10 py-7">
        <Credit />
      </div>

      <div className="shell flex flex-col gap-2 border-t border-white/10 pt-6 pb-28 text-sm text-mist sm:flex-row sm:justify-between lg:pb-6">
        <span>© {new Date().getFullYear()} {site.name}.</span>
        <span>{site.tagline}</span>
      </div>
    </footer>
  );
}
