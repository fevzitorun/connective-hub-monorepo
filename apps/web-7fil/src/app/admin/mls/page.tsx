'use client'
import { useState } from 'react'

const MOCK_MLS = [
  { id: '1', listing: 'Kadıköy 3+1 Daire', agency: 'Kartal Gayrimenkul', status: 'open',        collab: 2, commission: '%3', expires: '2026-07-15' },
  { id: '2', listing: 'Beşiktaş 2+1 Daire', agency: 'Boğaz Emlak',       status: 'in_progress', collab: 1, commission: '%2.5', expires: '2026-06-30' },
  { id: '3', listing: 'Çankaya Villa',       agency: 'Başkent Realty',    status: 'closed',      collab: 3, commission: '50.000 ₺', expires: '2026-05-01' },
]

const S_COLOR: Record<string, string> = {
  open:        'bg-green-100 text-green-700',
  in_progress: 'bg-blue-100 text-blue-700',
  closed:      'bg-stone-100 text-stone-500',
  cancelled:   'bg-red-100 text-red-700',
}
const S_LABEL: Record<string, string> = {
  open: 'Açık', in_progress: 'Devam Ediyor', closed: 'Kapandı', cancelled: 'İptal',
}

export default function MlsAdminPage() {
  const [tab, setTab] = useState<'pool' | 'stats'>('pool')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-ink">MLS Havuz Yönetimi</h1>
        <p className="text-ink/60 mt-1">Emlakçılar arası portföy paylaşımı ve komisyon sistemi</p>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Açık İlan',       value: '—', sub: 'MLS havuzunda' },
          { label: 'Aktif İşbirliği', value: '—', sub: 'Devam eden' },
          { label: 'Tamamlanan',      value: '—', sub: 'Bu ay' },
          { label: 'Komisyon Geliri', value: '—', sub: 'Bu ay (₺)' },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <p className="text-sm text-ink/50">{c.label}</p>
            <p className="text-3xl font-bold text-ink mt-1">{c.value}</p>
            <p className="text-xs text-ink/40 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Tab */}
      <div className="flex gap-2 mb-6">
        {(['pool', 'stats'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-ink text-white' : 'bg-white text-ink/60 border border-stone-200 hover:border-ink/30'
            }`}>
            {t === 'pool' ? 'MLS Havuzu' : 'İstatistikler'}
          </button>
        ))}
      </div>

      {tab === 'pool' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-semibold text-ink">Tüm MLS İlanları</h2>
            <div className="flex gap-2">
              <select className="text-sm border border-stone-200 rounded-lg px-3 py-2 text-ink/70 bg-white">
                <option>Tüm Durumlar</option>
                <option>Açık</option>
                <option>Devam Ediyor</option>
              </select>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-stone-50">
              <tr>
                {['İlan', 'Acenta', 'Durum', 'İşbirliği', 'Komisyon', 'Bitiş', 'İşlem'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink/50 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {MOCK_MLS.map((row) => (
                <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-ink">{row.listing}</td>
                  <td className="px-4 py-3 text-ink/60">{row.agency}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${S_COLOR[row.status]}`}>
                      {S_LABEL[row.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">{row.collab} başvuru</td>
                  <td className="px-4 py-3 font-semibold text-ink">{row.commission}</td>
                  <td className="px-4 py-3 text-ink/50">{row.expires}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-gold font-medium hover:underline">Detay</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t border-stone-100 text-sm text-ink/40">
            Canlı veriler API bağlantısından yüklenecek
          </div>
        </div>
      )}

      {tab === 'stats' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 text-center text-ink/40">
          <p className="text-4xl mb-2">📊</p>
          <p>MLS istatistikleri — Sprint 4'te aktifleşecek</p>
        </div>
      )}
    </div>
  )
}
