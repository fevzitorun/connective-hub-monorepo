'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '../../../store/auth'
import Link from 'next/link'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

type AuctionRow = {
  id: string
  title: string
  listing_title: string
  city: string
  start_price: string
  current_price: string
  buy_now_price: string | null
  bid_count: number
  status: 'scheduled' | 'active' | 'ended' | 'cancelled'
  starts_at: string
  ends_at: string
}

const STATUS_STYLE: Record<string, string> = {
  scheduled: 'bg-yellow-100 text-yellow-700',
  active: 'bg-emerald-100 text-emerald-700',
  ended: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-600',
}
const STATUS_LABEL: Record<string, string> = {
  scheduled: 'Yakında', active: 'Canlı', ended: 'Bitti', cancelled: 'İptal',
}

export default function PanelMuzaydePage() {
  const { accessToken } = useAuthStore()
  const [auctions, setAuctions] = useState<AuctionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/auctions/my/list`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const json = await res.json() as { data: AuctionRow[] }
      setAuctions(json.data ?? [])
    } finally { setLoading(false) }
  }, [accessToken])

  useEffect(() => { load() }, [load])

  async function cancelAuction(id: string) {
    if (!accessToken || !confirm('Bu artırmayı iptal etmek istediğinize emin misiniz?')) return
    await fetch(`${BASE}/auctions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    load()
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Açık Artırmalarım</h1>
          <p className="text-sm text-gray-400 mt-1">Oluşturduğunuz müzayedeleri yönetin</p>
        </div>
        <div className="flex gap-3">
          <Link href="/muzayede" target="_blank"
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-teal transition-colors">
            Müzayedeleri Gör
          </Link>
          <button onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-semibold hover:bg-teal/90 transition-colors">
            + Yeni Artırma
          </button>
        </div>
      </div>

      {/* Create form */}
      {showForm && <CreateAuctionForm accessToken={accessToken!} onCreated={() => { setShowForm(false); load() }} />}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏛️</p>
            <p className="text-gray-500 text-sm">Henüz açık artırma oluşturmadınız.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b border-gray-50">
                <th className="text-left px-6 py-3 font-medium">Başlık</th>
                <th className="text-right px-4 py-3 font-medium">Mevcut Fiyat</th>
                <th className="text-right px-4 py-3 font-medium">Teklif</th>
                <th className="text-center px-4 py-3 font-medium">Durum</th>
                <th className="text-left px-4 py-3 font-medium">Bitiş</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((a) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800 truncate max-w-xs">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.city}</p>
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-gray-800">
                    {Number(a.current_price).toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-4 py-4 text-right text-gray-500">{a.bid_count}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLE[a.status] ?? ''}`}>
                      {STATUS_LABEL[a.status] ?? a.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">
                    {new Date(a.ends_at).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/muzayede/${a.id}`} target="_blank"
                        className="text-xs px-2 py-1 border border-gray-200 rounded hover:border-teal text-gray-600 transition-colors">
                        Görüntüle
                      </Link>
                      {(a.status === 'scheduled' || a.status === 'active') && (
                        <button onClick={() => cancelAuction(a.id)}
                          className="text-xs px-2 py-1 border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors">
                          İptal
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function CreateAuctionForm({ accessToken, onCreated }: { accessToken: string; onCreated: () => void }) {
  const [form, setForm] = useState({
    listingId: '', title: '', description: '',
    startPrice: '', minIncrement: '1000', buyNowPrice: '',
    startsAt: '', endsAt: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setSaving(true); setError(null)
    try {
      const res = await fetch(`${BASE}/auctions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          listingId: form.listingId, title: form.title,
          description: form.description || undefined,
          startPrice: Number(form.startPrice),
          minIncrement: Number(form.minIncrement),
          buyNowPrice: form.buyNowPrice ? Number(form.buyNowPrice) : undefined,
          startsAt: form.startsAt, endsAt: form.endsAt,
        }),
      })
      const json = await res.json() as { error?: string }
      if (!res.ok) { setError(json.error ?? 'Hata'); return }
      onCreated()
    } finally { setSaving(false) }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal/30'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Yeni Açık Artırma</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-500 font-medium block mb-1">İlan ID (UUID)</label>
          <input className={inputCls} value={form.listingId} onChange={(e) => setForm({ ...form, listingId: e.target.value })} placeholder="İlan UUID" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-500 font-medium block mb-1">Başlık</label>
          <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        {[
          { label: 'Başlangıç Fiyatı (₺)', key: 'startPrice' },
          { label: 'Min. Artış (₺)', key: 'minIncrement' },
          { label: 'Hemen Al Fiyatı (₺, opsiyonel)', key: 'buyNowPrice' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 font-medium block mb-1">{label}</label>
            <input type="number" className={inputCls} value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
        <div>
          <label className="text-xs text-gray-500 font-medium block mb-1">Başlangıç Tarihi</label>
          <input type="datetime-local" className={inputCls} value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium block mb-1">Bitiş Tarihi</label>
          <input type="datetime-local" className={inputCls} value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-3 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      <div className="flex gap-3 mt-4">
        <button onClick={handleSubmit} disabled={saving}
          className="px-6 py-2.5 bg-teal text-white rounded-lg text-sm font-semibold hover:bg-teal/90 disabled:opacity-50 transition-colors">
          {saving ? 'Oluşturuluyor…' : 'Artırma Oluştur'}
        </button>
      </div>
    </div>
  )
}
