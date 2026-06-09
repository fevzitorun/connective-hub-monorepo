import { MetadataRoute } from 'next'

const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://7fil.com.tr'
const api  = process.env.NEXT_PUBLIC_API_URL  ?? 'http://localhost:4000/api/v1'

// Statik sayfalar
const staticRoutes: MetadataRoute.Sitemap = [
  { url: base,                  lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
  { url: `${base}/ilan`,        lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.9 },
  { url: `${base}/muzayede`,    lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.8 },
  { url: `${base}/ticari`,      lastModified: new Date(), changeFrequency: 'daily',   priority: 0.7 },
  { url: `${base}/giris`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  { url: `${base}/kayit`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Dinamik ilan sayfaları — API'den çek
  let listingRoutes: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${api}/listings/sitemap`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const ids: string[] = await res.json()
      listingRoutes = ids.map((id) => ({
        url: `${base}/ilan/${id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch {
    // API erişilemezse sadece statik sayfalar
  }

  return [...staticRoutes, ...listingRoutes]
}
