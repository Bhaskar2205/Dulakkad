import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import Footer from "@/components/Footer";
import MobileDock from "@/components/MobileDock";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import TouchSparks from "@/components/TouchSparks";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-fraunces", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://dulakkad.in"),
  title: { default: `${site.name} – Curated Wilderness Adventures`, template: `%s · ${site.name}` },
  description: site.description,
  icons: { icon: "/favicon.png" },
  openGraph: { title: site.name, description: site.description, images: ["/hero/about.jpg"], type: "website" },
};

export const viewport: Viewport = { themeColor: "#0b0919" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable}`}>
      <body>
        <SmoothScroll>
          <Nav />
          <main>{children}</main>
          <Footer />
          <MobileDock />
        </SmoothScroll>
        <TouchSparks />
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
