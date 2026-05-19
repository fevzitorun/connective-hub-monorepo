'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '../../store/auth'
import { panelApi, type DashboardStats } from '../../lib/panel-api'

const PLAN_LABELS: Record<string, string> = {
  free: 'Ücretsiz', pro: 'Pro', corporate: 'Kurumsal',
}

export default function PanelDashboard() {
  const { accessToken, user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accessToken) return
    panelApi.getStats(accessToken)
      .then((r) => setStats(r.data))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [accessToken])

  const statCards = stats ? [
    { label: 'Toplam İlan', value: stats.totalListings, color: 'text-ink' },
    { label: 'Aktif', value: stats.activeListings, color: 'text-teal' },
    { label: 'Taslak', value: stats.draftListings, color: 'text-muted' },
    { label: 'Toplam Görüntülenme', value: stats.totalViews.toLocaleString('tr-TR'), color: 'text-gold' },
    { label: 'WhatsApp Tıklama', value: stats.totalWhatsappClicks.toLocaleString('tr-TR'), color: 'text-[#25D366]' },
  ] : []

  return (
    <div className="p-8">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink">
          Merhaba{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-muted text-sm mt-1">İlan panelinize hoş geldiniz.</p>
      </div>

      {/* Plan bandı */}
      {stats && (
        <div className="mb-6 flex items-center justify-between bg-white rounded-xl border border-border px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="badge-gold">{PLAN_LABELS[stats.plan] ?? stats.plan} Plan</span>
            {stats.subscription?.endsAt && (
              <span className="text-xs text-muted">
                {new Date(stats.subscription.endsAt).toLocaleDateString('tr-TR')} tarihine kadar aktif
              </span>
            )}
          </div>
          {stats.plan === 'free' && (
            <Link href="/panel/abonelik" className="btn-primary text-sm py-1.5 px-4">
              Pro&apos;ya Geç
            </Link>
          )}
        </div>
      )}

      {/* Stat kartları */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-7 bg-cream rounded w-1/2 mb-2" />
              <div className="h-4 bg-cream rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="card p-5">
              <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Hızlı işlemler */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/panel/ilanlar/yeni" className="card p-5 flex items-center gap-4 hover:border-gold/30 transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center flex-shrink-0 group-hover:bg-gold group-hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-ink text-sm">Yeni İlan Ekle</p>
            <p className="text-xs text-muted">Tek tek veya CSV ile toplu</p>
          </div>
        </Link>

        <Link href="/panel/ilanlar" className="card p-5 flex items-center gap-4 hover:border-teal/30 transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-teal/10 text-teal flex items-center justify-center flex-shrink-0 group-hover:bg-teal group-hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-ink text-sm">İlanlarımı Yönet</p>
            <p className="text-xs text-muted">Düzenle, yayınla, sil</p>
          </div>
        </Link>

        <Link href="/panel/profil" className="card p-5 flex items-center gap-4 hover:border-gold/30 transition-colors group">
          <div className="w-10 h-10 rounded-lg bg-ink/5 text-ink flex items-center justify-center flex-shrink-0 group-hover:bg-ink group-hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-ink text-sm">Profili Güncelle</p>
            <p className="text-xs text-muted">Logo, subdomain, açıklama</p>
          </div>
        </Link>
      </div>

      {/* FILTERRA.AI bandı */}
      <div className="mt-8 bg-teal/5 border border-teal/20 rounded-xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-teal text-sm">FILTERRA.AI yakında</p>
          <p className="text-xs text-muted mt-1">
            AI destekli ilan açıklaması yazma, piyasa değerlemesi ve hukuki ön inceleme modülü aktif hale gelecek.
            Pro ve Kurumsal planlarda öncelikli erişim.
          </p>
        </div>
      </div>
    </div>
  )
}
