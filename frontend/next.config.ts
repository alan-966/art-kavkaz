import type { NextConfig } from "next";

const wagtailBaseUrl = new URL(process.env.WAGTAIL_BASE_URL ?? "http://localhost:8000");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: wagtailBaseUrl.protocol.replace(":", "") as "http" | "https",
        hostname: wagtailBaseUrl.hostname,
        port: wagtailBaseUrl.port,
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
