import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

/** Directory containing this config (the Next app root). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /**
   * Next otherwise picks a parent folder when multiple package-lock.json files exist
   * (e.g. C:\\Users\\pc\\package-lock.json), which breaks Turbopack resolution and can cause 500s.
   */
  turbopack: {
    root: projectRoot,
  },
  images: {
     remotePatterns: [
      {
        protocol: "https",
        hostname: "petszone-eg.com",
      },
    ],
  },
};

export default nextConfig;
