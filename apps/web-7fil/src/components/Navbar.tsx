import Link from 'next/link'

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl font-bold text-ink">
            7<span className="text-gold">fil</span>
          </span>
          <span className="hidden sm:inline text-xs text-muted border-l border-border pl-2">
            Gayrimenkul Ekosistemi
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-ink/70">
          <Link href="/ara?listingType=sale" className="hover:text-gold transition-colors">Satılık</Link>
          <Link href="/ara?listingType=rent" className="hover:text-gold transition-colors">Kiralık</Link>
          <Link href="/ara?propertyType=commercial" className="hover:text-gold transition-colors">İş Yeri</Link>
          <Link href="/ara?propertyType=land" className="hover:text-gold transition-colors">Arsa</Link>
          <Link href="/ticari" className="hover:text-gold transition-colors font-semibold text-gold/80">TicariMetre</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Favoriler */}
          <Link
            href="/favoriler"
            aria-label="Favoriler"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>

          <Link
            href="/giris"
            className="text-sm font-medium text-ink/70 hover:text-ink transition-colors hidden sm:block"
          >
            Giriş Yap
          </Link>
          <Link
            href="/panel/ilanlar/yeni"
            className="btn-primary text-sm py-2 px-4"
          >
            İlan Ver
          </Link>
        </div>
      </nav>
    </header>
  )
}
