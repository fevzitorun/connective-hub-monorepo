'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../../../store/auth'

interface AiStats {
  summary: { totalTokens: number; tokens24h: number; tokens7d: number }
  filterra: { totalCalls: number; totalTokens: number; tokens24h: number }
  atlas: { totalMessages: number; totalTokens: number; tokens24h: number }
  scribe: { totalCalls: number; totalTokens: number; tokens24h: number }
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

function fmtTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

const AGENTS = [
  {
    id: 'ATLAS',
    name: 'ATLAS',
    role: 'Akıllı Arama & Sınıflandırma',
    desc: 'NLS sorguları ayrıştırır, semantik vektör araması yapar, otomatik ilan kategorisi önerir.',
    status: 'active',
    runs_today: 0,
    module: 'search',
    color: 'blue',
  },
  {
    id: 'SCOUT',
    name: 'SCOUT',
    role: 'Fiyat & Pazar İstihbarat',
    desc: 'Rakip portallarda fiyat değişikliklerini izler, pazar raporu üretir, acenta uyarısı gönderir.',
    status: 'active',
    runs_today: 0,
    module: 'analytics',
    color: 'green',
  },
  {
    id: 'INSPECTOR',
    name: 'INSPECTOR',
    role: 'Mülk & Görsel Analiz',
    desc: 'Yüklenen fotoğrafları AI ile analiz eder, oda tespiti yapar, hasarları raporlar.',
    status: 'planned',
    runs_today: 0,
    module: 'property-mgmt',
    color: 'orange',
  },
  {
    id: 'BROKER',
    name: 'BROKER',
    role: 'MLS Eşleştirme',
    desc: 'Alıcı kriterleriyle MLS havuzunu eşleştirir, otomatik işbirliği önerileri sunar.',
    status: 'active',
    runs_today: 0,
    module: 'mls',
    color: 'purple',
  },
  {
    id: 'NOTARY',
    name: 'NOTARY',
    role: 'Hukuki Belge Asistanı',
    desc: 'Tapu, kira sözleşmesi, vekaletname kontrolü yapar, eksik madde uyarısı verir.',
    status: 'planned',
    runs_today: 0,
    module: 'legal',
    color: 'red',
  },
  {
    id: 'VALUATOR',
    name: 'VALUATOR',
    role: 'Otomatik Değerleme (AVM)',
    desc: 'PostGIS + tarihsel satış verisiyle anlık tahmini değer hesaplar.',
    status: 'planned',
    runs_today: 0,
    module: 'finance',
    color: 'yellow',
  },
  {
    id: 'SCRIBE',
    name: 'SCRIBE',
    role: 'İçerik Üretimi',
    desc: 'Blog, sosyal medya paketi, ilan açıklaması, pazar raporu ve bülten otomatik üretir.',
    status: 'in_progress',
    runs_today: 0,
    module: 'content',
    color: 'teal',
  },
  {
    id: 'YT-DIRECTOR',
    name: 'YT-DIRECTOR',
    role: 'YouTube Script Motoru',
    desc: 'Hook, senaryo, CTA, SEO metadata ve Shorts versiyonu üretir.',
    status: 'in_progress',
    runs_today: 0,
    module: 'youtube',
    color: 'rose',
  },
  {
    id: 'CAMPAIGNER',
    name: 'CAMPAIGNER',
    role: 'Drip & WhatsApp Kampanya',
    desc: 'Lead durumuna göre e-posta/WA serisi gönderir, şehir bülteni üretir.',
    status: 'planned',
    runs_today: 0,
    module: 'crm',
    color: 'indigo',
  },
  {
    id: 'OPTIMIZER',
    name: 'OPTIMIZER',
    role: 'SEO & Reklam Optimizer',
    desc: 'İlan başlıklarını SEO için optimize eder, reklam performansını izler.',
    status: 'planned',
    runs_today: 0,
    module: 'ads',
    color: 'cyan',
  },
  {
    id: 'ANALYST',
    name: 'ANALYST',
    role: 'Performans & BI Raporu',
    desc: 'Haftalık performans raporu, dönüşüm oranları ve öngörüler üretir.',
    status: 'planned',
    runs_today: 0,
    module: 'analytics',
    color: 'amber',
  },
  {
    id: 'PR-MAESTRO',
    name: 'PR-MAESTRO',
    role: 'Dijital PR & Basın',
    desc: 'Basın bülteni, 7fil Kira Endeksi raporu, influencer brifingi üretir.',
    status: 'planned',
    runs_today: 0,
    module: 'pr',
    color: 'pink',
  },
]

const STATUS_COLORS: Record<string, string> = {
  active:      'bg-green-100 text-green-700',
  in_progress: 'bg-amber-100 text-amber-700',
  planned:     'bg-stone-100 text-stone-500',
}

const STATUS_LABELS: Record<string, string> = {
  active:      'Aktif',
  in_progress: 'Geliştiriliyor',
  planned:     'Planlandı',
}

export default function AiAjanlarPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'in_progress' | 'planned'>('all')
  const [stats, setStats] = useState<AiStats | null>(null)
  const { accessToken } = useAuthStore()

  useEffect(() => {
    if (!accessToken) return
    fetch(`${BASE}/admin/ai/stats`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => r.json())
      .then((d) => setStats(d as AiStats))
      .catch(() => null)
  }, [accessToken])

  const filtered = filter === 'all' ? AGENTS : AGENTS.filter((a) => a.status === filter)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-ink">AI Ajan Kontrol Merkezi</h1>
        <p className="text-ink/60 mt-1">12 ajan · 7fil'in yapay zeka motoru</p>
      </div>

      {/* Token kullanım istatistikleri */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Toplam Token', value: fmtTokens(stats.summary.totalTokens), sub: 'tüm zamanlar', icon: '🔢' },
            { label: 'Son 24 Saat',  value: fmtTokens(stats.summary.tokens24h),   sub: 'token harcandı', icon: '⚡' },
            { label: 'Son 7 Gün',   value: fmtTokens(stats.summary.tokens7d),    sub: 'token harcandı', icon: '📊' },
            { label: 'FILTERRA çağrı', value: String(stats.filterra.totalCalls), sub: `+${stats.filterra.tokens24h > 0 ? fmtTokens(stats.filterra.tokens24h) + ' bugün' : '0 bugün'}`, icon: '🤖' },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 flex items-center gap-3">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="text-xs text-ink/50">{c.label}</p>
                <p className="text-2xl font-bold text-ink">{c.value}</p>
                <p className="text-xs text-ink/30 mt-0.5">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ajan durum özeti */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Aktif Ajan',        value: AGENTS.filter(a => a.status === 'active').length,      color: 'bg-green-500' },
          { label: 'Geliştiriliyor',    value: AGENTS.filter(a => a.status === 'in_progress').length, color: 'bg-amber-500' },
          { label: 'Planlandı',         value: AGENTS.filter(a => a.status === 'planned').length,     color: 'bg-stone-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${stat.color}`} />
            <div>
              <p className="text-sm text-ink/50">{stat.label}</p>
              <p className="text-3xl font-bold text-ink">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtreler */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'in_progress', 'planned'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-ink text-white'
                : 'bg-white text-ink/60 border border-stone-200 hover:border-ink/30'
            }`}
          >
            {f === 'all' ? 'Tümü' : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Ajan kartları */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((agent) => (
          <div key={agent.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="inline-block font-mono font-bold text-sm bg-ink text-white px-2 py-0.5 rounded mb-1">
                  {agent.name}
                </span>
                <p className="text-xs font-semibold text-ink/70">{agent.role}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[agent.status]}`}>
                {STATUS_LABELS[agent.status]}
              </span>
            </div>
            <p className="text-xs text-ink/50 leading-relaxed">{agent.desc}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-ink/30">Modül: {agent.module}</span>
              {agent.status === 'active' && (
                <button className="text-xs bg-gold/20 text-ink font-semibold px-3 py-1 rounded-lg hover:bg-gold/40 transition-colors">
                  Çalıştır
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
