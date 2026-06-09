import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '../../../components/Navbar'
import { Footer } from '../../../components/Footer'
import { TicariAnaliz } from '../../../components/TicariAnaliz'
import { TicariPiyasa } from '../../../components/TicariPiyasa'

export const metadata: Metadata = {
  title: 'TicariMetre Analiz Aracı | 7fil',
  description: 'Kira getirisi, cap rate ve ROI hesaplamalarını yapın. Canlı piyasa verisi ile ticari gayrimenkul analizi.',
}

export default function TicariAnalizPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

          {/* Header */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link href="/ticari" className="text-xs text-muted hover:text-ink transition-colors">TicariMetre</Link>
                <span className="text-muted/40">/</span>
                <span className="text-xs text-ink">Analiz Aracı</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                Ticari Gayrimenkul Analizi
              </h1>
              <p className="text-muted text-sm mt-1">
                Kira getirisi · Cap rate · ROI · Piyasa benchmark
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[11px] font-semibold text-gold tracking-wide">TICARİMETRE™</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

            {/* Left — Analysis tools (3 col) */}
            <div className="xl:col-span-3 space-y-6">
              <div>
                <h2 className="font-semibold text-ink text-sm mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-teal/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </span>
                  Yatırım Hesaplayıcılar
                </h2>
                <TicariAnaliz />
              </div>

              {/* Methodology box */}
              <div className="card p-5 bg-ink text-white/80 text-xs">
                <p className="font-semibold text-white mb-2 text-sm">Metodoloji Notları</p>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li><strong className="text-white">Brüt Getiri</strong> = Yıllık Kira / Satış Fiyatı × 100</li>
                  <li><strong className="text-white">Net Getiri</strong> = (Efektif Kira − Giderler) / Toplam Yatırım × 100</li>
                  <li><strong className="text-white">Cap Rate</strong> = NOI / Mülk Değeri × 100 (finansman harici)</li>
                  <li><strong className="text-white">Cash-on-Cash</strong> = Yıllık Net Akış / Yatırılan Sermaye × 100</li>
                  <li><strong className="text-white">IRR</strong> Newton-Raphson yakınsama ile hesaplanır</li>
                  <li>Türkiye ticari referans cap rate: %5–8 aralığı (2024)</li>
                </ul>
              </div>
            </div>

            {/* Right — Market data (2 col) */}
            <div className="xl:col-span-2 space-y-6">
              <div>
                <h2 className="font-semibold text-ink text-sm mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-gold/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" />
                    </svg>
                  </span>
                  Canlı Piyasa Verisi
                </h2>
                <TicariPiyasa />
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-10 bg-white border border-border rounded-xl p-5 text-xs text-muted">
            <p className="font-semibold text-ink mb-1">Yasal Uyarı</p>
            <p>
              TicariMetre hesaplamaları bilgilendirme amaçlıdır ve yatırım tavsiyesi niteliği taşımaz.
              Gerçek getiriler; piyasa koşulları, vergi, kira sözleşmesi yapısı ve diğer faktörler nedeniyle
              farklılık gösterebilir. Yatırım kararlarınızda uzman gayrimenkul danışmanı ve mali müşavirinizle
              görüşmeniz tavsiye edilir.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
