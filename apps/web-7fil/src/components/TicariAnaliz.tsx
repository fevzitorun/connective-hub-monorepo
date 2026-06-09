'use client'
import { useState } from 'react'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

type Tab = 'yield' | 'caprate' | 'roi'

interface YieldResult {
  grossYield: number; netYield: number
  annualRent: number; effectiveRent: number
  netAnnualIncome: number; monthlyNetIncome: number
  monthsToBreakeven: number; yearsToBreakeven: number
  yieldRating: string; priceToRentRatio: number
}

interface CapRateResult {
  grossOperatingIncome: number; netOperatingIncome: number
  capRate: number; grm: number
  impliedValueAtMarket: number; valueDelta: number; rating: string
}

interface RoiResult {
  downPayment: number; acquisitionCost: number; totalEquityInvested: number
  monthlyNetCashflow: number; annualNetCashflow: number
  cocReturn: number; exitValue: number; capitalGain: number
  irr: number | null; totalReturn: number; holdYears: number
  monthlyMortgage: number
  yearlyProjection: { year: number; propertyValue: number; cumulativeCashflow: number; unrealizedGain: number; totalWealth: number }[]
}

const RATING_STYLE: Record<string, string> = {
  excellent: 'text-green-600 bg-green-50',
  good: 'text-teal bg-teal/10',
  average: 'text-gold bg-gold/10',
  below_average: 'text-red-500 bg-red-50',
}

const RATING_LABEL: Record<string, string> = {
  excellent: 'Mükemmel', good: 'İyi', average: 'Ortalama', below_average: 'Ortalamanın Altı',
}

export function TicariAnaliz() {
  const [tab, setTab] = useState<Tab>('yield')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Yield inputs
  const [purchasePrice, setPurchasePrice] = useState(10_000_000)
  const [monthlyRent, setMonthlyRent] = useState(50_000)
  const [annualExpenses, setAnnualExpenses] = useState(30_000)
  const [vacancyRate, setVacancyRate] = useState(5)
  const [acquisitionCosts, setAcquisitionCosts] = useState(0)

  // Cap rate inputs (reuse purchase + rent + add opex)
  const [annualOpEx, setAnnualOpEx] = useState(60_000)

  // ROI inputs
  const [downPct, setDownPct] = useState(30)
  const [appreciation, setAppreciation] = useState(10)
  const [holdYears, setHoldYears] = useState(10)
  const [loanRate, setLoanRate] = useState(0)

  const [yieldResult, setYieldResult] = useState<YieldResult | null>(null)
  const [capResult, setCapResult] = useState<CapRateResult | null>(null)
  const [roiResult, setRoiResult] = useState<RoiResult | null>(null)

  async function calculate() {
    setLoading(true)
    setError(null)
    try {
      if (tab === 'yield') {
        const res = await fetch(`${BASE}/ticari/yield`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ purchasePrice, monthlyRent, annualExpenses, vacancyRate, acquisitionCosts }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message ?? 'Hata')
        setYieldResult(json.data)
      } else if (tab === 'caprate') {
        const res = await fetch(`${BASE}/ticari/caprate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyValue: purchasePrice, monthlyRent, annualOpEx }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message ?? 'Hata')
        setCapResult(json.data)
      } else {
        const res = await fetch(`${BASE}/ticari/roi`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            purchasePrice, downPaymentPct: downPct, monthlyRent, annualExpenses,
            annualAppreciation: appreciation, holdYears, loanInterestRate: loanRate,
          }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message ?? 'Hata')
        setRoiResult(json.data)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hesaplama başarısız')
    } finally {
      setLoading(false)
    }
  }

  const fmt = (n: number) => n.toLocaleString('tr-TR')

  const TABS: { key: Tab; label: string }[] = [
    { key: 'yield', label: 'Kira Getirisi' },
    { key: 'caprate', label: 'Cap Rate' },
    { key: 'roi', label: 'Yatırım ROI' },
  ]

  return (
    <div className="card p-6">
      {/* Tab switcher */}
      <div className="flex rounded-xl border border-border p-1 gap-1 mb-6 bg-cream">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setError(null) }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === t.key ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Shared inputs */}
      <div className="space-y-3 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted block mb-1">Mülk Değeri (TRY)</label>
            <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} className="input text-sm w-full" />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Aylık Kira (TRY)</label>
            <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value))} className="input text-sm w-full" />
          </div>
        </div>

        {/* Yield-specific */}
        {tab === 'yield' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted block mb-1">Yıllık Gider (TRY)</label>
              <input type="number" value={annualExpenses} onChange={(e) => setAnnualExpenses(Number(e.target.value))} className="input text-sm w-full" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Boşluk Oranı (%)</label>
              <input type="number" min={0} max={50} value={vacancyRate} onChange={(e) => setVacancyRate(Number(e.target.value))} className="input text-sm w-full" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Edinim Maliyeti (TRY)</label>
              <input type="number" value={acquisitionCosts} onChange={(e) => setAcquisitionCosts(Number(e.target.value))} className="input text-sm w-full" />
            </div>
          </div>
        )}

        {/* Cap rate-specific */}
        {tab === 'caprate' && (
          <div>
            <label className="text-xs text-muted block mb-1">Yıllık İşletme Gideri (TRY)</label>
            <input type="number" value={annualOpEx} onChange={(e) => setAnnualOpEx(Number(e.target.value))} className="input text-sm w-full" />
          </div>
        )}

        {/* ROI-specific */}
        {tab === 'roi' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-muted block mb-1">Peşinat (%)</label>
              <input type="number" min={0} max={100} value={downPct} onChange={(e) => setDownPct(Number(e.target.value))} className="input text-sm w-full" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Yıllık Gider (TRY)</label>
              <input type="number" value={annualExpenses} onChange={(e) => setAnnualExpenses(Number(e.target.value))} className="input text-sm w-full" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Değer Artışı (%/yıl)</label>
              <input type="number" step={0.5} value={appreciation} onChange={(e) => setAppreciation(Number(e.target.value))} className="input text-sm w-full" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Elde Tutma Yılı</label>
              <select value={holdYears} onChange={(e) => setHoldYears(Number(e.target.value))} className="input text-sm w-full">
                {[3,5,7,10,15,20].map((y) => <option key={y} value={y}>{y} yıl</option>)}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-4">
              <label className="text-xs text-muted block mb-1">Kredi Faiz Oranı (%/yıl) — 0 = nakit alım</label>
              <input type="number" step={0.1} min={0} value={loanRate} onChange={(e) => setLoanRate(Number(e.target.value))} className="input text-sm w-full sm:w-48" />
            </div>
          </div>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-xs mb-4">{error}</div>}

      <button onClick={calculate} disabled={loading} className="btn-primary w-full py-2.5 text-sm mb-6">
        {loading ? 'Hesaplanıyor...' : 'Hesapla'}
      </button>

      {/* ── Yield Result ── */}
      {tab === 'yield' && yieldResult && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4 text-center">
              <p className="text-xs text-muted">Brüt Getiri</p>
              <p className="text-3xl font-bold text-ink mt-1">%{yieldResult.grossYield}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xs text-muted">Net Getiri</p>
              <p className="text-3xl font-bold text-teal mt-1">%{yieldResult.netYield}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block font-medium ${RATING_STYLE[yieldResult.yieldRating] ?? ''}`}>
                {RATING_LABEL[yieldResult.yieldRating]}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Yıllık Kira', value: fmt(yieldResult.annualRent) + ' ₺' },
              { label: 'Efektif Kira', value: fmt(yieldResult.effectiveRent) + ' ₺' },
              { label: 'Net Yıllık Gelir', value: fmt(yieldResult.netAnnualIncome) + ' ₺' },
              { label: 'Aylık Net Gelir', value: fmt(yieldResult.monthlyNetIncome) + ' ₺' },
              { label: 'Başabaş Süresi', value: `${yieldResult.yearsToBreakeven} yıl` },
              { label: 'F/K Oranı', value: `${yieldResult.priceToRentRatio}×` },
            ].map((s) => (
              <div key={s.label} className="bg-cream rounded-lg p-3">
                <p className="text-[10px] text-muted">{s.label}</p>
                <p className="text-sm font-semibold text-ink mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Cap Rate Result ── */}
      {tab === 'caprate' && capResult && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4 text-center">
              <p className="text-xs text-muted">Cap Rate</p>
              <p className="text-3xl font-bold text-teal mt-1">%{capResult.capRate}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block font-medium ${RATING_STYLE[capResult.rating] ?? ''}`}>
                {RATING_LABEL[capResult.rating]}
              </span>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xs text-muted">GRM (Gross Rent Multiplier)</p>
              <p className="text-3xl font-bold text-ink mt-1">{capResult.grm}×</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Brüt Faaliyet Geliri', value: fmt(capResult.grossOperatingIncome) + ' ₺' },
              { label: 'Net Faaliyet Geliri (NOI)', value: fmt(capResult.netOperatingIncome) + ' ₺' },
              { label: 'Piyasa Cap Rate %6\'ya Göre Değer', value: fmt(capResult.impliedValueAtMarket) + ' ₺' },
              { label: 'Fiyat Farkı', value: (capResult.valueDelta >= 0 ? '+' : '') + fmt(capResult.valueDelta) + ' ₺', highlight: capResult.valueDelta >= 0 ? 'text-green-600' : 'text-red-500' },
            ].map((s) => (
              <div key={s.label} className="bg-cream rounded-lg p-3">
                <p className="text-[10px] text-muted">{s.label}</p>
                <p className={`text-sm font-semibold mt-0.5 ${'highlight' in s ? s.highlight : 'text-ink'}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted/60 text-center">Referans piyasa cap rate: %6 (Türkiye ticari ortalama)</p>
        </div>
      )}

      {/* ── ROI Result ── */}
      {tab === 'roi' && roiResult && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card p-4 text-center">
              <p className="text-xs text-muted">Cash-on-Cash</p>
              <p className="text-2xl font-bold text-teal mt-1">%{roiResult.cocReturn}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xs text-muted">IRR ({roiResult.holdYears} yıl)</p>
              <p className="text-2xl font-bold text-ink mt-1">
                {roiResult.irr !== null ? `%${roiResult.irr}` : 'N/A'}
              </p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xs text-muted">Toplam Getiri</p>
              <p className="text-2xl font-bold text-gold mt-1">%{roiResult.totalReturn}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xs text-muted">Aylık Net Akış</p>
              <p className={`text-2xl font-bold mt-1 ${roiResult.monthlyNetCashflow >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {fmt(roiResult.monthlyNetCashflow)} ₺
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Toplam Sermaye', value: fmt(roiResult.totalEquityInvested) + ' ₺' },
              { label: 'Çıkış Değeri', value: fmt(roiResult.exitValue) + ' ₺' },
              { label: 'Sermaye Kazancı', value: fmt(roiResult.capitalGain) + ' ₺' },
              { label: 'Peşinat', value: fmt(roiResult.downPayment) + ' ₺' },
              { label: 'Edinim Maliyeti', value: fmt(roiResult.acquisitionCost) + ' ₺' },
              ...(roiResult.monthlyMortgage > 0 ? [{ label: 'Aylık Taksit', value: fmt(roiResult.monthlyMortgage) + ' ₺' }] : []),
            ].map((s) => (
              <div key={s.label} className="bg-cream rounded-lg p-3">
                <p className="text-[10px] text-muted">{s.label}</p>
                <p className="text-sm font-semibold text-ink mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Projection table */}
          <details open>
            <summary className="cursor-pointer text-xs text-muted hover:text-ink py-1 font-medium">
              Yıllık Projeksiyon ({roiResult.holdYears} yıl)
            </summary>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-muted border-b border-border">
                    <th className="text-left py-1.5">Yıl</th>
                    <th className="text-right py-1.5">Mülk Değeri</th>
                    <th className="text-right py-1.5">Kümülatif Akış</th>
                    <th className="text-right py-1.5">Latent Kazanç</th>
                    <th className="text-right py-1.5">Toplam Servet</th>
                  </tr>
                </thead>
                <tbody>
                  {roiResult.yearlyProjection.map((row) => (
                    <tr key={row.year} className="border-b border-border/40 hover:bg-cream/50">
                      <td className="py-1.5 font-medium">{row.year}</td>
                      <td className="text-right py-1.5">{fmt(row.propertyValue)}</td>
                      <td className={`text-right py-1.5 ${row.cumulativeCashflow >= 0 ? 'text-teal' : 'text-red-500'}`}>{fmt(row.cumulativeCashflow)}</td>
                      <td className="text-right py-1.5 text-gold">{fmt(row.unrealizedGain)}</td>
                      <td className="text-right py-1.5 font-bold text-ink">{fmt(row.totalWealth)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}
