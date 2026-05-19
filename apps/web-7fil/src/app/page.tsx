import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { SearchBox } from '../components/SearchBox'
import { ListingCard } from '../components/ListingCard'
import { api } from '../lib/api'

export const metadata: Metadata = {
  title: '7fil — Türkiye\'nin Entegre Gayrimenkul Ekosistemi',
  description: 'Satılık ve kiralık konut, iş yeri ve arazi. AI destekli değerleme, hukuki ön inceleme, finansman karşılaştırması.',
}

const POPULAR_CITIES = [
  { name: 'İstanbul', count: '48.000+', img: 'istanbul' },
  { name: 'Ankara', count: '21.000+', img: 'ankara' },
  { name: 'İzmir', count: '15.000+', img: 'izmir' },
  { name: 'Bursa', count: '9.000+', img: 'bursa' },
  { name: 'Antalya', count: '11.000+', img: 'antalya' },
  { name: 'Adana', count: '5.000+', img: 'adana' },
]

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'FILTERRA.AI Değerleme',
    description: 'Yapay zeka destekli piyasa analizi ile ilanın gerçek değerini öğren. Karşılaştırmalı satış verisi ve m² fiyatı.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Hukuki Ön İnceleme',
    description: 'Tapu sicili kontrolü, ipotek sorgulaması, imar durumu. Avukat onaylı mülkiyet sertifikası.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: 'Finansman Karşılaştırması',
    description: 'Konvansiyonel ve katılım bankacılığı seçeneklerini karşılaştır. Aylık ödeme hesabı ve banka teklifleri.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'WhatsApp ile Doğrudan İletişim',
    description: 'Aracısız, anlık iletişim. Her ilan için özel WhatsApp linki ile emlakçıya veya ev sahibine ulaş.',
  },
]

async function getFeaturedListings() {
  try {
    const res = await api.getFeatured()
    return res.data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featured = await getFeaturedListings()

  return (
    <>
      <Navbar />

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-ink min-h-[620px] flex items-center overflow-hidden pt-16">
        {/* Arkaplan dekor */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-teal blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-2xl mb-10">
            {/* FILTERRA badge */}
            <div className="inline-flex items-center gap-2 bg-teal/20 text-teal text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              FILTERRA.AI Destekli — Türkiye&apos;nin İlk Entegre Gayrimenkul Ekosistemi
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Eviniz için
              <br />
              <span className="text-gold">doğru karar,</span>
              <br />
              doğru adres.
            </h1>

            <p className="mt-6 text-white/60 text-lg leading-relaxed max-w-xl">
              Satılık ve kiralık ilanlar, AI destekli değerleme, hukuki güvence ve finansman karşılaştırması — hepsi tek platformda.
            </p>
          </div>

          {/* Arama kutusu */}
          <SearchBox />

          {/* Hızlı istatistikler */}
          <div className="flex flex-wrap gap-8 mt-10 text-white/50 text-sm">
            <span><strong className="text-white">120.000+</strong> İlan</span>
            <span><strong className="text-white">81</strong> İl</span>
            <span><strong className="text-white">5.400+</strong> Emlakçı</span>
            <span><strong className="text-white">98%</strong> Memnuniyet</span>
          </div>
        </div>
      </section>

      {/* ─── Öne Çıkan İlanlar ────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-teal text-sm font-medium mb-1">Güncel İlanlar</p>
              <h2 className="section-title">Öne Çıkan İlanlar</h2>
            </div>
            <Link href="/ara" className="text-sm text-teal hover:text-gold transition-colors font-medium">
              Tümünü Gör →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((listing) => {
              const coverPhoto = listing.photos?.find((p) => p.isCover) ?? listing.photos?.[0]
              return (
                <ListingCard
                  key={listing.id}
                  hit={{
                    id: listing.id,
                    title: listing.title,
                    price: listing.price ?? null,
                    currency: listing.currency,
                    propertyType: listing.propertyType,
                    listingType: listing.listingType,
                    city: listing.city,
                    district: listing.district,
                    neighborhood: listing.neighborhood ?? '',
                    roomCount: listing.roomCount ?? '',
                    areaM2: listing.areaM2 ?? null,
                    hasParking: listing.hasParking ?? false,
                    hasElevator: listing.hasElevator ?? false,
                    coverPhoto: coverPhoto?.url ?? null,
                    whatsappLink: listing.whatsappLink ?? null,
                    publishedAt: null,
                    pricePerM2: listing.price && listing.areaM2
                      ? Math.round(listing.price / listing.areaM2)
                      : null,
                  }}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* ─── Popüler Şehirler ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-teal text-sm font-medium mb-1">Türkiye Genelinde</p>
            <h2 className="section-title">Popüler Şehirler</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_CITIES.map((city) => (
              <Link
                key={city.name}
                href={`/ara?city=${city.name}`}
                className="group card p-5 text-center hover:border-gold/30"
              >
                <div className="w-12 h-12 rounded-full bg-cream mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-ink text-sm group-hover:text-teal transition-colors">{city.name}</p>
                <p className="text-xs text-muted mt-0.5">{city.count} İlan</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Özellikler ───────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-teal text-sm font-medium mb-1">Neden 7fil?</p>
          <h2 className="section-title">Gayrimenkulde Yeni Standart</h2>
          <p className="mt-4 text-muted max-w-xl mx-auto">
            Sadece ilan platformu değil — alım-satım sürecinin tamamını güvenli ve şeffaf hale getiren entegre ekosistem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mx-auto mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-ink mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA — Emlakçılar ─────────────────────────────────────────────────── */}
      <section className="bg-ink py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="badge-gold mb-4 inline-block">Emlakçılar için</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
              Portföyünüzü dijitale<br />
              <span className="text-gold">taşıyın, müşterinizi</span><br />
              büyütün.
            </h2>
            <p className="mt-5 text-white/60 leading-relaxed max-w-lg">
              Sınırsız ilan, CSV toplu yükleme, WhatsApp entegrasyonu, FILTERRA.AI değerleme ve beyaz etiket subdomain.
              Aylık sabit fiyat, sürpriz yok.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/emlakci-ol" className="btn-primary">
                Ücretsiz Başla
              </Link>
              <Link href="/fiyatlandirma" className="btn-outline text-white border-white/30 hover:bg-white hover:text-ink">
                Planları İncele
              </Link>
            </div>
          </div>

          <div className="flex-shrink-0 grid grid-cols-2 gap-4 text-center">
            {[
              { value: '15 gün', label: 'İlan Görünürlüğü' },
              { value: '500', label: 'CSV Toplu İlan' },
              { value: 'AI', label: 'FILTERRA Analizi' },
              { value: 'QR', label: 'WhatsApp Deep Link' },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded-xl p-5 w-36">
                <p className="font-display text-2xl font-bold text-gold">{s.value}</p>
                <p className="text-xs text-white/50 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
