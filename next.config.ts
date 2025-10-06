import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This will temporarily bypass TypeScript errors during the build.
  // The build will pass even with type errors in your code.
  typescript: {
    ignoreBuildErrors: true,
  },
  //... other configurations
};

export default nextConfig;
