'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Şifre en az 8 karakter olmalı.'); return }
    if (password !== confirm) { setError('Şifreler eşleşmiyor.'); return }
    if (!token) { setError('Geçersiz bağlantı.'); return }

    setLoading(true); setError(null)
    try {
      const res = await fetch(`${BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const json = await res.json() as { message?: string }
      if (!res.ok) { setError(json.message ?? 'Bağlantı geçersiz veya süresi dolmuş.'); return }
      setDone(true)
      setTimeout(() => router.replace('/giris'), 2_500)
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
          {!token ? (
            <div className="text-center">
              <p className="text-red-500 text-sm mb-4">Geçersiz şifre sıfırlama bağlantısı.</p>
              <Link href="/sifremi-unuttum" className="text-teal hover:underline text-sm">Yeniden dene</Link>
            </div>
          ) : done ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Şifre Güncellendi</h2>
              <p className="text-sm text-gray-500">Giriş sayfasına yönlendiriliyorsunuz…</p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-800 mb-1">Yeni Şifre Belirle</h1>
              <p className="text-sm text-gray-500 mb-6">En az 8 karakter kullanın.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1 uppercase tracking-wide">Yeni Şifre</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1 uppercase tracking-wide">Şifre Tekrar</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
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
                  {loading ? 'Güncelleniyor…' : 'Şifremi Güncelle'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
