'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '../../store/auth'

const NAV = [
  { href: '/dashboard', label: 'Özet', icon: '📊' },
  { href: '/dashboard/referrals', label: 'Referanslar', icon: '🔗' },
  { href: '/dashboard/komisyon', label: 'Komisyonlar', icon: '💰' },
  { href: '/dashboard/mls', label: 'MLS Havuzu', icon: '🤝' },
  { href: '/dashboard/marka', label: 'Markam', icon: '🌐' },
  { href: '/dashboard/icerik', label: 'AI İçerik', icon: '✍️' },
  { href: '/dashboard/embed', label: 'Embed / Widget', icon: '🧩' },
  { href: '/dashboard/api-keys', label: 'API Anahtarları', icon: '🔑' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, accessToken, clearAuth } = useAuthStore()

  useEffect(() => {
    if (!accessToken) router.replace('/login')
  }, [accessToken, router])

  if (!accessToken || !user) return null

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 bg-ink text-white flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="https://7fil.com.tr" className="font-display text-xl font-bold" target="_blank">
            7<span className="text-gold">fil</span>
            <span className="text-white/40 text-xs font-sans font-normal ml-2">Partner</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? 'bg-gold text-ink font-semibold' : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-xs text-white/60 font-medium truncate">{user.fullName ?? user.email}</p>
          <p className="text-xs text-white/30 truncate">{user.email}</p>
          <button
            onClick={() => { clearAuth(); router.replace('/login') }}
            className="mt-2 text-xs text-white/40 hover:text-white transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-60 min-h-screen overflow-y-auto bg-cream">
        {children}
      </main>
    </div>
  )
}
