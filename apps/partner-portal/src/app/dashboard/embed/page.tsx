'use client'
import { useState } from 'react'
import { useAuthStore } from '../../../store/auth'
import { partnerApi } from '../../../lib/api'

type EmbedType = 'search' | 'listing' | 'calculator'
type Theme = 'light' | 'dark'

export default function EmbedPage() {
  const { accessToken } = useAuthStore()
  const [embedType, setEmbedType] = useState<EmbedType>('search')
  const [theme, setTheme] = useState<Theme>('light')
  const [agencyId, setAgencyId] = useState('')
  const [listingId, setListingId] = useState('')
  const [embed, setEmbed] = useState<{ src: string; iframeCode: string; scriptCode: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  async function generate() {
    if (!accessToken) return
    setLoading(true)
    try {
      const res = await partnerApi.getEmbed(accessToken, {
        type: embedType,
        agencyId: agencyId || undefined,
        theme,
      })
      setEmbed(res.data)
    } finally {
      setLoading(false)
    }
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Embed / Widget</h1>
        <p className="text-muted text-sm mt-0.5">Sitenize 7fil bileşenlerini entegre edin</p>
      </div>

      {/* Config form */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-ink mb-4">Widget Yapılandırması</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Widget Tipi</label>
            <select
              value={embedType}
              onChange={(e) => setEmbedType(e.target.value as EmbedType)}
              className="input-base"
            >
              <option value="search">İlan Arama</option>
              <option value="listing">Tek İlan</option>
              <option value="calculator">Kredi Hesaplama</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Tema</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)} className="input-base">
              <option value="light">Açık</option>
              <option value="dark">Koyu</option>
            </select>
          </div>
          {embedType === 'listing' && (
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">İlan ID</label>
              <input
                value={listingId}
                onChange={(e) => setListingId(e.target.value)}
                className="input-base font-mono text-xs"
                placeholder="ilan-uuid"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Ajans ID (opsiyonel)</label>
            <input
              value={agencyId}
              onChange={(e) => setAgencyId(e.target.value)}
              className="input-base font-mono text-xs"
              placeholder="ajans-uuid"
            />
          </div>
        </div>
        <button onClick={generate} disabled={loading} className="btn-primary">
          {loading ? 'Oluşturuluyor...' : 'Embed Kodu Oluştur'}
        </button>
      </div>

      {/* Generated codes */}
      {embed && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-ink">iframe Kodu</p>
              <button
                onClick={() => copy(embed.iframeCode, 'iframe')}
                className="text-xs text-teal hover:underline"
              >
                {copied === 'iframe' ? '✓ Kopyalandı' : 'Kopyala'}
              </button>
            </div>
            <pre className="text-xs bg-gray-50 rounded-xl p-4 overflow-x-auto text-gray-700 whitespace-pre-wrap">
              {embed.iframeCode}
            </pre>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-ink">Script Kodu</p>
              <button
                onClick={() => copy(embed.scriptCode, 'script')}
                className="text-xs text-teal hover:underline"
              >
                {copied === 'script' ? '✓ Kopyalandı' : 'Kopyala'}
              </button>
            </div>
            <pre className="text-xs bg-gray-50 rounded-xl p-4 overflow-x-auto text-gray-700 whitespace-pre-wrap">
              {embed.scriptCode}
            </pre>
          </div>

          {/* Preview */}
          <div className="card p-5">
            <p className="text-sm font-semibold text-ink mb-3">Önizleme</p>
            <iframe
              src={embed.src}
              className="w-full h-96 rounded-xl border border-gray-100"
              title="7fil embed preview"
            />
          </div>
        </div>
      )}

      {/* Docs */}
      <div className="mt-8 bg-ink/5 rounded-xl p-5 text-sm text-muted">
        <p className="font-semibold text-ink mb-2">Entegrasyon Notları</p>
        <ul className="space-y-1 text-xs">
          <li>• iframe kodu herhangi bir HTML sayfasına eklenebilir</li>
          <li>• Script kodu React/Vue/Angular uygulamalarıyla uyumludur</li>
          <li>• Mobil uyumlu, responsive tasarım</li>
          <li>• Tüm embed trafiği partner ID&apos;nize bağlanır</li>
        </ul>
      </div>
    </div>
  )
}
