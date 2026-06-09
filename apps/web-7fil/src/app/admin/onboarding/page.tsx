'use client'

const ONBOARDING_STEPS = [
  { id: 1, step: 'Magic Link ile Kayıt',       desc: 'E-posta doğrulama, şifresiz giriş',           status: 'done',    points: 100 },
  { id: 2, step: 'Profil Tamamlama',           desc: 'Acenta bilgileri, logo yükleme',              status: 'done',    points: 200 },
  { id: 3, step: 'İlk İlan',                   desc: 'Fotoğraflı ilk ilan yayınlama',               status: 'done',    points: 300 },
  { id: 4, step: 'MLS Aktivasyonu',            desc: 'MLS havuzuna ilk erişim',                     status: 'planned', points: 200 },
  { id: 5, step: 'WhatsApp Entegrasyonu',      desc: 'WA Business deep link kurulumu',              status: 'planned', points: 150 },
  { id: 6, step: 'Subdomain Aktivasyonu',      desc: 'acenta.7fil.com.tr subdomain kurulumu',       status: 'planned', points: 250 },
  { id: 7, step: 'İlk Müzayede İlanı',         desc: 'Müzayede modülüne katılım',                   status: 'planned', points: 200 },
  { id: 8, step: 'Kurucu Rozeti',              desc: '1000 puan = Kurucu Üye rozeti',               status: 'planned', points: 0 },
]

const STATUS_COLORS: Record<string, string> = {
  done:    'bg-green-100 text-green-700',
  planned: 'bg-stone-100 text-stone-500',
}

export default function OnboardingPage() {
  const totalPoints = ONBOARDING_STEPS.reduce((s, st) => s + st.points, 0)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-ink">Onboarding Yönetimi</h1>
        <p className="text-ink/60 mt-1">Acenta kayıt süreci, gamification ve Kurucu rozeti sistemi</p>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Toplam Adım',    value: ONBOARDING_STEPS.length, icon: '📋' },
          { label: 'Kazanılabilir Puan', value: totalPoints,         icon: '⭐' },
          { label: 'Kayıtlı Acenta', value: '—',                    icon: '🏢' },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex items-center gap-4">
            <span className="text-3xl">{c.icon}</span>
            <div>
              <p className="text-sm text-ink/50">{c.label}</p>
              <p className="text-3xl font-bold text-ink">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Adımlar */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold text-ink">Onboarding Akışı</h2>
          <button className="text-sm text-gold font-medium hover:underline">Düzenle</button>
        </div>
        <div className="divide-y divide-stone-100">
          {ONBOARDING_STEPS.map((step) => (
            <div key={step.id} className="px-6 py-4 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                step.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-400'
              }`}>
                {step.status === 'done' ? '✓' : step.id}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-ink">{step.step}</p>
                <p className="text-xs text-ink/50 mt-0.5">{step.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                {step.points > 0 && (
                  <span className="text-xs font-semibold text-gold bg-gold/10 px-2 py-1 rounded-lg">
                    +{step.points} puan
                  </span>
                )}
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[step.status]}`}>
                  {step.status === 'done' ? 'Hazır' : 'Planlandı'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kurucu rozeti */}
      <div className="bg-ink rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-3xl">
            🏆
          </div>
          <div>
            <h2 className="text-xl font-bold">Kurucu Üye Rozeti</h2>
            <p className="text-white/60 text-sm">7fil'in ilk 100 acentasına özel</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Gerekli Puan',    value: '1.000+' },
            { label: 'Maksimum Rozetli', value: '100 acenta' },
            { label: 'Avantajlar',      value: 'Ömür boyu %20 indirim' },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 rounded-xl p-4">
              <p className="text-xs text-white/50">{item.label}</p>
              <p className="font-bold text-white mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
