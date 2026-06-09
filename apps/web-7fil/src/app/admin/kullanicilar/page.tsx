'use client'
import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '../../../store/auth'
import { adminApi, AdminUser } from '../../../lib/admin-api'

const ROLES = ['all', 'buyer', 'agency', 'agent_person', 'lawyer', 'bank', 'admin']
const ROLE_LABELS: Record<string, string> = {
  all: 'Tümü', buyer: 'Alıcı', agency: 'Ajans', agent_person: 'Danışman',
  lawyer: 'Avukat', bank: 'Banka', admin: 'Admin',
}

export default function KullanicilarPage() {
  const { accessToken } = useAuthStore()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [role, setRole] = useState('all')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    try {
      const res = await adminApi.listUsers(accessToken, {
        page, limit: 25, role: role === 'all' ? undefined : role, q: q || undefined,
      })
      setUsers(res.data)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [accessToken, page, role, q])

  useEffect(() => { load() }, [load])

  async function toggleActive(id: string, current: boolean) {
    if (!accessToken) return
    setActionId(id)
    await adminApi.updateUser(accessToken, id, { isActive: !current })
    setActionId(null)
    load()
  }

  async function changeRole(id: string, newRole: string) {
    if (!accessToken) return
    setActionId(id)
    await adminApi.updateUser(accessToken, id, { role: newRole })
    setActionId(null)
    load()
  }

  const totalPages = Math.ceil(total / 25)

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Kullanıcılar</h1>
          <p className="text-muted text-sm mt-0.5">{total.toLocaleString('tr-TR')} kullanıcı</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="search"
            placeholder="E-posta veya isim ara..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            className="input-base w-56"
          />
          <select
            value={role}
            onChange={(e) => { setRole(e.target.value); setPage(1) }}
            className="input-base"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r] ?? r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['E-posta', 'İsim', 'Rol', 'Ajans', 'Durum', 'Kayıt', 'İşlem'].map((h) => (
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
                : users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted max-w-[200px] truncate">{u.email}</td>
                      <td className="px-4 py-3 font-medium text-ink">{u.full_name ?? '—'}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          disabled={actionId === u.id}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-teal"
                        >
                          {ROLES.filter((r) => r !== 'all').map((r) => (
                            <option key={r} value={r}>{ROLE_LABELS[r] ?? r}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted">
                        {u.company_name
                          ? <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{u.company_name}</span>
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {u.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                        {new Date(u.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          disabled={actionId === u.id}
                          onClick={() => toggleActive(u.id, u.is_active)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                            u.is_active
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {u.is_active ? 'Devre Dışı' : 'Aktif Et'}
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
