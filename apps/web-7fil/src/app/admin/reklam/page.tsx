'use client'
import { useState } from 'react'

const BOOST_PLANS = [
  { id: 'temel',     name: 'Temel Öne Çıkar',    price: 299,  duration: 7,  multiplier: '2x',  desc: '7 gün arama üstü' },
  { id: 'pro',       name: 'Pro Vitrin',          price: 599,  duration: 14, multiplier: '5x',  desc: '14 gün + rozet' },
  { id: 'premium',   name: 'Premium Spotlight',   price: 999,  duration: 30, multiplier: '10x', desc: '30 gün + kapak + anasayfa' },
  { id: 'kurumsal',  name: 'Kurumsal Boost',      price: 2499, duration: 30, multiplier: '∞',   desc: '30 gün + tüm özellikler' },
]

export default function ReklamPage() {
  const [tab, setTab] = useState<'active' | 'plans' | 'stats'>('active')

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">Reklam & Boost Yönetimi</h1>
          <p className="text-ink/60 mt-1">ADS-ENGINE — İlan öne çıkarma ve reklam satış sistemi</p>
        </div>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Aktif Boost',     value: '—', color: 'text-gold' },
          { label: 'Bu Ay Gelir',     value: '—₺', color: 'text-green-600' },
          { label: 'Ortalama Boost',  value: '—₺', color: 'text-ink' },
          { label: 'Dönüşüm Artışı',  value: '—%',  color: 'text-blue-600' },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <p className="text-sm text-ink/50">{c.label}</p>
            <p className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Tab */}
      <div className="flex gap-2 mb-6">
        {(['active', 'plans', 'stats'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-ink text-white' : 'bg-white text-ink/60 border border-stone-200 hover:border-ink/30'
            }`}>
            {t === 'active' ? 'Aktif Boostlar' : t === 'plans' ? 'Paketler' : 'İstatistikler'}
          </button>
        ))}
      </div>

      {tab === 'plans' && (
        <div className="grid grid-cols-2 gap-6">
          {BOOST_PLANS.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-ink">{plan.name}</h3>
                  <p className="text-sm text-ink/50 mt-1">{plan.desc}</p>
                </div>
                <span className="bg-gold/20 text-ink font-bold text-lg px-3 py-1 rounded-xl">
                  {plan.multiplier}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold text-ink">{plan.price.toLocaleString('tr-TR')} ₺</span>
                  <span className="text-sm text-ink/40 ml-1">/ {plan.duration} gün</span>
                </div>
                <button className="text-sm bg-ink text-white font-semibold px-4 py-2 rounded-lg hover:bg-ink/80 transition-colors">
                  Düzenle
                </button>
              </div>
            </div>
          ))}
          <div className="border border-dashed border-stone-300 rounded-2xl p-6 flex items-center justify-center">
            <button className="text-sm text-ink/40 hover:text-ink transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Paket Ekle
            </button>
          </div>
        </div>
      )}

      {tab === 'active' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 text-center text-ink/40">
          <p className="text-4xl mb-2">🚀</p>
          <p>Aktif boost listesi — ADS-ENGINE API'ye bağlanacak (Sprint 4)</p>
        </div>
      )}

      {tab === 'stats' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 text-center text-ink/40">
          <p className="text-4xl mb-2">📈</p>
          <p>Reklam istatistikleri — ANALYST ajanı tarafından üretilecek (Sprint 4)</p>
        </div>
      )}
    </div>
  )
}
