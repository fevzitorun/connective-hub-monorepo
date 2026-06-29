'use client'

import { useState } from 'react'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Gaziantep', 'Konya', 'Adana', 'Mersin', 'Kayseri']

const WHY_ITEMS = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'FILTERRA.AI Değerleme',
    desc: 'Piyasa verisiyle saniyeler içinde gerçek değer tahmini. Fazla ödeme yok.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Avukat Onaylı Sertifika',
    desc: 'Tapu, ipotek, imar. Her ilanda hukuki güvence belgesi.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: 'Mortgage Karşılaştırması',
    desc: '20+ bankadan anlık teklifler. Katılım ve konvansiyonel seçenekler.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'MLS Ağı',
    desc: '5.000+ onaylı acenta. Portföy paylaşımı ve işbirliği sistemi.',
  },
]

type LeadType = 'buyer' | 'seller' | 'agency'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [leadType, setLeadType] = useState<LeadType>('buyer')
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', city: '', kvkkConsent: false })
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.email) return
    setState('loading')
    try {
      await fetch(`${API}/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, leadType, utmSource: 'landing_v1' }),
      })
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ─── Nav ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="text-[22px] font-bold tracking-tight text-[#0d1f3c]">
            7<span className="text-[#c9a84c]">fil</span>
          </span>
          <div className="hidden sm:flex items-center gap-6 text-sm text-stone-500">
            <Link href="/fiyatlar" className="hover:text-[#0d1f3c] transition-colors">Fiyatlar</Link>
            <Link href="/panel/mls" className="hover:text-[#0d1f3c] transition-colors">MLS</Link>
            <Link href="/ara" className="hover:text-[#0d1f3c] transition-colors">İlanlar</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/(auth)/giris" className="text-sm text-stone-600 hover:text-[#0d1f3c] transition-colors">
              Giriş Yap
            </Link>
            <Link
              href="/(auth)/kayit"
              className="text-sm bg-[#0d1f3c] text-white px-4 py-2 rounded-lg hover:bg-[#1a3358] transition-colors"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────────────── */}
      <section className="pt-16 bg-[#0d1f3c] min-h-[580px] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #c9a84c 0%, transparent 60%), radial-gradient(circle at 80% 20%, #2a9d8f 0%, transparent 50%)' }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 w-full text-center">
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            Türkiye&apos;nin Rightmove&apos;u — Çok Yakında
          </div>

          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
            Doğru ev,{' '}
            <span className="text-[#c9a84c]" style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
              doğru fiyat,
            </span>
            <br />tam güvence.
          </h1>

          <p className="mt-6 text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            AI değerleme · Avukat onaylı sertifika · Mortgage karşılaştırması · MLS ağı —
            hepsi tek çatı altında.
          </p>

          {/* Search bar — Coming Soon mode */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden border border-stone-100">
              <div className="flex items-center pl-4 text-stone-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Şehir, ilçe veya mahalle arayın…"
                className="flex-1 px-4 py-4 text-[#0d1f3c] placeholder:text-stone-400 outline-none text-sm"
              />
              <button className="bg-[#c9a84c] text-[#0d1f3c] font-semibold px-7 py-4 text-sm hover:bg-[#b8942e] transition-colors shrink-0">
                Ara
              </button>
            </div>

            {/* City chips */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {CITIES.slice(0, 6).map((c) => (
                <button
                  key={c}
                  onClick={() => setQuery(c)}
                  className="text-xs text-white/50 hover:text-white/80 border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-full transition-all"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm">
            {[
              { n: '120.000+', l: 'İlan' },
              { n: '81 İl', l: 'Türkiye Geneli' },
              { n: '5.400+', l: 'Onaylı Acenta' },
              { n: 'AI', l: 'Destekli Değerleme' },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-white font-bold text-xl">{s.n}</div>
                <div className="text-white/40 text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Lead Capture ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-2">Erken Erişim</p>
            <h2 className="text-[#0d1f3c] text-3xl font-bold">Platform açılmadan listenize girin.</h2>
            <p className="mt-2 text-stone-500 text-sm">
              Lansman günü öncelikli erişim, özel fiyat ve kurulum desteği.
            </p>
          </div>

          {/* Type tabs */}
          <div className="flex bg-white rounded-xl border border-stone-200 p-1 mb-6 max-w-sm mx-auto">
            {([['buyer', 'Alıcı / Kiracı'], ['seller', 'Satıcı / Kiraya Veren'], ['agency', 'Emlak Ofisi']] as const).map(([type, label]) => (
              <button
                key={type}
                onClick={() => setLeadType(type)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  leadType === type
                    ? 'bg-[#0d1f3c] text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {state === 'done' ? (
            <div className="bg-white border border-green-100 rounded-2xl p-10 text-center shadow-sm">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-[#0d1f3c] font-bold text-xl mb-2">Listeye alındınız!</h3>
              <p className="text-stone-500 text-sm">Lansman günü size özel erken erişim linki göndereceğiz.</p>
            </div>
          ) : (
            <form onSubmit={submitLead} className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">Ad Soyad *</label>
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Ahmet Yılmaz"
                    className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm text-[#0d1f3c] placeholder:text-stone-300 focus:outline-none focus:border-[#0d1f3c] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">E-posta *</label>
                  <input
                    required type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ahmet@sirket.com"
                    className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm text-[#0d1f3c] placeholder:text-stone-300 focus:outline-none focus:border-[#0d1f3c] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">Telefon</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="05xx xxx xx xx"
                    className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm text-[#0d1f3c] placeholder:text-stone-300 focus:outline-none focus:border-[#0d1f3c] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">Şehir</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm text-[#0d1f3c] focus:outline-none focus:border-[#0d1f3c] transition-colors bg-white"
                  >
                    <option value="">Seçiniz…</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={form.kvkkConsent}
                  onChange={(e) => setForm({ ...form, kvkkConsent: e.target.checked })}
                  className="mt-0.5 w-4 h-4 accent-[#0d1f3c] shrink-0"
                />
                <span className="text-xs text-stone-400 leading-relaxed">
                  KVKK kapsamında iletişim bilgilerimin 7fil tarafından işlenmesine onay veriyorum.
                </span>
              </label>

              <button
                type="submit"
                disabled={state === 'loading'}
                className="w-full bg-[#0d1f3c] hover:bg-[#1a3358] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
              >
                {state === 'loading' ? 'Kaydediliyor…' : 'Erken Erişim Listesine Katıl'}
              </button>

              {state === 'error' && (
                <p className="text-red-500 text-xs text-center">Bir hata oluştu. Lütfen tekrar deneyin.</p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* ─── Agency CTA ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-[#0d1f3c] rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-10 lg:p-14">
                <span className="inline-block bg-[#c9a84c]/20 text-[#c9a84c] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                  Emlak Ofisleri için
                </span>
                <h2 className="text-white text-3xl sm:text-4xl font-bold leading-tight mb-4">
                  Sahibinden&apos;den daha fazlası.<br />
                  <span className="text-[#c9a84c]" style={{ fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>7fil Ortağı olun.</span>
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-md">
                  Kendi subdomain&apos;iniz, sınırsız ilan, AI destekli ilan yazarı, MLS ağı ve
                  WhatsApp entegrasyonu. Aylık sabit ücret, komisyon yok.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: '🤖', t: 'AI İlan Yazarı', s: 'Saniyede profesyonel ilan metni' },
                    { icon: '🏛️', t: 'MLS Ağı', s: '5.400+ acenta ile portföy paylaşımı' },
                    { icon: '🌐', t: 'Subdomain', s: 'remax-hedef.7fil.com.tr' },
                    { icon: '📊', t: 'Gelişmiş Analitik', s: 'CRM, lead takibi, dönüşüm' },
                  ].map((f) => (
                    <div key={f.t} className="bg-white/5 rounded-xl p-4">
                      <div className="text-xl mb-1.5">{f.icon}</div>
                      <div className="text-white text-xs font-semibold mb-0.5">{f.t}</div>
                      <div className="text-white/40 text-xs">{f.s}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => { setLeadType('agency'); document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' }) }}
                    className="bg-[#c9a84c] hover:bg-[#b8942e] text-[#0d1f3c] font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                  >
                    Ön Başvuru Yap
                  </button>
                  <Link href="/fiyatlar" className="border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-semibold px-6 py-3 rounded-xl text-sm transition-all">
                    Planları İncele
                  </Link>
                </div>
              </div>

              {/* Right side stats */}
              <div className="bg-white/5 p-10 lg:p-14 flex flex-col justify-center gap-6 border-l border-white/10">
                {[
                  { n: '%40', l: 'Daha Hızlı İlan Yayını', sub: 'AI ilan yazarı ile' },
                  { n: '3x', l: 'Daha Fazla Lead', sub: 'Entegre CRM ve takip sistemi' },
                  { n: '0₺', l: 'Komisyon', sub: 'Aylık sabit ücret, sürpriz yok' },
                ].map((s) => (
                  <div key={s.l} className="flex items-center gap-5">
                    <div className="text-[#c9a84c] text-4xl font-bold w-20 shrink-0">{s.n}</div>
                    <div>
                      <div className="text-white font-semibold text-sm">{s.l}</div>
                      <div className="text-white/40 text-xs mt-0.5">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why 7fil ─────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-stone-50" id="lead-form">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-2">Neden 7fil?</p>
            <h2 className="text-[#0d1f3c] text-3xl font-bold">Gayrimenkulde yeni standart.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-stone-100 hover:border-[#c9a84c]/30 hover:shadow-sm transition-all">
                <div className="w-12 h-12 bg-[#0d1f3c]/5 text-[#0d1f3c] rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#0d1f3c] text-sm mb-2">{item.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0d1f3c] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-2xl font-bold text-white">
                7<span className="text-[#c9a84c]">fil</span>
              </span>
              <p className="text-white/30 text-xs mt-1">Türkiye&apos;nin Entegre Gayrimenkul Ekosistemi</p>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/30">
              <Link href="/gizlilik" className="hover:text-white/60 transition-colors">Gizlilik</Link>
              <Link href="/kvkk" className="hover:text-white/60 transition-colors">KVKK</Link>
              <Link href="/kullanim-kosullari" className="hover:text-white/60 transition-colors">Kullanım Koşulları</Link>
              <span>© 2026 Connective Hub</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
