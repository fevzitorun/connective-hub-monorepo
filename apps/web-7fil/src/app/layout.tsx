import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import '@7fil/ui/globals.css'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: '7fil — Evin için doğru adım',
    template: '%s | 7fil',
  },
  description:
    'Türkiye\'nin en güvenilir gayrimenkul platformu. AI destekli değerleme, hukuki doğrulama ve finansman karşılaştırması ile ev alım-satımında yeni dönem.',
  keywords: ['emlak', 'gayrimenkul', 'konut', 'kiralık', 'satılık', 'istanbul', 'ankara', 'izmir'],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://7fil.com.tr',
    siteName: '7fil',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-cream font-body antialiased">
        {children}
      </body>
    </html>
  )
}
