'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../store/auth'
import { timeAgo } from '../../../lib/utils'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'rejected' | 'converted'

type Lead = {
  id: string
  loanType: 'conventional' | 'islamic'
  propertyPrice: number
  downPayment: number
  loanAmount: number
  loanTermYears: number
  monthlyPayment: number
  ltvRatio: number
  city: string | null
  propertyType: string | null
  isFirstHome: boolean
  status: LeadStatus
  isClaimed: boolean
  contactName: string | null
  contactPhone: string
  contactEmail: string
  createdAt: string
}

type Stats = { total: number; claimed: number; qualified: number; converted: number }

const STATUS_LABELS: Record<LeadStatus, { label: string; cls: string }> = {
  new:       { label: 'Yeni', cls: 'bg-blue-50 text-blue-600' },
  contacted: { label: 'İletişime Geçildi', cls: 'bg-gold/10 text-gold' },
  qualified: { label: 'Nitelikli', cls: 'bg-teal/10 text-teal' },
  rejected:  { label: 'Reddedildi', cls: 'bg-red-50 text-red-500' },
  converted: { label: 'Dönüştürüldü', cls: 'bg-green-50 text-green-600' },
}

const STATUS_NEXT: Partial<Record<LeadStatus, LeadStatus[]>> = {
  contacted: ['qualified', 'rejected'],
  qualified: ['converted', 'rejected'],
}

export default function BankaPanel() {
  const { accessToken } = useAuthStore()
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [cityFilter, setCityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [claiming, setClaiming] = useState<string | null>(null)

  const fetchLeads = async () => {
    if (!accessToken) return
    const params = new URLSearchParams()
    if (cityFilter) params.set('city', cityFilter)
    if (statusFilter) params.set('status', statusFilter)
    params.set('limit', '50')

    const [leadsRes, statsRes] = await Promise.all([
      fetch(`${BASE}/finance/bank/leads?${params}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((r) => r.json()),
      fetch(`${BASE}/finance/bank/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((r) => r.json()),
    ])
    setLeads(leadsRes.data ?? [])
    setStats(statsRes.data ?? null)
    setLoading(false)
  }

  useEffect(() => { fetchLeads() }, [accessToken, cityFilter, statusFilter])

  async function claimLead(id: string) {
    if (!accessToken) return
    setClaiming(id)
    try {
      await fetch(`${BASE}/finance/bank/leads/${id}/claim`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      await fetchLeads()
    } finally {
      setClaiming(null)
    }
  }

  async function updateStatus(id: string, status: string) {
    if (!accessToken) return
    await fetch(`${BASE}/finance/bank/leads/${id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    await fetchLeads()
  }

  const statCards = stats
    ? [
        { label: 'Toplam Lead', value: stats.total, color: 'text-ink' },
        { label: 'Talep Ettiklerim', value: stats.claimed, color: 'text-teal' },
        { label: 'Nitelikli', value: stats.qualified, color: 'text-gold' },
        { label: 'Dönüştürülen', value: stats.converted, color: 'text-green-600' },
      ]
    : []

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink">Kredi Lead Paneli</h1>
        <p className="text-muted text-sm mt-1">
          7fil kullanıcılarının kredi başvurularını görüntüleyin ve talep edin.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className="card p-5">
              <p className="text-xs text-muted">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          placeholder="Şehir filtrele..."
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="input text-sm w-40"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input text-sm"
        >
          <option value="">Tüm Durumlar</option>
          {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
          ))}
        </select>
      </div>

      {/* Leads */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-ink text-sm">Kredi Başvuruları</h2>
          <span className="text-xs text-muted">{leads.length} lead</span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-cream rounded-lg animate-pulse" />)}
          </div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center text-muted">
            <p className="font-semibold text-ink">Lead bulunamadı</p>
            <p className="text-sm mt-1">Filtrelerinizi değiştirmeyi deneyin.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {leads.map((lead) => (
              <div key={lead.id} className="px-6 py-4 hover:bg-cream/50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Loan info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-ink">
                        {lead.loanAmount.toLocaleString('tr-TR')} TRY
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink/5 text-muted">
                        {lead.loanType === 'islamic' ? 'Katılım' : 'Konvansiyonel'}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_LABELS[lead.status]?.cls}`}>
                        {STATUS_LABELS[lead.status]?.label}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
                      {lead.city && <span>{lead.city}</span>}
                      <span>LTV %{lead.ltvRatio}</span>
                      <span>{lead.loanTermYears} yıl</span>
                      <span>Taksit: {lead.monthlyPayment?.toLocaleString('tr-TR')} TRY/ay</span>
                      <span>{lead.isFirstHome ? 'İlk Konut' : '2. Konut+'}</span>
                      <span>{timeAgo(new Date(lead.createdAt))}</span>
                    </div>

                    {/* Contact — visible only if claimed */}
                    {lead.isClaimed && (
                      <div className="mt-2 flex gap-4 text-xs bg-teal/5 border border-teal/20 rounded-lg p-2">
                        {lead.contactName && <span className="font-medium text-ink">{lead.contactName}</span>}
                        <a href={`tel:${lead.contactPhone}`} className="text-teal font-medium">{lead.contactPhone}</a>
                        <a href={`mailto:${lead.contactEmail}`} className="text-teal">{lead.contactEmail}</a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {!lead.isClaimed ? (
                      <button
                        onClick={() => claimLead(lead.id)}
                        disabled={claiming === lead.id}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        {claiming === lead.id ? '...' : 'Lead Talep Et'}
                      </button>
                    ) : (
                      STATUS_NEXT[lead.status] && (
                        <div className="flex gap-1">
                          {STATUS_NEXT[lead.status]!.map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(lead.id, s)}
                              className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                                s === 'rejected' || s === 'converted'
                                  ? 'border-border text-muted hover:border-ink hover:text-ink'
                                  : 'border-teal/40 text-teal hover:bg-teal/5'
                              }`}
                            >
                              {STATUS_LABELS[s].label}
                            </button>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-muted/60 mt-4 text-center">
        Lead talep ettiğinizde müşterinin iletişim bilgileri açılır. Her lead yalnızca bir banka tarafından talep edilebilir.
      </p>
    </div>
  )
}
