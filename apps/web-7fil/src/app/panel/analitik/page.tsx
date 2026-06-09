'use client'
import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '../../../store/auth'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

// ── Types ─────────────────────────────────────────────────────────────────────

type Overview = {
  totalListings: number
  activeListings: number
  totalViews: number
  totalWaClicks: number
  totalFavorites: number
  avgViewsPerListing: number
  waConversionRate: number
  mortgageLeads: number
  legalCases: number
}

type StatusDist = { status: string; cnt: number }[]

type TrendPoint = { day: string; clicks: number }
type ListingTrend = { day: string; new_listings: number }

type Trend = {
  waClicks: TrendPoint[]
  newListings: ListingTrend[]
}

type TopListing = {
  id: string
  title: string
  status: string
  listing_type: string
  city: string
  district: string
  price: string
  currency: string
  view_count: number
  whatsapp_clicks: number
  favorite_count: number
  conversion_rate: string
  published_at: string
}

type AgencyStats = {
  overview: Overview
  statusDist: StatusDist
  topListings: TopListing[]
  trend: Trend
}

type PerformanceRow = {
  id: string
  title: string
  status: string
  listing_type: string
  property_type: string
  city: string
  district: string
  price: string
  currency: string
  area_m2: number | null
  view_count: number
  whatsapp_clicks: number
  favorite_count: number
  conversion_rate: string
  lead_count: number
  legal_count: number
  cover_url: string | null
  published_at: string
  created_at: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('tr-TR')
}

function statusLabel(s: string) {
  const m: Record<string, string> = {
    active: 'Aktif', passive: 'Pasif', sold: 'Satıldı',
    rented: 'Kiralandı', pending: 'Bekliyor', rejected: 'Reddedildi',
  }
  return m[s] ?? s
}

function statusColor(s: string) {
  const m: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    passive: 'bg-gray-100 text-gray-600',
    sold: 'bg-blue-100 text-blue-700',
    rented: 'bg-purple-100 text-purple-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
  }
  return m[s] ?? 'bg-gray-100 text-gray-600'
}

function currencySymbol(c: string) {
  return c === 'USD' ? '$' : c === 'EUR' ? '€' : '₺'
}

// Minimal sparkline SVG (no dependency)
function Sparkline({ data, color = '#2dd4bf' }: { data: number[]; color?: string }) {
  if (data.length < 2) return <span className="text-xs text-gray-300">—</span>
  const max = Math.max(...data, 1)
  const min = Math.min(...data)
  const range = max - min || 1
  const W = 80; const H = 28
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / range) * H
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="inline-block">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

// KPI card
function KpiCard({ label, value, sub, sparkData, sparkColor }: {
  label: string; value: string | number; sub?: string
  sparkData?: number[]; sparkColor?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-2">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {sparkData && <Sparkline data={sparkData} color={sparkColor} />}
      </div>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AnalitikPage() {
  const { accessToken, user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  const [stats, setStats] = useState<AgencyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Performance table
  const [perfPage, setPerfPage] = useState(1)
  const [perfSort, setPerfSort] = useState<'views' | 'wa' | 'favorites'>('views')
  const [perfData, setPerfData] = useState<{ data: PerformanceRow[]; total: number } | null>(null)
  const [perfLoading, setPerfLoading] = useState(false)

  const fetchStats = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE}/analytics/agency`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Hata')
      setStats(json.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Veri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  const fetchPerf = useCallback(async () => {
    if (!accessToken) return
    setPerfLoading(true)
    try {
      const res = await fetch(
        `${BASE}/analytics/agency/listings?page=${perfPage}&limit=15&sort=${perfSort}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      const json = await res.json()
      if (res.ok) setPerfData(json)
    } finally {
      setPerfLoading(false)
    }
  }, [accessToken, perfPage, perfSort])

  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { fetchPerf() }, [fetchPerf])

  async function handleExport() {
    if (!accessToken) return
    const res = await fetch(`${BASE}/analytics/agency/export`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ilanlar-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-red-600 text-sm">{error}</div>
      </div>
    )
  }

  if (!stats) return null

  const { overview, statusDist, topListings, trend } = stats

  // Build daily series aligned to last 30 days
  const waSeries = trend.waClicks.map((d) => d.clicks)
  const newListingSeries = trend.newListings.map((d) => d.new_listings)

  const totalInDist = statusDist.reduce((s, r) => s + r.cnt, 0) || 1

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analitik & Raporlama</h1>
          <p className="text-sm text-gray-400 mt-1">İlan performansı, dönüşüm ve trend verileri</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-teal text-white text-sm font-semibold rounded-lg hover:bg-teal/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          CSV İndir
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <KpiCard label="Toplam İlan" value={fmt(overview.totalListings)}
          sub={`${overview.activeListings} aktif`} />
        <KpiCard label="Toplam Görüntülenme" value={fmt(overview.totalViews)}
          sparkData={waSeries.length ? waSeries : undefined} sparkColor="#6366f1"
          sub={`Ort. ${fmt(overview.avgViewsPerListing)}/ilan`} />
        <KpiCard label="WhatsApp Tıklama" value={fmt(overview.totalWaClicks)}
          sparkData={waSeries} sparkColor="#25D366"
          sub={`Dönüşüm %${overview.waConversionRate}`} />
        <KpiCard label="Favori" value={fmt(overview.totalFavorites)} />
        <KpiCard label="Mortgage Lead" value={fmt(overview.mortgageLeads)} />
        <KpiCard label="Hukuki Talep" value={fmt(overview.legalCases)} />
        <KpiCard label="Yeni İlan (30g)" value={fmt(newListingSeries.reduce((a, b) => a + b, 0))}
          sparkData={newListingSeries} sparkColor="#f59e0b" />
        <KpiCard label="WA Dönüşüm" value={`%${overview.waConversionRate}`}
          sub="Görüntülenme → WA" />
      </div>

      {/* Status Distribution + Top Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status dist */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">İlan Durum Dağılımı</h2>
          <div className="space-y-3">
            {statusDist.map((row) => {
              const pct = Math.round((row.cnt / totalInDist) * 100)
              return (
                <div key={row.status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(row.status)}`}>
                      {statusLabel(row.status)}
                    </span>
                    <span className="text-xs text-gray-500">{row.cnt} ilan · %{pct}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-teal transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top 10 listings */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">En Çok Görüntülenen 10 İlan</h2>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {topListings.map((l, i) => (
              <div key={l.id} className="flex items-center gap-3">
                <span className="w-5 text-xs text-gray-400 font-mono shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{l.title}</p>
                  <p className="text-xs text-gray-400">{l.city} · {l.listing_type === 'sale' ? 'Satılık' : 'Kiralık'}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-gray-700">{fmt(l.view_count)} görüntülenme</p>
                  <p className="text-xs text-emerald-600">%{l.conversion_rate} dönüşüm</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart title="Son 30 Günlük WA Tıklamaları" data={trend.waClicks.map((d) => ({ day: d.day, value: d.clicks }))} color="#25D366" />
        <TrendChart title="Son 30 Günlük Yeni İlanlar" data={trend.newListings.map((d) => ({ day: d.day, value: d.new_listings }))} color="#f59e0b" />
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-semibold text-gray-700">İlan Performans Tablosu</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Sırala:</span>
            {(['views', 'wa', 'favorites'] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setPerfSort(s); setPerfPage(1) }}
                className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                  perfSort === s ? 'border-teal bg-teal text-white' : 'border-gray-200 text-gray-600 hover:border-teal'
                }`}
              >
                {s === 'views' ? 'Görüntülenme' : s === 'wa' ? 'WhatsApp' : 'Favori'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-50">
                <th className="text-left px-6 py-3 font-medium">İlan</th>
                <th className="text-right px-4 py-3 font-medium">Görüntülenme</th>
                <th className="text-right px-4 py-3 font-medium">WA Tıklama</th>
                <th className="text-right px-4 py-3 font-medium">Favori</th>
                <th className="text-right px-4 py-3 font-medium">Dönüşüm</th>
                <th className="text-right px-4 py-3 font-medium">Lead</th>
                <th className="text-center px-4 py-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody>
              {perfLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-300">Yükleniyor…</td>
                </tr>
              ) : (perfData?.data ?? []).map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="max-w-xs">
                      <p className="font-medium text-gray-800 truncate">{row.title}</p>
                      <p className="text-gray-400">{row.city}{row.district ? `, ${row.district}` : ''} · {row.listing_type === 'sale' ? 'Satılık' : 'Kiralık'}</p>
                      {row.price && (
                        <p className="text-gray-500 font-medium">
                          {Number(row.price).toLocaleString('tr-TR')} {currencySymbol(row.currency)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-700">{fmt(row.view_count)}</td>
                  <td className="px-4 py-3 text-right text-emerald-600 font-semibold">{fmt(row.whatsapp_clicks)}</td>
                  <td className="px-4 py-3 text-right text-rose-500 font-semibold">{fmt(row.favorite_count)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-semibold ${Number(row.conversion_rate) >= 5 ? 'text-emerald-600' : Number(row.conversion_rate) >= 2 ? 'text-yellow-600' : 'text-gray-400'}`}>
                      %{row.conversion_rate}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.lead_count > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-blue-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V3z"/><path fillRule="evenodd" d="M2 7h16v9a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm4 2a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg>
                        {row.lead_count}
                      </span>
                    )}
                    {row.legal_count > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-purple-600 ml-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                        {row.legal_count}
                      </span>
                    )}
                    {row.lead_count === 0 && row.legal_count === 0 && <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(row.status)}`}>
                      {statusLabel(row.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {perfData && perfData.total > 15 && (
          <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Toplam {fmt(perfData.total)} ilan · Sayfa {perfPage} / {Math.ceil(perfData.total / 15)}
            </p>
            <div className="flex gap-2">
              <button
                disabled={perfPage <= 1}
                onClick={() => setPerfPage((p) => p - 1)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:border-teal transition-colors"
              >
                ← Önceki
              </button>
              <button
                disabled={perfPage >= Math.ceil(perfData.total / 15)}
                onClick={() => setPerfPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:border-teal transition-colors"
              >
                Sonraki →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Admin section placeholder */}
      {isAdmin && <AdminStats accessToken={accessToken!} />}
    </div>
  )
}

// ── Trend Chart (SVG bar chart) ───────────────────────────────────────────────

function TrendChart({ title, data, color }: {
  title: string
  data: { day: string; value: number }[]
  color: string
}) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">{title}</h2>
        <p className="text-xs text-gray-300 text-center py-8">Veri yok</p>
      </div>
    )
  }

  const max = Math.max(...data.map((d) => d.value), 1)
  const W = 400; const H = 80; const BAR_GAP = 2
  const barW = Math.max(2, (W - BAR_GAP * (data.length - 1)) / data.length)

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H + 20}`}
          preserveAspectRatio="none"
          style={{ minWidth: 260, height: 100 }}
        >
          {data.map((d, i) => {
            const barH = Math.max(2, (d.value / max) * H)
            const x = i * (barW + BAR_GAP)
            const y = H - barH
            return (
              <g key={d.day}>
                <rect x={x} y={y} width={barW} height={barH} fill={color} fillOpacity={0.75} rx={1} />
                {data.length <= 14 && (
                  <text x={x + barW / 2} y={H + 14} textAnchor="middle" fontSize={7} fill="#9ca3af">
                    {d.day.slice(5)}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <span>{data[0]?.day?.slice(0, 10) ?? ''}</span>
        <span>Maks: {fmt(max)}</span>
        <span>{data[data.length - 1]?.day?.slice(0, 10) ?? ''}</span>
      </div>
    </div>
  )
}

// ── Admin Stats Section ───────────────────────────────────────────────────────

type AdminOverview = {
  users: { total: number; new30d: number; agencies: number; buyers: number; lawyers: number }
  listings: { total: number; active: number; new30d: number; totalViews: number; totalWa: number }
  waClicks30d: number
  legalCases: { total: number; approved: number }
  mortgageLeads: number
}

type TopAgency = {
  id: string; company_name: string; city: string; plan: string
  listing_count: number; total_views: number; total_wa: number
}

type AdminStats = {
  platform: AdminOverview
  topAgencies: TopAgency[]
  recentActivity: { day: string; new_users: number; new_listings: number; wa_clicks: number }[]
  cityDist: { city: string; count: number }[]
}

function AdminStats({ accessToken }: { accessToken: string }) {
  const [data, setData] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BASE}/analytics/admin`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((j) => setData(j.data))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [accessToken])

  if (loading) return <div className="text-xs text-gray-400 py-4">Admin verileri yükleniyor…</div>
  if (!data) return null

  const { platform, topAgencies, recentActivity, cityDist } = data
  const p = platform

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-800 border-t border-gray-200 pt-6">Platform Genel Görünüm (Admin)</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="Toplam Kullanıcı" value={fmt(p.users.total)} sub={`+${p.users.new30d} bu ay`} />
        <KpiCard label="Ajans" value={fmt(p.users.agencies)} />
        <KpiCard label="Toplam İlan" value={fmt(p.listings.total)} sub={`${p.listings.active} aktif`} />
        <KpiCard label="WA Tıklama (30g)" value={fmt(p.waClicks30d)} />
      </div>

      {/* Top agencies */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">En Çok İlan Veren Ajanslar</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-50">
                <th className="text-left py-2 font-medium">#</th>
                <th className="text-left py-2 font-medium">Ajans</th>
                <th className="text-left py-2 font-medium">Şehir</th>
                <th className="text-left py-2 font-medium">Plan</th>
                <th className="text-right py-2 font-medium">İlan</th>
                <th className="text-right py-2 font-medium">Görüntülenme</th>
                <th className="text-right py-2 font-medium">WA</th>
              </tr>
            </thead>
            <tbody>
              {topAgencies.map((a, i) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-2 text-gray-400">{i + 1}</td>
                  <td className="py-2 font-medium text-gray-800">{a.company_name}</td>
                  <td className="py-2 text-gray-500">{a.city}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      a.plan === 'pro' ? 'bg-gold/20 text-yellow-700'
                      : a.plan === 'enterprise' ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
                    }`}>{a.plan}</span>
                  </td>
                  <td className="py-2 text-right font-semibold">{fmt(a.listing_count)}</td>
                  <td className="py-2 text-right text-gray-600">{fmt(a.total_views)}</td>
                  <td className="py-2 text-right text-emerald-600">{fmt(a.total_wa)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* City distribution */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Şehir Dağılımı (Aktif İlanlar, Top 15)</h3>
        <div className="space-y-2">
          {cityDist.map((c) => {
            const maxC = cityDist[0]?.count ?? 1
            const pct = Math.round((c.count / maxC) * 100)
            return (
              <div key={c.city} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-24 shrink-0 truncate">{c.city}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-indigo-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-12 text-right">{fmt(c.count)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent activity mini chart */}
      <TrendChart
        title="Son 14 Gün — Yeni Kullanıcı"
        data={recentActivity.map((r) => ({ day: r.day, value: r.new_users }))}
        color="#6366f1"
      />
    </div>
  )
}
