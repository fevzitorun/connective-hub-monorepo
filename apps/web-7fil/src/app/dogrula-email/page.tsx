'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '../../store/auth'

type Status = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Geçersiz doğrulama bağlantısı.')
      return
    }

    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'
    fetch(`${base}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.statusCode >= 400 || data.error) {
          setStatus('error')
          setMessage(data.message ?? 'Doğrulama başarısız.')
        } else {
          setStatus('success')
          setMessage(data.message ?? 'E-posta adresiniz doğrulandı.')
          if (user) {
            setUser({ ...user, isVerified: true })
            setTimeout(() => router.replace('/panel'), 2500)
          } else {
            setTimeout(() => router.replace('/giris?verified=1'), 2500)
          }
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Sunucu hatası. Lütfen tekrar deneyin.')
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="font-display text-3xl font-bold text-ink inline-block mb-8">
          7<span className="text-gold">fil</span>
        </Link>

        {status === 'loading' && (
          <div className="card p-8">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ink font-medium">E-posta doğrulanıyor...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="card p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display text-xl font-bold text-ink mb-2">E-posta Doğrulandı!</h1>
            <p className="text-muted text-sm mb-6">{message}</p>
            <p className="text-xs text-muted">{user ? 'Panele' : 'Giriş sayfasına'} yönlendiriliyorsunuz...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="card p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="font-display text-xl font-bold text-ink mb-2">Doğrulama Başarısız</h1>
            <p className="text-muted text-sm mb-6">{message}</p>
            <p className="text-xs text-muted mb-4">
              Bağlantı süresi dolmuş olabilir. Yeni bir doğrulama e-postası almak için giriş yapın.
            </p>
            <Link href="/giris" className="btn-primary inline-block">
              Giriş Yap
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
