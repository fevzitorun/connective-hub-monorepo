'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '../../../store/auth'
import { timeAgo } from '../../../lib/utils'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

type LegalCase = {
  id: string
  listingId: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'cancelled'
  riskScore: number | null
  listing: { title: string; city: string }
  requester?: { fullName: string; email: string }
  createdAt: string
  reviewedAt: string | null
}

type Stats = {
  total: number
  pending: number
  approved: number
  rejected: number
  certsIssued: number
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending:      { label: 'Bekliyor', cls: 'bg-gold/10 text-gold' },
  under_review: { label: 'İncelemede', cls: 'bg-blue-50 text-blue-600' },
  approved:     { label: 'Onaylandı', cls: 'bg-green-50 text-green-600' },
  rejected:     { label: 'Reddedildi', cls: 'bg-red-50 text-red-600' },
  cancelled:    { label: 'İptal', cls: 'bg-cream text-muted' },
}

export default function LawyerDashboard() {
  const { accessToken } = useAuthStore()
  const [cases, setCases] = useState<LegalCase[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accessToken) return
    Promise.all([
      fetch(`${BASE}/legal/lawyer/cases`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((r) => r.json()),
      fetch(`${BASE}/legal/lawyer/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((r) => r.json()),
    ])
      .then(([casesRes, statsRes]) => {
        setCases(casesRes.data ?? [])
        setStats(statsRes.data ?? null)
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [accessToken])

  const statCards = stats
    ? [
        { label: 'Toplam Dava', value: stats.total, color: 'text-ink' },
        { label: 'İncelemede', value: stats.pending, color: 'text-blue-600' },
        { label: 'Onaylanan', value: stats.approved, color: 'text-green-600' },
        { label: 'Sertifika', value: stats.certsIssued, color: 'text-gold' },
      ]
    : []

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink">Hukuki İnceleme Paneli</h1>
        <p className="text-muted text-sm mt-1">Size atanan davaları ve sertifika işlemlerini buradan yönetin.</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className="card p-5">
              <p className="text-xs text-muted">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Cases table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-ink text-sm">Davalarım</h2>
          <span className="text-xs text-muted">{cases.length} dava</span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-cream rounded-lg animate-pulse" />)}
          </div>
        ) : cases.length === 0 ? (
          <div className="py-20 text-center text-muted">
            <p className="font-semibold text-ink">Henüz atanmış dava yok</p>
            <p className="text-sm mt-1">Admin size dava atadığında burada görünecek.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {cases.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-cream/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <Link href={`/panel/hukuk/davalar/${c.id}`}>
                    <p className="font-medium text-ink text-sm hover:text-teal transition-colors truncate">
                      {c.listing?.title ?? 'Bilinmeyen İlan'}
                    </p>
                  </Link>
                  <p className="text-xs text-muted mt-0.5">
                    {c.listing?.city}
                    {c.requester && ` · ${c.requester.fullName}`}
                    {' · '}
                    {timeAgo(new Date(c.createdAt))}
                  </p>
                </div>

                {c.riskScore != null && (
                  <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    c.riskScore < 30 ? 'bg-green-50 text-green-600' :
                    c.riskScore < 60 ? 'bg-gold/10 text-gold' :
                    'bg-red-50 text-red-600'
                  }`}>
                    Risk {c.riskScore}
                  </div>
                )}

                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_LABELS[c.status]?.cls}`}>
                  {STATUS_LABELS[c.status]?.label}
                </span>

                <Link
                  href={`/panel/hukuk/davalar/${c.id}`}
                  className="text-xs text-teal hover:text-gold transition-colors font-medium flex-shrink-0"
                >
                  Detay →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
