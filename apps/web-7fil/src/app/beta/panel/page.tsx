'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../../store/auth'
import { panelApi } from '../../../lib/panel-api'

export default function BetaPanelPage() {
  const router = useRouter()
  const { user, accessToken, clearAuth } = useAuthStore()
  const [draftCount, setDraftCount] = useState<number | null>(null)

  useEffect(() => {
    if (!accessToken) {
      router.replace('/beta/giris')
      return
    }
    panelApi
      .getStats(accessToken)
      .then((res) => setDraftCount(res.data.draftListings))
      .catch(() => {})
  }, [accessToken, router])

  if (!accessToken || !user) return null

  const firstName = (user.fullName ?? user.email ?? '').split(' ')[0] ?? 'Partner'

  return (
    <div className="min-h-screen bg-[#09111e] relative overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Header */}
      <header className="relative border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold text-white tracking-tight">
          7<span className="text-[#c9a84c]">fil</span>
          <span className="ml-2 text-xs font-semibold text-white/20 bg-white/5 border border-white/10 px-2 py-1 rounded-full">
            Beta
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-white/30 text-xs hidden sm:block">{user.email}</span>
          <button
            onClick={() => { clearAuth(); router.replace('/beta/giris') }}
            className="text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Çıkış
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 py-14">

        {/* Welcome */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            Kurucu Üye
          </div>
          <h1 className="text-white text-3xl sm:text-4xl font-extrabold leading-tight">
            Hoş Geldiniz, <em className="not-italic text-[#c9a84c]" style={{ fontFamily: 'Georgia, serif' }}>{firstName}!</em>
          </h1>
          <p className="text-white/35 text-sm mt-3 max-w-md leading-relaxed">
            7fil Eylül 2026&apos;da açılıyor. Lansmana hazır olmak için portföyünüzü şimdiden girin.
            Yayına alma gününde tek tıkla aktifleşecek.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: '📋',
              label: 'Taslak İlan',
              value: draftCount === null ? '—' : String(draftCount),
              sub: 'Lansmanda yayına alınacak',
              highlight: true,
            },
            {
              icon: '📅',
              label: 'Lansman Tarihi',
              value: 'Eylül 2026',
              sub: 'Erken erişim önceliğiniz var',
              highlight: false,
            },
            {
              icon: '🏅',
              label: 'Üyelik',
              value: 'Kurucu',
              sub: 'Özel lansman fiyatı garantili',
              highlight: false,
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl p-6 border ${
                s.highlight
                  ? 'bg-[#c9a84c]/5 border-[#c9a84c]/20'
                  : 'bg-white/[0.03] border-white/5'
              }`}
            >
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className={`text-2xl font-black mb-1 ${s.highlight ? 'text-[#c9a84c]' : 'text-white'}`}>
                {s.value}
              </div>
              <div className="text-white/50 text-xs font-semibold">{s.label}</div>
              <div className="text-white/25 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Action card */}
        <div className="bg-[#0d1f3c] border border-white/5 rounded-2xl p-8">
          <h2 className="text-white font-bold text-xl mb-2">Portföyünüzü Hazırlayın</h2>
          <p className="text-white/40 text-sm mb-6 max-w-md leading-relaxed">
            Satmak veya kiralamak istediğiniz ilanları şimdiden girin. Eylül lansmanında
            binlerce alıcıya anında ulaşacaksınız.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/panel/ilanlar/yeni"
              className="bg-[#c9a84c] hover:bg-[#b8942e] text-[#0d1f3c] font-bold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              + Yeni İlan Ekle
            </Link>
            <Link
              href="/panel/ilanlar"
              className="border border-white/15 text-white/60 hover:text-white hover:border-white/30 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
            >
              İlanlarım
            </Link>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-10 space-y-3">
          <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-5">Yol Haritası</h3>
          {[
            { date: 'Hemen', title: 'Portföyünüzü girin', done: true },
            { date: 'Ağustos 2026', title: 'AI değerleme + MLS test erişimi', done: false },
            { date: 'Eylül 2026', title: 'Grand Opening — Türkiye geneli yayın', done: false },
          ].map((s) => (
            <div key={s.title} className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full shrink-0 ${s.done ? 'bg-[#c9a84c]' : 'bg-white/15'}`} />
              <span className="text-white/25 text-xs w-28 shrink-0">{s.date}</span>
              <span className={`text-sm ${s.done ? 'text-white font-semibold' : 'text-white/40'}`}>{s.title}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
