import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      {
        source: '/admin-login',
        destination: '/admin/login',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https: http: data: blob: 'unsafe-inline' 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: blob:; script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https: http: blob:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https: res.cloudinary.com; font-src 'self' data: https:; frame-src 'self' https: http:; frame-ancestors 'self' *;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
