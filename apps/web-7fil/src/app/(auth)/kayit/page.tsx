'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../../store/auth'
import { panelApi } from '../../../lib/panel-api'

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: string
  companyName?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: { role: 'buyer' }
  })
  const role = watch('role')

  async function onSubmit(data: FormData) {
    if (data.password !== data.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }
    setError(null)
    const res = await panelApi.register({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      role: data.role,
    })
    if (res.statusCode >= 400 || res.error) {
      setError(res.message ?? 'Kayıt başarısız')
      return
    }
    const { user, accessToken, refreshToken } = res.data
    setAuth(user, accessToken, refreshToken)
    router.replace(data.role === 'buyer' ? '/' : '/panel')
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl font-bold text-ink inline-block">
            7<span className="text-gold">fil</span>
          </Link>
          <h1 className="mt-4 font-display text-xl font-bold text-ink">Hesap Oluşturun</h1>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Ad Soyad</label>
            <input {...register('fullName', { required: true })} className="input-base" placeholder="Ad Soyad" />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">E-posta *</label>
            <input type="email" {...register('email', { required: true })} className="input-base" />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Şifre *</label>
            <input type="password" {...register('password', { required: true, minLength: 8 })} className="input-base" />
            {errors.password?.type === 'minLength' && <p className="text-xs text-red-500 mt-1">En az 8 karakter</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Şifre Tekrar *</label>
            <input type="password" {...register('confirmPassword', { required: true })} className="input-base" />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Hesap Tipi</label>
            <select {...register('role')} className="input-base">
              <option value="buyer">Ev Arayan (Alıcı)</option>
              <option value="agency">Emlak Ofisi</option>
              <option value="agent_person">Bireysel Emlakçı</option>
            </select>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>

          <p className="text-xs text-center text-muted">
            Kayıt olarak{' '}
            <Link href="/kullanim-kosullari" className="text-teal hover:underline">Kullanım Koşulları</Link>
            {' '}ve{' '}
            <Link href="/kvkk" className="text-teal hover:underline">KVKK</Link>
            &apos;yı kabul etmiş sayılırsınız.
          </p>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Zaten hesabınız var mı?{' '}
          <Link href="/giris" className="text-teal hover:text-gold transition-colors font-medium">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  )
}
