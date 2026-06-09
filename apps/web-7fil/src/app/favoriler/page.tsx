'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
import { FavoriteButton } from '../../components/FavoriteButton'
import { useAuthStore } from '../../store/auth'
import { useFavoritesStore } from '../../store/favorites'
import { formatPrice, formatArea, listingTypeLabel, timeAgo } from '../../lib/utils'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

type FavListing = {
  id: string
  title: string
  price: number | null
  currency: string
  city: string
  district: string
  propertyType: string
  listingType: string
  roomCount: string
  areaM2: number | null
  whatsappLink: string | null
  status: string
  favoritedAt: string
  coverPhoto: string | null
}

export default function FavoritesPage() {
  const { accessToken } = useAuthStore()
  const { _ids, setAll } = useFavoritesStore()
  const [listings, setListings] = useState<FavListing[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!accessToken) return
    setLoading(true)
    fetch(`${BASE}/favorites`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((res) => {
        const data: FavListing[] = res.data ?? []
        setListings(data)
        // Store'u sunucu verisiyle güncelle
        setAll(data.map((l) => l.id))
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [accessToken, setAll])

  // Giriş yoksa — localStorage favorilerini göster (id only)
  const localIds = _ids

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-ink">Favorilerim</h1>
            <p className="text-muted text-sm mt-1">
              {accessToken
                ? `${listings.length} kayıtlı ilan`
                : `${localIds.length} yerel favori (giriş yaparak kaydedin)`}
            </p>
          </div>

          {!accessToken && (
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-5 mb-8 flex items-center justify-between gap-4">
              <p className="text-sm text-ink">
                Favorilerinizi tüm cihazlardan erişmek için giriş yapın.
              </p>
              <Link href="/giris?redirect=/favoriler" className="btn-primary text-sm py-2 px-4 flex-shrink-0">
                Giriş Yap
              </Link>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-cream" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-cream rounded w-3/4" />
                    <div className="h-3 bg-cream rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 && accessToken ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto text-muted/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="font-semibold text-ink">Henüz favori ilan yok</p>
              <p className="text-sm text-muted mt-2">İlan kartlarındaki kalp butonuna tıklayarak ekleyebilirsiniz.</p>
              <Link href="/ara" className="btn-primary mt-6 inline-block">İlan Ara</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {listings.map((l) => (
                <div key={l.id} className="card overflow-hidden group">
                  {/* Cover Photo */}
                  <Link href={`/ilan/${l.id}`}>
                    <div className="relative aspect-[4/3] bg-cream overflow-hidden">
                      {l.coverPhoto ? (
                        <Image
                          src={l.coverPhoto}
                          alt={l.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-10 h-10 text-muted/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                      )}

                      <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full ${l.listingType === 'sale' ? 'badge-gold' : 'badge-teal'}`}>
                        {listingTypeLabel(l.listingType)}
                      </span>
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="price-tag text-base">{formatPrice(l.price, l.currency)}</p>
                        <Link href={`/ilan/${l.id}`}>
                          <h3 className="mt-0.5 font-semibold text-ink text-sm line-clamp-2 hover:text-teal transition-colors">
                            {l.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted mt-0.5">
                          {l.district && `${l.district}, `}{l.city}
                        </p>
                      </div>
                      <FavoriteButton listingId={l.id} size="sm" />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted mt-3 pt-3 border-t border-border">
                      {l.areaM2 && <span>{formatArea(l.areaM2)}</span>}
                      {l.roomCount && <span>{l.roomCount}</span>}
                      <span className="ml-auto">{timeAgo(l.favoritedAt)}</span>
                    </div>

                    {/* WhatsApp */}
                    {l.whatsappLink && (
                      <a
                        href={l.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-1.5 bg-[#25D366]/10 text-[#25D366] text-xs font-medium py-2 rounded-lg hover:bg-[#25D366]/20 transition-colors w-full"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Emlakçıya Yaz
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
