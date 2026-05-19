'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../../store/auth'
import { panelApi, type AgencyProfile } from '../../../lib/panel-api'

export default function PanelProfile() {
  const { accessToken } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AgencyProfile>()

  useEffect(() => {
    if (!accessToken) return
    panelApi.getProfile(accessToken)
      .then((r) => reset(r.data))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [accessToken, reset])

  async function onSubmit(data: AgencyProfile) {
    if (!accessToken) return
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      await panelApi.updateProfile(accessToken, data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Güncelleme başarısız')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-cream rounded w-1/3" />
          <div className="card p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-cream rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Ajans Profili</h1>
        <p className="text-sm text-muted mt-1">Şirket bilgilerinizi ve subdomain ayarlarınızı güncelleyin.</p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}
      {success && <div className="mb-4 bg-teal/10 border border-teal/30 text-teal rounded-xl p-4 text-sm">Profil güncellendi ✓</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-ink text-sm border-b border-border pb-3">Şirket Bilgileri</h2>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Şirket Adı *</label>
            <input {...register('companyName', { required: true })} className="input-base" />
            {errors.companyName && <p className="text-xs text-red-500 mt-1">Zorunlu</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Lisans No</label>
              <input {...register('licenseNo')} className="input-base" placeholder="YS-XXXX" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Telefon</label>
              <input {...register('phone')} className="input-base" placeholder="0212 XXX XX XX" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Şehir</label>
              <input {...register('city')} className="input-base" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Adres</label>
            <input {...register('address')} className="input-base" />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Açıklama</label>
            <textarea {...register('description')} rows={3} className="input-base resize-none" />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-ink text-sm border-b border-border pb-3">Subdomain (Kurumsal)</h2>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Subdomain</label>
            <div className="flex items-center rounded-lg border border-border overflow-hidden focus-within:ring-2 focus-within:ring-gold/50 focus-within:border-gold">
              <span className="px-3 py-3 bg-cream text-muted text-sm border-r border-border whitespace-nowrap">https://</span>
              <input
                {...register('subdomain', {
                  pattern: { value: /^[a-z0-9-]+$/, message: 'Sadece küçük harf, rakam ve tire' },
                })}
                className="flex-1 px-3 py-3 bg-white text-ink text-sm focus:outline-none"
                placeholder="ajans-adiniz"
              />
              <span className="px-3 py-3 bg-cream text-muted text-sm border-l border-border whitespace-nowrap">.7fil.com.tr</span>
            </div>
            {errors.subdomain && <p className="text-xs text-red-500 mt-1">{errors.subdomain.message}</p>}
            <p className="text-xs text-muted mt-1">Sadece Kurumsal planda aktif edilir.</p>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Kaydediliyor...' : 'Profili Kaydet'}
        </button>
      </form>
    </div>
  )
}
