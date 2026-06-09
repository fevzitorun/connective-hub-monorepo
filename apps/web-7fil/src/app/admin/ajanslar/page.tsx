'use client'
import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '../../../store/auth'
import { adminApi, AdminAgency } from '../../../lib/admin-api'

const PLANS = ['all', 'free', 'pro', 'corporate', 'enterprise']
const PLAN_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-600',
  pro: 'bg-blue-100 text-blue-700',
  corporate: 'bg-purple-100 text-purple-700',
  enterprise: 'bg-gold/20 text-yellow-700',
}

export default function AjanslarPage() {
  const { accessToken } = useAuthStore()
  const [agencies, setAgencies] = useState<AdminAgency[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [plan, setPlan] = useState('all')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    try {
      const res = await adminApi.listAgencies(accessToken, {
        page, limit: 25, plan: plan === 'all' ? undefined : plan, q: q || undefined,
      })
      setAgencies(res.data)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [accessToken, page, plan, q])

  useEffect(() => { load() }, [load])

  async function toggleVerify(id: string, current: boolean) {
    if (!accessToken) return
    setActionId(id)
    await adminApi.verifyAgency(accessToken, id, !current)
    setActionId(null)
    load()
  }

  async function changePlan(id: string, newPlan: string) {
    if (!accessToken) return
    setActionId(id)
    await adminApi.updateAgencyPlan(accessToken, id, newPlan)
    setActionId(null)
    load()
  }

  const totalPages = Math.ceil(total / 25)

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Ajanslar</h1>
          <p className="text-muted text-sm mt-0.5">{total.toLocaleString('tr-TR')} ajans</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="search"
            placeholder="Ajans adı veya e-posta..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            className="input-base w-56"
          />
          <select
            value={plan}
            onChange={(e) => { setPlan(e.target.value); setPage(1) }}
            className="input-base"
          >
            {PLANS.map((p) => (
              <option key={p} value={p}>{p === 'all' ? 'Tüm Planlar' : p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Ajans', 'E-posta', 'Plan', 'İlan', 'Abonelik', 'Doğrulama', 'İşlemler'].map((h) => (
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
                : agencies.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-ink">{a.company_name}</p>
                        <p className="text-xs text-muted">{a.city ?? ''}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted max-w-[180px] truncate">{a.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={a.plan}
                          disabled={actionId === a.id}
                          onChange={(e) => changePlan(a.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-teal disabled:opacity-50"
                        >
                          {PLANS.filter((p) => p !== 'all').map((p) => (
                            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="font-semibold text-ink">{a.active_listings}</span>
                        <span className="text-muted">/{a.listing_count}</span>
                      </td>
                      <td className="px-4 py-3">
                        {a.sub_plan && a.sub_plan !== 'none'
                          ? (
                              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${PLAN_COLORS[a.sub_plan] ?? 'bg-gray-100 text-gray-600'}`}>
                                {a.sub_plan}
                              </span>
                            )
                          : <span className="text-xs text-muted">Yok</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          a.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {a.is_verified ? '✓ Onaylı' : 'Onaysız'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          disabled={actionId === a.id}
                          onClick={() => toggleVerify(a.id, a.is_verified)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                            a.is_verified
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {a.is_verified ? 'Onayı Kaldır' : 'Onayla'}
                        </button>
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
