import Link from 'next/link'
import Image from 'next/image'
import type { SearchHit } from '../lib/api'
import { formatPrice, formatArea, listingTypeLabel } from '../lib/utils'
import { FavoriteButton } from './FavoriteButton'

interface Props {
  hit: SearchHit
}

export function ListingCard({ hit }: Props) {
  const badge = listingTypeLabel(hit.listingType)
  const badgeClass = hit.listingType === 'sale' ? 'badge-gold' : 'badge-teal'

  return (
    <Link href={`/ilan/${hit.id}`} className="card group block overflow-hidden">
      {/* Cover Photo */}
      <div className="relative aspect-[4/3] bg-cream overflow-hidden">
        {hit.coverPhoto ? (
          <Image
            src={hit.coverPhoto}
            alt={hit.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        )}

        {/* Badge */}
        <span className={`absolute top-3 left-3 ${badgeClass} text-xs`}>
          {badge}
        </span>

        {/* Favori butonu */}
        <div className="absolute top-3 right-3">
          <FavoriteButton listingId={hit.id} size="sm" />
        </div>

        {/* WhatsApp hint */}
        {hit.whatsappLink && (
          <span className="absolute bottom-3 right-3 bg-[#25D366]/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            İletişim
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="price-tag">{formatPrice(hit.price, hit.currency)}</p>
        <h3
          className="mt-1 font-semibold text-ink line-clamp-2 group-hover:text-teal transition-colors text-sm"
          dangerouslySetInnerHTML={{ __html: hit._formatted?.title ?? hit.title }}
        />
        <p className="mt-1 text-xs text-muted">
          {hit.district && `${hit.district}, `}{hit.city}
        </p>

        {/* Specs row */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted border-t border-border pt-3">
          {hit.areaM2 && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {formatArea(hit.areaM2)}
            </span>
          )}
          {hit.roomCount && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {hit.roomCount}
            </span>
          )}
          {hit.pricePerM2 && hit.areaM2 && (
            <span className="ml-auto text-gold/70 font-medium">
              {hit.pricePerM2.toLocaleString('tr-TR')} ₺/m²
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
