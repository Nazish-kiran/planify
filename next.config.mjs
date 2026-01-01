/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: false, // Disable double rendering in production
  swcMinify: true,
  
  // Image optimization
  images: {
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
  },

  // Webpack optimization
  webpack: (config, { isServer }) => {
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          default: false,
          vendors: false,
        },
      },
    };
    return config;
  },

  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth',
        permanent: true, 
      },
      {
        source: '/signup',
        destination: '/auth',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
