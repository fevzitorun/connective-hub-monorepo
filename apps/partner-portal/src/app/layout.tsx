import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '7fil Partner Portal',
  description: '7fil.com.tr partner ve entegrasyon paneli',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-cream text-ink font-sans antialiased">{children}</body>
    </html>
  )
}
