import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  // No `env` block: server code reads process.env directly. Listing secrets
  // there inlines them wherever they're referenced, so a single reference from
  // a client component would ship the Cloudinary API secret to the browser.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: process.env.IMGIX_URL?.split("//")[1] as string,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
