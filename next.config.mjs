/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? ["error", "warn"] : false,
  },
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    IMGIX_URL: process.env.IMGIX_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    AWS_CLOUDFRONT_URL: process.env.AWS_CLOUDFRONT_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: process.env.IMGIX_URL.split("//")[1],
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: process.env.AWS_CLOUDFRONT_URL.split("//")[1],
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
