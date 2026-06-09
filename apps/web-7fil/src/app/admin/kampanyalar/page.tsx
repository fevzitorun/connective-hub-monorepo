'use client'
import { useState } from 'react'

const CAMPAIGN_TEMPLATES = [
  { id: 'welcome',     name: 'Hoşgeldin Serisi',        steps: 5,  channel: 'email+whatsapp', trigger: 'Üye olunca' },
  { id: 'follow-up',   name: 'Lead Takip Serisi',       steps: 7,  channel: 'email+whatsapp', trigger: 'Yeni lead' },
  { id: 'city',        name: 'Şehir Bülteni',           steps: 1,  channel: 'email',          trigger: 'Haftalık otomatik' },
  { id: 'reactivate',  name: 'Pasif Lead Reaktivasyon', steps: 3,  channel: 'whatsapp',       trigger: '30 gün sessizlik' },
  { id: 'promo',       name: 'Promosyon Kampanyası',    steps: 2,  channel: 'email+whatsapp', trigger: 'Manuel' },
]

export default function KampanyalarPage() {
  const [creating, setCreating] = useState(false)

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Kampanya Yönetimi</h1>
          <p className="text-ink/60 mt-1">CAMPAIGNER ajanıyla drip e-posta ve WhatsApp otomasyonu</p>
        </div>
        <button
          onClick={() => setCreating(!creating)}
          className="bg-gold text-ink font-semibold px-5 py-2.5 rounded-xl hover:bg-gold/80 transition-colors text-sm"
        >
          + Kampanya Oluştur
        </button>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Aktif Kampanya',   value: '—', icon: '📣' },
          { label: 'E-posta Gönderim', value: '—', icon: '📧' },
          { label: 'WhatsApp',         value: '—', icon: '💬' },
          { label: 'Ort. Açılma',      value: '—%', icon: '👁' },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex items-center gap-4">
            <span className="text-3xl">{c.icon}</span>
            <div>
              <p className="text-sm text-ink/50">{c.label}</p>
              <p className="text-2xl font-bold text-ink">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Şablonlar */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-ink">Kampanya Şablonları</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {CAMPAIGN_TEMPLATES.map((tpl) => (
            <div key={tpl.id} className="px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-ink/5 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-ink/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-ink">{tpl.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-ink/40">{tpl.steps} adım</span>
                    <span className="text-xs text-ink/40">•</span>
                    <span className="text-xs text-ink/40">{tpl.channel}</span>
                    <span className="text-xs text-ink/40">•</span>
                    <span className="text-xs text-gold font-medium">{tpl.trigger}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs border border-stone-200 text-ink/60 px-3 py-1.5 rounded-lg hover:border-ink/30 transition-colors">
                  Düzenle
                </button>
                <button className="text-xs bg-ink text-white font-medium px-3 py-1.5 rounded-lg hover:bg-ink/80 transition-colors">
                  Başlat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Şehir bülteni */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
        <h2 className="font-semibold text-ink mb-4">Haftalık Şehir Bülteni</h2>
        <p className="text-sm text-ink/50 mb-4">
          SCRIBE + CAMPAIGNER ajanları her Pazartesi otomatik olarak şehir bazlı pazar özeti bülteni hazırlar ve abonelere gönderir.
        </p>
        <div className="grid grid-cols-5 gap-3">
          {['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'].map((city) => (
            <div key={city} className="border border-stone-200 rounded-xl p-3 text-center">
              <p className="font-semibold text-sm text-ink">{city}</p>
              <p className="text-xs text-ink/40 mt-1">— abone</p>
              <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                Beklemede
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
