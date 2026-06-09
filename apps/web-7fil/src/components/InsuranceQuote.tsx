'use client'
import { useState } from 'react'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

type ConstructionType = 'betonarme' | 'yigma' | 'hafif_celik' | 'wood'

interface DASKResult {
  zone: number
  coverageAmount: number
  annualPremium: number
  monthlyPremium: number
  breakdown: {
    baseRate: number
    constructionFactor: number
    ageFactor: number
    zoneLabel: string
  }
}

interface KonutResult {
  coverageType: 'basic' | 'comprehensive'
  contentValue: number
  annualPremium: number
  monthlyPremium: number
}

interface CombinedResult {
  dask: DASKResult
  konutBasic: KonutResult
  konutComprehensive: KonutResult
}

interface Props {
  listingId?: string
  defaultArea?: number
  defaultCity?: string
  defaultBuildingAge?: number
  compact?: boolean
}

const CONSTRUCTION_LABELS: Record<ConstructionType, string> = {
  betonarme: 'Betonarme',
  yigma: 'Yığma',
  hafif_celik: 'Hafif Çelik',
  wood: 'Ahşap',
}

export function InsuranceQuote({ listingId, defaultArea, defaultCity, defaultBuildingAge, compact = false }: Props) {
  const [area, setArea] = useState(defaultArea ?? 100)
  const [city, setCity] = useState(defaultCity ?? 'İstanbul')
  const [buildingAge, setBuildingAge] = useState(defaultBuildingAge ?? 10)
  const [constructionType, setConstructionType] = useState<ConstructionType>('betonarme')
  const [result, setResult] = useState<CombinedResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedKonut, setSelectedKonut] = useState<'basic' | 'comprehensive'>('basic')

  async function calculate() {
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/finance/insurance/combined`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          areaM2: area,
          city,
          constructionType,
          buildingAge,
          listingId,
        }),
      })
      const json = await res.json()
      if (res.ok) setResult(json.data)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  const riskColor = (zone: number) =>
    zone <= 1 ? 'text-red-600' : zone <= 2 ? 'text-gold' : zone <= 3 ? 'text-blue-600' : 'text-green-600'

  const riskLabel = (zone: number) =>
    zone <= 1 ? 'Çok Yüksek Risk' : zone <= 2 ? 'Yüksek Risk' : zone <= 3 ? 'Orta Risk' : 'Düşük Risk'

  return (
    <div className={`card ${compact ? 'p-4' : 'p-6'}`}>
      {!compact && (
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-ink text-sm">Sigorta Teklifi</h3>
            <p className="text-xs text-muted">DASK (zorunlu) + Konut Sigortası</p>
          </div>
        </div>
      )}

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted block mb-1">Brüt Alan (m²)</label>
            <input
              type="number" value={area} onChange={(e) => setArea(Number(e.target.value))}
              className="input text-sm w-full"
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Bina Yaşı</label>
            <input
              type="number" min={0} max={100} value={buildingAge}
              onChange={(e) => setBuildingAge(Number(e.target.value))}
              className="input text-sm w-full"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted block mb-1">Şehir</label>
          <input
            value={city} onChange={(e) => setCity(e.target.value)}
            placeholder="İstanbul, Ankara, İzmir..."
            className="input text-sm w-full"
          />
        </div>

        <div>
          <label className="text-xs text-muted block mb-1">Yapı Tipi</label>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(CONSTRUCTION_LABELS) as ConstructionType[]).map((t) => (
              <button
                key={t}
                onClick={() => setConstructionType(t)}
                className={`py-1.5 text-xs rounded-lg border transition-colors ${
                  constructionType === t
                    ? 'border-teal bg-teal/5 text-teal font-medium'
                    : 'border-border text-muted hover:border-teal/40'
                }`}
              >
                {CONSTRUCTION_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={calculate} disabled={loading} className="btn-primary w-full text-sm py-2.5 mb-4">
        {loading ? 'Hesaplanıyor...' : 'Teklif Al'}
      </button>

      {result && (
        <div className="space-y-4">
          {/* DASK */}
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-ink">DASK (Zorunlu Deprem Sigortası)</p>
                <p className={`text-[10px] font-medium ${riskColor(result.dask.zone)}`}>
                  {result.dask.breakdown.zoneLabel} · {riskLabel(result.dask.zone)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-ink">{result.dask.annualPremium.toLocaleString('tr-TR')} ₺</p>
                <p className="text-[10px] text-muted">yıllık prim</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white rounded-lg p-2.5">
                <p className="text-muted">Teminat Bedeli</p>
                <p className="font-semibold text-ink">{result.dask.coverageAmount.toLocaleString('tr-TR')} ₺</p>
              </div>
              <div className="bg-white rounded-lg p-2.5">
                <p className="text-muted">Aylık Prim</p>
                <p className="font-semibold text-ink">{result.dask.monthlyPremium.toLocaleString('tr-TR')} ₺</p>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-muted/70 flex gap-3">
              <span>Yapı katsayısı: ×{result.dask.breakdown.constructionFactor}</span>
              <span>Yaş katsayısı: ×{result.dask.breakdown.ageFactor}</span>
              <span>Baz oran: ‰{result.dask.breakdown.baseRate}</span>
            </div>
          </div>

          {/* Konut Sigortası */}
          <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-ink mb-3">Konut Sigortası (İsteğe Bağlı)</p>

            <div className="flex rounded-lg border border-border p-0.5 mb-3 gap-0.5">
              {(['basic', 'comprehensive'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedKonut(t)}
                  className={`flex-1 py-1 text-[10px] font-medium rounded-md transition-colors ${
                    selectedKonut === t ? 'bg-teal text-white' : 'text-muted'
                  }`}
                >
                  {t === 'basic' ? 'Temel' : 'Kapsamlı'}
                </button>
              ))}
            </div>

            {(() => {
              const k = selectedKonut === 'basic' ? result.konutBasic : result.konutComprehensive
              return (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white rounded-lg p-2.5">
                    <p className="text-muted">Yıllık Prim</p>
                    <p className="font-bold text-ink text-base">{k.annualPremium.toLocaleString('tr-TR')} ₺</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5">
                    <p className="text-muted">Eşya Teminatı</p>
                    <p className="font-semibold text-ink">{k.contentValue.toLocaleString('tr-TR')} ₺</p>
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Total */}
          <div className="bg-ink/5 rounded-xl p-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted">Toplam Yıllık (DASK + Konut)</span>
              <span className="font-bold text-ink">
                {(result.dask.annualPremium + (selectedKonut === 'basic' ? result.konutBasic : result.konutComprehensive).annualPremium).toLocaleString('tr-TR')} ₺
              </span>
            </div>
          </div>

          <p className="text-[10px] text-muted/60 text-center">
            Tahmini primler TSB 2024 tarife tablolarına göre hesaplanmıştır. Kesin prim sigorta şirketi tarafından belirlenir.
          </p>
        </div>
      )}
    </div>
  )
}
