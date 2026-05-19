'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '../../../store/auth'
import { panelApi, type PanelListing } from '../../../lib/panel-api'
import { formatPrice, listingTypeLabel, timeAgo } from '../../../lib/utils'

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  active:  { label: 'Aktif',   className: 'badge-teal' },
  draft:   { label: 'Taslak',  className: 'bg-muted/10 text-muted' },
  passive: { label: 'Pasif',   className: 'bg-muted/10 text-muted' },
  expired: { label: 'Süresi Dolmuş', className: 'bg-red-50 text-red-600' },
  sold:    { label: 'Satıldı', className: 'badge-gold' },
  rented:  { label: 'Kiralandı', className: 'badge-gold' },
}

export default function PanelListings() {
  const { accessToken } = useAuthStore()
  const [listings, setListings] = useState<PanelListing[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    try {
      const res = await panelApi.getMyListings(accessToken, page)
      setListings(res.data.data)
      setTotal(res.data.total)
      setTotalPages(res.data.totalPages)
    } catch {
      /* handle silently */
    } finally {
      setLoading(false)
    }
  }, [accessToken, page])

  useEffect(() => { load() }, [load])

  async function handlePublish(id: string) {
    if (!accessToken) return
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'}/listings/${id}/publish`,
      { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } }
    )
    load()
  }

  async function handleDelete(id: string) {
    if (!accessToken || !confirm('Bu ilanı silmek istediğinizden emin misiniz?')) return
    setDeleting(id)
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'}/listings/${id}`,
      { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } }
    )
    setDeleting(null)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">İlanlarım</h1>
          <p className="text-sm text-muted mt-0.5">{total} ilan</p>
        </div>
        <div className="flex gap-3">
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'}/listings/csv/template`}
            download
            className="btn-outline text-sm py-2 px-4"
          >
            CSV Şablonu İndir
          </a>
          <Link href="/panel/ilanlar/yeni" className="btn-primary text-sm py-2 px-4">
            + Yeni İlan
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-4 animate-pulse flex gap-4">
              <div className="w-20 h-16 bg-cream rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-cream rounded w-1/2" />
                <div className="h-3 bg-cream rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 card">
          <p className="text-muted">Henüz ilan yok.</p>
          <Link href="/panel/ilanlar/yeni" className="btn-primary mt-4 inline-block">
            İlk İlanı Ekle
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream text-xs text-muted uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 w-16">Fotoğraf</th>
                <th className="text-left px-4 py-3">Başlık</th>
                <th className="text-left px-4 py-3">Fiyat</th>
                <th className="text-left px-4 py-3">Durum</th>
                <th className="text-right px-4 py-3">Görüntülenme</th>
                <th className="text-right px-4 py-3">WA</th>
                <th className="text-left px-4 py-3">Tarih</th>
                <th className="text-right px-4 py-3">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listings.map((l) => {
                const cover = l.photos?.find((p) => p.isCover)
                const statusMeta = STATUS_LABELS[l.status] ?? { label: l.status, className: 'badge-teal' }
                const expired = l.expiresAt && new Date(l.expiresAt) < new Date()
                return (
                  <tr key={l.id} className="hover:bg-cream/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                        {cover ? (
                          <Image src={cover.url} alt="" width={64} height={48} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted/30">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink line-clamp-1">{l.title}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {l.city}{l.district && `, ${l.district}`} · {listingTypeLabel(l.listingType)}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gold">{formatPrice(l.price, l.currency)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMeta.className}`}>
                        {expired && l.status === 'active' ? 'Süresi Dolmuş' : statusMeta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-muted">{l.viewCount}</td>
                    <td className="px-4 py-3 text-right text-[#25D366]">{l.whatsappClicks}</td>
                    <td className="px-4 py-3 text-xs text-muted">{timeAgo(l.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {l.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(l.id)}
                            className="text-xs text-teal hover:text-gold font-medium transition-colors"
                          >
                            Yayınla
                          </button>
                        )}
                        <Link
                          href={`/ilan/${l.id}`}
                          target="_blank"
                          className="text-xs text-muted hover:text-teal transition-colors"
                        >
                          Gör
                        </Link>
                        <button
                          onClick={() => handleDelete(l.id)}
                          disabled={deleting === l.id}
                          className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                        >
                          {deleting === l.id ? '...' : 'Sil'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-40 hover:border-gold/50">← Önceki</button>
          <span className="px-4 py-2 text-sm text-muted">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-40 hover:border-gold/50">Sonraki →</button>
        </div>
      )}
    </div>
  )
}
