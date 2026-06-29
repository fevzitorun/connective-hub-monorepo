'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../../store/auth'
import { panelApi } from '../../../lib/panel-api'

export default function BetaGirisPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await panelApi.login(email, password)
      if (res.statusCode >= 400 || res.error) {
        setError(res.message ?? 'Giriş başarısız')
        return
      }
      const { user, accessToken, refreshToken } = res.data
      setAuth(user, accessToken, refreshToken)
      router.replace('/beta/panel')
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09111e] flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(201,168,76,0.10) 0%, transparent 60%)',
            'radial-gradient(ellipse 40% 30% at 80% 90%, rgba(13,31,60,0.8) 0%, transparent 60%)',
          ].join(', '),
        }}
      />

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              7<span className="text-[#c9a84c]">fil</span>
            </span>
          </Link>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Partner Erişimi
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] backdrop-blur border border-white/10 rounded-3xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-white/5">
            <h1 className="text-white text-xl font-bold leading-snug">
              7fil Partner Ağına<br />
              <em className="not-italic text-[#c9a84c]" style={{ fontFamily: 'Georgia, serif' }}>
                Hoş Geldiniz.
              </em>
            </h1>
            <p className="text-white/35 text-xs mt-2 leading-relaxed">
              Beta portföy panelinize erişmek için davet e-postanızdaki bilgilerle giriş yapın.
            </p>
          </div>

          <form onSubmit={submit} className="px-8 py-6 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-white/40 text-xs font-semibold uppercase tracking-wide mb-1.5">
                E-posta
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@firma.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#c9a84c]/40 transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/40 text-xs font-semibold uppercase tracking-wide mb-1.5">
                Şifre
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#c9a84c]/40 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] hover:bg-[#b8942e] disabled:opacity-60 text-[#09111e] font-bold py-3.5 rounded-xl text-sm transition-colors mt-2"
            >
              {loading ? 'Doğrulanıyor…' : 'Partner Paneline Gir →'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Beta davetiniz mi yok?{' '}
          <Link href="/" className="text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors">
            Erken erişim listesine katılın
          </Link>
        </p>
      </div>
    </div>
  )
}
