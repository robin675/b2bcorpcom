/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@b2bcorpcom/db", "@b2bcorpcom/shared"],
  experimental: {
    serverActions: { allowedOrigins: ["*"] },
  },
};

export default nextConfig;
