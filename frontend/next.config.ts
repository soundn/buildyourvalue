import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The prototype is data-light by design: no image optimisation service, no heavy runtime deps.
  images: { unoptimized: true },
};

export default nextConfig;
