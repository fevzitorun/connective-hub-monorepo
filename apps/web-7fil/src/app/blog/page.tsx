import type { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from './posts'

export const metadata: Metadata = {
  title: 'Blog — Gayrimenkul Rehberi',
  description: 'Konut alım satım, mortgage hesaplama, tapu süreçleri ve AI değerleme hakkında uzman rehberleri. 7fil Blog.',
  alternates: { canonical: 'https://7fil.com.tr/blog' },
  openGraph: {
    title: '7fil Blog — Gayrimenkul Rehberi',
    description: 'Konut alım satım, mortgage, tapu ve AI değerleme rehberleri.',
    url: 'https://7fil.com.tr/blog',
  },
}

const CATEGORY_COLORS: Record<string, string> = {
  'Teknoloji': 'bg-blue-50 text-blue-700',
  'Piyasa Analizi': 'bg-amber-50 text-amber-700',
  'Finans': 'bg-green-50 text-green-700',
  'Hukuk': 'bg-purple-50 text-purple-700',
  'Sektör': 'bg-teal-50 text-teal-700',
}

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[22px] font-extrabold tracking-tight text-[#0d1f3c]">
            7<span className="text-[#c9a84c]">fil</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-stone-400">
            <Link href="/" className="hover:text-[#0d1f3c] transition-colors">Ana Sayfa</Link>
            <Link href="/fiyatlar" className="hover:text-[#0d1f3c] transition-colors">Fiyatlar</Link>
            <Link href="/" className="bg-[#0d1f3c] text-white px-5 py-2 rounded-lg hover:bg-[#1a3358] transition-colors font-semibold">
              Erken Erişim
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">7fil Blog</p>
          <h1 className="text-[#0d1f3c] text-4xl sm:text-5xl font-extrabold leading-tight">
            Gayrimenkul<br />
            <em className="not-italic text-[#c9a84c]" style={{ fontFamily: 'Georgia, serif' }}>rehberiniz.</em>
          </h1>
          <p className="mt-5 text-stone-500 text-lg leading-relaxed">
            Konut alım satım, mortgage, hukuk ve AI değerleme hakkında uzman içerikler.
          </p>
        </div>

        {/* Featured */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group block bg-[#0d1f3c] rounded-3xl overflow-hidden mb-12 hover:shadow-2xl transition-shadow"
          >
            <div className="p-10 sm:p-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold text-[#c9a84c] bg-[#c9a84c]/15 px-3 py-1 rounded-full">
                  {featured.category}
                </span>
                <span className="text-white/30 text-xs">{featured.readMinutes} dk okuma</span>
              </div>
              <h2 className="text-white text-2xl sm:text-3xl font-extrabold leading-snug max-w-3xl group-hover:text-[#c9a84c] transition-colors">
                {featured.title}
              </h2>
              <p className="mt-5 text-white/50 text-sm leading-relaxed max-w-2xl">
                {featured.excerpt}
              </p>
              <div className="mt-8 inline-flex items-center gap-2 text-[#c9a84c] text-sm font-semibold">
                Okumaya devam et
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white border border-stone-100 hover:border-[#c9a84c]/40 hover:shadow-lg rounded-2xl p-7 transition-all"
            >
              <div className="flex items-center justify-between mb-5">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-stone-50 text-stone-600'}`}>
                  {post.category}
                </span>
                <span className="text-stone-300 text-xs">{post.readMinutes} dk</span>
              </div>
              <h2 className="text-[#0d1f3c] font-bold text-lg leading-snug mb-3 group-hover:text-[#c9a84c] transition-colors">
                {post.title}
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-5 flex items-center gap-1 text-[#c9a84c] text-xs font-semibold">
                Oku
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-[#0d1f3c]">
            7<span className="text-[#c9a84c]">fil</span>
          </Link>
          <p className="text-stone-400 text-xs">© 2026 Connective Hub Dijital Teknolojiler</p>
        </div>
      </footer>
    </div>
  )
}
