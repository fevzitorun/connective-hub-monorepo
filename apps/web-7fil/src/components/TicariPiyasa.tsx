'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

type PropertyType = 'commercial' | 'industrial' | 'land' | 'residential'
type ListingType = 'sale' | 'rent'

interface DistrictRow { district: string; count: number; avgPriceM2: number | null }
interface HistogramBucket { bucket: number; count: number; min: number; max: number }
interface Comparable {
  id: string; title: string; price: number | null; currency: string
  areaM2: number | null; district: string; pricePerM2: number | null; coverUrl: string | null
}
interface BenchmarkData {
  city: string; district: string | null; propertyType: string; listingType: string
  listingCount: number; avgPriceM2: number | null; medianPriceM2: number | null
  minPriceM2: number | null; maxPriceM2: number | null
  avgPrice: number | null; avgAreaM2: number | null
  districtBreakdown: DistrictRow[]; histogram: HistogramBucket[]; dataAsOf: string
}

const PROP_LABELS: Record<PropertyType, string> = {
  commercial: 'Ticari', industrial: 'Endüstriyel', land: 'Arsa', residential: 'Konut',
}
const LIST_LABELS: Record<ListingType, string> = { sale: 'Satılık', rent: 'Kiralık' }

export function TicariPiyasa() {
  const [city, setCity] = useState('İstanbul')
  const [district, setDistrict] = useState('')
  const [propType, setPropType] = useState<PropertyType>('commercial')
  const [listType, setListType] = useState<ListingType>('sale')
  const [data, setData] = useState<BenchmarkData | null>(null)
  const [comparables, setComparables] = useState<Comparable[]>([])
  const [loading, setLoading] = useState(false)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      city, propertyType: propType, listingType: listType,
      ...(district ? { district } : {}),
    })
    try {
      const [bmRes, compRes] = await Promise.all([
        fetch(`${BASE}/ticari/benchmark?${params}`).then((r) => r.json()),
        fetch(`${BASE}/ticari/comparables?${params}&limit=6`).then((r) => r.json()),
      ])
      setData(bmRes.data ?? null)
      setComparables(compRes.data ?? [])
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [city, district, propType, listType])

  const fmt = (n: number | null | undefined) =>
    n == null ? '—' : n.toLocaleString('tr-TR')

  const maxCount = data?.districtBreakdown.reduce((m, r) => Math.max(m, r.count), 0) ?? 1
  const maxHistCount = data?.histogram.reduce((m, r) => Math.max(m, r.count), 0) ?? 1

  return (
    <div className="space-y-6">
      {/* Search form */}
      <div className="card p-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-32">
            <label className="text-xs text-muted block mb-1">Şehir</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} className="input text-sm w-full" placeholder="İstanbul" />
          </div>
          <div className="flex-1 min-w-32">
            <label className="text-xs text-muted block mb-1">İlçe (opsiyonel)</label>
            <input value={district} onChange={(e) => setDistrict(e.target.value)} className="input text-sm w-full" placeholder="Kadıköy" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Tür</label>
            <select value={propType} onChange={(e) => setPropType(e.target.value as PropertyType)} className="input text-sm">
              {(Object.keys(PROP_LABELS) as PropertyType[]).map((k) => (
                <option key={k} value={k}>{PROP_LABELS[k]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">İşlem</label>
            <select value={listType} onChange={(e) => setListType(e.target.value as ListingType)} className="input text-sm">
              {(Object.keys(LIST_LABELS) as ListingType[]).map((k) => (
                <option key={k} value={k}>{LIST_LABELS[k]}</option>
              ))}
            </select>
          </div>
          <button onClick={fetch_} disabled={loading} className="btn-primary px-5 py-2.5 text-sm">
            {loading ? '...' : 'Sorgula'}
          </button>
        </div>
      </div>

      {data && (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Ortalama m² Fiyatı', value: fmt(data.avgPriceM2) + ' ₺' },
              { label: 'Medyan m² Fiyatı', value: fmt(data.medianPriceM2) + ' ₺' },
              { label: 'Min m² Fiyatı', value: fmt(data.minPriceM2) + ' ₺' },
              { label: 'Aktif İlan', value: String(data.listingCount) },
            ].map((s) => (
              <div key={s.label} className="card p-5">
                <p className="text-xs text-muted">{s.label}</p>
                <p className="text-2xl font-bold text-ink mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* District breakdown */}
            {data.districtBreakdown.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-ink text-sm mb-4">İlçe Bazlı Ortalama m² Fiyatı</h3>
                <div className="space-y-2.5">
                  {data.districtBreakdown.map((row) => (
                    <div key={row.district}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-ink">{row.district}</span>
                        <span className="text-muted">
                          {fmt(row.avgPriceM2)} ₺/m² · {row.count} ilan
                        </span>
                      </div>
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal rounded-full transition-all"
                          style={{ width: `${Math.round((row.count / maxCount) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price histogram */}
            {data.histogram.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-ink text-sm mb-4">Fiyat Dağılımı (m²)</h3>
                <div className="flex items-end gap-2 h-28">
                  {data.histogram.map((b) => (
                    <div key={b.bucket} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] text-muted">{b.count}</span>
                      <div
                        className="w-full bg-gold/70 rounded-t-sm"
                        style={{ height: `${Math.round((b.count / maxHistCount) * 80)}px`, minHeight: '4px' }}
                      />
                      <span className="text-[9px] text-muted text-center leading-tight">
                        {b.min >= 1_000_000 ? `${(b.min / 1_000_000).toFixed(1)}M` : `${(b.min / 1_000).toFixed(0)}K`}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted/60 mt-2 text-center">m² başına TRY</p>
              </div>
            )}
          </div>

          {/* Comparables */}
          {comparables.length > 0 && (
            <div>
              <h3 className="font-semibold text-ink text-sm mb-3">Benzer Aktif İlanlar</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {comparables.map((c) => (
                  <Link
                    key={c.id}
                    href={`/ilan/${c.id}`}
                    className="card p-4 hover:border-teal/40 transition-colors group"
                  >
                    {c.coverUrl && (
                      <div className="aspect-video rounded-lg overflow-hidden bg-ink/5 mb-3">
                        <img src={c.coverUrl} alt={c.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="text-sm font-medium text-ink group-hover:text-teal transition-colors line-clamp-2">{c.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-gold">
                        {c.price ? fmt(c.price) + ' ₺' : '—'}
                      </span>
                      <span className="text-xs text-muted">
                        {c.pricePerM2 ? fmt(c.pricePerM2) + ' ₺/m²' : ''}
                      </span>
                    </div>
                    {(c.district || c.areaM2) && (
                      <p className="text-[10px] text-muted mt-1">
                        {c.district}{c.district && c.areaM2 ? ' · ' : ''}{c.areaM2 ? `${c.areaM2} m²` : ''}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {data.listingCount === 0 && (
            <div className="card p-8 text-center text-muted">
              <p className="font-semibold text-ink">Veri bulunamadı</p>
              <p className="text-sm mt-1">Bu kriterlere uygun aktif ilan henüz yok.</p>
            </div>
          )}

          <p className="text-[10px] text-muted/50 text-center">
            Veriler: {new Date(data.dataAsOf).toLocaleString('tr-TR')} · Canlı ilan veritabanı
          </p>
        </>
      )}
    </div>
  )
}
