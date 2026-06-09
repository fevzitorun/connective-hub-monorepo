'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/auth'
import { adminApi, AdminStats } from '../../lib/admin-api'

export default function AdminDashboard() {
  const { accessToken } = useAuthStore()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accessToken) return
    adminApi.getStats(accessToken)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [accessToken])

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const kpis = [
    { label: 'Toplam Kullanıcı', value: stats.users.total, sub: `+${stats.users.new_7d} bu hafta`, color: 'bg-blue-50 text-blue-700' },
    { label: 'Aktif Kullanıcı', value: stats.users.active, sub: `${stats.users.buyers} alıcı`, color: 'bg-green-50 text-green-700' },
    { label: 'Toplam İlan', value: stats.listings.total, sub: `${stats.listings.pending} beklemede`, color: 'bg-purple-50 text-purple-700' },
    { label: 'Aktif İlan', value: stats.listings.active, sub: `+${stats.listings.new_7d} bu hafta`, color: 'bg-teal-50 text-teal-700' },
    { label: 'Toplam Ajans', value: stats.agencies.total, sub: `${stats.agencies.verified} onaylı`, color: 'bg-orange-50 text-orange-700' },
    { label: 'Aktif Abonelik', value: stats.subscriptions.active, sub: `${stats.subscriptions.total} toplam`, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Mortgage Lead', value: stats.mortgageLeads, sub: 'toplam', color: 'bg-pink-50 text-pink-700' },
    { label: 'Müzayede', value: stats.auctions.total, sub: `${stats.auctions.live} canlı`, color: 'bg-indigo-50 text-indigo-700' },
  ]

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink">Platform Özeti</h1>
        <p className="text-muted text-sm mt-1">7fil.com.tr admin paneli</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className={`rounded-xl p-5 ${k.color.split(' ')[0]}`}>
            <p className="text-xs font-medium text-muted">{k.label}</p>
            <p className={`text-3xl font-bold mt-1 ${k.color.split(' ')[1]}`}>
              {k.value.toLocaleString('tr-TR')}
            </p>
            <p className="text-xs text-muted mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: '/admin/kullanicilar', label: 'Kullanıcıları Yönet', desc: 'Rol ve durum değiştir' },
          { href: '/admin/ajanslar', label: 'Ajansları Yönet', desc: 'Onayla, plan değiştir' },
          { href: '/admin/ilanlar?status=pending', label: 'Bekleyen İlanlar', desc: `${stats.listings.pending} ilan onay bekliyor` },
          { href: '/admin/abonelikler', label: 'Abonelikler', desc: 'Abonelik yönetimi' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="card p-5 hover:border-teal/30 transition-colors group"
          >
            <p className="font-semibold text-ink text-sm group-hover:text-teal transition-colors">{item.label}</p>
            <p className="text-xs text-muted mt-1">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
