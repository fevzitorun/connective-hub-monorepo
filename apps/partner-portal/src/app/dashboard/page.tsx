'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/auth'
import { partnerApi, DashboardStats } from '../../lib/api'

export default function DashboardPage() {
  const { accessToken } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [rates, setRates] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    if (!accessToken) return
    partnerApi.getDashboard(accessToken).then(r => setStats(r.data)).catch(() => null)
    partnerApi.getRates(accessToken).then(r => setRates(r.data)).catch(() => null)
  }, [accessToken])

  const kpis = stats
    ? [
        { label: 'Toplam Referans', value: stats.referrals.total, sub: `+${stats.referrals.last_30d} son 30 gün` },
        { label: 'Dönüşüm', value: stats.referrals.converted, sub: `${stats.referrals.total > 0 ? Math.round((stats.referrals.converted / stats.referrals.total) * 100) : 0}% oran` },
        { label: 'Toplam Kazanç', value: `${Number(stats.commissions.total_earned).toLocaleString('tr-TR')}₺`, sub: `${Number(stats.commissions.paid).toLocaleString('tr-TR')}₺ ödendi` },
        { label: 'Bekleyen', value: `${Number(stats.commissions.pending).toLocaleString('tr-TR')}₺`, sub: 'ödeme bekleniyor' },
      ]
    : []

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink">Partner Dashboard</h1>
        <p className="text-muted text-sm mt-1">7fil.com.tr partner ağı</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats
          ? kpis.map((k) => (
              <div key={k.label} className="card p-5">
                <p className="text-xs text-muted">{k.label}</p>
                <p className="text-2xl font-bold text-ink mt-1">{k.value}</p>
                <p className="text-xs text-muted mt-1">{k.sub}</p>
              </div>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-3 bg-gray-100 rounded w-20 mb-2" />
                <div className="h-7 bg-gray-100 rounded w-24 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-28" />
              </div>
            ))}
      </div>

      {/* Commission Rates */}
      {rates && (
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-ink mb-4">Komisyon Oranları</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(rates).map(([type, rate]) => (
              <div key={type} className="bg-cream rounded-xl p-4">
                <p className="text-xs text-muted mb-1">
                  {type === 'listing_lead' ? 'İlan Lead' : type === 'mortgage_lead' ? 'Mortgage Lead' : 'Abonelik Referansı'}
                </p>
                <p className="text-xl font-bold text-ink">
                  {type === 'mortgage_lead' ? `${rate.toLocaleString('tr-TR')}₺` : `%${rate}`}
                </p>
                <p className="text-xs text-muted mt-1">
                  {type === 'mortgage_lead' ? 'sabit ücret / lead' : 'işlem değeri üzerinden'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {[
          { href: '/dashboard/referrals', label: 'Referans Gönder', desc: 'Yeni müşteri veya ajans yönlendir' },
          { href: '/dashboard/embed', label: 'Widget Oluştur', desc: 'Sitenize 7fil embed ekle' },
        ].map((item) => (
          <a key={item.href} href={item.href} className="card p-5 hover:border-teal/30 transition-colors group">
            <p className="font-semibold text-ink group-hover:text-teal transition-colors">{item.label}</p>
            <p className="text-xs text-muted mt-1">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
