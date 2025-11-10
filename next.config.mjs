/** @type {import('next').NextConfig} */
const nextConfig = {
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
