import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '../../../components/Navbar'
import { Footer } from '../../../components/Footer'
import { ListingCard } from '../../../components/ListingCard'
import { api } from '../../../lib/api'

// Bilinen mahalleler — genişletilebilir (DB'den de çekilebilir)
const NEIGHBORHOOD_META: Record<string, { city: string; district: string; name: string; description: string }> = {
  'kadikoy': { city: 'İstanbul', district: 'Kadıköy', name: 'Kadıköy', description: 'İstanbul\'un en gözde Anadolu yakası ilçesi. Canlı kafe kültürü, sahil şeridi ve kolay ulaşım.' },
  'besiktas': { city: 'İstanbul', district: 'Beşiktaş', name: 'Beşiktaş', description: 'İstanbul\'un merkezi ve prestijli semtlerinden biri. Kültürel zenginlik ve modern yaşam.' },
  'cankaya': { city: 'Ankara', district: 'Çankaya', name: 'Çankaya', description: 'Ankara\'nın prestijli ilçesi. Kamu kurumları, üniversiteler ve modern konutlar.' },
  'konak': { city: 'İzmir', district: 'Konak', name: 'Konak', description: 'İzmir\'in tarihi merkezi. Kordon sahili, Kemeraltı çarşısı ve modern altyapı.' },
  'muratpasa': { city: 'Antalya', district: 'Muratpaşa', name: 'Muratpaşa', description: 'Antalya\'nın merkez ilçesi. Eski şehir kaleiçi, sahil ve turizm altyapısı.' },
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = NEIGHBORHOOD_META[params.slug]
  if (!meta) return { title: 'Mahalle Bulunamadı' }
  return {
    title: `${meta.name} Emlak İlanları — ${meta.city}`,
    description: `${meta.name}, ${meta.city} satılık ve kiralık daire, ev ve iş yeri ilanları. ${meta.description}`,
    openGraph: { type: 'website' },
  }
}

export default async function NeighborhoodPage({ params }: Props) {
  const meta = NEIGHBORHOOD_META[params.slug]
  if (!meta) notFound()

  let listings: import('../../../lib/api').SearchHit[] = []
  let total = 0
  try {
    const res = await api.search({ city: meta.city, district: meta.district, perPage: 12 })
    listings = res.data
    total = res.total
  } catch {
    // Göster ama boş
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-ink pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-gold">Ana Sayfa</Link>
            <span>/</span>
            <Link href={`/ara?city=${meta.city}`} className="hover:text-gold">{meta.city}</Link>
            <span>/</span>
            <span className="text-white/70">{meta.name}</span>
          </nav>

          <h1 className="font-display text-4xl font-bold text-white">
            {meta.name} <span className="text-gold">Emlak İlanları</span>
          </h1>
          <p className="mt-3 text-white/60 max-w-2xl">{meta.description}</p>

          <div className="flex flex-wrap gap-6 mt-8 text-sm text-white/50">
            <span><strong className="text-white">{total.toLocaleString('tr-TR')}</strong> İlan</span>
            <span><strong className="text-white">{meta.city}</strong></span>
            <span><strong className="text-white">{meta.district}</strong> İlçesi</span>
          </div>
        </div>
      </section>

      {/* İlanlar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title text-xl">Güncel İlanlar</h2>
          <div className="flex gap-3">
            <Link href={`/ara?city=${meta.city}&district=${meta.district}&listingType=sale`} className="badge-gold text-xs px-3 py-1.5">Satılık</Link>
            <Link href={`/ara?city=${meta.city}&district=${meta.district}&listingType=rent`} className="badge-teal text-xs px-3 py-1.5">Kiralık</Link>
          </div>
        </div>

        {listings.length === 0 ? (
          <p className="text-center py-20 text-muted">Bu mahallede henüz ilan bulunamadı.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {listings.map((hit) => (
                <ListingCard key={hit.id} hit={hit} />
              ))}
            </div>

            {total > 12 && (
              <div className="text-center mt-10">
                <Link
                  href={`/ara?city=${meta.city}&district=${meta.district}`}
                  className="btn-outline"
                >
                  Tüm {total.toLocaleString('tr-TR')} İlanı Gör
                </Link>
              </div>
            )}
          </>
        )}

        {/* SEO içerik */}
        <section className="mt-16 bg-white rounded-2xl border border-border p-8">
          <h2 className="font-display text-xl font-bold text-ink mb-4">
            {meta.name} Hakkında
          </h2>
          <div className="prose prose-sm text-muted max-w-none">
            <p>
              <strong>{meta.name}</strong>, {meta.city} iline bağlı {meta.district} ilçesinde yer alan, gayrimenkul piyasasında
              yatırımcıların ve ev arayanların yoğun ilgi gösterdiği bir bölgedir.
              {meta.description}
            </p>
            <p className="mt-3">
              7fil.com.tr üzerinden {meta.name} bölgesindeki tüm satılık daire, kiralık daire, müstakil ev ve iş yeri ilanlarına
              kolayca ulaşabilirsiniz. FILTERRA.AI destekli değerleme sistemi ile bölgedeki ortalama m² fiyatını öğrenebilirsiniz.
            </p>
          </div>

          {/* İlgili aramalar */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-ink mb-3">İlgili Aramalar</h3>
            <div className="flex flex-wrap gap-2">
              {[
                `${meta.name} Satılık Daire`,
                `${meta.name} Kiralık Daire`,
                `${meta.name} 3+1`,
                `${meta.name} 2+1`,
                `${meta.name} Satılık Müstakil`,
                `${meta.city} ${meta.district} İlanları`,
              ].map((tag) => (
                <Link
                  key={tag}
                  href={`/ara?city=${meta.city}&district=${meta.district}&q=${encodeURIComponent(tag)}`}
                  className="text-xs bg-cream text-muted hover:text-teal hover:bg-teal/10 px-3 py-1.5 rounded-full transition-colors border border-border"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
