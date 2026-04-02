import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["three"],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
