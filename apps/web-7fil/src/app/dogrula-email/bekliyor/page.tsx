'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '../../../store/auth'

export default function VerifyEmailWaitingPage() {
  const { user, accessToken: token } = useAuthStore()
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function resend() {
    if (!token) return
    setLoading(true)
    setError(null)
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'
    try {
      const res = await fetch(`${base}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (data.statusCode >= 400 || data.error) {
        setError(data.message ?? 'Gönderilemedi.')
      } else {
        setSent(true)
      }
    } catch {
      setError('Sunucu hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="font-display text-3xl font-bold text-ink inline-block mb-8">
          7<span className="text-gold">fil</span>
        </Link>

        <div className="card p-8">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="font-display text-xl font-bold text-ink mb-2">
            E-postanızı Kontrol Edin
          </h1>
          <p className="text-muted text-sm mb-2">
            <strong className="text-ink">{user?.email ?? 'e-posta adresinize'}</strong> bir
            doğrulama bağlantısı gönderdik.
          </p>
          <p className="text-muted text-xs mb-6">
            E-postayı göremiyorsanız spam/önemsiz klasörünüzü kontrol edin.
          </p>

          {error && (
            <p className="text-red-600 text-xs mb-3">{error}</p>
          )}

          {sent ? (
            <p className="text-green-600 text-sm font-medium">
              Doğrulama e-postası yeniden gönderildi!
            </p>
          ) : (
            <button
              onClick={resend}
              disabled={loading}
              className="text-teal hover:text-gold text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Gönderiliyor...' : 'Tekrar gönder'}
            </button>
          )}
        </div>

        <p className="text-center text-sm text-muted mt-6">
          <Link href="/panel" className="text-teal hover:text-gold transition-colors">
            Şimdilik atla →
          </Link>
        </p>
      </div>
    </div>
  )
}
