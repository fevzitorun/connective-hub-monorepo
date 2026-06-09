'use client'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '../../../store/auth'
import { panelApi, type PlanPricing, type DashboardStats } from '../../../lib/panel-api'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

const PLAN_LABELS: Record<string, string> = {
  free: 'Ücretsiz', pro: 'Pro', corporate: 'Kurumsal', enterprise: 'Enterprise',
}
const PLAN_ORDER = ['free', 'pro', 'corporate']

const MONTH_OPTIONS = [1, 3, 6, 12]
const MONTH_DISCOUNTS: Record<number, number> = { 1: 0, 3: 5, 6: 10, 12: 20 }

interface CheckoutData {
  orderId: string
  checkoutFormContent: string
  token: string
}

export default function PanelSubscription() {
  const searchParams = useSearchParams()
  const { accessToken } = useAuthStore()
  const [plans, setPlans] = useState<PlanPricing | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [selectedMonths, setSelectedMonths] = useState(1)
  const [initiating, setInitiating] = useState<string | null>(null)
  const [checkout, setCheckout] = useState<CheckoutData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const iframeRef = useRef<HTMLDivElement>(null)

  // Handle callback redirect params
  const odeme = searchParams.get('odeme')

  useEffect(() => {
    if (odeme === 'basarili') {
      setSuccessMsg('Ödeme başarıyla tamamlandı! Aboneliğiniz aktif edildi.')
    } else if (odeme === 'hata') {
      setError('Ödeme işlemi başarısız veya iptal edildi. Lütfen tekrar deneyin.')
    }
  }, [odeme])

  useEffect(() => {
    if (!accessToken) return
    Promise.all([
      panelApi.getPlans(accessToken).then(r => setPlans(r.data)).catch(() => null),
      panelApi.getStats(accessToken).then(r => setStats(r.data)).catch(() => null),
    ])
  }, [accessToken])

  // Inject İyzico checkout form content into iframe container
  useEffect(() => {
    if (!checkout || !iframeRef.current) return
    iframeRef.current.innerHTML = checkout.checkoutFormContent
    // İyzico injects a script — re-execute any script tags
    const scripts = iframeRef.current.querySelectorAll<HTMLScriptElement>('script')
    scripts.forEach((orig) => {
      const s = document.createElement('script')
      if (orig.src) s.src = orig.src
      else s.textContent = orig.textContent
      orig.parentNode?.replaceChild(s, orig)
    })
    // Scroll into view
    iframeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [checkout])

  async function handleSubscribe(plan: string) {
    if (!accessToken) return
    setError(null)
    setSuccessMsg(null)
    setInitiating(plan)
    setCheckout(null)
    try {
      const res = await fetch(`${BASE}/finance/payment/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ plan, months: selectedMonths }),
      })
      const json = await res.json() as { data?: CheckoutData; message?: string }
      if (!res.ok || !json.data) {
        setError((json as { message?: string }).message ?? 'Ödeme başlatılamadı.')
        return
      }
      setCheckout(json.data)
    } catch {
      setError('Sunucu hatası. Lütfen tekrar deneyin.')
    } finally {
      setInitiating(null)
    }
  }

  const currentPlan = stats?.plan ?? 'free'

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Abonelik</h1>
        <p className="text-sm text-muted mt-1">
          Mevcut plan: <span className="badge-gold ml-1">{PLAN_LABELS[currentPlan] ?? currentPlan}</span>
          {stats?.subscription?.endsAt && (
            <span className="ml-2 text-muted">
              · {new Date(stats.subscription.endsAt).toLocaleDateString('tr-TR')} tarihine kadar
            </span>
          )}
        </p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
      )}
      {successMsg && (
        <div className="mb-5 bg-teal/10 border border-teal/30 text-teal rounded-xl p-4 text-sm font-medium">{successMsg}</div>
      )}

      {/* Süre seçimi */}
      <div className="mb-6 flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted font-medium">Abonelik süresi:</span>
        {MONTH_OPTIONS.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonths(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              selectedMonths === m
                ? 'bg-ink text-white border-ink'
                : 'border-gray-200 text-muted hover:border-teal'
            }`}
          >
            {m} ay
            {MONTH_DISCOUNTS[m] ? (
              <span className="ml-1.5 text-xs text-gold font-semibold">-%{MONTH_DISCOUNTS[m]}</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Plan kartları */}
      {plans && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {PLAN_ORDER.map((planKey) => {
            const plan = plans[planKey]
            if (!plan) return null
            const isCurrent = currentPlan === planKey
            const isPro = planKey === 'pro'
            const discount = MONTH_DISCOUNTS[selectedMonths] ?? 0
            const discountedPrice = Math.round(plan.monthly * (1 - discount / 100))

            return (
              <div
                key={planKey}
                className={`card p-6 flex flex-col relative ${isPro ? 'border-gold ring-1 ring-gold/20' : ''} ${isCurrent ? 'bg-teal/5 border-teal' : ''}`}
              >
                {isPro && (
                  <span className="badge-gold self-start mb-3 text-xs">Önerilen</span>
                )}
                <h3 className="font-display text-xl font-bold text-ink">{PLAN_LABELS[planKey]}</h3>
                <div className="mt-2 mb-1">
                  {plan.monthly === 0 ? (
                    <span className="text-3xl font-bold text-ink">Ücretsiz</span>
                  ) : (
                    <>
                      {discount > 0 && (
                        <span className="text-sm text-muted line-through mr-1">
                          {plan.monthly.toLocaleString('tr-TR')}₺
                        </span>
                      )}
                      <span className="text-3xl font-bold text-ink">
                        {discountedPrice.toLocaleString('tr-TR')}₺
                      </span>
                      <span className="text-muted text-sm">/ay</span>
                    </>
                  )}
                </div>
                {selectedMonths > 1 && plan.monthly > 0 && (
                  <p className="text-xs text-teal font-medium mb-2">
                    Toplam: {(discountedPrice * selectedMonths).toLocaleString('tr-TR')}₺ ({selectedMonths} ay)
                  </p>
                )}
                <p className="text-xs text-muted mb-4">
                  {plan.maxListings === -1 ? 'Sınırsız ilan' : `${plan.maxListings} aktif ilan`}
                </p>

                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink/80">
                      <svg className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {isCurrent ? (
                    <div className="text-center text-sm text-teal font-medium py-2">
                      ✓ Mevcut Planınız
                    </div>
                  ) : planKey === 'free' ? (
                    <div className="text-center text-xs text-muted py-2">Ücretsiz plan ödeme gerektirmez</div>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(planKey)}
                      disabled={initiating === planKey}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 ${
                        isPro ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      {initiating === planKey ? 'Yönlendiriliyor...' : `${PLAN_LABELS[planKey]}'a Geç`}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* İyzico Checkout Form */}
      {checkout && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-ink">Ödeme</h2>
            <button
              onClick={() => setCheckout(null)}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              İptal
            </button>
          </div>
          <div className="card p-0 overflow-hidden">
            <div ref={iframeRef} className="w-full min-h-[500px]" />
          </div>
        </div>
      )}

      {/* Güvenlik notu */}
      <div className="bg-ink/5 rounded-xl p-5 text-sm text-muted">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="font-semibold text-ink mb-1">Güvenli Ödeme</p>
            <p>
              Tüm ödemeler <strong>İyzico</strong> altyapısıyla 3D Secure korumalı olarak gerçekleştirilir.
              Kart bilgileriniz 7fil sunucularında saklanmaz. Dilediğiniz zaman iptal edebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
