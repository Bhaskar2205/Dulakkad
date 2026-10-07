import Link from "next/link";
import { Arrow } from "@/components/Icons";
import Ridges from "@/components/Ridges";

export default function NotFound() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 text-center">
      <p className="eyebrow">404 · Off the trail</p>
      <h1 className="display mt-4 text-6xl font-semibold sm:text-8xl">
        This path leads <span className="text-sunrise italic">nowhere</span>
      </h1>
      <Link href="/" className="btn btn-sun relative z-10 mt-8">
        Back to base camp <Arrow />
      </Link>
      <Ridges className="absolute inset-x-0 bottom-0 h-56 w-full opacity-80" />
    </section>
  );
}
