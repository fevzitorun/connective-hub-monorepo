'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../../store/auth'
import { panelApi } from '../../../lib/panel-api'

interface FormData {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'
  const { setAuth } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>()

  async function onSubmit(data: FormData) {
    setError(null)
    const res = await panelApi.login(data.email, data.password)
    if (res.statusCode >= 400 || res.error) {
      setError(res.message ?? 'Giriş başarısız')
      return
    }
    const { user, accessToken, refreshToken } = res.data
    setAuth(user, accessToken, refreshToken)
    router.replace(redirect)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold text-ink inline-block">
            7<span className="text-gold">fil</span>
          </Link>
          <h1 className="mt-4 font-display text-xl font-bold text-ink">Hesabınıza Giriş Yapın</h1>
          <p className="text-muted text-sm mt-2">Panel ve ilan yönetimi için giriş gerekli.</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">E-posta</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="input-base"
              placeholder="ornek@firma.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Şifre</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="input-base"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Hesabınız yok mu?{' '}
          <Link href="/kayit" className="text-teal hover:text-gold transition-colors font-medium">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  )
}
