/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "photography-database.fly.dev",
        port: "",
        pathname: "/api/files/**",
      },
    ],
  },
};

export default nextConfig;
