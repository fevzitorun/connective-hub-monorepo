import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '../../components/Navbar'
import { Footer } from '../../components/Footer'

export const metadata: Metadata = {
  title: 'TicariMetre — Ticari Gayrimenkul Analitik Platformu | 7fil',
  description: 'Türkiye\'nin ilk ticari gayrimenkul analitik platformu. Kira getirisi, cap rate, ROI ve piyasa benchmark hesaplamalarını yapın.',
}

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Kira Getirisi Analizi',
    desc: 'Brüt ve net getiri, boşluk oranı, gider düşümü ile gerçekçi yatırım getirisi hesaplayın.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    title: 'Cap Rate Hesaplayıcı',
    desc: 'NOI hesabı, GRM ve piyasa referans cap rate\'e göre mülk değer karşılaştırması.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'ROI / IRR Analizi',
    desc: 'Cash-on-cash return, 10 yıllık projeksiyon, IRR hesabı ve çıkış değeri tahmini.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: 'Canlı Piyasa Verisi',
    desc: 'Şehir ve ilçe bazında m² fiyat ortalamaları, aktif ilan sayısı ve fiyat dağılımı.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: 'Karşılaştırılabilir İlanlar',
    desc: 'Aynı bölge ve özellikteki aktif ilanları inceleyin, fiyatlandırmanızı doğrulayın.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    ),
    title: 'Rapor Kaydetme',
    desc: 'Analizlerinizi kaydedin, PDF olarak dışa aktarın ve müşterilerinizle paylaşın.',
  },
]

const PROPERTY_TYPES = [
  { label: 'Ofis', count: '4.200+' },
  { label: 'Mağaza / Dükkan', count: '8.100+' },
  { label: 'Depo / Lojistik', count: '1.800+' },
  { label: 'Fabrika / Sanayi', count: '950+' },
  { label: 'Arsa', count: '12.000+' },
  { label: 'Otel / Apart', count: '620+' },
]

export default function TicariMetrePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 bg-cream min-h-screen">

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-semibold text-gold tracking-wide">TICARİMETRE™</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold text-ink mb-5 leading-tight">
            Ticari Gayrimenkulde
            <br />
            <span className="text-gold">Veri ile Karar Verin</span>
          </h1>
          <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Türkiye'nin ilk entegre ticari gayrimenkul analitik platformu.
            Gerçek piyasa verisiyle kira getirisi, cap rate ve yatırım ROI hesaplamaları yapın.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ticari/analiz" className="btn-primary text-base px-8 py-3.5">
              Analiz Aracını Kullan
            </Link>
            <Link href="/ara?propertyType=commercial" className="btn-outline text-base px-8 py-3.5">
              Ticari İlanları Gör
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-ink py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {[
                { label: 'Aktif Ticari İlan', value: '27,000+' },
                { label: 'Şehir', value: '81' },
                { label: 'Günlük Analiz', value: '1,200+' },
                { label: 'Veri Noktası', value: '2M+' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl font-bold text-gold">{s.value}</p>
                  <p className="text-white/50 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="font-display text-3xl font-bold text-ink text-center mb-3">
            Analiz Araçları
          </h2>
          <p className="text-muted text-center mb-12">Profesyonel yatırımcıların kullandığı metodoloji, herkes için erişilebilir.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 hover:border-gold/40 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Property type matrix */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-ink text-center mb-10">
              Hangi Mülk Tiplerini Kapsıyoruz?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {PROPERTY_TYPES.map((p) => (
                <div key={p.label} className="card p-4 text-center">
                  <p className="font-semibold text-ink text-sm">{p.label}</p>
                  <p className="text-gold text-xs mt-1">{p.count}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h2 className="font-display text-3xl font-bold text-ink mb-4">
            Analize Hemen Başlayın
          </h2>
          <p className="text-muted mb-8">Kayıt gerektirmez. Hesaplamalar anlık ve ücretsiz.</p>
          <Link href="/ticari/analiz" className="btn-primary text-base px-10 py-4">
            TicariMetre Analiz Aracı →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
