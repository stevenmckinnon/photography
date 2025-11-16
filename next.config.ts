import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  cacheComponents: true,
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    IMGIX_URL: process.env.IMGIX_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  },
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
