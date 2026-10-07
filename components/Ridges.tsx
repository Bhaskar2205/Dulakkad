/** Layered Aravalli silhouette used at the foot of dark sections. */
export default function Ridges({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice" aria-hidden className={className}>
      <path fill="#2a1d44" d="M0 190 90 150l80 22 110-70 80 34 90-58 90 44 100-64 80 42 100-52 100 62 80-30 100 50 100-40 100 52 80-30 60 30v208H0Z" />
      <path fill="#1a1230" d="M0 250 110 210l90 24 120-64 80 40 140-30 120 56 140-44 140 30 120-50 120 40 100-30 160 38v100H0Z" />
      <path fill="#0b0919" d="M0 300 220 268l300 6 180 26 300-12 440 16v16H0Z" />
    </svg>
  );
}
