'use client'
import { useState } from 'react'
import Link from 'next/link'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const json = await res.json() as { message?: string }
      if (!res.ok) { setError(json.message ?? 'Bir hata oluştu.'); return }
      setSent(true)
    } catch {
      setError('Sunucuya bağlanılamadı.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold text-ink">
            7<span className="text-gold">fil</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">E-posta Gönderildi</h2>
              <p className="text-sm text-gray-500 mb-6">
                Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi. Gelen kutunuzu kontrol edin.
              </p>
              <Link href="/giris" className="text-teal hover:underline text-sm font-medium">
                Giriş sayfasına dön
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-800 mb-1">Şifremi Unuttum</h1>
              <p className="text-sm text-gray-500 mb-6">E-posta adresinizi girin, sıfırlama bağlantısı gönderelim.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1 uppercase tracking-wide">E-posta</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@mail.com"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30"
                  />
                </div>

                {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal text-white font-bold py-3 rounded-xl hover:bg-teal/90 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Gönderiliyor…' : 'Sıfırlama Bağlantısı Gönder'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-6">
                <Link href="/giris" className="text-teal hover:underline">← Giriş sayfasına dön</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
