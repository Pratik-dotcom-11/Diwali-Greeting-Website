import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["*.app.applet", "*.asia-southeast1.run.app", "*.run.app", "localhost:3000"],
};

export default nextConfig;
