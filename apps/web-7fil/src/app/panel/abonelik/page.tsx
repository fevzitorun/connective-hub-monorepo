'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../store/auth'
import { panelApi, type PlanPricing, type DashboardStats } from '../../../lib/panel-api'

const PLAN_LABELS: Record<string, string> = { free: 'Ücretsiz', pro: 'Pro', corporate: 'Kurumsal' }
const PLAN_ORDER = ['free', 'pro', 'corporate']

export default function PanelSubscription() {
  const { accessToken } = useAuthStore()
  const [plans, setPlans] = useState<PlanPricing | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) return
    Promise.all([
      panelApi.getPlans(accessToken).then(r => setPlans(r.data)).catch(() => null),
      panelApi.getStats(accessToken).then(r => setStats(r.data)).catch(() => null),
    ])
  }, [accessToken])

  async function handleSubscribe(plan: string) {
    if (!accessToken) return
    setSubscribing(plan)
    setError(null)
    setSuccess(null)
    try {
      await panelApi.subscribe(accessToken, plan)
      setSuccess(`${PLAN_LABELS[plan]} planına geçiş yapıldı.`)
      panelApi.getStats(accessToken).then(r => setStats(r.data)).catch(() => null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Abonelik başarısız')
    } finally {
      setSubscribing(null)
    }
  }

  const currentPlan = stats?.plan ?? 'free'

  return (
    <div className="p-8">
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

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}
      {success && <div className="mb-4 bg-teal/10 border border-teal/30 text-teal rounded-xl p-4 text-sm">{success}</div>}

      {/* Plan kartları */}
      {plans && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {PLAN_ORDER.map((planKey) => {
            const plan = plans[planKey]
            if (!plan) return null
            const isCurrent = currentPlan === planKey
            const isPro = planKey === 'pro'

            return (
              <div
                key={planKey}
                className={`card p-6 flex flex-col ${isPro ? 'border-gold ring-1 ring-gold/20' : ''} ${isCurrent ? 'bg-teal/5 border-teal' : ''}`}
              >
                {isPro && (
                  <span className="badge-gold self-start mb-3 text-xs">Önerilen</span>
                )}
                <h3 className="font-display text-xl font-bold text-ink">{PLAN_LABELS[planKey]}</h3>
                <div className="mt-2 mb-4">
                  {plan.monthly === 0 ? (
                    <span className="text-3xl font-bold text-ink">Ücretsiz</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-ink">
                        {plan.monthly.toLocaleString('tr-TR')}₺
                      </span>
                      <span className="text-muted text-sm">/ay</span>
                    </>
                  )}
                </div>
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
                  ) : (
                    <button
                      onClick={() => handleSubscribe(planKey)}
                      disabled={subscribing === planKey}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        isPro ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      {subscribing === planKey ? 'İşleniyor...' : `${PLAN_LABELS[planKey]}&apos;a Geç`}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Iyzico notu */}
      <div className="bg-ink/5 rounded-xl p-5 text-sm text-muted">
        <p className="font-semibold text-ink mb-1">Ödeme Güvenliği</p>
        <p>
          Ödeme işlemleri <strong>Iyzico</strong> güvencesiyle gerçekleştirilir. Kart bilgileriniz
          7fil sunucularında saklanmaz. İlk ay ücretsiz deneme, dilediğiniz zaman iptal.
        </p>
        <p className="mt-2 text-xs">Ödeme entegrasyonu yakında aktif edilecek (Beta aşaması).</p>
      </div>
    </div>
  )
}
