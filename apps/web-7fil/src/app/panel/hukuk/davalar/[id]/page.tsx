'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '../../../../../store/auth'
import { timeAgo } from '../../../../../lib/utils'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

const DOC_LABELS: Record<string, string> = {
  tapu: 'Tapu Senedi',
  iskan: 'İskan Belgesi',
  ruhsat: 'Yapı Ruhsatı',
  kadastro: 'Kadastro',
  vekaletname: 'Vekaletname',
  dask: 'DASK Poliçesi',
  ipotek: 'İpotek Belgesi',
  other: 'Diğer',
}

type CaseDetail = {
  id: string
  listingId: string
  status: string
  riskScore: number | null
  riskNotes: string | null
  lawyerNotes: string | null
  listing: { id: string; title: string; city: string; district: string; propertyType: string }
  requester: { fullName: string; email: string }
  documents: {
    id: string
    docType: string
    fileUrl: string
    notes: string | null
    createdAt: string
  }[]
  createdAt: string
  reviewedAt: string | null
}

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { accessToken, user } = useAuthStore()
  const [caseData, setCaseData] = useState<CaseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [certLoading, setCertLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Review form state
  const [verdict, setVerdict] = useState<'approved' | 'rejected'>('approved')
  const [riskScore, setRiskScore] = useState(30)
  const [riskNotes, setRiskNotes] = useState('')
  const [lawyerNotes, setLawyerNotes] = useState('')
  const [fee, setFee] = useState('')

  useEffect(() => {
    if (!accessToken) return
    fetch(`${BASE}/legal/lawyer/cases/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((res) => setCaseData(res.data))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [id, accessToken])

  async function submitReview() {
    if (!riskNotes.trim()) {
      setError('Risk notları zorunludur.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${BASE}/legal/lawyer/cases/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          verdict,
          riskScore: Number(riskScore),
          riskNotes,
          lawyerNotes: lawyerNotes || undefined,
          fee: fee ? Number(fee) : undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Hata oluştu')
      setCaseData(json.data)
      setSuccess('İnceleme sonucu kaydedildi.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hata')
    } finally {
      setSubmitting(false)
    }
  }

  async function issueCert() {
    setCertLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE}/legal/lawyer/cases/${id}/certificate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Hata')
      setSuccess(`Sertifika düzenlendi! Hash: ${json.data.certHash.slice(0, 16)}...`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hata')
    } finally {
      setCertLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-cream rounded-xl animate-pulse" />)}
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="p-8 text-center text-muted">
        Dava bulunamadı.
        <Link href="/panel/hukuk" className="ml-2 text-teal hover:text-gold">← Geri dön</Link>
      </div>
    )
  }

  const isUnderReview = caseData.status === 'under_review'
  const isApproved = caseData.status === 'approved'
  const riskColor = !caseData.riskScore ? 'text-muted' :
    caseData.riskScore < 30 ? 'text-green-600' :
    caseData.riskScore < 60 ? 'text-gold' : 'text-red-600'

  return (
    <div className="p-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <Link href="/panel/hukuk" className="text-xs text-muted hover:text-teal transition-colors">← Davalar</Link>
          <h1 className="font-display text-2xl font-bold text-ink mt-1">{caseData.listing.title}</h1>
          <p className="text-sm text-muted mt-0.5">{caseData.listing.district && `${caseData.listing.district}, `}{caseData.listing.city}</p>
        </div>
        <div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
            caseData.status === 'approved' ? 'bg-green-50 text-green-600' :
            caseData.status === 'rejected' ? 'bg-red-50 text-red-600' :
            caseData.status === 'under_review' ? 'bg-blue-50 text-blue-600' :
            'bg-gold/10 text-gold'
          }`}>
            {caseData.status === 'under_review' ? 'İncelemede' :
             caseData.status === 'approved' ? 'Onaylandı' :
             caseData.status === 'rejected' ? 'Reddedildi' : 'Bekliyor'}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl p-4">{success}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — info + docs */}
        <div className="lg:col-span-2 space-y-5">
          {/* Requester info */}
          <div className="card p-5">
            <h2 className="font-semibold text-sm text-ink mb-3 border-b border-border pb-2">Talep Bilgisi</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted">Talep Eden</p>
                <p className="font-medium text-ink mt-0.5">{caseData.requester?.fullName ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted">E-posta</p>
                <p className="font-medium text-ink mt-0.5">{caseData.requester?.email ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Talep Tarihi</p>
                <p className="font-medium text-ink mt-0.5">{timeAgo(new Date(caseData.createdAt))}</p>
              </div>
              {caseData.reviewedAt && (
                <div>
                  <p className="text-xs text-muted">İnceleme Tarihi</p>
                  <p className="font-medium text-ink mt-0.5">{timeAgo(new Date(caseData.reviewedAt))}</p>
                </div>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <Link
                href={`/ilan/${caseData.listing.id}`}
                target="_blank"
                className="text-sm text-teal hover:text-gold transition-colors"
              >
                İlanı Görüntüle →
              </Link>
            </div>
          </div>

          {/* Documents */}
          <div className="card p-5">
            <h2 className="font-semibold text-sm text-ink mb-3 border-b border-border pb-2">
              Yüklenen Belgeler
              <span className="text-muted font-normal ml-2">({caseData.documents.length})</span>
            </h2>
            {caseData.documents.length === 0 ? (
              <p className="text-sm text-muted">Henüz belge yüklenmemiş.</p>
            ) : (
              <div className="space-y-2">
                {caseData.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-gold/40 transition-colors group"
                  >
                    <svg className="w-5 h-5 text-muted/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink group-hover:text-teal transition-colors">
                        {DOC_LABELS[doc.docType] ?? doc.docType}
                      </p>
                      {doc.notes && <p className="text-xs text-muted truncate">{doc.notes}</p>}
                    </div>
                    <span className="text-xs text-muted">{timeAgo(new Date(doc.createdAt))}</span>
                    <svg className="w-4 h-4 text-muted group-hover:text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Previous review notes (if reviewed) */}
          {caseData.riskScore != null && (
            <div className="card p-5">
              <h2 className="font-semibold text-sm text-ink mb-3 border-b border-border pb-2">İnceleme Sonucu</h2>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-2xl font-bold ${riskColor}`}>{caseData.riskScore}/100</span>
                <span className="text-sm text-muted">Risk Skoru</span>
              </div>
              {caseData.riskNotes && (
                <p className="text-sm text-ink/80 leading-relaxed">{caseData.riskNotes}</p>
              )}
              {caseData.lawyerNotes && (
                <p className="text-xs text-muted mt-2 italic">{caseData.lawyerNotes}</p>
              )}
            </div>
          )}
        </div>

        {/* Right — Review form */}
        <div className="space-y-4">
          {isUnderReview && (
            <div className="card p-5 space-y-4">
              <h2 className="font-semibold text-sm text-ink border-b border-border pb-2">İnceleme Sonucu Gir</h2>

              <div>
                <label className="text-xs font-medium text-muted block mb-2">Karar</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVerdict('approved')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      verdict === 'approved' ? 'border-green-500 bg-green-50 text-green-700' : 'border-border text-muted'
                    }`}
                  >
                    ✓ Onayla
                  </button>
                  <button
                    onClick={() => setVerdict('rejected')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      verdict === 'rejected' ? 'border-red-500 bg-red-50 text-red-700' : 'border-border text-muted'
                    }`}
                  >
                    ✗ Reddet
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">
                  Risk Skoru: <span className={`font-bold ${riskColor}`}>{riskScore}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={riskScore}
                  onChange={(e) => setRiskScore(Number(e.target.value))}
                  className="w-full accent-gold"
                />
                <div className="flex justify-between text-[10px] text-muted mt-1">
                  <span>0 Risksiz</span>
                  <span>100 Çok Riskli</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">Risk Notları *</label>
                <textarea
                  value={riskNotes}
                  onChange={(e) => setRiskNotes(e.target.value)}
                  rows={4}
                  className="input-base text-sm resize-none"
                  placeholder="Tespit edilen hukuki riskler ve öneriler..."
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">İç Notlar (opsiyonel)</label>
                <textarea
                  value={lawyerNotes}
                  onChange={(e) => setLawyerNotes(e.target.value)}
                  rows={2}
                  className="input-base text-sm resize-none"
                  placeholder="Sadece avukat notları..."
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">Hizmet Bedeli (TL)</label>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="input-base text-sm"
                  placeholder="0"
                />
              </div>

              <button
                onClick={submitReview}
                disabled={submitting}
                className="btn-primary w-full text-sm py-2.5"
              >
                {submitting ? 'Kaydediliyor...' : 'İncelemeyi Tamamla'}
              </button>
            </div>
          )}

          {/* Issue certificate (approved cases) */}
          {isApproved && (
            <div className="card p-5 space-y-3">
              <h2 className="font-semibold text-sm text-ink border-b border-border pb-2">Mülk Sertifikası</h2>
              <p className="text-xs text-muted leading-relaxed">
                Bu ilan onaylandı. 7fil Mülk Sertifikası düzenleyebilirsiniz.
                Sertifika 1 yıl geçerlidir ve QR kod ile doğrulanabilir.
              </p>
              <button
                onClick={issueCert}
                disabled={certLoading}
                className="w-full py-2.5 rounded-xl border border-gold text-gold text-sm font-medium hover:bg-gold/10 transition-colors disabled:opacity-50"
              >
                {certLoading ? 'Düzenleniyor...' : '🔏 Sertifika Düzenle'}
              </button>
            </div>
          )}

          {/* Quick actions */}
          <div className="card p-5 space-y-2">
            <h2 className="font-semibold text-sm text-ink border-b border-border pb-2">Hızlı Linkler</h2>
            <Link
              href={`/ilan/${caseData.listing.id}`}
              target="_blank"
              className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors py-1"
            >
              <span>🏠</span> İlan Sayfası
            </Link>
            <Link
              href="/panel/hukuk"
              className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors py-1"
            >
              <span>←</span> Tüm Davalar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
