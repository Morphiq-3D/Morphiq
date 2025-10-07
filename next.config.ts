import type { NextConfig } from "next";

// TODO: un-ignore build errors and solve them and do a test build
const nextConfig: NextConfig = {
  // This will temporarily bypass TypeScript errors during the build.
  // The build will pass even with type errors in your code.
  typescript: {
    ignoreBuildErrors: true,
  },
    eslint: {
    // This will allow the build to pass even with ESLint errors.
    ignoreDuringBuilds: true,
  },
  //... other configurations
};

export default nextConfig;
