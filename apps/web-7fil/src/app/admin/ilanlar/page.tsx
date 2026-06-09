'use client'
import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '../../../store/auth'
import { adminApi, AdminListing } from '../../../lib/admin-api'

const STATUSES = ['all', 'active', 'pending', 'passive', 'rejected', 'sold', 'rented']
const STATUS_LABELS: Record<string, string> = {
  all: 'Tümü', active: 'Aktif', pending: 'Beklemede', passive: 'Pasif',
  rejected: 'Reddedildi', sold: 'Satıldı', rented: 'Kiralandı',
}
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  passive: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-100 text-red-600',
  sold: 'bg-blue-100 text-blue-700',
  rented: 'bg-teal-100 text-teal-700',
}

export default function IlanlarPage() {
  const { accessToken } = useAuthStore()
  const [listings, setListings] = useState<AdminListing[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    try {
      const res = await adminApi.listListings(accessToken, {
        page, limit: 25, status: status === 'all' ? undefined : status, q: q || undefined,
      })
      setListings(res.data)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [accessToken, page, status, q])

  useEffect(() => { load() }, [load])

  async function changeStatus(id: string, newStatus: string) {
    if (!accessToken) return
    setActionId(id)
    await adminApi.updateListingStatus(accessToken, id, newStatus)
    setActionId(null)
    load()
  }

  async function deleteListing(id: string) {
    if (!accessToken) return
    setActionId(id)
    await adminApi.deleteListing(accessToken, id)
    setDeleteConfirm(null)
    setActionId(null)
    load()
  }

  const totalPages = Math.ceil(total / 25)

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">İlanlar</h1>
          <p className="text-muted text-sm mt-0.5">{total.toLocaleString('tr-TR')} ilan</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="search"
            placeholder="İlan başlığı ara..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            className="input-base w-56"
          />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="input-base"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s] ?? s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['İlan', 'Ajans / Sahip', 'Fiyat', 'Durum', 'Görüntülenme', 'İşlemler'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : listings.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 max-w-[240px]">
                        <div className="flex items-center gap-3">
                          {l.cover_url
                            ? <img src={l.cover_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            : <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0" />}
                          <div className="min-w-0">
                            <p className="font-medium text-ink text-xs truncate">{l.title}</p>
                            <p className="text-xs text-muted">{l.city} · {l.listing_type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">
                        <p>{l.agency_name ?? '—'}</p>
                        <p className="text-gray-400">{l.owner_email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-ink whitespace-nowrap">
                        {l.price
                          ? `${Number(l.price).toLocaleString('tr-TR')} ${l.currency}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={l.status}
                          disabled={actionId === l.id}
                          onChange={(e) => changeStatus(l.id, e.target.value)}
                          className={`text-xs border rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-teal disabled:opacity-50 ${STATUS_COLORS[l.status] ?? 'border-gray-200'}`}
                        >
                          {STATUSES.filter((s) => s !== 'all').map((s) => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">
                        <span>{l.view_count.toLocaleString('tr-TR')} görüntülenme</span>
                      </td>
                      <td className="px-4 py-3">
                        {deleteConfirm === l.id
                          ? (
                              <div className="flex gap-1">
                                <button
                                  disabled={actionId === l.id}
                                  onClick={() => deleteListing(l.id)}
                                  className="text-xs px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                  Sil
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                                >
                                  İptal
                                </button>
                              </div>
                            )
                          : (
                              <button
                                onClick={() => setDeleteConfirm(l.id)}
                                className="text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
                              >
                                Sil
                              </button>
                            )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-muted">Sayfa {page} / {totalPages}</p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:border-teal"
              >
                Önceki
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:border-teal"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
