'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../store/auth'
import { partnerApi, MlsListing } from '../../../lib/api'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  closed: 'bg-gray-100 text-gray-600',
}

export default function MlsPage() {
  const { accessToken } = useAuthStore()
  const [tab, setTab] = useState<'pool' | 'mine'>('pool')
  const [pool, setPool] = useState<MlsListing[]>([])
  const [mine, setMine] = useState<MlsListing[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)
  const [joinDone, setJoinDone] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!accessToken) return
    setLoading(true)
    Promise.all([
      partnerApi.getMlsPool(accessToken).catch(() => ({ data: [] as MlsListing[] })),
      partnerApi.getMyMls(accessToken).catch(() => ({ data: [] as MlsListing[] })),
    ]).then(([p, m]) => {
      setPool(p.data ?? [])
      setMine(m.data ?? [])
    }).finally(() => setLoading(false))
  }, [accessToken])

  const handleJoin = async (id: string) => {
    if (!accessToken) return
    setJoining(id)
    try {
      await partnerApi.joinMls(accessToken, id, 50)
      setJoinDone(prev => new Set([...prev, id]))
    } catch { /* silent */ }
    setJoining(null)
  }

  const listings = tab === 'pool' ? pool : mine

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink">MLS Havuzu</h1>
        <p className="text-muted text-sm mt-1">
          7fil MLS ağındaki ilanları görün, işbirliği yapın ve komisyon kazanın.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Havuzdaki İlan', value: pool.length },
          { label: 'İşbirliklerim', value: mine.length },
          { label: 'Ort. Komisyon', value: pool.length > 0 ? `%${Math.round(pool.reduce((a, l) => a + l.commissionSplit, 0) / pool.length)}` : '—' },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-xs text-muted">{s.label}</p>
            <p className="text-2xl font-bold text-ink mt-1">{loading ? '—' : s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {([['pool', 'MLS Havuzu'], ['mine', 'İşbirliklerim']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Listings */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted">Yükleniyor...</div>
        ) : listings.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-4xl mb-3">🤝</p>
            <p className="text-sm font-medium text-ink">
              {tab === 'pool' ? 'Havuzda henüz ilan yok.' : 'Henüz işbirliği yapmadınız.'}
            </p>
            <p className="text-xs text-muted mt-1">
              {tab === 'pool' ? 'Acentalar ilan ekledikçe burada görünecek.' : 'Havuzdan bir ilana katılın.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['İlan', 'Şehir', 'Fiyat', 'Acenta', 'Komisyon', 'Durum', ''].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink line-clamp-1 max-w-[180px]">{l.listing.title}</p>
                      <p className="text-xs text-muted">{l.listing.propertyType}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{l.listing.city}</td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {Number(l.listing.price).toLocaleString('tr-TR')} ₺
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{l.agency.name}</td>
                    <td className="px-4 py-3 font-medium text-teal">%{l.commissionSplit}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLORS[l.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {tab === 'pool' && (
                        joinDone.has(l.id) ? (
                          <span className="text-xs text-teal font-semibold">✓ Katıldınız</span>
                        ) : (
                          <button
                            onClick={() => handleJoin(l.id)}
                            disabled={joining === l.id}
                            className="text-xs btn-primary py-1.5 px-3"
                          >
                            {joining === l.id ? '...' : 'Katıl'}
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-muted mt-4 text-center">
        MLS ortaklık başvurusu veya sorular için: <a href="mailto:partner@7fil.com.tr" className="text-teal hover:underline">partner@7fil.com.tr</a>
      </p>
    </div>
  )
}
