/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@azure/storage-blob"],
  },
  reactStrictMode: true,
  swcMinify: true,
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,  // Preserve existing fallbacks
        tedious: false,  // Exclude `tedious` from client-side
      };
    }

    return config;
  },
};

module.exports = nextConfig;
