'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useAuthStore } from '../../../store/auth'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

type AuctionDetail = {
  id: string
  title: string
  description: string | null
  listing_title: string
  listing_description: string | null
  city: string
  district: string
  property_type: string
  listing_type: string
  area_m2: number | null
  room_count: string | null
  original_price: string
  start_price: string
  reserve_price: string | null
  min_increment: string
  buy_now_price: string | null
  current_price: string
  bid_count: number
  status: 'scheduled' | 'active' | 'ended' | 'cancelled'
  starts_at: string
  ends_at: string
  winner_name: string | null
  cover_url: string | null
  photos: string[] | null
}

type Bid = {
  id: string
  amount: string
  bidder_name: string
  bidder_email_masked: string
  created_at: string
}

function Countdown({ endsAt }: { endsAt: string }) {
  const [parts, setParts] = useState({ h: 0, m: 0, s: 0 })

  useEffect(() => {
    function tick() {
      const diff = new Date(endsAt).getTime() - Date.now()
      if (diff <= 0) { setParts({ h: 0, m: 0, s: 0 }); return }
      setParts({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      })
    }
    tick()
    const id = setInterval(tick, 1_000)
    return () => clearInterval(id)
  }, [endsAt])

  return (
    <div className="flex gap-3 justify-center my-4">
      {[{ v: parts.h, l: 'Saat' }, { v: parts.m, l: 'Dakika' }, { v: parts.s, l: 'Saniye' }].map(({ v, l }) => (
        <div key={l} className="text-center">
          <div className="bg-ink text-white text-3xl font-mono font-bold w-16 h-16 flex items-center justify-center rounded-xl">
            {String(v).padStart(2, '0')}
          </div>
          <p className="text-xs text-gray-400 mt-1">{l}</p>
        </div>
      ))}
    </div>
  )
}

export default function AuctionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken, user } = useAuthStore()
  const [auction, setAuction] = useState<AuctionDetail | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState('')
  const [bidding, setBidding] = useState(false)
  const [bidError, setBidError] = useState<string | null>(null)
  const [bidSuccess, setBidSuccess] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)
  const pollRef = useRef<ReturnType<typeof setInterval>>()

  const fetchAuction = useCallback(async () => {
    const [ar, br] = await Promise.all([
      fetch(`${BASE}/auctions/${id}`).then((r) => r.json()),
      fetch(`${BASE}/auctions/${id}/bids`).then((r) => r.json()),
    ])
    setAuction((ar as { data: AuctionDetail }).data)
    setBids((br as { data: Bid[] }).data ?? [])
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchAuction()
    // Poll every 5s for live updates (fallback to WebSocket if needed)
    pollRef.current = setInterval(fetchAuction, 5_000)
    return () => clearInterval(pollRef.current)
  }, [fetchAuction])

  async function handleBid() {
    if (!accessToken) { setBidError('Teklif vermek için giriş yapmalısınız.'); return }
    const amount = Number(bidAmount)
    if (!amount || amount <= 0) { setBidError('Geçerli bir tutar girin.'); return }
    setBidding(true); setBidError(null); setBidSuccess(false)
    try {
      const res = await fetch(`${BASE}/auctions/${id}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ amount }),
      })
      const json = await res.json() as { error?: string }
      if (!res.ok) { setBidError(json.error ?? 'Teklif başarısız.'); return }
      setBidSuccess(true); setBidAmount('')
      await fetchAuction()
    } catch {
      setBidError('Bir hata oluştu.')
    } finally {
      setBidding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (!auction) return <div className="min-h-screen bg-cream flex items-center justify-center text-gray-400">Artırma bulunamadı.</div>

  const photos = auction.photos?.filter(Boolean) ?? (auction.cover_url ? [auction.cover_url] : [])
  const currentPrice = Number(auction.current_price)
  const minIncrement = Number(auction.min_increment)
  const minBid = currentPrice + minIncrement
  const buyNow = auction.buy_now_price ? Number(auction.buy_now_price) : null
  const isActive = auction.status === 'active'

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo */}
            {photos.length > 0 && (
              <div>
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
                  <Image src={photos[photoIdx] ?? ''} alt={auction.title} fill className="object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      isActive ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isActive ? '🔴 CANLI' : auction.status === 'scheduled' ? '⏰ Yakında' : '✅ Bitti'}
                    </span>
                  </div>
                </div>
                {photos.length > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {photos.map((url, i) => (
                      <button key={i} onClick={() => setPhotoIdx(i)}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === photoIdx ? 'border-teal' : 'border-transparent'}`}>
                        <Image src={url} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{auction.title}</h1>
              <p className="text-gray-400 text-sm mt-1">{auction.city}{auction.district ? `, ${auction.district}` : ''}</p>
              {auction.description && (
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{auction.description}</p>
              )}
            </div>

            {/* Bid history */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Teklif Geçmişi ({auction.bid_count})</h2>
              {bids.length === 0 ? (
                <p className="text-sm text-gray-400">Henüz teklif verilmedi. İlk teklifi siz verin!</p>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {bids.map((b, i) => (
                    <div key={b.id} className={`flex items-center justify-between py-2 ${i < bids.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{b.bidder_name}</p>
                        <p className="text-xs text-gray-400">{new Date(b.created_at).toLocaleString('tr-TR')}</p>
                      </div>
                      <p className={`text-sm font-bold ${i === 0 ? 'text-emerald-600 text-base' : 'text-gray-600'}`}>
                        {Number(b.amount).toLocaleString('tr-TR')} ₺
                        {i === 0 && <span className="ml-1 text-xs font-normal text-emerald-500">En yüksek</span>}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — Bid panel */}
          <div className="space-y-4">
            {/* Countdown */}
            {isActive && (
              <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm text-center">
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Kalan Süre</p>
                <Countdown endsAt={auction.ends_at} />
              </div>
            )}

            {/* Price card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-6">
              <p className="text-xs text-gray-400 mb-1">Güncel En Yüksek Teklif</p>
              <p className="text-3xl font-extrabold text-ink mb-1">{currentPrice.toLocaleString('tr-TR')} ₺</p>
              <p className="text-xs text-gray-400">{auction.bid_count} teklif</p>

              {buyNow && (
                <div className="mt-3 p-3 bg-gold/10 rounded-xl border border-gold/30">
                  <p className="text-xs text-yellow-700 font-medium">Hemen Al Fiyatı</p>
                  <p className="text-lg font-bold text-yellow-800">{buyNow.toLocaleString('tr-TR')} ₺</p>
                </div>
              )}

              {isActive ? (
                <div className="mt-6 space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 font-medium block mb-1">
                      Teklifiniz (min {minBid.toLocaleString('tr-TR')} ₺)
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => { setBidAmount(e.target.value); setBidError(null); setBidSuccess(false) }}
                      placeholder={`${minBid.toLocaleString('tr-TR')}`}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal/30"
                      min={minBid}
                      step={minIncrement}
                    />
                  </div>

                  {/* Quick bid buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {[minBid, minBid + minIncrement, minBid + minIncrement * 2].map((v) => (
                      <button key={v} onClick={() => setBidAmount(String(v))}
                        className="text-xs px-3 py-1.5 border border-teal text-teal rounded-lg hover:bg-teal hover:text-white transition-colors font-medium">
                        {v.toLocaleString('tr-TR')} ₺
                      </button>
                    ))}
                  </div>

                  {bidError && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{bidError}</p>}
                  {bidSuccess && <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">✓ Teklifiniz alındı!</p>}

                  <button
                    onClick={handleBid}
                    disabled={bidding}
                    className="w-full bg-teal hover:bg-teal/90 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors"
                  >
                    {bidding ? 'Gönderiliyor…' : 'Teklif Ver'}
                  </button>

                  {buyNow && (
                    <button
                      onClick={() => { setBidAmount(String(buyNow)); handleBid() }}
                      className="w-full bg-gold hover:bg-yellow-400 text-ink font-bold py-3 rounded-xl transition-colors text-sm"
                    >
                      Hemen Satın Al — {buyNow.toLocaleString('tr-TR')} ₺
                    </button>
                  )}

                  {!user && (
                    <p className="text-xs text-center text-gray-400">
                      Teklif vermek için <a href="/giris" className="text-teal underline">giriş yapın</a>
                    </p>
                  )}
                </div>
              ) : auction.status === 'ended' ? (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">Artırma tamamlandı</p>
                  {auction.winner_name && (
                    <p className="text-sm font-semibold text-emerald-600 mt-1">🏆 Kazanan: {auction.winner_name}</p>
                  )}
                </div>
              ) : (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">
                    Başlangıç: {new Date(auction.starts_at).toLocaleString('tr-TR')}
                  </p>
                </div>
              )}

              {/* Auction details */}
              <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Başlangıç fiyatı</span>
                  <span className="font-medium text-gray-600">{Number(auction.start_price).toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between">
                  <span>Min. artış</span>
                  <span className="font-medium text-gray-600">{minIncrement.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between">
                  <span>Bitiş</span>
                  <span className="font-medium text-gray-600">{new Date(auction.ends_at).toLocaleString('tr-TR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
