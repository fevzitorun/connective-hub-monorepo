'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

const CITIES = [
  { name: 'İstanbul', count: '48.200', price: '₺18.4M' },
  { name: 'Ankara', count: '21.500', price: '₺8.2M' },
  { name: 'İzmir', count: '14.300', price: '₺12.1M' },
  { name: 'Bursa', count: '8.900', price: '₺6.8M' },
  { name: 'Antalya', count: '11.200', price: '₺9.5M' },
  { name: 'Gaziantep', count: '5.400', price: '₺4.2M' },
]

const FEATURES = [
  { icon: '🧠', title: 'FILTERRA.AI Değerleme', desc: 'Makine öğrenimi ile saniyeler içinde gerçek piyasa değeri. 850.000+ satış verisi.', tag: 'AI Destekli' },
  { icon: '⚖️', title: 'Avukat Onaylı Sertifika', desc: 'Tapu, ipotek, imar ve hukuki durum analizi. Sürpriz olmadan karar verin.', tag: 'Hukuk Güvencesi' },
  { icon: '🏦', title: 'Mortgage Karşılaştırması', desc: '20+ bankadan anlık teklifler. Katılım ve konvansiyonel seçenekler yan yana.', tag: 'Finans' },
  { icon: '🤝', title: 'MLS Ağı', desc: '5.400+ onaylı acentadan oluşan paylaşım ağı. Türkiye\'nin ilk gerçek MLS platformu.', tag: 'Ağ' },
  { icon: '🗺️', title: 'Mahalle Analizi', desc: 'ATLAS AI ile okul, ulaşım, güvenlik ve yaşam kalitesi skoru. Harita üzerinde.', tag: 'Lokasyon' },
  { icon: '✍️', title: 'AI İlan Yazarı', desc: 'SCRIBE AI ile 4 dilde (TR/EN/AR/RU) profesyonel ilan metni. Saniyeler içinde.', tag: 'İçerik' },
]

const LAUNCH = new Date('2026-09-01T00:00:00').getTime()

const FILTERRA_CITIES: Record<string, number> = {
  'İstanbul': 125000,
  'Ankara': 58000,
  'İzmir': 78000,
  'Bursa': 50000,
  'Antalya': 68000,
  'Gaziantep': 32000,
  'Adana': 34000,
  'Konya': 36000,
  'Trabzon': 42000,
}

const ROOM_MULTS: Record<string, number> = {
  'Stüdyo': 0.88, '1+1': 0.95, '2+1': 1.00, '3+1': 1.08, '4+1': 1.15, '5+': 1.25,
}

const AGE_MULTS: Record<string, number> = {
  '0-2': 1.15, '3-5': 1.08, '6-10': 1.00, '11-15': 0.94, '16-20': 0.88, '20+': 0.80,
}

const FILTERRA_STEPS = [
  '📍 Konum ve çevre verileri analiz ediliyor...',
  '📊 850.000+ satış kaydı taranıyor...',
  '🤖 FILTERRA.AI modeli hesaplıyor...',
  '✅ Değerleme tamamlandı!',
]

function calcTimeLeft() {
  const diff = Math.max(0, LAUNCH - Date.now())
  return {
    days: Math.floor(diff / 864e5),
    hours: Math.floor((diff / 36e5) % 24),
    mins: Math.floor((diff / 6e4) % 60),
    secs: Math.floor((diff / 1e3) % 60),
  }
}

function CountdownTimer() {
  const [t, setT] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  useEffect(() => {
    setT(calcTimeLeft())
    const id = setInterval(() => setT(calcTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { v: t.days, l: 'Gün' },
    { v: t.hours, l: 'Saat' },
    { v: t.mins, l: 'Dak' },
    { v: t.secs, l: 'San' },
  ]

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-3">
      {units.map((u, i) => (
        <div key={u.l} className="flex items-end gap-2 sm:gap-3">
          <div className="text-center">
            <div className="bg-white/5 border border-white/10 rounded-xl px-3 sm:px-5 py-2.5 sm:py-3 min-w-[54px] sm:min-w-[68px]">
              <span className="text-white font-black text-3xl sm:text-4xl tabular-nums leading-none">
                {String(u.v).padStart(2, '0')}
              </span>
            </div>
            <p className="text-white/30 text-[10px] mt-2 font-semibold uppercase tracking-widest">{u.l}</p>
          </div>
          {i < 3 && <span className="text-[#c9a84c]/40 text-3xl font-black pb-7">:</span>}
        </div>
      ))}
    </div>
  )
}

function LeadCounter() {
  const [count, setCount] = useState<number | null>(null)
  useEffect(() => {
    fetch(`${API}/public/leads/count`)
      .then((r) => r.json())
      .then((d: { count: number }) => setCount(d.count))
      .catch(() => {})
  }, [])

  return (
    <>
      <div className="text-white font-extrabold text-2xl">
        {count === null ? '—' : `${count.toLocaleString('tr-TR')}+`}
      </div>
      <div className="text-white/25 text-xs mt-1">Ön Kayıt</div>
    </>
  )
}

type LeadType = 'buyer' | 'seller' | 'agency'

function SearchLeadModal({ query, onClose }: { query: string; onClose: () => void }) {
  const [leadType, setLeadType] = useState<LeadType>('buyer')
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', city: query, kvkkConsent: false })
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    try {
      await fetch(`${API}/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, leadType, utmSource: 'search_hero' }),
      })
      setState('done')
    } catch {
      setState('error')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={state === 'done' ? onClose : undefined}
      />
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">

        <div className="bg-[#0d1f3c] px-8 pt-8 pb-7 relative">
          {state !== 'done' && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
            <span className="text-[#c9a84c] text-xs font-bold uppercase tracking-[0.15em]">Çok Yakında Açılıyor</span>
          </div>
          {state === 'done' ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-400/15 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Listedesiniz!</h3>
              <p className="text-white/40 text-sm mb-6">Lansman günü size özel erken erişim linki göndereceğiz.</p>
              <button
                onClick={onClose}
                className="bg-[#c9a84c] hover:bg-[#b8942e] text-[#0d1f3c] font-bold px-7 py-3 rounded-xl text-sm transition-colors"
              >
                Harika, teşekkürler!
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-white text-[1.6rem] font-bold leading-snug">
                Platform açılmadan<br />
                <em className="not-italic text-[#c9a84c]" style={{ fontFamily: 'Georgia, serif' }}>
                  ilk siz haberdar olun.
                </em>
              </h2>
              <p className="text-white/35 text-xs mt-2.5 leading-relaxed">
                Erken erişim listesine katılın — lansman günü öncelikli destek garantili.
              </p>
            </>
          )}
        </div>

        {state !== 'done' && (
          <form onSubmit={submit} className="px-8 py-7 space-y-4">
            <div className="flex bg-stone-50 rounded-xl p-1">
              {([['buyer', 'Alıcı/Kiracı'], ['seller', 'Satıcı'], ['agency', 'Acenta']] as const).map(([type, label]) => (
                <button
                  key={type} type="button"
                  onClick={() => setLeadType(type)}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    leadType === type
                      ? 'bg-[#0d1f3c] text-white shadow-sm'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <input
              required value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Ad Soyad *"
              className="w-full border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-[#0d1f3c] placeholder:text-stone-300 focus:outline-none focus:border-[#0d1f3c] transition-colors"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="E-posta *"
                className="border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-[#0d1f3c] placeholder:text-stone-300 focus:outline-none focus:border-[#0d1f3c] transition-colors"
              />
              <input
                type="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Telefon"
                className="border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-[#0d1f3c] placeholder:text-stone-300 focus:outline-none focus:border-[#0d1f3c] transition-colors"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox" required
                checked={form.kvkkConsent}
                onChange={(e) => setForm({ ...form, kvkkConsent: e.target.checked })}
                className="mt-0.5 w-4 h-4 accent-[#0d1f3c] shrink-0"
              />
              <span className="text-xs text-stone-400 leading-relaxed">
                KVKK kapsamında iletişim bilgilerimin 7fil tarafından işlenmesine onay veriyorum.
              </span>
            </label>

            <button
              type="submit" disabled={state === 'loading'}
              className="w-full bg-[#c9a84c] hover:bg-[#b8942e] disabled:opacity-60 text-[#0d1f3c] font-bold py-4 rounded-xl transition-colors text-sm"
            >
              {state === 'loading' ? 'Kaydediliyor…' : 'Erken Erişim Listesine Katıl →'}
            </button>

            {state === 'error' && (
              <p className="text-red-500 text-xs text-center">Bir hata oluştu. Lütfen tekrar deneyin.</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

type FState = 'idle' | 'loading' | 'result'
type FForm = { city: string; sqm: string; rooms: string; age: string }
type FResult = { min: number; mid: number; max: number }

function FilterraDemo() {
  const [form, setForm] = useState<FForm>({ city: 'İstanbul', sqm: '', rooms: '2+1', age: '6-10' })
  const [fstate, setFstate] = useState<FState>('idle')
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<FResult | null>(null)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const calc = (): FResult => {
    const base = FILTERRA_CITIES[form.city] ?? 50000
    const sqm = Math.max(20, Math.min(500, Number(form.sqm) || 100))
    const mid = Math.round(base * sqm * (ROOM_MULTS[form.rooms] ?? 1) * (AGE_MULTS[form.age] ?? 1))
    return { min: Math.round(mid * 0.88), mid, max: Math.round(mid * 1.12) }
  }

  const run = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.sqm) return
    setFstate('loading')
    setStep(0)
    let s = 0
    const id = setInterval(() => {
      s++
      setStep(s)
      if (s >= FILTERRA_STEPS.length - 1) {
        clearInterval(id)
        setTimeout(() => { setResult(calc()); setFstate('result') }, 500)
      }
    }, 500)
  }

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch(`${API}/public/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          leadType: 'seller',
          city: form.city,
          notes: `FILTERRA: ${form.sqm}m² ${form.rooms} — ${result?.mid.toLocaleString('tr-TR')} ₺`,
          kvkkConsent: true,
          utmSource: 'filterra_demo',
        }),
      })
    } catch { /* silent */ }
    setEmailSent(true)
  }

  const fmt = (n: number) => n.toLocaleString('tr-TR') + ' ₺'
  const sqmNum = Number(form.sqm) || 100

  return (
    <section className="py-24 bg-[#09111e] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(201,168,76,0.05) 0%, transparent 60%)' }}
      />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-bold px-5 py-2 rounded-full uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            FILTERRA.AI — Canlı Demo
          </div>
          <h2 className="text-white text-4xl font-extrabold leading-tight">
            Evinizin değerini<br />
            <em className="not-italic text-[#c9a84c]" style={{ fontFamily: 'Georgia, serif' }}>saniyeler içinde</em> öğrenin.
          </h2>
          <p className="mt-4 text-white/30 text-sm max-w-sm mx-auto leading-relaxed">
            850.000+ gerçek satış kaydı üzerinde eğitilmiş AI modelimizi deneyin. Ücretsiz.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Form */}
          <div className="bg-white/[0.04] backdrop-blur border border-white/10 rounded-3xl overflow-hidden">
            <div className="px-8 py-6 border-b border-white/5">
              <h3 className="text-white font-bold text-lg">Mülk Bilgileri</h3>
              <p className="text-white/30 text-xs mt-1">Birkaç soruyu yanıtlayın, AI modelimiz çalışsın.</p>
            </div>
            <form onSubmit={run} className="px-8 py-6 space-y-5">

              <div>
                <label className="block text-white/40 text-xs font-semibold uppercase tracking-wide mb-2">Şehir</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a84c]/40 transition-colors"
                >
                  {Object.keys(FILTERRA_CITIES).map((c) => (
                    <option key={c} value={c} style={{ background: '#0d1f3c' }}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/40 text-xs font-semibold uppercase tracking-wide mb-2">Brüt Alan (m²)</label>
                <input
                  type="number" required min={20} max={500}
                  value={form.sqm}
                  onChange={(e) => setForm({ ...form, sqm: e.target.value })}
                  placeholder="120"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#c9a84c]/40 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/40 text-xs font-semibold uppercase tracking-wide mb-2">Oda Sayısı</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(ROOM_MULTS).map((r) => (
                    <button
                      key={r} type="button"
                      onClick={() => setForm({ ...form, rooms: r })}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                        form.rooms === r
                          ? 'bg-[#c9a84c] text-[#0d1f3c] border-[#c9a84c]'
                          : 'bg-white/5 text-white/40 border-white/10 hover:text-white/70 hover:border-white/25'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/40 text-xs font-semibold uppercase tracking-wide mb-2">Bina Yaşı</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(AGE_MULTS).map((a) => (
                    <button
                      key={a} type="button"
                      onClick={() => setForm({ ...form, age: a })}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                        form.age === a
                          ? 'bg-[#c9a84c] text-[#0d1f3c] border-[#c9a84c]'
                          : 'bg-white/5 text-white/40 border-white/10 hover:text-white/70 hover:border-white/25'
                      }`}
                    >
                      {a} yıl
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit" disabled={fstate === 'loading'}
                className="w-full bg-[#c9a84c] hover:bg-[#b8942e] disabled:opacity-60 text-[#09111e] font-black py-4 rounded-2xl text-sm transition-colors"
              >
                {fstate === 'loading' ? 'Hesaplanıyor...' : '🧠 FILTERRA ile Değerle →'}
              </button>
            </form>
          </div>

          {/* Result Panel */}
          <div className="min-h-[460px] flex flex-col justify-center">

            {fstate === 'idle' && (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-5">
                  <span className="text-3xl">🧠</span>
                </div>
                <p className="text-white/20 text-sm leading-relaxed">
                  Mülk bilgilerini girin,<br />AI değerlemeniz burada görünecek.
                </p>
              </div>
            )}

            {fstate === 'loading' && (
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-8">Analiz Ediliyor</p>
                <div className="space-y-5">
                  {FILTERRA_STEPS.map((s, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 transition-all duration-500 ${i <= step ? 'opacity-100' : 'opacity-20'}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                          i < step
                            ? 'bg-[#c9a84c] text-[#09111e]'
                            : i === step
                            ? 'bg-[#c9a84c]/20 border border-[#c9a84c]/50 animate-pulse'
                            : 'bg-white/5'
                        }`}
                      >
                        {i < step ? '✓' : ''}
                      </div>
                      <span className={`text-sm ${i <= step ? 'text-white' : 'text-white/25'}`}>{s}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#c9a84c] to-[#f0c96e] rounded-full transition-all duration-500"
                    style={{ width: `${((step + 1) / FILTERRA_STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {fstate === 'result' && result && (
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-br from-[#c9a84c]/10 to-transparent px-8 py-6 border-b border-white/5">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest">FILTERRA.AI Sonucu</p>
                    <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2.5 py-1 rounded-full">%94 Güven</span>
                  </div>
                  <div className="text-white text-4xl font-black tracking-tight">
                    {fmt(result.mid)}
                  </div>
                  <p className="text-white/30 text-xs mt-2">
                    {fmt(result.min)} – {fmt(result.max)} tahmin aralığı
                  </p>
                </div>

                <div className="px-8 py-1 divide-y divide-white/5">
                  <div className="flex items-center justify-between py-3.5">
                    <span className="text-white/40 text-xs">m² birim değer</span>
                    <span className="text-white text-sm font-bold">{fmt(Math.round(result.mid / sqmNum))} /m²</span>
                  </div>
                  <div className="flex items-center justify-between py-3.5">
                    <span className="text-white/40 text-xs">Son 6 ay değer artışı</span>
                    <span className="text-green-400 text-sm font-bold">▲ +12.4%</span>
                  </div>
                  <div className="flex items-center justify-between py-3.5">
                    <span className="text-white/40 text-xs">{form.city} endeks skoru</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${i <= 4 ? 'bg-[#c9a84c]' : 'bg-white/10'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-8 py-5 bg-[#c9a84c]/[0.04] border-t border-[#c9a84c]/10">
                  {!emailSent ? (
                    <>
                      <p className="text-white/50 text-xs font-semibold mb-3">
                        📄 Mahalle analizi + benzer satışlar PDF raporunu ücretsiz alın:
                      </p>
                      <form onSubmit={sendEmail} className="flex gap-2">
                        <input
                          type="email" required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="E-posta adresiniz"
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#c9a84c]/40 min-w-0"
                        />
                        <button
                          type="submit"
                          className="bg-[#c9a84c] hover:bg-[#b8942e] text-[#09111e] font-bold px-5 py-2.5 rounded-xl text-sm shrink-0 transition-colors"
                        >
                          Gönder
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-1">
                      <p className="text-green-400 text-sm font-bold">✓ Rapor gönderildi!</p>
                      <p className="text-white/25 text-xs mt-1">Spam klasörünüzü de kontrol edin.</p>
                    </div>
                  )}
                </div>

                <div className="px-8 py-4 flex justify-center">
                  <button
                    onClick={() => { setFstate('idle'); setResult(null); setEmailSent(false); setStep(0) }}
                    className="text-white/20 hover:text-white/40 text-xs transition-colors"
                  >
                    ← Yeni değerleme yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-white/10 text-xs mt-10">
          * FILTERRA.AI tahmini bilgi amaçlıdır. Resmi değerleme için lisanslı değerleme uzmanına başvurun.
        </p>
      </div>
    </section>
  )
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)

  const openModal = (city?: string) => {
    if (city) setQuery(city)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {showModal && <SearchLeadModal query={query} onClose={() => setShowModal(false)} />}

      {/* ─── Nav ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="text-[22px] font-extrabold tracking-tight text-[#0d1f3c]">
            7<span className="text-[#c9a84c]">fil</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm text-stone-400">
            <Link href="/fiyatlar" className="hover:text-[#0d1f3c] transition-colors">Fiyatlar</Link>
            <button onClick={() => openModal()} className="hover:text-[#0d1f3c] transition-colors">MLS Ağı</button>
            <button onClick={() => openModal()} className="hover:text-[#0d1f3c] transition-colors">İlanlar</button>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/(auth)/giris" className="text-sm text-stone-500 hover:text-[#0d1f3c] transition-colors font-medium">
              Giriş
            </Link>
            <button
              onClick={() => openModal()}
              className="text-sm bg-[#0d1f3c] text-white px-5 py-2 rounded-lg hover:bg-[#1a3358] transition-colors font-semibold"
            >
              Erken Erişim
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 min-h-screen flex flex-col">
        <div className="absolute inset-0 bg-[#09111e]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              'radial-gradient(ellipse 100% 70% at 50% -10%, rgba(201,168,76,0.12) 0%, transparent 65%)',
              'radial-gradient(ellipse 50% 40% at 85% 75%, rgba(42,157,143,0.06) 0%, transparent 50%)',
              'radial-gradient(ellipse 60% 40% at 5% 90%, rgba(13,31,60,0.9) 0%, transparent 60%)',
            ].join(', '),
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: [
              'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative flex-1 flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">

          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2.5 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-[0.12em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
              Türkiye&apos;nin Rightmove&apos;u — Yakında Açılıyor
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-white tracking-tight">
              <span className="block text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.05]">
                Eviniz için doğru
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.05] mt-1">
                <em className="not-italic text-[#c9a84c]" style={{ fontFamily: 'Georgia, serif' }}>karar,</em>{' '}
                tam güvence.
              </span>
            </h1>
            <p className="mt-7 text-white/40 text-lg max-w-xl mx-auto leading-relaxed">
              İlan · AI Değerleme · Hukuk · Mortgage · MLS —<br className="hidden sm:block" />
              Türkiye genelinde tek adres.
            </p>

            <div className="mt-10">
              <p className="text-center text-white/20 text-[10px] uppercase tracking-[0.2em] font-semibold mb-5">
                Eylül 2026 Lansmanına
              </p>
              <CountdownTimer />
            </div>
          </div>

          {/* Search bar — modal trigger */}
          <form
            onSubmit={(e) => { e.preventDefault(); openModal() }}
            className="mt-8 max-w-2xl mx-auto w-full"
          >
            <div className="flex bg-white rounded-2xl shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="flex items-center pl-5 text-stone-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Şehir, ilçe veya mahalle arayın…"
                className="flex-1 px-4 py-4 text-[#0d1f3c] placeholder:text-stone-300 outline-none text-[15px]"
              />
              <button
                type="submit"
                className="bg-[#c9a84c] hover:bg-[#b8942e] text-[#0d1f3c] font-bold px-8 py-4 text-sm transition-colors shrink-0 flex items-center gap-2"
              >
                Ara
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Konya'].map((c) => (
                <button
                  key={c} type="button"
                  onClick={() => openModal(c)}
                  className="text-xs text-white/35 hover:text-white/70 border border-white/10 hover:border-white/30 px-3.5 py-1.5 rounded-full transition-all"
                >
                  {c}
                </button>
              ))}
            </div>
          </form>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5 max-w-3xl mx-auto w-full">
            {[
              { n: '120.000+', l: 'Aktif İlan' },
              { n: '81 İl', l: 'Türkiye Geneli' },
              { n: '5.400+', l: 'Onaylı Acenta' },
            ].map((s) => (
              <div key={s.l} className="bg-white/[0.025] px-6 py-5 text-center">
                <div className="text-white font-extrabold text-2xl">{s.n}</div>
                <div className="text-white/25 text-xs mt-1">{s.l}</div>
              </div>
            ))}
            <div className="bg-white/[0.025] px-6 py-5 text-center">
              <LeadCounter />
            </div>
          </div>
        </div>

        <div className="relative flex justify-center pb-10">
          <div className="flex flex-col items-center gap-1.5 text-white/15 text-xs">
            <span>Keşfet</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── Trust strip ──────────────────────────────────────────────────────── */}
      <div className="py-4 bg-stone-50 border-y border-stone-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-stone-400 font-semibold uppercase tracking-widest">
          {['BDDK Uyumlu', '·', 'Baro Onaylı Ortaklar', '·', 'KVKK & GDPR', '·', '256-bit SSL', '·', 'İyzico Güvenli Ödeme'].map((t, i) => (
            <span key={i} className={t === '·' ? 'text-stone-200' : ''}>{t}</span>
          ))}
        </div>
      </div>

      {/* ─── How it works ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">Nasıl Çalışır?</p>
            <h2 className="text-[#0d1f3c] text-4xl font-extrabold">Üç adımda mükemmel ev.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              { step: '01', title: 'Arayın', desc: 'Şehir, ilçe veya mahalle bazında filtreleyin. Harita ve liste görünümü.' },
              { step: '02', title: 'Değerlendirin', desc: 'AI değerleme, hukuki sertifika ve mahalle analizi ile bilinçli karar verin.' },
              { step: '03', title: 'Güvenle Alın', desc: '20+ bankadan mortgage karşılaştırması ve avukat denetimli kapanış süreci.' },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="absolute -top-3 -left-1 text-[#0d1f3c]/[0.04] text-9xl font-black select-none leading-none">
                  {s.step}
                </div>
                <div className="relative">
                  <div className="w-10 h-10 bg-[#c9a84c] text-[#0d1f3c] rounded-xl flex items-center justify-center text-xs font-black mb-5">
                    {s.step}
                  </div>
                  <h3 className="text-[#0d1f3c] font-bold text-xl mb-2">{s.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">Platform Özellikleri</p>
            <h2 className="text-[#0d1f3c] text-4xl font-extrabold">Gayrimenkulde yeni standart.</h2>
            <p className="mt-3 text-stone-500 text-sm max-w-sm mx-auto">
              Sahibinden&apos;de bulamayacağınız araçlar. Hepsi tek platformda.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-7 border border-stone-100 hover:border-[#c9a84c]/40 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="text-3xl leading-none">{f.icon}</div>
                  <span className="text-[11px] font-bold text-[#c9a84c] bg-[#c9a84c]/10 px-2.5 py-1 rounded-full">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-bold text-[#0d1f3c] mb-2">{f.title}</h3>
                <p className="text-stone-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FILTERRA Demo ────────────────────────────────────────────────────── */}
      <FilterraDemo />

      {/* ─── Cities ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-2">Büyük Şehirler</p>
              <h2 className="text-[#0d1f3c] text-3xl font-extrabold">Nerede arıyorsunuz?</h2>
            </div>
            <button
              onClick={() => openModal()}
              className="text-sm text-stone-400 hover:text-[#0d1f3c] transition-colors font-medium hidden sm:block"
            >
              Tüm şehirler →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => openModal(city.name)}
                className="group relative bg-[#0d1f3c] rounded-2xl p-6 text-left hover:bg-[#152d52] transition-all overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'radial-gradient(circle at 70% 50%, rgba(201,168,76,0.1) 0%, transparent 65%)' }}
                />
                <div className="relative">
                  <h3 className="text-white font-bold text-lg mb-1">{city.name}</h3>
                  <p className="text-white/30 text-xs mb-4">{city.count} ilan</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#c9a84c] text-sm font-bold">{city.price} ort.</span>
                    <span className="text-white/20 group-hover:text-white/50 transition-colors text-lg">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── International ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-2">Yurt Dışı Yatırım</p>
              <h2 className="text-[#0d1f3c] text-3xl font-extrabold">Türkiye&apos;nin sınırlarının ötesinde.</h2>
              <p className="text-stone-500 text-sm mt-2">Londra, Dubai, Kıbrıs ve daha fazlası — çok yakında.</p>
            </div>
            <button
              onClick={() => openModal()}
              className="text-sm text-stone-400 hover:text-[#0d1f3c] transition-colors font-medium hidden sm:block"
            >
              Erken bildirim al →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { flag: '🇬🇧', city: 'Londra', country: 'İngiltere', from: '£ 450K', note: 'Zone 1–3 daireler' },
              { flag: '🇦🇪', city: 'Dubai', country: 'BAE', from: '$ 280K', note: 'Marina & JVC projeleri' },
              { flag: '🇨🇾', city: 'Kıbrıs', country: 'KKTC / G.Kıbrıs', from: '€ 120K', note: 'Vatandaşlık fırsatları' },
              { flag: '🇬🇷', city: 'Yunanistan', country: 'Atina & Adalar', from: '€ 90K', note: 'Golden Visa programı' },
            ].map((d) => (
              <button
                key={d.city}
                onClick={() => openModal()}
                className="group bg-white border border-stone-200 hover:border-[#c9a84c]/40 hover:shadow-md rounded-2xl p-5 text-left transition-all"
              >
                <div className="text-3xl mb-3">{d.flag}</div>
                <h3 className="text-[#0d1f3c] font-bold text-base mb-0.5">{d.city}</h3>
                <p className="text-stone-400 text-xs mb-3">{d.country}</p>
                <div className="text-[#c9a84c] font-bold text-sm">{d.from}&apos;den</div>
                <p className="text-stone-400 text-xs mt-0.5">{d.note}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs text-stone-300 group-hover:text-[#c9a84c] transition-colors font-semibold">
                  Yakında
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Agency CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0d1f3c]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block bg-[#c9a84c]/15 text-[#c9a84c] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-7">
                Emlak Ofisleri İçin
              </span>
              <h2 className="text-white text-4xl font-extrabold leading-tight mb-6">
                Portföyünüzü<br />
                <em className="not-italic text-[#c9a84c]" style={{ fontFamily: 'Georgia, serif' }}>
                  Türkiye&apos;nin tamamına
                </em>
                <br />taşıyın.
              </h2>
              <p className="text-white/45 text-sm leading-relaxed mb-8 max-w-md">
                Kendi subdomain&apos;iniz, sınırsız ilan, AI ilan yazarı, CRM ve
                WhatsApp entegrasyonu. Aylık sabit ücret — komisyon yok.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => openModal()}
                  className="bg-[#c9a84c] hover:bg-[#b8942e] text-[#0d1f3c] font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
                >
                  Ortak Olmak İstiyorum
                </button>
                <Link
                  href="/fiyatlar"
                  className="border border-white/20 text-white/60 hover:text-white hover:border-white/40 font-semibold px-7 py-3.5 rounded-xl text-sm transition-all"
                >
                  Planları İncele
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { n: '%40', l: 'Daha Hızlı İlan', sub: 'AI ilan yazarı ile' },
                { n: '3x', l: 'Daha Fazla Lead', sub: 'CRM + WhatsApp ile' },
                { n: '0₺', l: 'Komisyon Yok', sub: 'Sabit aylık plan' },
                { n: '4 Dil', l: 'Yabancı Müşteri', sub: 'TR · EN · AR · RU' },
              ].map((s) => (
                <div key={s.l} className="bg-white/5 border border-white/5 rounded-2xl p-5">
                  <div className="text-[#c9a84c] text-3xl font-black mb-1">{s.n}</div>
                  <div className="text-white text-sm font-semibold">{s.l}</div>
                  <div className="text-white/30 text-xs mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-4">Sınırlı Erken Erişim</p>
          <h2 className="text-[#0d1f3c] text-4xl font-extrabold mb-4">
            Listemiz dolmadan<br />yerinizi ayırtın.
          </h2>
          <p className="text-stone-500 text-sm mb-9 leading-relaxed">
            İlk 500 kullanıcı ve acenta için özel lansman fiyatı ve kişisel kurulum desteği.
          </p>
          <button
            onClick={() => openModal()}
            className="bg-[#0d1f3c] hover:bg-[#1a3358] text-white font-bold px-10 py-4 rounded-2xl text-sm transition-colors shadow-xl shadow-[#0d1f3c]/15"
          >
            Erken Erişim Listesine Katıl →
          </button>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0d1f3c] py-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <span className="text-2xl font-extrabold text-white">
              7<span className="text-[#c9a84c]">fil</span>
            </span>
            <p className="text-white/20 text-xs mt-1">Türkiye&apos;nin Entegre Gayrimenkul Ekosistemi</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/20">
            <Link href="/gizlilik" className="hover:text-white/50 transition-colors">Gizlilik</Link>
            <Link href="/kvkk" className="hover:text-white/50 transition-colors">KVKK</Link>
            <Link href="/kullanim-kosullari" className="hover:text-white/50 transition-colors">Kullanım Koşulları</Link>
            <span>© 2026 Connective Hub Dijital Teknolojiler</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
