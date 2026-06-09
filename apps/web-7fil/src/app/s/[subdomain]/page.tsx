import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '../../../lib/utils'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

interface Props {
  params: { subdomain: string }
  searchParams: { page?: string }
}

type Branding = {
  agencyId: string; companyName: string; subdomain: string; city: string
  agencyDescription: string | null; agencyVerified: boolean
  primaryColor: string; secondaryColor: string; fontFamily: string
  logoUrl: string | null; faviconUrl: string | null
  heroTitle: string | null; heroSubtitle: string | null; aboutText: string | null
  contactPhone: string | null; contactEmail: string | null; contactAddress: string | null
  instagramUrl: string | null; facebookUrl: string | null
  twitterUrl: string | null; linkedinUrl: string | null; youtubeUrl: string | null
  customCss: string | null; seoTitle: string | null; seoDescription: string | null
  show7filBadge: boolean; listingsPerPage: number
}

type Listing = {
  id: string; title: string; price: string; currency: string
  listing_type: string; property_type: string
  city: string; district: string; area_m2: string
  room_count: string; cover_url: string | null
}

async function getBranding(subdomain: string): Promise<Branding | null> {
  try {
    const res = await fetch(`${BASE}/whitelabel/public/${subdomain}`, { cache: 'no-store' })
    const json = await res.json()
    return json.data ?? null
  } catch { return null }
}

async function getListings(subdomain: string, page = 1): Promise<{ listings: Listing[]; total: number }> {
  try {
    const res = await fetch(`${BASE}/whitelabel/public/${subdomain}/listings/page/${page}`, { cache: 'no-store' })
    const json = await res.json()
    return { listings: json.listings ?? [], total: json.total ?? 0 }
  } catch { return { listings: [], total: 0 } }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await getBranding(params.subdomain)
  if (!b) return { title: 'Emlak Ofisi' }
  return {
    title: b.seoTitle ?? `${b.companyName} — ${b.city} Emlak`,
    description: b.seoDescription ?? b.agencyDescription ?? `${b.companyName} aktif ilanlarını inceleyin.`,
    icons: b.faviconUrl ? [{ url: b.faviconUrl }] : undefined,
  }
}

export default async function SubdomainHomePage({ params, searchParams }: Props) {
  const { subdomain } = params
  const page = Number(searchParams.page ?? 1)

  const [b, { listings, total }] = await Promise.all([
    getBranding(subdomain),
    getListings(subdomain, page),
  ])

  if (!b) notFound()

  const totalPages = Math.ceil(total / b.listingsPerPage)
  const p = b.primaryColor
  const s = b.secondaryColor

  return (
    <>
      {/* Dynamic brand CSS variables */}
      <style>{`
        :root {
          --brand-primary: ${p};
          --brand-secondary: ${s};
        }
        .brand-bg { background-color: ${p}; }
        .brand-text { color: ${p}; }
        .brand-btn { background-color: ${s}; color: #fff; }
        .brand-btn:hover { opacity: 0.9; }
        ${b.customCss ?? ''}
      `}</style>

      <div className="min-h-screen bg-gray-50" style={{ fontFamily: b.fontFamily }}>

        {/* Header */}
        <header className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: p }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {b.logoUrl ? (
                <Image src={b.logoUrl} alt={b.companyName} width={120} height={40} className="h-10 w-auto object-contain" />
              ) : (
                <span className="font-bold text-xl text-white">{b.companyName}</span>
              )}
              {b.agencyVerified && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-medium">✓ Doğrulanmış</span>
              )}
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
              <a href="#ilanlar" className="hover:text-white transition-colors">İlanlar</a>
              {b.aboutText && <a href="#hakkimizda" className="hover:text-white transition-colors">Hakkımızda</a>}
              <a href="#iletisim" className="hover:text-white transition-colors">İletişim</a>
            </nav>
            {b.contactPhone && (
              <a href={`tel:${b.contactPhone}`} className="text-sm font-semibold text-white hidden sm:block">
                {b.contactPhone}
              </a>
            )}
          </div>
        </header>

        {/* Hero */}
        <section className="py-16 sm:py-24 text-center text-white" style={{ backgroundColor: p }}>
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: b.fontFamily }}>
              {b.heroTitle ?? b.companyName}
            </h1>
            {(b.heroSubtitle ?? b.agencyDescription) && (
              <p className="text-white/70 text-lg mt-2">
                {b.heroSubtitle ?? b.agencyDescription}
              </p>
            )}
            <div className="flex gap-3 justify-center mt-8 flex-wrap">
              <a href="#ilanlar"
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: s, color: '#fff' }}>
                İlanları Gör ({total})
              </a>
              {b.contactPhone && (
                <a href={`tel:${b.contactPhone}`}
                  className="px-6 py-3 rounded-xl font-semibold text-sm bg-white/10 text-white hover:bg-white/20 transition-colors">
                  Ara: {b.contactPhone}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Listings */}
        <section id="ilanlar" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Aktif İlanlar
              <span className="text-sm font-normal text-gray-400 ml-2">({total} ilan)</span>
            </h2>
          </div>

          {listings.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <p className="text-lg font-semibold text-gray-600">Henüz aktif ilan yok</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <Link
                  key={l.id}
                  href={`/s/${subdomain}/ilan/${l.id}`}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                    {l.cover_url ? (
                      <Image
                        src={l.cover_url} alt={l.title}
                        fill className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: l.listing_type === 'sale' ? s : p }}>
                      {l.listing_type === 'sale' ? 'Satılık' : 'Kiralık'}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-opacity-80 transition-colors">
                      {l.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{l.district}, {l.city}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-base font-bold" style={{ color: s }}>
                        {formatPrice(Number(l.price), l.currency)}
                      </span>
                      {l.area_m2 && (
                        <span className="text-xs text-gray-400">{l.area_m2} m²</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <Link
                  key={pg}
                  href={`/s/${subdomain}?page=${pg}`}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                    pg === page ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                  style={pg === page ? { backgroundColor: p } : {}}
                >
                  {pg}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* About */}
        {b.aboutText && (
          <section id="hakkimizda" className="bg-white py-14">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-2xl font-bold mb-6" style={{ color: p }}>Hakkımızda</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{b.aboutText}</p>
            </div>
          </section>
        )}

        {/* Contact */}
        <section id="iletisim" className="py-14" style={{ backgroundColor: `${p}08` }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-center mb-8" style={{ color: p }}>İletişim</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {b.contactPhone && (
                <a href={`tel:${b.contactPhone}`} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${s}20` }}>
                    <svg className="w-6 h-6" style={{ color: s }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Telefon</p>
                  <p className="font-semibold text-gray-800">{b.contactPhone}</p>
                </a>
              )}
              {b.contactEmail && (
                <a href={`mailto:${b.contactEmail}`} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${s}20` }}>
                    <svg className="w-6 h-6" style={{ color: s }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">E-posta</p>
                  <p className="font-semibold text-gray-800 text-sm break-all">{b.contactEmail}</p>
                </a>
              )}
              {b.contactAddress && (
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `${s}20` }}>
                    <svg className="w-6 h-6" style={{ color: s }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Adres</p>
                  <p className="font-semibold text-gray-800 text-sm">{b.contactAddress}</p>
                </div>
              )}
            </div>

            {/* Social media */}
            {(b.instagramUrl || b.facebookUrl || b.twitterUrl || b.linkedinUrl) && (
              <div className="flex justify-center gap-4 mt-8">
                {b.instagramUrl && (
                  <a href={b.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ backgroundColor: p }}>
                    <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                )}
                {b.facebookUrl && (
                  <a href={b.facebookUrl} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ backgroundColor: p }}>
                    <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-gray-400 border-t border-gray-100">
          {b.show7filBadge ? (
            <p>
              {b.companyName} · <Link href="https://7fil.com.tr" className="hover:text-gray-600 transition-colors">7fil</Link> üzerinde çalışmaktadır
            </p>
          ) : (
            <p>© {new Date().getFullYear()} {b.companyName}</p>
          )}
        </footer>
      </div>
    </>
  )
}
