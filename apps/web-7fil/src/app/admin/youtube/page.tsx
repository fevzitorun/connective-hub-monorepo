'use client'
import { useState } from 'react'

const CHANNELS = [
  { name: '7fil Emlak', handle: '@7filemlak', target: 'Alıcı / Kiracı',    desc: 'Piyasa rehberleri, mahalle videoları, ilan tanıtımları', status: 'planned' },
  { name: '7fil Akademi', handle: '@7filakademi', target: 'Emlakçılar', desc: 'Satış teknikleri, dijital araçlar, MLS kullanımı',        status: 'planned' },
]

const SCRIPT_TYPES = [
  { id: 'market', label: 'Piyasa Rehberi',     icon: '📊', duration: '8-12 dk', prompt: 'Şehir/ilçe pazar analizi' },
  { id: 'tour',   label: 'Mülk Turu',          icon: '🏠', duration: '3-6 dk',  prompt: 'İlan showcase' },
  { id: 'tips',   label: 'Emlak Tüyoları',     icon: '💡', duration: '5-8 dk',  prompt: 'Eğitim / tavsiye' },
  { id: 'shorts', label: 'YouTube Shorts',     icon: '⚡', duration: '60 sn',   prompt: 'Kısa dikkat çekici video' },
  { id: 'news',   label: 'Haftalık Bülten',    icon: '📰', duration: '10-15 dk', prompt: 'Haftalık piyasa özeti' },
]

export default function YoutubePage() {
  const [selectedType, setSelectedType] = useState('market')
  const [city, setCity] = useState('İstanbul')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-ink">YouTube Studio</h1>
        <p className="text-ink/60 mt-1">YT-DIRECTOR ajanıyla otomatik senaryo ve içerik üretimi</p>
      </div>

      {/* Kanallar */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {CHANNELS.map((ch) => (
          <div key={ch.name} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-ink">{ch.name}</p>
                  <p className="text-sm text-red-600">{ch.handle}</p>
                </div>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                {ch.status === 'planned' ? 'Planlandı' : 'Aktif'}
              </span>
            </div>
            <p className="text-sm text-ink/60 mb-1"><strong>Hedef:</strong> {ch.target}</p>
            <p className="text-xs text-ink/40">{ch.desc}</p>
          </div>
        ))}
      </div>

      {/* Senaryo üretici */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
        <h2 className="font-semibold text-ink mb-6">YT-DIRECTOR ile Senaryo Üret</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {SCRIPT_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedType === t.id
                  ? 'border-ink bg-ink/5 shadow-sm'
                  : 'border-stone-200 hover:border-ink/30'
              }`}
            >
              <div className="text-2xl mb-2">{t.icon}</div>
              <p className="font-semibold text-sm text-ink">{t.label}</p>
              <p className="text-xs text-ink/40 mt-1">{t.duration}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Kanal</label>
              <select className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm bg-white">
                <option>7fil Emlak (@7filemlak)</option>
                <option>7fil Akademi (@7filakademi)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Şehir / Konu</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm"
                placeholder="Örn: İstanbul Kadıköy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">Ek Yönlendirme</label>
              <textarea rows={3} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm resize-none"
                placeholder="Vurgulanmasını istediğiniz noktalar..." />
            </div>
            <button className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              YT-DIRECTOR ile Üret
            </button>
          </div>
          <div className="border border-dashed border-stone-300 rounded-2xl flex items-center justify-center text-ink/30 text-sm p-4 text-center">
            <div>
              <p className="text-3xl mb-2">🎬</p>
              <p>Hook · Senaryo · CTA</p>
              <p>SEO Meta · Shorts versiyonu</p>
              <p className="text-xs mt-2 text-ink/20">Üretilen içerik burada görünecek</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
