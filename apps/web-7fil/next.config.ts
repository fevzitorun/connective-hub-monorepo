import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@7fil/ui', '@7fil/types'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.7fil.com.tr' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '*.7fil.com.tr' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
