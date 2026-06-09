'use client'

const SAAS_PLANS = [
  { name: 'Ücretsiz',  price: 0,    agencies: '—', rev_share: '—',   color: 'bg-stone-100' },
  { name: 'Pro',       price: 990,  agencies: '—', rev_share: '—',   color: 'bg-blue-100' },
  { name: 'Kurumsal',  price: 2490, agencies: '—', rev_share: '—',   color: 'bg-gold/30' },
  { name: 'Enterprise',price: 5990, agencies: '—', rev_share: '—',   color: 'bg-ink/10' },
]

export default function FinansPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-ink">Finans & Gelir</h1>
        <p className="text-ink/60 mt-1">SaaS abonelik gelirleri, boost satışları ve komisyon paylaşımı</p>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Aylık Tekrarlayan Gelir',  value: '—₺',  sub: 'MRR', icon: '💰' },
          { label: 'Boost Gelirleri',           value: '—₺',  sub: 'Bu ay', icon: '🚀' },
          { label: 'MLS Komisyon',              value: '—₺',  sub: 'Bu ay', icon: '🤝' },
          { label: 'Toplam Gelir Hedefi',       value: '179.300₺', sub: 'Pilot (100 acenta)', icon: '🎯' },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{c.icon}</span>
              <p className="text-sm text-ink/50">{c.label}</p>
            </div>
            <p className="text-2xl font-bold text-ink">{c.value}</p>
            <p className="text-xs text-ink/30 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* SaaS Plan tablosu */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-ink">SaaS Paket Yönetimi</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-stone-50">
            <tr>
              {['Plan', 'Aylık Fiyat', 'Abone Sayısı', 'MRR', 'Rev Share'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink/50 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {SAAS_PLANS.map((plan) => (
              <tr key={plan.name} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3">
                  <span className={`inline-block text-sm font-bold px-3 py-1 rounded-lg ${plan.color}`}>
                    {plan.name}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-ink">
                  {plan.price === 0 ? 'Ücretsiz' : `${plan.price.toLocaleString('tr-TR')} ₺`}
                </td>
                <td className="px-4 py-3 text-ink/60">{plan.agencies}</td>
                <td className="px-4 py-3 font-semibold text-green-600">—₺</td>
                <td className="px-4 py-3 text-ink/60">{plan.rev_share}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gelir projeksiyonu */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
        <h2 className="font-semibold text-ink mb-4">Pilot Gelir Projeksiyonu (100 Acenta)</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'SaaS Abonelik',    target: '99.000₺',  note: '10 ücretsiz + 60 Pro + 25 Kurumsal + 5 Enterprise' },
            { label: 'Boost / Reklam',   target: '40.500₺',  note: '450 boost/ay × ort. 90₺' },
            { label: 'MLS Komisyon',     target: '39.800₺',  note: '20 kapanan deal × ort. 1.990₺ pay' },
          ].map((item) => (
            <div key={item.label} className="border border-stone-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-ink">{item.label}</p>
              <p className="text-2xl font-bold text-gold mt-2">{item.target}</p>
              <p className="text-xs text-ink/40 mt-2">{item.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-ink text-white rounded-xl p-4 flex items-center justify-between">
          <span className="font-semibold">Toplam Aylık Hedef</span>
          <span className="text-2xl font-bold text-gold">~179.300 ₺ / ay</span>
        </div>
        <p className="text-xs text-ink/30 mt-3 text-center">
          Yıllık projeksiyon: ~2.15M ₺ · Tam kapasite (1000 acenta): ~1.79M ₺ / ay
        </p>
      </div>
    </div>
  )
}
