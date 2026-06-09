'use client'
import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '../../../store/auth'
import { partnerApi, Commission } from '../../../lib/api'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function KomisyonPage() {
  const { accessToken } = useAuthStore()
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    if (!accessToken) return
    const res = await partnerApi.listCommissions(accessToken, page).catch(() => null)
    if (res) { setCommissions(res.data); setTotal(res.total) }
  }, [accessToken, page])

  useEffect(() => { load() }, [load])

  const totalPages = Math.ceil(total / 20)
  const totalPaid = commissions.filter(c => c.status === 'paid').reduce((s, c) => s + Number(c.amount), 0)
  const totalPending = commissions.filter(c => c.status === 'pending' || c.status === 'approved').reduce((s, c) => s + Number(c.amount), 0)

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Komisyonlar</h1>
        <p className="text-muted text-sm mt-0.5">Kazanç geçmişi ve ödemeler</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-xs text-muted">Ödenen</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{totalPaid.toLocaleString('tr-TR')}₺</p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-muted">Bekleyen</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{totalPending.toLocaleString('tr-TR')}₺</p>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Referans', 'Tip', 'Tutar', 'Durum', 'Tarih', 'Ödeme'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {commissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">Henüz komisyon kaydı yok.</td>
                </tr>
              ) : commissions.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-ink">{c.contact_name ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-muted">{c.commission_type}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{Number(c.amount).toLocaleString('tr-TR')} {c.currency}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_COLORS[c.status] ?? 'bg-gray-100 text-gray-500'}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{new Date(c.created_at).toLocaleDateString('tr-TR')}</td>
                  <td className="px-4 py-3 text-xs text-muted">{c.paid_at ? new Date(c.paid_at).toLocaleDateString('tr-TR') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-muted">Sayfa {page} / {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40">Önceki</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40">Sonraki</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
