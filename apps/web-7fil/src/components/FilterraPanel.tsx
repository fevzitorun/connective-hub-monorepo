'use client'
import { useState, useRef } from 'react'
import { useAuthStore } from '../store/auth'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ListingInput {
  title: string
  city: string
  district?: string
  neighborhood?: string
  propertyType: string
  listingType: string
  roomCount?: string
  areaM2?: number
  floorNo?: number
  totalFloors?: number
  buildingAge?: number
  isFurnished?: boolean
  hasParking?: boolean
  hasElevator?: boolean
  hasBalcony?: boolean
  hasGarden?: boolean
  hasPool?: boolean
  category?: string
}

interface FilterraPanelProps {
  listingInput: ListingInput
  listingId?: string
  onDescriptionGenerated?: (text: string) => void
}

// ─── AI Yazım Paneli ──────────────────────────────────────────────────────────

export function FilterraPanel({ listingInput, listingId, onDescriptionGenerated }: FilterraPanelProps) {
  const { accessToken } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'writer' | 'titles' | 'valuation' | 'legal' | 'neighborhood'>('writer')
  const [streaming, setStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [titles, setTitles] = useState<string[] | null>(null)
  const [valuation, setValuation] = useState<ValuationResult | null>(null)
  const [legal, setLegal] = useState<LegalResult | null>(null)
  const [neighborhood, setNeighborhood] = useState<NeighborhoodResult | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // ── Writer (SSE) ──────────────────────────────────────────────────────────

  async function startStream() {
    if (!accessToken) return
    setStreaming(true)
    setStreamedText('')
    setError(null)
    abortRef.current = new AbortController()

    try {
      const res = await fetch(`${BASE}/filterra/write`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ input: listingInput, listingId }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error('AI servisi başlatılamadı')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.text) {
              fullText += data.text
              setStreamedText(fullText)
            }
            if (data.done) {
              onDescriptionGenerated?.(fullText)
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError('Açıklama oluşturulamadı. Lütfen tekrar deneyin.')
      }
    } finally {
      setStreaming(false)
    }
  }

  function stopStream() {
    abortRef.current?.abort()
    setStreaming(false)
  }

  // ── Titles ────────────────────────────────────────────────────────────────

  async function fetchTitles() {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE}/filterra/titles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ input: listingInput, listingId }),
      })
      const json = await res.json()
      setTitles(json.data?.alternatives ?? [])
    } catch {
      setError('Başlık önerileri alınamadı.')
    } finally {
      setLoading(false)
    }
  }

  // ── Valuation ─────────────────────────────────────────────────────────────

  async function fetchValuation() {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE}/filterra/valuate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ input: listingInput, listingId }),
      })
      const json = await res.json()
      setValuation(json.data)
    } catch {
      setError('Ekspertiz hesaplanamadı.')
    } finally {
      setLoading(false)
    }
  }

  // ── Legal ─────────────────────────────────────────────────────────────────

  async function fetchLegal() {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE}/filterra/legal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ input: listingInput, listingId }),
      })
      const json = await res.json()
      setLegal(json.data)
    } catch {
      setError('Hukuki kontrol yapılamadı.')
    } finally {
      setLoading(false)
    }
  }

  // ── Neighborhood ──────────────────────────────────────────────────────────

  async function fetchNeighborhood() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE}/filterra/neighborhood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: {
            city: listingInput.city,
            district: listingInput.district,
            neighborhood: listingInput.neighborhood,
            propertyType: listingInput.propertyType,
            listingType: listingInput.listingType,
          },
          listingId,
        }),
      })
      const json = await res.json()
      setNeighborhood(json.data)
    } catch {
      setError('Mahalle analizi yapılamadı.')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'writer', label: 'AI Yaz', icon: '✍️' },
    { id: 'titles', label: 'Başlık', icon: '🎯' },
    { id: 'valuation', label: 'Ekspertiz', icon: '📊' },
    { id: 'legal', label: 'Hukuki', icon: '⚖️' },
    { id: 'neighborhood', label: 'Mahalle', icon: '🏘️' },
  ] as const

  return (
    <div className="border border-gold/30 rounded-2xl overflow-hidden bg-gradient-to-br from-ink/5 to-gold/5">
      {/* Header */}
      <div className="px-5 py-3 bg-ink/5 border-b border-gold/20 flex items-center gap-2">
        <span className="text-xs font-bold text-gold tracking-widest">FILTERRA</span>
        <span className="text-xs text-muted">.AI ENGINE</span>
        <span className="ml-auto text-[10px] text-muted/60 bg-ink/5 px-2 py-0.5 rounded-full">claude-powered</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-white/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-xs py-2.5 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-gold border-b-2 border-gold bg-white'
                : 'text-muted hover:text-ink'
            }`}
          >
            <span className="hidden sm:inline">{tab.icon} </span>{tab.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        {/* AI Writer Tab */}
        {activeTab === 'writer' && (
          <div className="space-y-3">
            <p className="text-xs text-muted">
              İlan bilgilerinize göre profesyonel açıklama oluşturur (claude-sonnet-4-6).
            </p>
            {streamedText && (
              <div className="bg-white border border-border rounded-xl p-4 text-sm text-ink leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
                {streamedText}
                {streaming && <span className="animate-pulse text-gold">▌</span>}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={streaming ? stopStream : startStream}
                disabled={!accessToken}
                className={`flex-1 text-sm py-2.5 rounded-xl font-medium transition-colors ${
                  streaming
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'btn-primary'
                } disabled:opacity-50`}
              >
                {streaming ? '⏹ Durdur' : streamedText ? '🔄 Yeniden Üret' : '✨ AI ile Yaz'}
              </button>
              {streamedText && !streaming && (
                <button
                  onClick={() => onDescriptionGenerated?.(streamedText)}
                  className="px-4 py-2.5 rounded-xl border border-teal text-teal text-sm font-medium hover:bg-teal/5 transition-colors"
                >
                  Kullan →
                </button>
              )}
            </div>
            {!accessToken && (
              <p className="text-xs text-muted text-center">Bu özellik için giriş yapmanız gerekiyor.</p>
            )}
          </div>
        )}

        {/* Titles Tab */}
        {activeTab === 'titles' && (
          <div className="space-y-3">
            <p className="text-xs text-muted">
              3 farklı SEO dostu başlık alternatifi önerir (claude-haiku-4-5).
            </p>
            {titles && (
              <div className="space-y-2">
                {titles.map((t, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-border rounded-lg p-3">
                    <span className="text-xs text-gold font-bold w-4">{i + 1}</span>
                    <span className="text-sm text-ink flex-1">{t}</span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={fetchTitles}
              disabled={loading || !accessToken}
              className="w-full btn-primary text-sm py-2.5 disabled:opacity-50"
            >
              {loading ? 'Öneriliyor...' : titles ? '🔄 Yeniden Öner' : '🎯 Başlık Öner'}
            </button>
          </div>
        )}

        {/* Valuation Tab */}
        {activeTab === 'valuation' && (
          <div className="space-y-3">
            <p className="text-xs text-muted">
              Piyasa verilerine göre ekspertiz değeri hesaplar (claude-sonnet-4-6, agentic).
            </p>
            {valuation && <ValuationCard data={valuation} />}
            <button
              onClick={fetchValuation}
              disabled={loading || !accessToken}
              className="w-full btn-primary text-sm py-2.5 disabled:opacity-50"
            >
              {loading ? 'Hesaplanıyor...' : valuation ? '🔄 Yenile' : '📊 Ekspertiz Al'}
            </button>
          </div>
        )}

        {/* Legal Tab */}
        {activeTab === 'legal' && (
          <div className="space-y-3">
            <p className="text-xs text-muted">
              Türk gayrimenkul hukukuna göre risk analizi yapar (claude-opus-4-7).
            </p>
            {legal && <LegalCard data={legal} />}
            <button
              onClick={fetchLegal}
              disabled={loading || !accessToken}
              className="w-full btn-primary text-sm py-2.5 disabled:opacity-50"
            >
              {loading ? 'Analiz ediliyor...' : legal ? '🔄 Yenile' : '⚖️ Hukuki Kontrol'}
            </button>
          </div>
        )}

        {/* Neighborhood Tab */}
        {activeTab === 'neighborhood' && (
          <div className="space-y-3">
            <p className="text-xs text-muted">
              Mahallenin yaşam kalitesi ve yatırım potansiyelini puanlar (claude-sonnet-4-6).
            </p>
            {neighborhood && <NeighborhoodCard data={neighborhood} />}
            <button
              onClick={fetchNeighborhood}
              disabled={loading}
              className="w-full btn-primary text-sm py-2.5 disabled:opacity-50"
            >
              {loading ? 'Analiz ediliyor...' : neighborhood ? '🔄 Yenile' : '🏘️ Mahalle Analizi'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sub-cards ─────────────────────────────────────────────────────────────────

type ValuationResult = {
  estimatedMin: number
  estimatedMax: number
  pricePerM2: number
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
  comparablesUsed: number
}

function ValuationCard({ data }: { data: ValuationResult }) {
  const confidenceColor = { high: 'text-green-600', medium: 'text-gold', low: 'text-red-500' }[data.confidence]
  const confidenceLabel = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' }[data.confidence]

  return (
    <div className="bg-white border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">Tahmini Değer</span>
        <span className={`text-xs font-medium ${confidenceColor}`}>Güven: {confidenceLabel}</span>
      </div>
      <div className="text-center py-2">
        <p className="text-2xl font-bold text-ink">
          {data.estimatedMin.toLocaleString('tr-TR')} – {data.estimatedMax.toLocaleString('tr-TR')}
          <span className="text-sm font-normal text-muted ml-1">TL</span>
        </p>
        {data.pricePerM2 > 0 && (
          <p className="text-xs text-muted mt-1">{data.pricePerM2.toLocaleString('tr-TR')} TL/m²</p>
        )}
      </div>
      {data.reasoning && (
        <p className="text-xs text-muted leading-relaxed border-t border-border pt-3">{data.reasoning}</p>
      )}
      {data.comparablesUsed > 0 && (
        <p className="text-[10px] text-muted/60">{data.comparablesUsed} emsal ilan analiz edildi</p>
      )}
    </div>
  )
}

type LegalResult = {
  riskScore: number
  redFlags: string[]
  checklist: string[]
  summary: string
}

function LegalCard({ data }: { data: LegalResult }) {
  const riskColor =
    data.riskScore < 30 ? 'text-green-600 bg-green-50' :
    data.riskScore < 60 ? 'text-gold bg-gold/10' :
    'text-red-600 bg-red-50'
  const riskLabel = data.riskScore < 30 ? 'Düşük Risk' : data.riskScore < 60 ? 'Orta Risk' : 'Yüksek Risk'

  return (
    <div className="bg-white border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${riskColor}`}>
          {data.riskScore}/100
        </div>
        <span className="text-sm font-medium text-ink">{riskLabel}</span>
      </div>
      {data.summary && <p className="text-xs text-muted leading-relaxed">{data.summary}</p>}
      {data.redFlags.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-600 mb-1">⚠️ Dikkat Edilmesi Gerekenler</p>
          <ul className="space-y-1">
            {data.redFlags.map((flag, i) => (
              <li key={i} className="text-xs text-muted flex gap-1.5">
                <span className="text-red-400 flex-shrink-0">•</span>{flag}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.checklist.length > 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-xs font-semibold text-ink mb-1">✅ Kontrol Listesi</p>
          <ul className="space-y-1">
            {data.checklist.slice(0, 5).map((item, i) => (
              <li key={i} className="text-xs text-muted flex gap-1.5">
                <span className="text-teal flex-shrink-0">{i + 1}.</span>{item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

type NeighborhoodResult = {
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
  targetAudience: string
}

const SCORE_LABELS: { key: keyof NeighborhoodResult; label: string }[] = [
  { key: 'transport', label: 'Ulaşım' },
  { key: 'education', label: 'Eğitim' },
  { key: 'health', label: 'Sağlık' },
  { key: 'shopping', label: 'Alışveriş' },
  { key: 'social', label: 'Sosyal' },
  { key: 'safety', label: 'Güvenlik' },
  { key: 'greenSpace', label: 'Yeşil Alan' },
  { key: 'investment', label: 'Yatırım' },
]

function ScoreBar({ value }: { value: number }) {
  const color = value >= 7 ? 'bg-teal' : value >= 5 ? 'bg-gold' : 'bg-red-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-cream rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value * 10}%` }} />
      </div>
      <span className="text-xs text-muted w-4">{value}</span>
    </div>
  )
}

function NeighborhoodCard({ data }: { data: NeighborhoodResult }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">Mahalle Skoru</span>
        <span className="text-2xl font-bold text-gold">{data.overall}<span className="text-sm text-muted">/100</span></span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {SCORE_LABELS.map(({ key, label }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[11px] text-muted">{label}</span>
            </div>
            <ScoreBar value={data[key] as number} />
          </div>
        ))}
      </div>

      {data.summary && (
        <p className="text-xs text-muted leading-relaxed border-t border-border pt-3">{data.summary}</p>
      )}

      {data.pros.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.pros.map((p, i) => (
            <span key={i} className="text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded-full">+ {p}</span>
          ))}
          {data.cons.map((c, i) => (
            <span key={i} className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full">- {c}</span>
          ))}
        </div>
      )}

      {data.targetAudience && (
        <p className="text-[11px] text-muted border-t border-border pt-2">
          <span className="font-medium">Hedef kitle:</span> {data.targetAudience}
        </p>
      )}
    </div>
  )
}
