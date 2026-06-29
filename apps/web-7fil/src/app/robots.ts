import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://7fil.com.tr'
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/on-kayit', '/fiyatlar'],
        disallow: ['/panel/', '/admin/', '/api/', '/beta/', '/ara', '/ilan/', '/sehir/', '/dogrula-email/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
