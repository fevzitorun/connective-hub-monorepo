'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
import { FilterPanel } from '../../components/FilterPanel'
import { ListingCard } from '../../components/ListingCard'
import { SaveSearchButton } from '../../components/SaveSearchButton'
import { useSearchStore } from '../../store/search'
import { useHistoryStore } from '../../store/history'
import { api } from '../../lib/api'

// Mapbox sadece client-side yüklenir
const ListingMap = dynamic(
  () => import('../../components/ListingMap').then((m) => m.ListingMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-cream rounded-xl animate-pulse" /> }
)

const SORT_OPTIONS = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'price_asc', label: 'Fiyat: Düşük → Yüksek' },
  { value: 'price_desc', label: 'Fiyat: Yüksek → Düşük' },
  { value: 'area_asc', label: 'Alan: Küçük → Büyük' },
]

export default function SearchPage() {
  const router = useRouter()
  const urlParams = useSearchParams()
  const { params, result, loading, error, mapView, setParams, setResult, setLoading, setError, toggleMapView } = useSearchStore()
  const { push: pushHistory } = useHistoryStore()

  // URL → store sync (ilk yüklenme)
  useEffect(() => {
    const p: Record<string, string | number> = {}
    urlParams.forEach((v, k) => {
      p[k] = ['priceMin', 'priceMax', 'areaMin', 'areaMax', 'page', 'perPage'].includes(k) ? Number(v) : v
    })
    setParams(p)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const runSearch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.search(params)
      setResult(res)
      // Arama geçmişine ekle (en az 1 kriter girilmişse)
      if (params.city || params.q || params.listingType) {
        pushHistory(params, '')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Arama başarısız')
    } finally {
      setLoading(false)
    }
  }, [params, setError, setLoading, setResult])

  useEffect(() => {
    runSearch()
  }, [runSearch])

  const hits = result?.data ?? []
  const total = result?.total ?? 0
  const totalPages = result?.totalPages ?? 1

  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Başlık + kontroller */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">
                {params.city ? `${params.city} İlanları` : 'Tüm İlanlar'}
              </h1>
              <p className="text-sm text-muted mt-0.5">
                {loading ? 'Aranıyor...' : `${total.toLocaleString('tr-TR')} ilan bulundu`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Arama alarm */}
              <SaveSearchButton />

              {/* Harita toggle */}
              <button
                onClick={toggleMapView}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-colors ${
                  mapView ? 'border-teal bg-teal/10 text-teal' : 'border-border text-muted hover:border-teal/50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {mapView ? 'Liste' : 'Harita'}
              </button>

              {/* Sıralama */}
              <select
                value={params.sortBy ?? 'newest'}
                onChange={(e) => setParams({ sortBy: e.target.value })}
                className="input-base text-sm w-auto py-2"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filtre paneli — sol */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <FilterPanel />
            </div>

            {/* Sonuçlar */}
            <div className="flex-1 min-w-0">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4 text-sm">
                  {error}
                </div>
              )}

              {mapView ? (
                /* Harita görünümü */
                <div className="h-[600px]">
                  <ListingMap
                    pins={hits.map((h) => ({
                      id: h.id,
                      title: h.title,
                      price: h.price,
                      currency: h.currency,
                      listingType: h.listingType,
                      lat: 0,
                      lng: 0,
                    }))}
                  />
                </div>
              ) : (
                /* Liste görünümü */
                <>
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="card overflow-hidden animate-pulse">
                          <div className="aspect-[4/3] bg-cream" />
                          <div className="p-4 space-y-3">
                            <div className="h-5 bg-cream rounded w-2/3" />
                            <div className="h-4 bg-cream rounded w-1/2" />
                            <div className="h-3 bg-cream rounded w-1/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : hits.length === 0 ? (
                    <div className="text-center py-24 text-muted">
                      <svg className="w-16 h-16 mx-auto mb-4 text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="font-semibold text-ink">Sonuç bulunamadı</p>
                      <p className="text-sm mt-2">Arama kriterlerinizi genişletmeyi deneyin.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {hits.map((hit) => (
                        <ListingCard key={hit.id} hit={hit} />
                      ))}
                    </div>
                  )}

                  {/* Sayfalama */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                      <button
                        disabled={params.page === 1}
                        onClick={() => setParams({ page: (params.page ?? 1) - 1 })}
                        className="px-4 py-2 rounded-lg border border-border text-sm text-ink disabled:opacity-40 hover:border-gold/50 transition-colors"
                      >
                        ← Önceki
                      </button>

                      <span className="px-4 py-2 text-sm text-muted">
                        {params.page ?? 1} / {totalPages}
                      </span>

                      <button
                        disabled={(params.page ?? 1) >= totalPages}
                        onClick={() => setParams({ page: (params.page ?? 1) + 1 })}
                        className="px-4 py-2 rounded-lg border border-border text-sm text-ink disabled:opacity-40 hover:border-gold/50 transition-colors"
                      >
                        Sonraki →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
