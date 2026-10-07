import os from "node:os";
import type { NextConfig } from "next";

// `next dev` only serves its scripts to the host it was started on. Listing this
// machine's network addresses lets a phone on the same Wi-Fi or hotspot open the
// dev server and get a working (hydrated) page.
const lanAddresses = Object.values(os.networkInterfaces())
  .flat()
  .filter((net) => net?.family === "IPv4" && !net.internal)
  .map((net) => net!.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: lanAddresses,
  images: {
    // Treks added later in the admin panel are served straight from Google Drive.
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
};

export default nextConfig;
