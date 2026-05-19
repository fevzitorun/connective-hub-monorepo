import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '../../../components/Navbar'
import { Footer } from '../../../components/Footer'
import { FavoriteButton } from '../../../components/FavoriteButton'
import { OfferButton } from '../../../components/OfferButton'
import { api } from '../../../lib/api'
import { formatPrice, formatArea, listingTypeLabel, propertyTypeLabel, categoryLabel, timeAgo } from '../../../lib/utils'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { data: listing } = await api.getListing(params.id)
    return {
      title: listing.title,
      description: `${listingTypeLabel(listing.listingType)} — ${listing.city}, ${listing.district}. ${formatPrice(listing.price, listing.currency)}`,
      openGraph: {
        images: listing.photos?.[0]?.url ? [listing.photos[0].url] : [],
      },
    }
  } catch {
    return { title: 'İlan Bulunamadı' }
  }
}

export default async function ListingDetailPage({ params }: Props) {
  let listing
  try {
    const res = await api.getListing(params.id)
    listing = res.data
  } catch {
    notFound()
  }

  const coverPhoto = listing.photos?.find((p) => p.isCover) ?? listing.photos?.[0]
  const otherPhotos = listing.photos?.filter((p) => !p.isCover) ?? []

  const specs: { label: string; value: string }[] = [
    ...(listing.roomCount ? [{ label: 'Oda Sayısı', value: listing.roomCount }] : []),
    ...(listing.areaM2 ? [{ label: 'Brüt Alan', value: formatArea(listing.areaM2) }] : []),
    ...(listing.floorNo != null ? [{ label: 'Bulunduğu Kat', value: String(listing.floorNo) }] : []),
    ...(listing.totalFloors != null ? [{ label: 'Toplam Kat', value: String(listing.totalFloors) }] : []),
    ...(listing.buildingAge != null ? [{ label: 'Bina Yaşı', value: `${listing.buildingAge} yıl` }] : []),
    { label: 'Eşyalı', value: listing.isFurnished ? 'Evet' : 'Hayır' },
    { label: 'Otopark', value: listing.hasParking ? 'Var' : 'Yok' },
    { label: 'Asansör', value: listing.hasElevator ? 'Var' : 'Yok' },
    { label: 'Balkon', value: listing.hasBalcony ? 'Var' : 'Yok' },
  ]

  return (
    <>
      <Navbar />
      <main className="pt-16 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted mb-6">
            <Link href="/" className="hover:text-gold">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/ara" className="hover:text-gold">İlanlar</Link>
            <span>/</span>
            <Link href={`/ara?city=${listing.city}`} className="hover:text-gold">{listing.city}</Link>
            <span>/</span>
            <span className="text-ink">{listing.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sol — Fotoğraf + Detaylar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ana fotoğraf */}
              <div className="relative aspect-[16/9] bg-ink rounded-2xl overflow-hidden">
                {coverPhoto ? (
                  <Image
                    src={coverPhoto.url}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                )}

                {/* Tip badge */}
                <span className={`absolute top-4 left-4 ${listing.listingType === 'sale' ? 'badge-gold' : 'badge-teal'} text-sm px-3 py-1`}>
                  {listingTypeLabel(listing.listingType)}
                </span>

                {/* Favori butonu */}
                <div className="absolute top-4 right-4">
                  <FavoriteButton listingId={listing.id} size="lg" />
                </div>
              </div>

              {/* Diğer fotoğraflar */}
              {otherPhotos.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {otherPhotos.slice(0, 6).map((p) => (
                    <div key={p.id} className="relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden gallery-thumb">
                      <Image src={p.url} alt="" fill className="object-cover" sizes="96px" />
                    </div>
                  ))}
                  {otherPhotos.length > 6 && (
                    <div className="flex-shrink-0 w-24 h-16 rounded-lg bg-ink/10 flex items-center justify-center text-xs text-muted">
                      +{otherPhotos.length - 6}
                    </div>
                  )}
                </div>
              )}

              {/* Başlık + Fiyat */}
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">{listing.title}</h1>
                <p className="text-muted text-sm mt-1">
                  {listing.neighborhood && `${listing.neighborhood}, `}
                  {listing.district && `${listing.district}, `}
                  {listing.city}
                </p>
              </div>

              {/* Özellikler grid */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="font-semibold text-ink mb-4 text-sm">Genel Bilgiler</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                  {specs.map((s) => (
                    <div key={s.label}>
                      <p className="text-xs text-muted">{s.label}</p>
                      <p className="text-sm font-semibold text-ink mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Açıklama */}
              {listing.description && (
                <div className="bg-white rounded-xl border border-border p-6">
                  <h2 className="font-semibold text-ink mb-3 text-sm">Açıklama</h2>
                  <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              )}

              {/* FILTERRA.AI badge */}
              <div className="flex items-center gap-2 text-xs text-teal/70 bg-teal/5 border border-teal/20 rounded-lg px-4 py-3">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>
                  <strong className="text-teal">FILTERRA.AI</strong> — Bu ilan yapay zeka destekli analiz kapsamına alınacak.
                  Değerleme ve hukuki ön inceleme için emlakçıyla iletişime geçin.
                </span>
              </div>
            </div>

            {/* Sağ — Fiyat + İletişim kartı */}
            <div className="space-y-4">
              {/* Fiyat kartı */}
              <div className="bg-white rounded-xl border border-border p-6 sticky top-20">
                <p className="text-3xl font-display font-bold text-gold">
                  {formatPrice(listing.price, listing.currency)}
                </p>
                {listing.areaM2 && listing.price && (
                  <p className="text-sm text-muted mt-1">
                    {Math.round(listing.price / listing.areaM2).toLocaleString('tr-TR')} ₺/m²
                  </p>
                )}

                {/* WhatsApp butonu */}
                {listing.whatsappLink ? (
                  <a
                    href={listing.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-btn mt-5 w-full"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp ile İletişim
                  </a>
                ) : (
                  <button className="btn-primary mt-5 w-full">İletişime Geç</button>
                )}

                {/* Teklif Ver */}
                <OfferButton
                  whatsappLink={listing.whatsappLink}
                  listingTitle={listing.title}
                  listingPrice={listing.price}
                  currency={listing.currency}
                />

                {/* QR Kodu */}
                {listing.whatsappQrUrl && (
                  <div className="mt-5 text-center border-t border-border pt-5">
                    <p className="text-xs text-muted mb-3">QR ile hızlı ulaş</p>
                    <Image
                      src={listing.whatsappQrUrl}
                      alt="WhatsApp QR"
                      width={120}
                      height={120}
                      className="mx-auto rounded-lg"
                    />
                  </div>
                )}

                {/* İlan bilgileri */}
                <div className="mt-5 pt-5 border-t border-border space-y-2 text-xs text-muted">
                  <div className="flex justify-between">
                    <span>İlan No</span>
                    <span className="font-mono text-ink/60">{listing.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tür</span>
                    <span>{propertyTypeLabel(listing.propertyType)} — {categoryLabel(listing.category)}</span>
                  </div>
                  {listing.createdAt && (
                    <div className="flex justify-between">
                      <span>Eklenme</span>
                      <span>{timeAgo(listing.createdAt)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Görüntülenme</span>
                    <span>{listing.viewCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
