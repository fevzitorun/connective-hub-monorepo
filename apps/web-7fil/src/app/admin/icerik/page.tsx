'use client'
import { useState } from 'react'

const CONTENT_QUEUE = [
  { id: '1', type: 'blog',    title: 'İstanbul'da 2026 Kira Trendleri',        agent: 'SCRIBE',      status: 'draft',     city: 'İstanbul', created: '2026-05-24' },
  { id: '2', type: 'social',  title: '7 fotoğraflı Kadıköy daire tanıtımı',   agent: 'SCRIBE',      status: 'published', city: 'İstanbul', created: '2026-05-23' },
  { id: '3', type: 'youtube', title: 'Ankara Çankaya\'da yatırım rehberi',     agent: 'YT-DIRECTOR', status: 'draft',     city: 'Ankara',   created: '2026-05-22' },
  { id: '4', type: 'report',  title: '7fil Kira Endeksi — Mayıs 2026',         agent: 'PR-MAESTRO',  status: 'draft',     city: 'Türkiye',  created: '2026-05-21' },
]

const TYPE_COLORS: Record<string, string> = {
  blog:    'bg-blue-100 text-blue-700',
  social:  'bg-pink-100 text-pink-700',
  youtube: 'bg-red-100 text-red-700',
  report:  'bg-purple-100 text-purple-700',
}
const STATUS_COLORS: Record<string, string> = {
  draft:     'bg-amber-100 text-amber-700',
  published: 'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  rejected:  'bg-red-100 text-red-700',
}

export default function IcerikPage() {
  const [activeTab, setActiveTab] = useState<'queue' | 'generate'>('queue')

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-ink">İçerik Yönetimi</h1>
          <p className="text-ink/60 mt-1">SCRIBE · YT-DIRECTOR · PR-MAESTRO ajanlarıyla otomatik içerik üretimi</p>
        </div>
        <button className="bg-gold text-ink font-semibold px-5 py-2.5 rounded-xl hover:bg-gold/80 transition-colors text-sm">
          + İçerik Üret
        </button>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Toplam İçerik',  value: '—', icon: '📝' },
          { label: 'Bu Ay Üretilen', value: '—', icon: '🚀' },
          { label: 'Yayında',        value: '—', icon: '✅' },
          { label: 'Taslak',         value: '—', icon: '✏️' },
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

      {/* Tab */}
      <div className="flex gap-2 mb-6">
        {(['queue', 'generate'] as const).map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === t ? 'bg-ink text-white' : 'bg-white text-ink/60 border border-stone-200 hover:border-ink/30'
            }`}>
            {t === 'queue' ? 'İçerik Kuyruğu' : 'Yeni Üret'}
          </button>
        ))}
      </div>

      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50">
              <tr>
                {['Tür', 'Başlık', 'Ajan', 'Şehir', 'Durum', 'Tarih', 'İşlem'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink/50 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {CONTENT_QUEUE.map((row) => (
                <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${TYPE_COLORS[row.type]}`}>
                      {row.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink max-w-xs truncate">{row.title}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-ink text-white px-2 py-0.5 rounded">{row.agent}</span>
                  </td>
                  <td className="px-4 py-3 text-ink/60">{row.city}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[row.status]}`}>
                      {row.status === 'draft' ? 'Taslak' : row.status === 'published' ? 'Yayında' : row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink/50">{row.created}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="text-xs text-gold font-medium hover:underline">Düzenle</button>
                    <button className="text-xs text-green-600 font-medium hover:underline">Yayınla</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'generate' && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <h2 className="font-semibold text-ink mb-6">İçerik Üret</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">İçerik Türü</label>
                <select className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm bg-white">
                  <option>Blog Yazısı</option>
                  <option>Sosyal Medya Paketi (7 platform)</option>
                  <option>YouTube Senaryosu</option>
                  <option>Ilan Açıklaması</option>
                  <option>Pazar Raporu</option>
                  <option>Basın Bülteni</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">Şehir / Konu</label>
                <input className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm"
                  placeholder="Örn: İstanbul Kadıköy" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1">Ek Talimatlar</label>
                <textarea rows={4} className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm resize-none"
                  placeholder="Ajan için özel yönlendirmeler..." />
              </div>
              <button className="w-full bg-ink text-white font-semibold py-3 rounded-xl hover:bg-ink/80 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                SCRIBE ile Üret
              </button>
            </div>
            {/* Preview placeholder */}
            <div className="border border-dashed border-stone-300 rounded-2xl flex items-center justify-center text-ink/30 text-sm">
              İçerik önizlemesi burada görünecek
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
