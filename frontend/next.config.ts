import type { NextConfig } from "next";

const wagtailBaseUrl = new URL(process.env.WAGTAIL_BASE_URL ?? "http://localhost:8000");

const nextConfig: NextConfig = {
  images: {
    // Wagtail runs on localhost in dev; Next 16 blocks image optimization for
    // local/loopback IPs by default. remotePatterns above already scopes this
    // to the configured Wagtail host+port+path, so it's safe to allow here.
    dangerouslyAllowLocalIP: true,
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
