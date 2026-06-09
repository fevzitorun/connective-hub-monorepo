'use client'
import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../../store/auth'
import { partnerApi, Referral } from '../../../lib/api'

const REF_TYPES = [
  { value: 'listing_lead', label: 'İlan Lead' },
  { value: 'mortgage_lead', label: 'Mortgage Lead' },
  { value: 'agency_signup', label: 'Ajans Kaydı' },
]
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  contacted: 'bg-blue-100 text-blue-700',
  converted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

interface FormData {
  refType: 'listing_lead' | 'mortgage_lead' | 'agency_signup'
  contactName: string
  contactEmail: string
  contactPhone?: string
  notes?: string
  estimatedValue?: string
}

export default function ReferralsPage() {
  const { accessToken } = useAuthStore()
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: { refType: 'listing_lead' },
  })

  const load = useCallback(async () => {
    if (!accessToken) return
    const res = await partnerApi.listReferrals(accessToken, { page }).catch(() => null)
    if (res) { setReferrals(res.data); setTotal(res.total) }
  }, [accessToken, page])

  useEffect(() => { load() }, [load])

  async function onSubmit(data: FormData) {
    if (!accessToken) return
    setSubmitting(true)
    setFormError(null)
    try {
      await partnerApi.createReferral(accessToken, {
        ...data,
        estimatedValue: data.estimatedValue ? Number(data.estimatedValue) : undefined,
      })
      setSuccessMsg('Referansınız başarıyla gönderildi. Ekibimiz inceleyecek.')
      setShowForm(false)
      reset()
      load()
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Referanslar</h1>
          <p className="text-muted text-sm mt-0.5">{total} toplam referans</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setSuccessMsg(null) }} className="btn-primary">
          + Yeni Referans
        </button>
      </div>

      {successMsg && (
        <div className="mb-5 bg-teal/10 border border-teal/30 text-teal rounded-xl p-4 text-sm">{successMsg}</div>
      )}

      {/* Referral form */}
      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-ink mb-4">Yeni Referans Gönder</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Referans Tipi</label>
                <select {...register('refType', { required: true })} className="input-base">
                  {REF_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">İletişim Adı *</label>
                <input {...register('contactName', { required: true })} className="input-base" placeholder="Ad Soyad" />
                {errors.contactName && <p className="text-xs text-red-500 mt-1">Zorunlu alan</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">E-posta *</label>
                <input type="email" {...register('contactEmail', { required: true })} className="input-base" placeholder="email@ornek.com" />
                {errors.contactEmail && <p className="text-xs text-red-500 mt-1">Zorunlu alan</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Telefon</label>
                <input {...register('contactPhone')} className="input-base" placeholder="+90 5XX XXX XX XX" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Tahmini Değer (₺)</label>
                <input type="number" {...register('estimatedValue')} className="input-base" placeholder="1000000" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Notlar</label>
              <textarea {...register('notes')} rows={3} className="input-base resize-none" placeholder="Müşteri hakkında ek bilgi..." />
            </div>
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? 'Gönderiliyor...' : 'Gönder'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">İptal</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['İletişim', 'Tip', 'Durum', 'Komisyon', 'Tarih'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted">Henüz referans bulunmuyor. İlk referansınızı gönderin!</td>
                </tr>
              ) : referrals.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{r.contact_name}</p>
                    <p className="text-xs text-muted">{r.contact_email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {REF_TYPES.find(t => t.value === r.ref_type)?.label ?? r.ref_type}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_COLORS[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-ink">
                    {r.commission_amount
                      ? `${Number(r.commission_amount).toLocaleString('tr-TR')}₺`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(r.created_at).toLocaleDateString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-muted">Sayfa {page} / {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40">Önceki</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40">Sonraki</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
