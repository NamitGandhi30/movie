/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
    unoptimized: true, // Disable image optimization to avoid ECONNRESET issues
  },
  experimental: {
    serverComponentsExternalPackages: ['tailwind-merge', 'clsx'],
  },
  // Increase timeout for API requests
  serverRuntimeConfig: {
    apiTimeout: 30000,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig