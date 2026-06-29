'use client'
import { useState } from 'react'
import { useAuthStore } from '../../../store/auth'
import { partnerApi } from '../../../lib/api'

const CONTENT_TYPES = [
  { value: 'blog', label: 'Blog Yazısı', icon: '📝', desc: 'SEO uyumlu 800-1200 kelime' },
  { value: 'social_pack', label: 'Sosyal Medya', icon: '📱', desc: 'Instagram + Twitter + LinkedIn' },
  { value: 'listing_desc', label: 'İlan Açıklaması', icon: '🏠', desc: 'Profesyonel satış metni' },
  { value: 'market_report', label: 'Piyasa Raporu', icon: '📊', desc: 'Şehir bazlı analiz raporu' },
]

const TONES = [
  { value: 'professional', label: 'Profesyonel' },
  { value: 'friendly', label: 'Samimi' },
  { value: 'urgent', label: 'Acil / Dikkat Çekici' },
]

type GenState = 'idle' | 'loading' | 'done' | 'error'

export default function IcerikPage() {
  const { accessToken } = useAuthStore()
  const [type, setType] = useState('blog')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [state, setState] = useState<GenState>('idle')
  const [result, setResult] = useState<{ content: string; wordCount: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<Array<{ type: string; topic: string; content: string; wordCount: number }>>([])

  const generate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken || !topic.trim()) return
    setState('loading')
    setResult(null)
    try {
      const res = await partnerApi.generateContent(accessToken, { type, topic, tone })
      const data = res.data
      setResult(data)
      setHistory((h) => [{ type, topic, content: data.content, wordCount: data.wordCount }, ...h.slice(0, 9)])
      setState('done')
    } catch {
      setState('error')
    }
  }

  const copy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const selectedType = CONTENT_TYPES.find((t) => t.value === type)

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink">AI İçerik Fabrikası</h1>
        <p className="text-muted text-sm mt-1">
          SCRIBE AI ile blog yazısı, ilan metni ve sosyal medya içeriği üretin.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">

        {/* Form */}
        <div className="space-y-5">
          <div className="card p-6">
            <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-3">İçerik Türü</label>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.value}
                  type="button"
                  onClick={() => setType(ct.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    type === ct.value
                      ? 'border-teal bg-teal/5 text-ink'
                      : 'border-gray-200 text-muted hover:border-gray-300 hover:text-ink'
                  }`}
                >
                  <div className="text-xl mb-1">{ct.icon}</div>
                  <div className="text-sm font-semibold">{ct.label}</div>
                  <div className="text-xs mt-0.5">{ct.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={generate} className="card p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                Konu / Prompt
              </label>
              <textarea
                required
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                  type === 'blog' ? 'Örn: İstanbul Kadıköy 2026 kira fiyatları ve trend analizi'
                  : type === 'social_pack' ? 'Örn: 3+1 Deniz manzaralı daire — Antalya Lara'
                  : type === 'listing_desc' ? 'Örn: 4+1, 180m², Bosphorus view, Beşiktaş'
                  : 'Örn: Ankara Çankaya konut piyasası Q2 2026 raporu'
                }
                className="input-base resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-2">Ton</label>
              <div className="flex gap-2 flex-wrap">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    className={`px-4 py-2 rounded-xl text-sm transition-all border ${
                      tone === t.value
                        ? 'border-teal bg-teal text-white'
                        : 'border-gray-200 text-muted hover:border-teal hover:text-ink'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={state === 'loading' || !topic.trim()}
              className="btn-primary w-full py-3"
            >
              {state === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                  SCRIBE üretiyor...
                </span>
              ) : (
                `${selectedType?.icon} ${selectedType?.label} Üret`
              )}
            </button>

            {state === 'error' && (
              <p className="text-sm text-red-600 text-center">
                Üretim başarısız. ANTHROPIC_API_KEY staging ortamında tanımlı mı?
              </p>
            )}
          </form>
        </div>

        {/* Result */}
        <div>
          {state === 'idle' && history.length === 0 && (
            <div className="card p-10 text-center">
              <div className="text-5xl mb-4">✍️</div>
              <p className="text-sm font-medium text-ink">İçerik üretilecek</p>
              <p className="text-xs text-muted mt-1">Konu girin ve SCRIBE'ı çalıştırın.</p>
            </div>
          )}

          {(state === 'done' || state === 'loading') && result && (
            <div className="card overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-ink">{selectedType?.label}</span>
                  {result.wordCount > 0 && (
                    <span className="text-xs text-muted ml-2">· {result.wordCount} kelime</span>
                  )}
                </div>
                <button
                  onClick={copy}
                  className="text-xs text-teal hover:text-teal/70 font-semibold transition-colors"
                >
                  {copied ? '✓ Kopyalandı!' : '📋 Kopyala'}
                </button>
              </div>
              <div className="p-5 max-h-[500px] overflow-y-auto">
                <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{result.content}</p>
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 1 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Geçmiş</p>
              <div className="space-y-2">
                {history.slice(1).map((h, i) => (
                  <button
                    key={i}
                    onClick={() => setResult({ content: h.content, wordCount: h.wordCount })}
                    className="w-full card p-4 text-left hover:border-teal/30 transition-colors"
                  >
                    <p className="text-xs font-semibold text-ink line-clamp-1">{h.topic}</p>
                    <p className="text-xs text-muted mt-0.5">{CONTENT_TYPES.find(t => t.value === h.type)?.label} · {h.wordCount} kelime</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
