'use client'
import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '../../../store/auth'
import { adminApi, AdminSubscription } from '../../../lib/admin-api'

const STATUSES = ['all', 'active', 'cancelled', 'expired']
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  expired: 'bg-gray-100 text-gray-500',
}
const PLAN_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-600',
  pro: 'bg-blue-100 text-blue-700',
  corporate: 'bg-purple-100 text-purple-700',
  enterprise: 'bg-yellow-100 text-yellow-700',
}

export default function AboneliklerPage() {
  const { accessToken } = useAuthStore()
  const [subs, setSubs] = useState<AdminSubscription[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  // New subscription form
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ agencyId: '', plan: 'pro', months: '1' })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    try {
      const res = await adminApi.listSubscriptions(accessToken, {
        page, limit: 25, status: status === 'all' ? undefined : status,
      })
      setSubs(res.data)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [accessToken, page, status])

  useEffect(() => { load() }, [load])

  async function handleUpsert(e: React.FormEvent) {
    e.preventDefault()
    if (!accessToken) return
    setFormError(null)
    setSaving(true)
    try {
      await adminApi.upsertSubscription(accessToken, form.agencyId.trim(), form.plan, Number(form.months))
      setShowForm(false)
      setForm({ agencyId: '', plan: 'pro', months: '1' })
      load()
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const totalPages = Math.ceil(total / 25)

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Abonelikler</h1>
          <p className="text-muted text-sm mt-0.5">{total.toLocaleString('tr-TR')} abonelik</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="input-base"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'Tüm Durumlar' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary text-sm"
          >
            + Abonelik Ata
          </button>
        </div>
      </div>

      {/* Upsert form */}
      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-ink mb-4">Ajansa Abonelik Ata / Güncelle</h2>
          <form onSubmit={handleUpsert} className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Ajans ID</label>
              <input
                required
                value={form.agencyId}
                onChange={(e) => setForm({ ...form, agencyId: e.target.value })}
                placeholder="UUID"
                className="input-base w-72 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Plan</label>
              <select
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                className="input-base"
              >
                {['free', 'pro', 'corporate', 'enterprise'].map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Süre (ay)</label>
              <input
                type="number"
                min={1}
                max={36}
                value={form.months}
                onChange={(e) => setForm({ ...form, months: e.target.value })}
                className="input-base w-24"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(null) }}
                className="btn-secondary"
              >
                İptal
              </button>
            </div>
          </form>
          {formError && (
            <p className="mt-3 text-sm text-red-600">{formError}</p>
          )}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Ajans', 'E-posta', 'Plan', 'Tutar', 'Durum', 'Başlangıç', 'Bitiş'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : subs.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-ink">{s.company_name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted">{s.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${PLAN_COLORS[s.plan] ?? 'bg-gray-100 text-gray-600'}`}>
                          {s.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-ink whitespace-nowrap">
                        {Number(s.amount).toLocaleString('tr-TR')} {s.currency}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[s.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                        {new Date(s.starts_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                        {s.ends_at ? new Date(s.ends_at).toLocaleDateString('tr-TR') : '—'}
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
