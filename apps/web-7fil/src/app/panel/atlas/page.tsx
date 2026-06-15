'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuthStore } from '../../../store/auth'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

type Message = {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type ConvItem = { id: string; title: string; message_count: number; updated_at: string }

const QUICK_PROMPTS = [
  'İstanbul\'da daire fiyatları nasıl?',
  'Konut kredisi LTV limitleri nedir?',
  'Tapu devir işlemleri nasıl yapılır?',
  'Kira artış oranı 2024 ne kadar?',
  'DASK sigortası zorunlu mu?',
  'Yabancılar Türkiye\'de ev alabilir mi?',
]

export default function AtlasPage() {
  const { accessToken } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<ConvItem[]>([])
  const [tab, setTab] = useState<'chat' | 'valuation' | 'neighborhood'>('chat')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Valuation form state
  const [vForm, setVForm] = useState({
    city: '', district: '', propertyType: 'apartment',
    areaM2: '', roomCount: '', buildingAge: '', floorNo: '',
    hasParking: false, hasElevator: false,
  })
  const [vResult, setVResult] = useState<Record<string, unknown> | null>(null)
  const [vLoading, setVLoading] = useState(false)

  // Neighborhood form state
  const [nForm, setNForm] = useState({ city: '', district: '' })
  const [nResult, setNResult] = useState<{ analysis: string; stats: Record<string, number> } | null>(null)
  const [nLoading, setNLoading] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = useCallback(async () => {
    if (!accessToken) return
    const res = await fetch(`${BASE}/atlas/conversations`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const json = await res.json() as { data: ConvItem[] }
    setConversations(json.data ?? [])
  }, [accessToken])

  useEffect(() => { loadConversations() }, [loadConversations])

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: msg, timestamp: new Date() }])
    setLoading(true)

    try {
      const endpoint = accessToken ? '/atlas/chat/auth' : '/atlas/chat'
      const res = await fetch(`${BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ message: msg, conversationId }),
      })
      const json = await res.json() as { message: string; conversationId: string }
      setConversationId(json.conversationId)
      setMessages((prev) => [...prev, { role: 'assistant', content: json.message, timestamp: new Date() }])
      loadConversations()
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  async function loadConversation(id: string) {
    if (!accessToken) return
    const res = await fetch(`${BASE}/atlas/conversations/${id}/messages`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const json = await res.json() as { data: { role: 'user' | 'assistant'; content: string; created_at: string }[] }
    setMessages((json.data ?? []).map((m) => ({
      role: m.role, content: m.content, timestamp: new Date(m.created_at),
    })))
    setConversationId(id)
  }

  async function handleValuation() {
    setVLoading(true); setVResult(null)
    try {
      const res = await fetch(`${BASE}/atlas/valuation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: vForm.city, district: vForm.district, propertyType: vForm.propertyType,
          areaM2: Number(vForm.areaM2), roomCount: vForm.roomCount || undefined,
          buildingAge: vForm.buildingAge ? Number(vForm.buildingAge) : undefined,
          floorNo: vForm.floorNo ? Number(vForm.floorNo) : undefined,
          hasParking: vForm.hasParking, hasElevator: vForm.hasElevator,
        }),
      })
      setVResult(await res.json() as Record<string, unknown>)
    } finally { setVLoading(false) }
  }

  async function handleNeighborhood() {
    setNLoading(true); setNResult(null)
    try {
      const res = await fetch(`${BASE}/atlas/neighborhood?city=${encodeURIComponent(nForm.city)}&district=${encodeURIComponent(nForm.district)}`)
      setNResult(await res.json() as { analysis: string; stats: Record<string, number> })
    } finally { setNLoading(false) }
  }

  return (
    <div className="p-6 sm:p-8 h-[calc(100vh-0px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-ink rounded-xl flex items-center justify-center">
          <span className="text-gold font-bold text-sm">AI</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Atlas AI</h1>
          <p className="text-xs text-gray-400">Türkiye gayrimenkul asistanı</p>
        </div>
        <div className="ml-auto flex gap-2">
          {(['chat', 'valuation', 'neighborhood'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                tab === t ? 'bg-ink text-white border-ink' : 'border-gray-200 text-gray-600 hover:border-ink'
              }`}>
              {t === 'chat' ? '💬 Sohbet' : t === 'valuation' ? '🏠 Değerleme' : '📍 Bölge Analizi'}
            </button>
          ))}
        </div>
      </div>

      {/* ── CHAT TAB ── */}
      {tab === 'chat' && (
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Conversation sidebar */}
          {accessToken && (
            <div className="w-56 shrink-0 flex flex-col gap-2">
              <button
                onClick={() => { setMessages([]); setConversationId(null) }}
                className="flex items-center gap-2 text-xs px-3 py-2 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors font-semibold"
              >
                + Yeni Sohbet
              </button>
              <div className="flex-1 overflow-y-auto space-y-1">
                {conversations.map((c) => (
                  <button key={c.id} onClick={() => loadConversation(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                      conversationId === c.id ? 'bg-ink text-white' : 'hover:bg-gray-100 text-gray-600'
                    }`}>
                    <p className="font-medium truncate">{c.title}</p>
                    <p className="text-gray-400 mt-0.5">{c.message_count} mesaj</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
              {messages.length === 0 && (
                <div className="pt-8 text-center">
                  <div className="w-16 h-16 bg-ink rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-gold text-2xl font-extrabold">A</span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">Atlas'a Sorun</h2>
                  <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
                    Türkiye gayrimenkul piyasası, tapu işlemleri, kredi, DASK ve yatırım konularında yardımcı olabilirim.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {QUICK_PROMPTS.map((p) => (
                      <button key={p} onClick={() => sendMessage(p)}
                        className="text-xs px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-700 transition-colors text-left">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center shrink-0 mt-1">
                      <span className="text-gold text-xs font-bold">A</span>
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-ink text-white rounded-tr-sm'
                      : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-sm'
                  }`}>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    <p className={`text-xs mt-1 ${m.role === 'user' ? 'text-white/50' : 'text-gray-400'}`}>
                      {m.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
                    <span className="text-gold text-xs font-bold">A</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex gap-3 items-end bg-white border border-gray-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-teal/30">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="Sormak istediğiniz soruyu yazın… (Enter gönderin)"
                  rows={1}
                  className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 max-h-32"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-teal/90 transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Atlas bilgi amaçlıdır, hukuki tavsiye değildir.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── VALUATION TAB ── */}
      {tab === 'valuation' && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Mülk Bilgileri</h2>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Şehir" value={vForm.city} onChange={(v) => setVForm({ ...vForm, city: v })} />
                <InputField label="İlçe" value={vForm.district} onChange={(v) => setVForm({ ...vForm, district: v })} />
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Mülk Tipi</label>
                  <select value={vForm.propertyType} onChange={(e) => setVForm({ ...vForm, propertyType: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal/30">
                    {[['apartment','Daire'],['house','Müstakil'],['villa','Villa'],['land','Arsa'],['office','Ofis'],['shop','Dükkan']].map(([k,l]) => (
                      <option key={k} value={k}>{l}</option>
                    ))}
                  </select>
                </div>
                <InputField label="Alan (m²)" value={vForm.areaM2} onChange={(v) => setVForm({ ...vForm, areaM2: v })} type="number" />
                <InputField label="Oda Sayısı" value={vForm.roomCount} onChange={(v) => setVForm({ ...vForm, roomCount: v })} placeholder="3+1" />
                <InputField label="Bina Yaşı" value={vForm.buildingAge} onChange={(v) => setVForm({ ...vForm, buildingAge: v })} type="number" />
                <InputField label="Kat No" value={vForm.floorNo} onChange={(v) => setVForm({ ...vForm, floorNo: v })} type="number" />
                <div className="flex items-center gap-6 col-span-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={vForm.hasParking} onChange={(e) => setVForm({ ...vForm, hasParking: e.target.checked })} className="w-4 h-4 rounded accent-teal" />
                    Otopark
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={vForm.hasElevator} onChange={(e) => setVForm({ ...vForm, hasElevator: e.target.checked })} className="w-4 h-4 rounded accent-teal" />
                    Asansör
                  </label>
                </div>
              </div>
              <button onClick={handleValuation} disabled={!vForm.city || !vForm.areaM2 || vLoading}
                className="mt-4 w-full bg-teal text-white font-semibold py-3 rounded-xl hover:bg-teal/90 disabled:opacity-50 transition-colors">
                {vLoading ? 'Hesaplanıyor…' : 'Değer Tahmini Al'}
              </button>
            </div>

            {vResult && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">Değerleme Sonucu</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: 'Min Değer', value: vResult['minValue'] as number },
                    { label: 'Tahmini Değer', value: vResult['midValue'] as number, highlight: true },
                    { label: 'Max Değer', value: vResult['maxValue'] as number },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className={`text-center p-4 rounded-xl ${highlight ? 'bg-teal/10 border border-teal/30' : 'bg-gray-50'}`}>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className={`text-lg font-bold mt-1 ${highlight ? 'text-teal' : 'text-gray-700'}`}>
                        {value ? `${Math.round(value).toLocaleString('tr-TR')} ₺` : '—'}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-gray-500">Güven: </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    vResult['confidence'] === 'high' ? 'bg-emerald-100 text-emerald-700'
                    : vResult['confidence'] === 'medium' ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                  }`}>{vResult['confidence'] as string}</span>
                  <span className="text-xs text-gray-400 ml-auto">m²: {Math.round(vResult['pricePerM2'] as number ?? 0).toLocaleString('tr-TR')} ₺</span>
                </div>
                {Boolean(vResult['reasoning']) && <p className="text-sm text-gray-600 leading-relaxed">{String(vResult['reasoning'])}</p>}
                {(vResult['marketData'] as Record<string, number>)?.sampleCount !== undefined && (
                  <p className="text-xs text-gray-400 mt-2">Örnek veri: {(vResult['marketData'] as Record<string, number>).sampleCount} aktif ilan</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── NEIGHBORHOOD TAB ── */}
      {tab === 'neighborhood' && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Bölge Seçin</h2>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Şehir" value={nForm.city} onChange={(v) => setNForm({ ...nForm, city: v })} />
                <InputField label="İlçe" value={nForm.district} onChange={(v) => setNForm({ ...nForm, district: v })} />
              </div>
              <button onClick={handleNeighborhood} disabled={!nForm.city || nLoading}
                className="mt-4 w-full bg-teal text-white font-semibold py-3 rounded-xl hover:bg-teal/90 disabled:opacity-50 transition-colors">
                {nLoading ? 'Analiz ediliyor…' : 'Bölge Analizi Al'}
              </button>
            </div>

            {nResult && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-semibold text-gray-700">
                  {nForm.city}{nForm.district ? `, ${nForm.district}` : ''} Bölge Raporu
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Aktif İlan', value: nResult.stats['listing_count'] ?? 0, fmt: (v: number) => v.toLocaleString('tr-TR') },
                    { label: 'Ort. Fiyat', value: nResult.stats['avg_price'] ?? 0, fmt: (v: number) => `${Math.round(v).toLocaleString('tr-TR')} ₺` },
                    { label: 'Ort. m²', value: nResult.stats['avg_area'] ?? 0, fmt: (v: number) => `${Math.round(v)} m²` },
                    { label: 'm² Fiyatı', value: nResult.stats['avg_m2_price'] ?? 0, fmt: (v: number) => `${Math.round(v).toLocaleString('tr-TR')} ₺` },
                  ].map(({ label, value, fmt }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-bold text-gray-800 mt-1">{fmt(value)}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-ink/5 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Atlas AI Analizi</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{nResult.analysis}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="text-xs text-gray-500 font-medium block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal/30"
      />
    </div>
  )
}
