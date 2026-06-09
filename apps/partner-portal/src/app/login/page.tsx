'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/auth'
import { partnerApi } from '../../lib/api'

interface FormData { email: string; password: string }

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>()

  async function onSubmit(data: FormData) {
    setError(null)
    const res = await partnerApi.login(data.email, data.password)
    if (res.statusCode && res.statusCode >= 400) {
      setError(res.message ?? 'Giriş başarısız')
      return
    }
    if (!res.data) { setError('Giriş başarısız'); return }
    if (res.data.user.role !== 'partner' && res.data.user.role !== 'admin') {
      setError('Bu portal yalnızca partner hesapları içindir.')
      return
    }
    setAuth(res.data.user, res.data.accessToken)
    router.replace('/dashboard')
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-white">
            7<span className="text-gold">fil</span>
          </h1>
          <p className="text-white/60 mt-2 text-sm">Partner Portal</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-900/40 border border-red-700 text-red-300 rounded-xl p-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/5 backdrop-blur rounded-2xl p-6 space-y-4 border border-white/10">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">E-posta</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold"
              placeholder="partner@firma.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Şifre</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold text-ink font-semibold py-2.5 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center text-xs text-white/30 mt-6">
          Partner hesabı için{' '}
          <a href="https://7fil.com.tr/partner" className="text-gold hover:underline" target="_blank" rel="noopener">
            başvur
          </a>
        </p>
      </div>
    </div>
  )
}
