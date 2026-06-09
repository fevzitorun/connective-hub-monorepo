import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '../../../../../lib/api'
import { formatPrice, formatArea, listingTypeLabel, propertyTypeLabel } from '../../../../../lib/utils'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

interface Props {
  params: { subdomain: string; id: string }
}

type Branding = {
  companyName: string; primaryColor: string; secondaryColor: string
  fontFamily: string; logoUrl: string | null; contactPhone: string | null
  contactEmail: string | null; show7filBadge: boolean
}

async function getBranding(subdomain: string): Promise<Branding | null> {
  try {
    const res = await fetch(`${BASE}/whitelabel/public/${subdomain}`, { cache: 'no-store' })
    const json = await res.json()
    return json.data ?? null
  } catch { return null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data: listing } = await api.getListing(params.id)
    return {
      title: listing.title,
      description: `${listingTypeLabel(listing.listingType)} — ${listing.city}. ${formatPrice(listing.price, listing.currency)}`,
    }
  } catch { return { title: 'İlan' } }
}

export default async function SubdomainListingPage({ params }: Props) {
  const { subdomain, id } = params

  const [b, listingRes] = await Promise.all([
    getBranding(subdomain),
    api.getListing(id).catch(() => null),
  ])

  if (!b || !listingRes) notFound()
  const listing = listingRes.data

  const p = b.primaryColor
  const s = b.secondaryColor
  const coverPhoto = listing.photos?.find((ph: { isCover: boolean }) => ph.isCover) ?? listing.photos?.[0]
  const otherPhotos = listing.photos?.filter((ph: { isCover: boolean }) => !ph.isCover) ?? []

  const specs = [
    ...(listing.roomCount ? [{ label: 'Oda', value: listing.roomCount }] : []),
    ...(listing.areaM2 ? [{ label: 'Alan', value: formatArea(listing.areaM2) }] : []),
    ...(listing.floorNo != null ? [{ label: 'Kat', value: String(listing.floorNo) }] : []),
    ...(listing.buildingAge != null ? [{ label: 'Bina Yaşı', value: `${listing.buildingAge} yıl` }] : []),
    { label: 'Otopark', value: listing.hasParking ? 'Var' : 'Yok' },
    { label: 'Asansör', value: listing.hasElevator ? 'Var' : 'Yok' },
  ]

  return (
    <>
      <style>{`
        :root { --brand-primary: ${p}; --brand-secondary: ${s}; }
      `}</style>

      <div className="min-h-screen bg-gray-50" style={{ fontFamily: b.fontFamily }}>
        {/* Header */}
        <header className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: p }}>
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href={`/s/${subdomain}`} className="flex items-center gap-2">
              {b.logoUrl ? (
                <Image src={b.logoUrl} alt={b.companyName} width={100} height={36} className="h-8 w-auto object-contain" />
              ) : (
                <span className="font-bold text-lg text-white">{b.companyName}</span>
              )}
            </Link>
            <Link href={`/s/${subdomain}`} className="text-xs text-white/70 hover:text-white transition-colors">
              ← Tüm İlanlar
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Cover photo */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-200 mb-6">
            {coverPhoto ? (
              <Image src={coverPhoto.url} alt={listing.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 960px" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            )}
            <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: listing.listingType === 'sale' ? s : p }}>
              {listingTypeLabel(listing.listingType)}
            </span>
          </div>

          {/* Thumbnails */}
          {otherPhotos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto mb-6 pb-1">
              {otherPhotos.slice(0, 8).map((ph: { id: string; url: string }) => (
                <div key={ph.id} className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden">
                  <Image src={ph.url} alt="" fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <span className="text-xs text-gray-400">{propertyTypeLabel(listing.propertyType)}</span>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{listing.title}</h1>
                <p className="text-gray-400 text-sm mt-1">
                  {listing.neighborhood && `${listing.neighborhood}, `}
                  {listing.district && `${listing.district}, `}{listing.city}
                </p>
              </div>

              {/* Specs */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {specs.map((sp) => (
                    <div key={sp.label}>
                      <p className="text-xs text-gray-400">{sp.label}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">{sp.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {listing.description && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h2 className="font-semibold text-gray-800 mb-3 text-sm">Açıklama</h2>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Price card */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm sticky top-20">
                <p className="text-3xl font-bold" style={{ color: s }}>
                  {formatPrice(listing.price, listing.currency)}
                </p>
                {listing.areaM2 && listing.price && (
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round(listing.price / listing.areaM2).toLocaleString('tr-TR')} ₺/m²
                  </p>
                )}

                {listing.whatsappLink ? (
                  <a href={listing.whatsappLink} target="_blank" rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#25D366' }}>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                ) : b.contactPhone ? (
                  <a href={`tel:${b.contactPhone}`}
                    className="mt-5 flex items-center justify-center w-full py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: p }}>
                    {b.contactPhone}
                  </a>
                ) : null}

                {b.contactEmail && (
                  <a href={`mailto:${b.contactEmail}?subject=${encodeURIComponent(listing.title)}`}
                    className="mt-2 flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors">
                    E-posta Gönder
                  </a>
                )}

                <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1.5">
                  <div className="flex justify-between">
                    <span>İlan No</span>
                    <span className="font-mono">{listing.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-5 text-center text-xs text-gray-400 border-t border-gray-100 mt-10">
          {b.show7filBadge ? (
            <p>{b.companyName} · <Link href="https://7fil.com.tr" className="hover:text-gray-600">7fil</Link> üzerinde çalışmaktadır</p>
          ) : (
            <p>© {new Date().getFullYear()} {b.companyName}</p>
          )}
        </footer>
      </div>
    </>
  )
}
