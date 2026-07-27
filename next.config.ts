import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Railway free tier: reduce memory usage
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  // Don't trace node_modules (saves memory during startup)
  outputFileTracingExcludes: {
    "*": ["**/*.map", "**/node_modules/.cache/**"],
  },
};

export default nextConfig;
