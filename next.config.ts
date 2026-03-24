import type { NextConfig } from "next";

// GraphQL: pages/api/graphql.ts orqali proxy. Eski xato URL (3008) buildga kirmasin.
const rawGql = process.env.NEXT_PUBLIC_GRAPHQL_URL;
const gqlBad =
  !!rawGql &&
  (/:\s*3008(\/|$)/.test(rawGql) || /127\.0\.0\.1:\s*3008/.test(rawGql));
const gqlPublic = gqlBad || !rawGql?.trim() ? "/api/graphql" : rawGql.trim();

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GRAPHQL_URL: gqlPublic,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
