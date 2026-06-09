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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://7fil.com.tr'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: '7fil — Evin için doğru adım',
    template: '%s | 7fil',
  },
  description:
    'Türkiye\'nin entegre gayrimenkul platformu. AI değerleme, avukat onaylı hukuki doğrulama, mortgage karşılaştırma ve müzayede — hepsi bir arada.',
  keywords: [
    'emlak', 'gayrimenkul', 'konut', 'kiralık daire', 'satılık daire',
    'istanbul emlak', 'ankara emlak', 'izmir emlak',
    'mortgage hesaplama', 'emlak değerleme', 'tapu sorgulama',
  ],
  authors: [{ name: 'Connective Hub Dijital Teknolojiler', url: APP_URL }],
  creator: '7fil',
  publisher: '7fil',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: APP_URL,
    siteName: '7fil',
    title: '7fil — Evin için doğru adım',
    description: 'Türkiye\'nin entegre gayrimenkul platformu. AI değerleme, hukuki doğrulama, mortgage ve müzayede.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '7fil Gayrimenkul Platformu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@7filemlak',
    creator: '@7filemlak',
    title: '7fil — Evin için doğru adım',
    description: 'Türkiye\'nin entegre gayrimenkul platformu.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  },
  alternates: {
    canonical: APP_URL,
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
