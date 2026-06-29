'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../store/auth'
import { partnerApi, Branding } from '../../../lib/api'

const DEFAULT_BRANDING: Partial<Branding> = {
  primaryColor: '#1a1a2e',
  heroTitle: 'Profesyonel Gayrimenkul Hizmetleri',
  heroSubtitle: 'Hayalinizdeki evi birlikte bulalım.',
  show7filBadge: true,
}

export default function MarkaPage() {
  const { accessToken, user } = useAuthStore()
  const [branding, setBranding] = useState<Partial<Branding>>(DEFAULT_BRANDING)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!accessToken) return
    partnerApi.getBranding(accessToken)
      .then((r) => { if (r.data) setBranding(r.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [accessToken])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken) return
    setSaving(true)
    setSaved(false)
    try {
      await partnerApi.updateBranding(accessToken, branding)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { /* silent */ }
    setSaving(false)
  }

  const set = (key: keyof Branding, value: string | boolean) =>
    setBranding((b) => ({ ...b, [key]: value }))

  const subdomain = branding.subdomain ?? (user?.email?.split('@')[0] ?? 'firma')
  const previewUrl = `https://${subdomain}.7fil.com.tr`

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink">Markam</h1>
        <p className="text-muted text-sm mt-1">
          Kendi markalı 7fil sayfanızı özelleştirin. Müşterilerinize özel alan adıyla sunun.
        </p>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-sm text-muted">Yükleniyor...</div>
      ) : (
        <form onSubmit={save} className="space-y-6">

          {/* Subdomain */}
          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
              <span>🌐</span> Subdomain
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden flex-1 min-w-0">
                <span className="bg-gray-50 px-4 py-2.5 text-sm text-muted border-r border-gray-200 shrink-0">https://</span>
                <input
                  value={branding.subdomain ?? ''}
                  onChange={(e) => set('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="firmaniz"
                  className="flex-1 px-4 py-2.5 text-sm text-ink focus:outline-none min-w-0"
                />
                <span className="bg-gray-50 px-4 py-2.5 text-sm text-muted border-l border-gray-200 shrink-0">.7fil.com.tr</span>
              </div>
              {branding.domainVerified ? (
                <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">✓ Aktif</span>
              ) : (
                <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-full">Doğrulanmamış</span>
              )}
            </div>
            <p className="text-xs text-muted mt-2">
              Sayfanız: <a href={previewUrl} target="_blank" rel="noopener" className="text-teal hover:underline">{previewUrl}</a>
            </p>
          </div>

          {/* Hero content */}
          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
              <span>✍️</span> Sayfa İçeriği
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Ana Başlık</label>
                <input
                  value={branding.heroTitle ?? ''}
                  onChange={(e) => set('heroTitle', e.target.value)}
                  className="input-base"
                  placeholder="Profesyonel Gayrimenkul Hizmetleri"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Alt Başlık</label>
                <input
                  value={branding.heroSubtitle ?? ''}
                  onChange={(e) => set('heroSubtitle', e.target.value)}
                  className="input-base"
                  placeholder="Hayalinizdeki evi birlikte bulalım."
                />
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
              <span>🎨</span> Renk Teması
            </h2>
            <div className="flex items-center gap-4">
              <label className="block text-xs font-medium text-muted">Ana Renk</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={branding.primaryColor ?? '#1a1a2e'}
                  onChange={(e) => set('primaryColor', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  value={branding.primaryColor ?? ''}
                  onChange={(e) => set('primaryColor', e.target.value)}
                  className="input-base w-32 font-mono text-xs"
                  placeholder="#1a1a2e"
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="card p-6">
            <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
              <span>📞</span> İletişim Bilgileri
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">E-posta</label>
                <input
                  type="email"
                  value={branding.contactEmail ?? ''}
                  onChange={(e) => set('contactEmail', e.target.value)}
                  className="input-base"
                  placeholder="info@firmaniz.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Telefon</label>
                <input
                  value={branding.contactPhone ?? ''}
                  onChange={(e) => set('contactPhone', e.target.value)}
                  className="input-base"
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>
            </div>
          </div>

          {/* 7fil badge */}
          <div className="card p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={branding.show7filBadge ?? true}
                onChange={(e) => set('show7filBadge', e.target.checked)}
                className="w-4 h-4 accent-teal"
              />
              <div>
                <p className="text-sm font-medium text-ink">7fil rozeti göster</p>
                <p className="text-xs text-muted">"7fil ile güçlendirildi" rozeti sayfanızda görünür</p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
            {saved && <p className="text-sm text-teal font-semibold">✓ Kaydedildi!</p>}
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener"
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              Sayfamı Önizle →
            </a>
          </div>
        </form>
      )}
    </div>
  )
}
