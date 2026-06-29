import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_POSTS, getPost } from '../posts'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  const url = `https://7fil.com.tr/blog/${post.slug}`
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: 'article',
      publishedTime: post.publishedAt,
      siteName: '7fil',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

function renderContent(content: string) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i] ?? ''

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-[#0d1f3c] text-2xl font-extrabold mt-10 mb-4 leading-snug">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={i} className="font-bold text-[#0d1f3c] mt-4 mb-1">
          {line.slice(2, -2)}
        </p>
      )
    } else if (line.startsWith('- [ ] ')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 text-sm text-stone-600 py-1">
          <span className="w-4 h-4 border border-stone-300 rounded mt-0.5 shrink-0" />
          <span>{line.slice(6)}</span>
        </div>
      )
    } else if (line.startsWith('| ') && line.includes('|')) {
      const tableLines: string[] = []
      while (i < lines.length && (lines[i] ?? '').startsWith('|')) {
        tableLines.push(lines[i] ?? '')
        i++
      }
      const rows = tableLines.filter((l) => !l.match(/^\|[\s-|]+\|$/))
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            {rows.map((row, ri) => {
              const cells = row.split('|').filter((_, ci) => ci > 0 && ci < row.split('|').length - 1)
              const isHeader = ri === 0
              return (
                <tr key={ri} className={isHeader ? 'bg-[#0d1f3c] text-white' : ri % 2 === 0 ? 'bg-stone-50' : 'bg-white'}>
                  {cells.map((cell, ci) => (
                    <td key={ci} className={`px-4 py-2.5 border border-stone-200 ${isHeader ? 'font-semibold border-[#0d1f3c]' : ''}`}>
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              )
            })}
          </table>
        </div>
      )
      continue
    } else if (line.trim() === '') {
      // empty line — skip
    } else {
      const text = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/%/g, '%')
      elements.push(
        <p
          key={i}
          className="text-stone-700 leading-relaxed mb-4 text-[15px]"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )
    }
    i++
  }
  return elements
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: '7fil' },
    publisher: {
      '@type': 'Organization',
      name: '7fil',
      logo: { '@type': 'ImageObject', url: 'https://7fil.com.tr/icon.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://7fil.com.tr/blog/${post.slug}` },
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[22px] font-extrabold tracking-tight text-[#0d1f3c]">
            7<span className="text-[#c9a84c]">fil</span>
          </Link>
          <Link href="/blog" className="text-sm text-stone-400 hover:text-[#0d1f3c] transition-colors">
            ← Blog
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-14">

        {/* Meta */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <Link
              href="/blog"
              className="text-xs font-bold text-[#c9a84c] bg-[#c9a84c]/10 px-3 py-1 rounded-full hover:bg-[#c9a84c]/20 transition-colors"
            >
              {post.category}
            </Link>
            <span className="text-stone-300 text-xs">·</span>
            <span className="text-stone-400 text-xs">{post.readMinutes} dakika okuma</span>
            <span className="text-stone-300 text-xs">·</span>
            <span className="text-stone-400 text-xs">
              {new Date(post.publishedAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="text-[#0d1f3c] text-3xl sm:text-4xl font-extrabold leading-tight">
            {post.title}
          </h1>

          <p className="mt-5 text-stone-500 text-lg leading-relaxed border-l-4 border-[#c9a84c] pl-5">
            {post.excerpt}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-100 mb-10" />

        {/* Content */}
        <div className="prose-custom">
          {renderContent(post.content)}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-[#0d1f3c] rounded-3xl p-8 text-center">
          <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-3">7fil — Yakında</p>
          <h3 className="text-white text-2xl font-extrabold mb-3">
            Eylül 2026&apos;da açılıyoruz.
          </h3>
          <p className="text-white/40 text-sm mb-7">
            Erken erişim listesine katılın — lansman günü öncelikli destek ve özel fiyat garantisi.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#c9a84c] hover:bg-[#b8942e] text-[#0d1f3c] font-bold px-8 py-3.5 rounded-xl text-sm transition-colors"
          >
            Erken Erişim Listesine Katıl →
          </Link>
        </div>

        {/* Related */}
        <div className="mt-14">
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-6">Diğer Yazılar</p>
          <div className="space-y-4">
            {BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3).map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="flex items-start gap-4 group py-3 border-b border-stone-100 last:border-0"
              >
                <div className="flex-1">
                  <p className="text-[#0d1f3c] font-semibold text-sm leading-snug group-hover:text-[#c9a84c] transition-colors">
                    {p.title}
                  </p>
                  <p className="text-stone-400 text-xs mt-1">{p.category} · {p.readMinutes} dk</p>
                </div>
                <svg className="w-4 h-4 text-stone-300 group-hover:text-[#c9a84c] transition-colors shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
