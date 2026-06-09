import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://7fil.com.tr'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/panel/', '/admin/', '/api/', '/dogrula-email/bekliyor'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
