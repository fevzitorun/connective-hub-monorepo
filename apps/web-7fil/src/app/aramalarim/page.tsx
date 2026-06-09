'use client'
import Link from 'next/link'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'
import { useHistoryStore } from '../../store/history'
import { useAuthStore } from '../../store/auth'
import { timeAgo } from '../../lib/utils'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

function buildSearchUrl(params: Record<string, unknown>): string {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') qs.set(k, String(v))
  })
  return `/ara?${qs}`
}

export default function SavedSearchesPage() {
  const { entries, remove, clear } = useHistoryStore()
  const { accessToken } = useAuthStore()

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-ink">Aramalarım</h1>
              <p className="text-muted text-sm mt-1">Son aramalar ve kayıtlı alarmlarınız</p>
            </div>
            {entries.length > 0 && (
              <button onClick={clear} className="text-sm text-muted hover:text-red-500 transition-colors">
                Tümünü Sil
              </button>
            )}
          </div>

          {!accessToken && (
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-5 mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-ink">
                E-posta bildirimleri için giriş yapın.
              </p>
              <Link href="/giris?redirect=/aramalarim" className="btn-primary text-sm py-2 px-4 flex-shrink-0">
                Giriş Yap
              </Link>
            </div>
          )}

          {entries.length === 0 ? (
            <div className="text-center py-20 card">
              <svg className="w-12 h-12 mx-auto text-muted/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="font-semibold text-ink">Henüz kayıtlı arama yok</p>
              <p className="text-sm text-muted mt-2">Arama yaparken &quot;Bu aramayı kaydet&quot; butonuna tıklayın.</p>
              <Link href="/ara" className="btn-primary mt-6 inline-block">Aramaya Başla</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="card p-4 flex items-center justify-between gap-4">
                  <Link
                    href={buildSearchUrl(entry.params as Record<string, unknown>)}
                    className="flex-1 min-w-0 group"
                  >
                    <p className="font-semibold text-ink group-hover:text-teal transition-colors truncate">
                      {entry.label}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted flex-wrap">
                      {entry.params.listingType && (
                        <span>{entry.params.listingType === 'sale' ? 'Satılık' : 'Kiralık'}</span>
                      )}
                      {entry.params.priceMin && <span>Min {Number(entry.params.priceMin).toLocaleString('tr-TR')}₺</span>}
                      {entry.params.priceMax && <span>Max {Number(entry.params.priceMax).toLocaleString('tr-TR')}₺</span>}
                      {entry.params.roomCount && <span>{String(entry.params.roomCount)}</span>}
                      <span>{timeAgo(new Date(entry.timestamp))}</span>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={buildSearchUrl(entry.params as Record<string, unknown>)}
                      className="text-xs text-teal hover:text-gold transition-colors font-medium"
                    >
                      Ara →
                    </Link>
                    <button
                      onClick={() => remove(entry.id)}
                      className="text-xs text-muted hover:text-red-500 transition-colors ml-2"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Aktif API alarmları (giriş yapmışsa) */}
          {accessToken && (
            <div className="mt-10">
              <h2 className="font-semibold text-ink mb-4 text-sm">E-posta Alarmlarım</h2>
              <AlertsList token={accessToken} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function AlertsList({ token }: { token: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BASE}/search/alerts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => setAlerts(res.data ?? []))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [token])

  async function deleteAlert(id: string) {
    await fetch(`${BASE}/search/alerts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  if (loading) return <div className="h-20 bg-cream rounded-xl animate-pulse" />

  if (alerts.length === 0) {
    return (
      <p className="text-sm text-muted bg-white border border-border rounded-xl p-4">
        Aktif alarm yok. Arama sayfasında &quot;Bu aramayı kaydet&quot; ile alarm kurabilirsiniz.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((a) => (
        <div key={a.id} className="card p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-ink text-sm">{a.label ?? 'Kayıtlı Arama'}</p>
            <p className="text-xs text-muted mt-0.5">
              {a.channel === 'email' ? '📧 E-posta' : '📱 WhatsApp'} · {timeAgo(a.createdAt)}
            </p>
          </div>
          <button onClick={() => deleteAlert(a.id)} className="text-xs text-muted hover:text-red-500 transition-colors">
            İptal
          </button>
        </div>
      ))}
    </div>
  )
}

// useState + useEffect için client import (file başında zaten 'use client' var)
import { useState, useEffect } from 'react'

type Alert = {
  id: string
  label: string
  channel: string
  createdAt: string
  filters: Record<string, unknown>
}
