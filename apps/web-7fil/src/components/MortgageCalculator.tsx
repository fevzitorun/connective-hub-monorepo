'use client'
import { useState } from 'react'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

type LoanType = 'conventional' | 'islamic'
type PropertyType = 'residential' | 'commercial' | 'land'

interface CalcResult {
  loanType: LoanType
  loanAmount: number
  monthlyPayment: number
  totalPayment: number
  totalInterest?: number
  totalProfit?: number
  ltvRatio: number
  annualInterestRate?: number
  profitRate?: number
  loanTermYears: number
  schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[]
}

interface Props {
  defaultPrice?: number
  defaultCity?: string
  listingId?: string
  propertyType?: PropertyType
  compact?: boolean
}

const BDDK_LTV: Record<string, number> = {
  first_residential: 80,
  other_residential: 60,
  commercial: 50,
  land: 50,
}

export function MortgageCalculator({ defaultPrice, defaultCity, listingId, propertyType = 'residential', compact = false }: Props) {
  const [loanType, setLoanType] = useState<LoanType>('conventional')
  const [price, setPrice] = useState(defaultPrice ?? 5_000_000)
  const [downPct, setDownPct] = useState(20)
  const [term, setTerm] = useState(120)
  const [rate, setRate] = useState(loanType === 'islamic' ? 3.5 : 4.5)
  const [isFirstHome, setIsFirstHome] = useState(true)
  const [result, setResult] = useState<CalcResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Lead form
  const [showLead, setShowLead] = useState(false)
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [leadSent, setLeadSent] = useState(false)

  const downPayment = Math.round(price * (downPct / 100))
  const loanAmount = price - downPayment
  const maxLtv = propertyType === 'commercial' || propertyType === 'land'
    ? 50
    : (isFirstHome ? 80 : 60)

  async function calculate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE}/finance/mortgage/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyPrice: price,
          downPayment,
          loanTermYears: Math.floor(term / 12),
          annualInterestRate: rate,
          isFirstHome,
          propertyType: propertyType === 'land' ? 'land' : propertyType,
          loanType,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? 'Hesaplama hatası')
      setResult(json.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hesaplama başarısız')
    } finally {
      setLoading(false)
    }
  }

  async function submitLead() {
    if (!result || !leadName || !leadPhone || !leadEmail) return
    try {
      await fetch(`${BASE}/finance/mortgage/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          loanType: result.loanType,
          propertyPrice: price,
          downPayment,
          loanAmount: result.loanAmount,
          loanTermYears: result.loanTermYears,
          interestRate: rate,
          monthlyPayment: result.monthlyPayment,
          ltvRatio: result.ltvRatio,
          contactName: leadName,
          contactPhone: leadPhone,
          contactEmail: leadEmail,
          city: defaultCity,
          propertyType,
          isFirstHome,
        }),
      })
      setLeadSent(true)
      setShowLead(false)
    } catch {
      /* silent */
    }
  }

  return (
    <div className={`card ${compact ? 'p-4' : 'p-6'}`}>
      {!compact && (
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-ink text-sm">Konut Kredisi Hesaplayıcı</h3>
            <p className="text-xs text-muted">BDDK limitli · Konvansiyonel ve Katılım Bankacılığı</p>
          </div>
        </div>
      )}

      {/* Loan type toggle */}
      <div className="flex rounded-lg border border-border p-0.5 mb-4 gap-0.5">
        {(['conventional', 'islamic'] as LoanType[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setLoanType(t)
              setRate(t === 'islamic' ? 3.5 : 4.5)
              setResult(null)
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              loanType === t ? 'bg-teal text-white' : 'text-muted hover:text-ink'
            }`}
          >
            {t === 'conventional' ? 'Konvansiyonel' : 'Katılım (İslami)'}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs text-muted block mb-1">Mülk Değeri</label>
          <div className="relative">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="input text-sm w-full pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">TRY</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-muted">Peşinat Oranı</label>
            <span className="text-xs font-semibold text-ink">%{downPct} · {downPayment.toLocaleString('tr-TR')} TRY</span>
          </div>
          <input
            type="range" min={0} max={100} step={5} value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            className="w-full accent-teal"
          />
          <div className="flex justify-between text-[10px] text-muted mt-0.5">
            <span>%0</span>
            <span className="text-gold font-medium">BDDK maks: %{100 - maxLtv}</span>
            <span>%100</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted block mb-1">Vade (Ay)</label>
            <select value={term} onChange={(e) => setTerm(Number(e.target.value))} className="input text-sm w-full">
              {[36, 60, 84, 120, 180, 240].map((m) => (
                <option key={m} value={m}>{m} ay ({m / 12} yıl)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">
              {loanType === 'islamic' ? 'Kâr Payı Oranı (%)' : 'Faiz Oranı (Yıllık %)'}
            </label>
            <input
              type="number" step={0.1} min={0} max={50} value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="input text-sm w-full"
            />
          </div>
        </div>

        {propertyType === 'residential' && (
          <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
            <input
              type="checkbox" checked={isFirstHome}
              onChange={(e) => setIsFirstHome(e.target.checked)}
              className="accent-teal"
            />
            İlk konut (BDDK LTV %80 avantajı)
          </label>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-xs mb-4">
          {error}
        </div>
      )}

      <button
        onClick={calculate}
        disabled={loading || loanAmount <= 0}
        className="btn-primary w-full text-sm py-2.5 mb-4"
      >
        {loading ? 'Hesaplanıyor...' : 'Hesapla'}
      </button>

      {/* Result */}
      {result && (
        <div className="space-y-3">
          <div className="bg-teal/5 border border-teal/20 rounded-xl p-4">
            <p className="text-xs text-muted mb-1">Aylık Taksit</p>
            <p className="text-3xl font-bold text-teal">
              {result.monthlyPayment.toLocaleString('tr-TR')} <span className="text-base font-normal">TRY</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-cream rounded-lg p-3">
              <p className="text-[10px] text-muted">Kredi Tutarı</p>
              <p className="text-xs font-bold text-ink mt-0.5">
                {result.loanAmount.toLocaleString('tr-TR')}
              </p>
            </div>
            <div className="bg-cream rounded-lg p-3">
              <p className="text-[10px] text-muted">Toplam Ödeme</p>
              <p className="text-xs font-bold text-ink mt-0.5">
                {result.totalPayment.toLocaleString('tr-TR')}
              </p>
            </div>
            <div className="bg-cream rounded-lg p-3">
              <p className="text-[10px] text-muted">{result.loanType === 'islamic' ? 'Toplam Kâr' : 'Toplam Faiz'}</p>
              <p className="text-xs font-bold text-gold mt-0.5">
                {(result.totalInterest ?? result.totalProfit ?? 0).toLocaleString('tr-TR')}
              </p>
            </div>
          </div>

          <div className="text-xs text-muted/60 bg-gold/5 border border-gold/20 rounded-lg p-2.5">
            LTV: %{result.ltvRatio} · BDDK maks: %{maxLtv} ·{' '}
            {result.loanType === 'islamic' ? 'Murabaha (kâr payı)' : 'Anapara + faiz'}
          </div>

          {/* Amortization preview */}
          {result.schedule.length > 0 && (
            <details className="text-xs">
              <summary className="cursor-pointer text-muted hover:text-ink py-1">Ödeme Planı Önizleme</summary>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="text-muted border-b border-border">
                      <th className="text-left py-1">Ay</th>
                      <th className="text-right py-1">Taksit</th>
                      <th className="text-right py-1">Anapara</th>
                      <th className="text-right py-1">Faiz</th>
                      <th className="text-right py-1">Kalan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.slice(0, 3).map((row) => (
                      <tr key={row.month} className="border-b border-border/50">
                        <td className="py-1">{row.month}</td>
                        <td className="text-right py-1">{row.payment.toLocaleString('tr-TR')}</td>
                        <td className="text-right py-1">{row.principal.toLocaleString('tr-TR')}</td>
                        <td className="text-right py-1 text-gold">{row.interest.toLocaleString('tr-TR')}</td>
                        <td className="text-right py-1">{row.balance.toLocaleString('tr-TR')}</td>
                      </tr>
                    ))}
                    {result.schedule.length > 3 && (
                      <tr key="dots"><td colSpan={5} className="text-center text-muted py-1">···</td></tr>
                    )}
                    {result.schedule.slice(3).map((row) => (
                      <tr key={row.month} className="border-b border-border/50">
                        <td className="py-1">{row.month}</td>
                        <td className="text-right py-1">{row.payment.toLocaleString('tr-TR')}</td>
                        <td className="text-right py-1">{row.principal.toLocaleString('tr-TR')}</td>
                        <td className="text-right py-1 text-gold">{row.interest.toLocaleString('tr-TR')}</td>
                        <td className="text-right py-1">{row.balance.toLocaleString('tr-TR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}

          {/* Bank lead CTA */}
          {!leadSent ? (
            <div className="border-t border-border pt-3 mt-3">
              {!showLead ? (
                <button
                  onClick={() => setShowLead(true)}
                  className="w-full text-xs text-teal hover:text-gold transition-colors py-1.5 font-medium"
                >
                  Banka teklifleri al — ücretsiz →
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted font-medium">Banka temsilcisi sizi arasın</p>
                  <input placeholder="Ad Soyad" value={leadName} onChange={(e) => setLeadName(e.target.value)} className="input text-xs w-full" />
                  <input placeholder="Telefon" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} className="input text-xs w-full" />
                  <input placeholder="E-posta" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} className="input text-xs w-full" />
                  <div className="flex gap-2">
                    <button onClick={submitLead} className="btn-primary flex-1 text-xs py-2">Gönder</button>
                    <button onClick={() => setShowLead(false)} className="btn-outline flex-1 text-xs py-2">İptal</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-teal/10 text-teal text-xs rounded-lg p-3 text-center">
              Başvurunuz alındı. Banka temsilcisi yakında iletişime geçecek.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
