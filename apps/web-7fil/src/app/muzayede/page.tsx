'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

type Auction = {
  id: string
  title: string
  listing_title: string
  city: string
  district: string
  property_type: string
  start_price: string
  current_price: string
  buy_now_price: string | null
  bid_count: number
  status: 'scheduled' | 'active' | 'ended' | 'cancelled'
  starts_at: string
  ends_at: string
  cover_url: string | null
}

function statusLabel(s: Auction['status']) {
  return { scheduled: 'Yakında', active: 'Canlı', ended: 'Bitti', cancelled: 'İptal' }[s]
}
function statusStyle(s: Auction['status']) {
  return {
    scheduled: 'bg-yellow-100 text-yellow-700',
    active: 'bg-emerald-100 text-emerald-700 animate-pulse',
    ended: 'bg-gray-100 text-gray-500',
    cancelled: 'bg-red-100 text-red-600',
  }[s]
}

function Countdown({ endsAt, status }: { endsAt: string; status: Auction['status'] }) {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    function tick() {
      const diff = new Date(endsAt).getTime() - Date.now()
      if (diff <= 0) { setRemaining('Sona erdi'); return }
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setRemaining(`${h > 0 ? `${h}s ` : ''}${m}d ${s}sn`)
    }
    tick()
    const id = setInterval(tick, 1_000)
    return () => clearInterval(id)
  }, [endsAt])

  if (status !== 'active') return null
  return (
    <div className="flex items-center gap-1 text-xs font-mono font-bold text-red-600">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
      {remaining}
    </div>
  )
}

export default function AuctionListPage() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<'active' | 'scheduled' | 'ended' | ''>('active')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const qs = status ? `status=${status}&` : ''
      const res = await fetch(`${BASE}/auctions?${qs}limit=24`)
      const json = await res.json() as { data: Auction[]; total: number }
      setAuctions(json.data ?? [])
      setTotal(json.total ?? 0)
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => { load() }, [load])

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-ink text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-2">7fil · Açık Artırma</p>
          <h1 className="text-3xl font-bold mb-2">Emlak Müzayedeleri</h1>
          <p className="text-white/60 text-sm">Canlı açık artırma sistemi ile şeffaf ve güvenli mülk alımı</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {([
            { key: 'active', label: '🔴 Canlı' },
            { key: 'scheduled', label: '⏰ Yakında' },
            { key: 'ended', label: '✅ Bitti' },
            { key: '', label: 'Tümü' },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setStatus(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                status === f.key
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400 self-center">{total} artırma</span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏛️</p>
            <p className="text-gray-500">Bu kategoride artırma bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((a) => (
              <Link key={a.id} href={`/muzayede/${a.id}`} className="group">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Photo */}
                  <div className="relative h-48 bg-gray-100">
                    {a.cover_url ? (
                      <Image src={a.cover_url} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl">🏛️</div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyle(a.status)}`}>
                        {statusLabel(a.status)}
                      </span>
                    </div>
                    {a.buy_now_price && (
                      <div className="absolute top-3 right-3 bg-gold text-ink text-xs font-bold px-2 py-1 rounded-full">
                        Hemen Al
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-1">{a.title}</h3>
                    <p className="text-xs text-gray-400">{a.city}{a.district ? `, ${a.district}` : ''}</p>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Güncel Teklif</p>
                        <p className="text-xl font-extrabold text-ink">
                          {Number(a.current_price).toLocaleString('tr-TR')} ₺
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.bid_count} teklif</p>
                      </div>
                      <Countdown endsAt={a.ends_at} status={a.status} />
                    </div>

                    {a.buy_now_price && (
                      <p className="mt-2 text-xs text-gray-400">
                        Hemen al: <span className="font-semibold text-gray-700">{Number(a.buy_now_price).toLocaleString('tr-TR')} ₺</span>
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
