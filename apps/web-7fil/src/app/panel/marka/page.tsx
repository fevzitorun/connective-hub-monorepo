'use client'
import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '../../../store/auth'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

type Branding = {
  primaryColor: string; secondaryColor: string; fontFamily: string
  logoUrl: string | null; faviconUrl: string | null
  heroTitle: string | null; heroSubtitle: string | null; aboutText: string | null
  contactPhone: string | null; contactEmail: string | null; contactAddress: string | null
  instagramUrl: string | null; facebookUrl: string | null
  twitterUrl: string | null; linkedinUrl: string | null; youtubeUrl: string | null
  customCss: string | null; seoTitle: string | null; seoDescription: string | null
  show7filBadge: boolean; listingsPerPage: number
}

const FONT_OPTIONS = ['Inter', 'Poppins', 'Roboto', 'Montserrat', 'Lato', 'Nunito', 'Raleway', 'Open Sans']

const DEFAULT: Branding = {
  primaryColor: '#1B3A4B', secondaryColor: '#C9A84C', fontFamily: 'Inter',
  logoUrl: null, faviconUrl: null,
  heroTitle: null, heroSubtitle: null, aboutText: null,
  contactPhone: null, contactEmail: null, contactAddress: null,
  instagramUrl: null, facebookUrl: null, twitterUrl: null, linkedinUrl: null, youtubeUrl: null,
  customCss: null, seoTitle: null, seoDescription: null,
  show7filBadge: true, listingsPerPage: 12,
}

type Tab = 'brand' | 'content' | 'contact' | 'seo' | 'domain'

export default function MarkaPanel() {
  const { accessToken } = useAuthStore()
  const [form, setForm] = useState<Branding>(DEFAULT)
  const [activeTab, setActiveTab] = useState<Tab>('brand')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [subdomain, setSubdomain] = useState<string | null>(null)
  const [domainInput, setDomainInput] = useState('')
  const [domainResult, setDomainResult] = useState<{ verifyToken?: string; instructions?: string } | null>(null)

  const load = useCallback(async () => {
    if (!accessToken) return
    const res = await fetch(`${BASE}/whitelabel/branding`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const json = await res.json()
    if (json.data) setForm({ ...DEFAULT, ...json.data })

    // Get subdomain from agency info
    const agRes = await fetch(`${BASE}/agency/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const agJson = await agRes.json()
    setSubdomain(agJson.data?.subdomain ?? null)
  }, [accessToken])

  useEffect(() => { load() }, [load])

  function set<K extends keyof Branding>(key: K, value: Branding[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function save() {
    if (!accessToken) return
    setSaving(true)
    setSaved(false)
    await fetch(`${BASE}/whitelabel/branding`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function setDomain() {
    if (!accessToken || !domainInput) return
    const res = await fetch(`${BASE}/whitelabel/domain`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: domainInput }),
    })
    const json = await res.json()
    setDomainResult(json.data ?? null)
  }

  const previewUrl = subdomain ? `https://${subdomain}.7fil.com.tr` : null

  const TABS: { key: Tab; label: string }[] = [
    { key: 'brand', label: 'Marka & Tasarım' },
    { key: 'content', label: 'İçerik' },
    { key: 'contact', label: 'İletişim' },
    { key: 'seo', label: 'SEO' },
    { key: 'domain', label: 'Özel Domain' },
  ]

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">White-Label Marka Ayarları</h1>
          <p className="text-muted text-sm mt-1">Ajansınızın özel subdomain sitesini özelleştirin.</p>
          {previewUrl && (
            <a href={previewUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-teal hover:text-gold transition-colors mt-1 inline-block">
              {previewUrl} ↗
            </a>
          )}
        </div>
        <button onClick={save} disabled={saving}
          className={`btn-primary text-sm px-6 py-2.5 ${saved ? 'bg-green-600 hover:bg-green-600' : ''}`}>
          {saving ? 'Kaydediliyor...' : saved ? '✓ Kaydedildi' : 'Kaydet'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === t.key
                ? 'border-teal text-teal'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Marka & Tasarım ── */}
      {activeTab === 'brand' && (
        <div className="space-y-5">
          {/* Color preview */}
          <div className="flex gap-3 items-center p-4 rounded-xl border border-border bg-cream">
            <div className="w-10 h-10 rounded-xl shadow-sm" style={{ backgroundColor: form.primaryColor }} />
            <div className="w-10 h-10 rounded-xl shadow-sm" style={{ backgroundColor: form.secondaryColor }} />
            <div className="flex-1 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: form.primaryColor }}>
              {form.fontFamily} Preview
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted block mb-1">Ana Renk (Header, Buttons)</label>
              <div className="flex gap-2">
                <input type="color" value={form.primaryColor} onChange={(e) => set('primaryColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border" />
                <input value={form.primaryColor} onChange={(e) => set('primaryColor', e.target.value)}
                  className="input text-sm flex-1 font-mono uppercase" maxLength={7} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Vurgu Rengi (Fiyat, CTA)</label>
              <div className="flex gap-2">
                <input type="color" value={form.secondaryColor} onChange={(e) => set('secondaryColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-border" />
                <input value={form.secondaryColor} onChange={(e) => set('secondaryColor', e.target.value)}
                  className="input text-sm flex-1 font-mono uppercase" maxLength={7} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted block mb-1">Font</label>
            <select value={form.fontFamily} onChange={(e) => set('fontFamily', e.target.value)} className="input text-sm w-full">
              {FONT_OPTIONS.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted block mb-1">Logo URL</label>
            <input value={form.logoUrl ?? ''} onChange={(e) => set('logoUrl', e.target.value || null)}
              placeholder="https://..." className="input text-sm w-full" />
            <p className="text-[10px] text-muted mt-1">CDN ya da R2 URL'si. Önerilen boyut: 240×80px, PNG/SVG şeffaf arka plan.</p>
          </div>

          <div>
            <label className="text-xs text-muted block mb-1">Favicon URL</label>
            <input value={form.faviconUrl ?? ''} onChange={(e) => set('faviconUrl', e.target.value || null)}
              placeholder="https://..." className="input text-sm w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted block mb-1">Sayfa Başına İlan</label>
              <select value={form.listingsPerPage} onChange={(e) => set('listingsPerPage', Number(e.target.value))} className="input text-sm w-full">
                {[6, 9, 12, 15, 18, 24].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                <input type="checkbox" checked={form.show7filBadge} onChange={(e) => set('show7filBadge', e.target.checked)}
                  className="accent-teal" />
                <span>7fil rozeti göster</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted block mb-1">Özel CSS (İleri Düzey)</label>
            <textarea
              value={form.customCss ?? ''}
              onChange={(e) => set('customCss', e.target.value || null)}
              rows={5}
              className="input text-xs font-mono w-full resize-y"
              placeholder=".brand-btn { border-radius: 0; }"
            />
          </div>
        </div>
      )}

      {/* ── İçerik ── */}
      {activeTab === 'content' && (
        <div className="space-y-5">
          <div>
            <label className="text-xs text-muted block mb-1">Hero Başlığı</label>
            <input value={form.heroTitle ?? ''} onChange={(e) => set('heroTitle', e.target.value || null)}
              placeholder="Hayalinizdeki Evi Bulun" className="input text-sm w-full" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Hero Alt Başlık</label>
            <input value={form.heroSubtitle ?? ''} onChange={(e) => set('heroSubtitle', e.target.value || null)}
              placeholder="20 yıllık tecrübeyle hizmetinizdeyiz" className="input text-sm w-full" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Hakkımızda Metni</label>
            <textarea
              value={form.aboutText ?? ''}
              onChange={(e) => set('aboutText', e.target.value || null)}
              rows={6}
              className="input text-sm w-full resize-y"
              placeholder="Ajansınız hakkında kısa bir tanıtım yazısı..."
            />
          </div>
        </div>
      )}

      {/* ── İletişim ── */}
      {activeTab === 'contact' && (
        <div className="space-y-4">
          {([
            { key: 'contactPhone', label: 'Telefon', placeholder: '0212 000 00 00' },
            { key: 'contactEmail', label: 'E-posta', placeholder: 'info@ajansınız.com' },
            { key: 'contactAddress', label: 'Adres', placeholder: 'Mahalle, İlçe, Şehir' },
            { key: 'instagramUrl', label: 'Instagram', placeholder: 'https://instagram.com/...' },
            { key: 'facebookUrl', label: 'Facebook', placeholder: 'https://facebook.com/...' },
            { key: 'twitterUrl', label: 'Twitter / X', placeholder: 'https://x.com/...' },
            { key: 'linkedinUrl', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' },
            { key: 'youtubeUrl', label: 'YouTube', placeholder: 'https://youtube.com/@...' },
          ] as { key: keyof Branding; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs text-muted block mb-1">{label}</label>
              <input
                value={(form[key] as string | null) ?? ''}
                onChange={(e) => set(key, (e.target.value || null) as Branding[typeof key])}
                placeholder={placeholder}
                className="input text-sm w-full"
              />
            </div>
          ))}
        </div>
      )}

      {/* ── SEO ── */}
      {activeTab === 'seo' && (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted block mb-1">SEO Sayfa Başlığı</label>
            <input value={form.seoTitle ?? ''} onChange={(e) => set('seoTitle', e.target.value || null)}
              placeholder="Ajans Adı — Şehir Emlak" className="input text-sm w-full" />
            <p className="text-[10px] text-muted mt-1">Tavsiye: 50–60 karakter</p>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">SEO Meta Açıklaması</label>
            <textarea
              value={form.seoDescription ?? ''}
              onChange={(e) => set('seoDescription', e.target.value || null)}
              rows={3}
              className="input text-sm w-full resize-none"
              placeholder="Şehirdeki en iyi gayrimenkul fırsatlarını keşfedin..."
              maxLength={160}
            />
            <p className="text-[10px] text-muted mt-1">{(form.seoDescription?.length ?? 0)}/160 karakter</p>
          </div>
        </div>
      )}

      {/* ── Özel Domain ── */}
      {activeTab === 'domain' && (
        <div className="space-y-5">
          {subdomain && (
            <div className="bg-teal/5 border border-teal/20 rounded-xl p-4">
              <p className="text-xs text-muted mb-1">Mevcut Subdomain</p>
              <p className="font-mono text-sm text-teal font-semibold">{subdomain}.7fil.com.tr</p>
            </div>
          )}

          <div>
            <label className="text-xs text-muted block mb-1">Özel Domain (opsiyonel)</label>
            <div className="flex gap-2">
              <input value={domainInput} onChange={(e) => setDomainInput(e.target.value)}
                placeholder="emlak.sirketiniz.com" className="input text-sm flex-1" />
              <button onClick={setDomain} className="btn-primary text-sm px-4">Ekle</button>
            </div>
            <p className="text-[10px] text-muted mt-1">Alt domain veya tam domain girebilirsiniz (örn: emlak.firmaniz.com)</p>
          </div>

          {domainResult && (
            <div className="bg-gold/5 border border-gold/30 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-ink">DNS Doğrulama Talimatları</p>
              <div className="bg-ink text-white rounded-lg p-3 font-mono text-xs whitespace-pre-wrap">
                {domainResult.instructions}
              </div>
              <p className="text-[10px] text-muted">
                DNS değişikliklerinin yayılması 24–48 saat sürebilir.
                Doğrulama sonrası &quot;Domain Doğrula&quot; butonunu tıklayın.
              </p>
            </div>
          )}

          <div className="bg-ink/5 rounded-xl p-4 text-xs text-muted">
            <p className="font-semibold text-ink mb-2">Nasıl Çalışır?</p>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Özel domaininizi yukarıya girin</li>
              <li>DNS sağlayıcınızda CNAME kaydı ekleyin: <span className="font-mono text-ink">app.7fil.com.tr</span></li>
              <li>TXT doğrulama kaydı ekleyin</li>
              <li>DNS yayıldıktan sonra &quot;Domain Doğrula&quot; butonuna basın</li>
            </ol>
          </div>
        </div>
      )}

      {/* Bottom save */}
      <div className="mt-8 pt-5 border-t border-border flex justify-end">
        <button onClick={save} disabled={saving}
          className={`btn-primary text-sm px-8 py-2.5 ${saved ? 'bg-green-600 hover:bg-green-600' : ''}`}>
          {saving ? 'Kaydediliyor...' : saved ? '✓ Kaydedildi' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </div>
  )
}
