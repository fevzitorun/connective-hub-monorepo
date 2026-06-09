'use client'
import { useState } from 'react'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

interface Props {
  listingId: string
  city: string
  district?: string
  neighborhood?: string
  propertyType: string
  listingType: string
  roomCount?: string
  areaM2?: number
  buildingAge?: number
  floorNo?: number
  totalFloors?: number
  hasParking?: boolean
  hasElevator?: boolean
  price?: number
  title: string
  description?: string
}

type AnalysisState = {
  valuation: ValuationData | null
  legal: LegalData | null
  neighborhood: NeighborhoodData | null
}

type ValuationData = {
  estimatedMin: number
  estimatedMax: number
  pricePerM2: number
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
  comparablesUsed: number
}

type LegalData = {
  riskScore: number
  redFlags: string[]
  checklist: string[]
  summary: string
}

type NeighborhoodData = {
  transport: number
  education: number
  health: number
  shopping: number
  social: number
  safety: number
  greenSpace: number
  investment: number
  overall: number
  summary: string
  pros: string[]
  cons: string[]
}

export function ListingFilterra(props: Props) {
  const [analysis, setAnalysis] = useState<AnalysisState | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'valuation' | 'legal' | 'neighborhood'>('valuation')
  const [marketTrend, setMarketTrend] = useState<MarketTrendData | null>(null)
  const [loadingTrend, setLoadingTrend] = useState(false)

  async function runAnalysis() {
    setLoading(true)
    setError(null)
    setExpanded(true)
    try {
      const body = {
        input: {
          city: props.city,
          district: props.district,
          neighborhood: props.neighborhood,
          propertyType: props.propertyType,
          listingType: props.listingType,
          roomCount: props.roomCount,
          areaM2: props.areaM2,
          buildingAge: props.buildingAge,
          floorNo: props.floorNo,
          totalFloors: props.totalFloors,
          hasParking: props.hasParking,
          hasElevator: props.hasElevator,
          price: props.price,
          title: props.title,
          description: props.description,
        },
      }

      const res = await fetch(`${BASE}/filterra/full/${props.listingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      setAnalysis(json.data)
    } catch {
      setError('Analiz yüklenemedi. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  async function loadMarketTrend() {
    if (marketTrend || loadingTrend) return
    setLoadingTrend(true)
    try {
      const params = new URLSearchParams({
        city: props.city,
        propertyType: props.propertyType,
        listingType: props.listingType,
        ...(props.district ? { district: props.district } : {}),
      })
      const res = await fetch(`${BASE}/filterra/market-trend?${params}`)
      const json = await res.json()
      setMarketTrend(json.data)
    } catch { /* non-critical */ }
    finally { setLoadingTrend(false) }
  }

  return (
    <div className="rounded-2xl border border-gold/30 overflow-hidden bg-gradient-to-br from-ink/3 to-gold/3">
      {/* Header — always visible */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gold/5 transition-colors"
        onClick={() => {
          if (!expanded) runAnalysis()
          else setExpanded((v) => !v)
        }}
      >
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gold tracking-widest">FILTERRA</span>
              <span className="text-xs text-muted">.AI Analizi</span>
            </div>
            <p className="text-[11px] text-muted/70 mt-0.5">
              Ekspertiz · Hukuki Ön İnceleme · Mahalle Skoru
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!expanded && !loading && (
            <span className="text-xs bg-gold/10 text-gold px-3 py-1 rounded-full font-medium">
              Analiz Başlat →
            </span>
          )}
          {loading && (
            <span className="text-xs text-muted animate-pulse">Analiz ediliyor...</span>
          )}
          {expanded && !loading && (
            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div>
          {/* Tabs */}
          <div className="flex border-t border-b border-border bg-white/60">
            {[
              { id: 'valuation', label: '📊 Ekspertiz' },
              { id: 'legal', label: '⚖️ Hukuki' },
              { id: 'neighborhood', label: '🏘️ Mahalle' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab)
                  if (tab.id === 'neighborhood') loadMarketTrend()
                }}
                className={`flex-1 text-xs py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-gold border-b-2 border-gold bg-white'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3 mb-4 flex items-center justify-between">
                <span>{error}</span>
                <button onClick={runAnalysis} className="text-red-500 hover:text-red-700 font-medium ml-3">
                  Tekrar Dene
                </button>
              </div>
            )}

            {loading && (
              <div className="space-y-3 py-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-cream rounded-lg animate-pulse" />
                ))}
              </div>
            )}

            {!loading && analysis && (
              <>
                {activeTab === 'valuation' && analysis.valuation && (
                  <ValuationView data={analysis.valuation} askingPrice={props.price} />
                )}
                {activeTab === 'legal' && analysis.legal && (
                  <LegalView data={analysis.legal} />
                )}
                {activeTab === 'neighborhood' && analysis.neighborhood && (
                  <NeighborhoodView data={analysis.neighborhood} trend={marketTrend} loadingTrend={loadingTrend} />
                )}
              </>
            )}

            <p className="text-[10px] text-muted/50 text-center mt-5">
              Bu analiz yapay zeka tarafından üretilmiştir. Resmi ekspertiz ve hukuki danışmanlık yerine geçmez.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-views ─────────────────────────────────────────────────────────────────

function ValuationView({ data, askingPrice }: { data: ValuationData; askingPrice?: number }) {
  const confidenceColor = { high: 'text-green-600', medium: 'text-gold', low: 'text-red-500' }[data.confidence]
  const confidenceLabel = { high: 'Güven: Yüksek', medium: 'Güven: Orta', low: 'Güven: Düşük' }[data.confidence]

  const priceDiff = askingPrice && data.estimatedMax
    ? ((askingPrice - data.estimatedMax) / data.estimatedMax) * 100
    : null

  return (
    <div className="space-y-4">
      <div className="bg-white border border-border rounded-xl p-5 text-center">
        <p className="text-xs text-muted mb-1">FILTERRA Tahmini Değer Aralığı</p>
        <p className="text-2xl font-display font-bold text-ink">
          {data.estimatedMin.toLocaleString('tr-TR')} – {data.estimatedMax.toLocaleString('tr-TR')}
          <span className="text-base font-normal text-muted ml-1">TL</span>
        </p>
        {data.pricePerM2 > 0 && (
          <p className="text-xs text-muted mt-0.5">{data.pricePerM2.toLocaleString('tr-TR')} TL/m² piyasa ortalaması</p>
        )}
        <span className={`inline-block mt-2 text-xs ${confidenceColor} font-medium`}>{confidenceLabel}</span>
      </div>

      {priceDiff !== null && (
        <div className={`text-center text-sm font-medium px-4 py-2 rounded-lg ${
          priceDiff > 10 ? 'bg-red-50 text-red-600' :
          priceDiff < -10 ? 'bg-green-50 text-green-600' :
          'bg-gold/10 text-gold'
        }`}>
          {priceDiff > 0 ? `Piyasa değerinin %${priceDiff.toFixed(0)} üzerinde fiyatlandırılmış` :
           priceDiff < 0 ? `Piyasa değerinin %${Math.abs(priceDiff).toFixed(0)} altında — cazip fırsat` :
           'Piyasa değeriyle uyumlu'}
        </div>
      )}

      {data.reasoning && (
        <p className="text-xs text-muted leading-relaxed">{data.reasoning}</p>
      )}
      {data.comparablesUsed > 0 && (
        <p className="text-[10px] text-muted/60 text-center">{data.comparablesUsed} emsal ilan analiz edildi</p>
      )}
    </div>
  )
}

function LegalView({ data }: { data: LegalData }) {
  const riskLabel = data.riskScore < 30 ? 'Düşük Risk' : data.riskScore < 60 ? 'Orta Risk' : 'Yüksek Risk'
  const riskColor = data.riskScore < 30 ? 'bg-green-500' : data.riskScore < 60 ? 'bg-gold' : 'bg-red-500'

  return (
    <div className="space-y-4">
      <div className="bg-white border border-border rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
            <div className={`h-full ${riskColor} rounded-full transition-all`} style={{ width: `${data.riskScore}%` }} />
          </div>
          <span className="text-sm font-bold text-ink w-12 text-right">{data.riskScore}/100</span>
        </div>
        <p className="text-xs font-semibold text-ink">{riskLabel}</p>
        {data.summary && <p className="text-xs text-muted mt-1 leading-relaxed">{data.summary}</p>}
      </div>

      {data.redFlags.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-600 mb-2">⚠️ Dikkat Edilmesi Gerekenler</p>
          <ul className="space-y-1.5">
            {data.redFlags.map((flag, i) => (
              <li key={i} className="text-xs text-red-700 flex gap-1.5">
                <span className="flex-shrink-0">•</span>{flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.checklist.length > 0 && (
        <div className="bg-white border border-border rounded-xl p-4">
          <p className="text-xs font-semibold text-ink mb-2">✅ Alıcı Kontrol Listesi</p>
          <ul className="space-y-1.5">
            {data.checklist.map((item, i) => (
              <li key={i} className="text-xs text-muted flex gap-2">
                <span className="text-teal flex-shrink-0 font-medium">{i + 1}.</span>{item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

type MarketTrendData = {
  trend: 'rising' | 'stable' | 'falling'
  trendPercent: number
  activeListings: number
  avgDaysOnMarket: number
  summary: string
  recommendation: string
}

function NeighborhoodView({
  data, trend, loadingTrend,
}: {
  data: NeighborhoodData
  trend: MarketTrendData | null
  loadingTrend: boolean
}) {
  const scores = [
    { label: 'Ulaşım', value: data.transport },
    { label: 'Eğitim', value: data.education },
    { label: 'Sağlık', value: data.health },
    { label: 'Alışveriş', value: data.shopping },
    { label: 'Sosyal', value: data.social },
    { label: 'Güvenlik', value: data.safety },
    { label: 'Yeşil Alan', value: data.greenSpace },
    { label: 'Yatırım', value: data.investment },
  ]

  const trendIcon = trend?.trend === 'rising' ? '📈' : trend?.trend === 'falling' ? '📉' : '➡️'

  return (
    <div className="space-y-4">
      {/* Overall score */}
      <div className="bg-white border border-border rounded-xl p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-gold">{data.overall}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink">Mahalle Skoru</p>
          {data.summary && <p className="text-xs text-muted mt-0.5 leading-snug">{data.summary}</p>}
        </div>
      </div>

      {/* Score bars */}
      <div className="bg-white border border-border rounded-xl p-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {scores.map(({ label, value }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-muted">{label}</span>
                <span className="text-[11px] font-medium text-ink">{value}/10</span>
              </div>
              <div className="h-1.5 bg-cream rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${value >= 7 ? 'bg-teal' : value >= 5 ? 'bg-gold' : 'bg-red-400'}`}
                  style={{ width: `${value * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pros / Cons */}
      {(data.pros.length > 0 || data.cons.length > 0) && (
        <div className="flex flex-wrap gap-1.5">
          {data.pros.slice(0, 4).map((p, i) => (
            <span key={i} className="text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded-full">+ {p}</span>
          ))}
          {data.cons.slice(0, 3).map((c, i) => (
            <span key={i} className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full">- {c}</span>
          ))}
        </div>
      )}

      {/* Market trend */}
      {loadingTrend && (
        <div className="h-16 bg-cream rounded-xl animate-pulse" />
      )}
      {trend && (
        <div className="bg-white border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span>{trendIcon}</span>
            <span className="text-xs font-semibold text-ink">Piyasa Trendi</span>
            {trend.trendPercent !== 0 && (
              <span className={`text-xs font-medium ml-auto ${trend.trend === 'rising' ? 'text-green-600' : trend.trend === 'falling' ? 'text-red-500' : 'text-gold'}`}>
                {trend.trendPercent > 0 ? '+' : ''}{trend.trendPercent.toFixed(1)}%
              </span>
            )}
          </div>
          {trend.summary && <p className="text-xs text-muted leading-snug">{trend.summary}</p>}
          {trend.recommendation && (
            <p className="text-xs text-teal font-medium mt-2">{trend.recommendation}</p>
          )}
          <div className="flex gap-4 mt-2 text-[10px] text-muted/60">
            {trend.activeListings > 0 && <span>{trend.activeListings} aktif ilan</span>}
            {trend.avgDaysOnMarket > 0 && <span>Ort. {trend.avgDaysOnMarket} gün satışta</span>}
          </div>
        </div>
      )}
    </div>
  )
}
