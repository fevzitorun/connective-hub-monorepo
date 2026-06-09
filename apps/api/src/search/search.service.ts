import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import MeiliSearch from 'meilisearch'
import { Listing, ListingStatus } from '../listings/entities/listing.entity'

const INDEX_NAME = '7fil_listings'

// Meilisearch'e gönderilen hafif doküman yapısı
interface ListingDocument {
  id:           string
  title:        string
  description:  string
  price:        number | null
  currency:     string
  propertyType: string
  listingType:  string
  category:     string
  city:         string
  district:     string
  neighborhood: string
  roomCount:    string
  areaM2:       number | null
  buildingAge:  number | null
  hasParking:   boolean
  hasElevator:  boolean
  hasBalcony:   boolean
  coverPhoto:   string | null
  whatsappLink: string | null
  publishedAt:  number | null   // Unix timestamp — Meilisearch sayısal filtreler için
  pricePerM2:   number | null
}

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name)
  private readonly client: MeiliSearch
  private readonly index: ReturnType<MeiliSearch['index']>

  constructor(private readonly config: ConfigService) {
    this.client = new MeiliSearch({
      host:   config.get<string>('MEILI_HOST', 'http://localhost:7700'),
      apiKey: config.get<string>('MEILI_MASTER_KEY', ''),
    })
    this.index = this.client.index(INDEX_NAME)
  }

  // ─── Index kurulumu ───────────────────────────────────────────────────────

  async onModuleInit() {
    try {
      await this.setupIndex()
      this.logger.log('Meilisearch index hazır')
    } catch (err) {
      this.logger.warn('Meilisearch bağlantısı kurulamadı (dev ortamında normal)', err)
    }
  }

  private async setupIndex() {
    // Index yoksa oluştur
    await this.client.createIndex(INDEX_NAME, { primaryKey: 'id' }).catch(() => null)

    // Aranabilir alanlar
    await this.index.updateSearchableAttributes([
      'title', 'description', 'city', 'district', 'neighborhood', 'category',
    ])

    // Filtrelenebilir alanlar
    await this.index.updateFilterableAttributes([
      'propertyType', 'listingType', 'category', 'city', 'district',
      'neighborhood', 'price', 'areaM2', 'roomCount', 'buildingAge',
      'hasParking', 'hasElevator', 'hasBalcony', 'pricePerM2',
    ])

    // Sıralanabilir alanlar
    await this.index.updateSortableAttributes([
      'price', 'areaM2', 'publishedAt', 'pricePerM2',
    ])

    await this.index.updateSettings({
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 },
        // Türkçe karakterler typo sayılmasın
        disableOnAttributes: ['city', 'district', 'neighborhood'],
      },
      // Türkçe stopword'ler — arama kalitesini artırır
      stopWords: [
        've', 'veya', 'ile', 'bir', 'bu', 'şu', 'o', 'da', 'de', 'den',
        'dan', 'için', 'gibi', 'kadar', 'daha', 'en', 'çok', 'az', 'var',
        'yok', 'olan', 'olarak', 'olan', 'mi', 'mı', 'mu', 'mü',
        'ama', 'fakat', 'lakin', 'ancak', 'ne', 'nasıl', 'nerede',
      ],
      synonyms: {
        'daire':        ['apartment', 'konut', 'ev', 'residence'],
        'villa':        ['müstakil', 'köşk', 'bağımsız'],
        'isyeri':       ['iş yeri', 'dükkan', 'ofis', 'işyeri'],
        'satilik':      ['satılık', 'satışa çıkarıldı'],
        'kiralik':      ['kiralık', 'kiralama'],
        'dukkan':       ['dükkan', 'mağaza', 'shop'],
        'arsa':         ['tarla', 'parsel', 'alan'],
        'asansor':      ['asansör', 'elevator'],
        'otopark':      ['garaj', 'parking', 'park yeri'],
        'merkez':       ['center', 'şehir merkezi'],
        '1+1':          ['1+1', 'bir artı bir', 'bir oda'],
        '2+1':          ['2+1', 'iki artı bir', 'iki oda bir salon'],
        '3+1':          ['3+1', 'üç artı bir', 'üç oda bir salon'],
        '4+1':          ['4+1', 'dört artı bir'],
        'deniz manzara': ['deniz manzaralı', 'sea view', 'boğaz manzara'],
      },
      // Sıralama: en yeni önce varsayılan
      rankingRules: [
        'words', 'typo', 'proximity', 'attribute', 'sort', 'exactness',
      ],
    })
  }

  // ─── Doküman ekle / güncelle ──────────────────────────────────────────────

  async indexListing(listing: Listing): Promise<void> {
    if (listing.status !== ListingStatus.ACTIVE) return

    const doc = this.toDocument(listing)
    try {
      await this.index.addDocuments([doc])
    } catch (err) {
      this.logger.error(`Meilisearch indexleme hatası: ${listing.id}`, err)
    }
  }

  async removeListing(id: string): Promise<void> {
    try {
      await this.index.deleteDocument(id)
    } catch (err) {
      this.logger.error(`Meilisearch silme hatası: ${id}`, err)
    }
  }

  // ─── Arama ───────────────────────────────────────────────────────────────

  async search(params: {
    q:            string
    city?:        string
    district?:    string
    propertyType?: string
    listingType?:  string
    priceMin?:    number
    priceMax?:    number
    areaMin?:     number
    areaMax?:     number
    roomCount?:   string
    hasParking?:  boolean
    hasElevator?: boolean
    page?:        number
    perPage?:     number
    sortBy?:      string
  }) {
    const page    = params.page    ?? 1
    const perPage = params.perPage ?? 20

    // Filtre ifadesi oluştur
    const filters: string[] = []
    if (params.city)         filters.push(`city = "${params.city}"`)
    if (params.district)     filters.push(`district = "${params.district}"`)
    if (params.propertyType) filters.push(`propertyType = "${params.propertyType}"`)
    if (params.listingType)  filters.push(`listingType = "${params.listingType}"`)
    if (params.roomCount)    filters.push(`roomCount = "${params.roomCount}"`)
    if (params.hasParking)   filters.push(`hasParking = true`)
    if (params.hasElevator)  filters.push(`hasElevator = true`)
    if (params.priceMin != null && params.priceMax != null)
      filters.push(`price ${params.priceMin} TO ${params.priceMax}`)
    else if (params.priceMin != null) filters.push(`price >= ${params.priceMin}`)
    else if (params.priceMax != null) filters.push(`price <= ${params.priceMax}`)
    if (params.areaMin != null) filters.push(`areaM2 >= ${params.areaMin}`)
    if (params.areaMax != null) filters.push(`areaM2 <= ${params.areaMax}`)

    // Sıralama
    const sortMap: Record<string, string> = {
      price_asc:  'price:asc',
      price_desc: 'price:desc',
      area_asc:   'areaM2:asc',
      newest:     'publishedAt:desc',
    }
    const sort = params.sortBy && sortMap[params.sortBy]
      ? [sortMap[params.sortBy]!]
      : ['publishedAt:desc']

    const result = await this.index.search(params.q || '', {
      filter:             filters.length ? filters.join(' AND ') : undefined,
      sort,
      offset:             (page - 1) * perPage,
      limit:              perPage,
      attributesToHighlight: ['title', 'description'],
      highlightPreTag:    '<mark>',
      highlightPostTag:   '</mark>',
    })

    return {
      data:       result.hits,
      total:      result.estimatedTotalHits ?? 0,
      page,
      perPage,
      totalPages: Math.ceil((result.estimatedTotalHits ?? 0) / perPage),
      query:      params.q,
    }
  }

  // ─── Toplu yeniden indeksleme (admin) ─────────────────────────────────────

  async bulkIndex(listings: Listing[]): Promise<void> {
    const docs = listings
      .filter((l) => l.status === ListingStatus.ACTIVE)
      .map((l) => this.toDocument(l))

    if (docs.length === 0) return

    // Meilisearch 1000'er parça alır
    for (let i = 0; i < docs.length; i += 1000) {
      await this.index.addDocuments(docs.slice(i, i + 1000))
    }
    this.logger.log(`${docs.length} ilan Meilisearch'e yüklendi`)
  }

  // ─── Dönüşüm ─────────────────────────────────────────────────────────────

  private toDocument(listing: Listing): ListingDocument {
    const cover = listing.photos?.find((p) => p.isCover) ?? listing.photos?.[0]
    return {
      id:           listing.id,
      title:        listing.title,
      description:  listing.description ?? '',
      price:        listing.price ? Number(listing.price) : null,
      currency:     listing.currency,
      propertyType: listing.propertyType,
      listingType:  listing.listingType,
      category:     listing.category ?? '',
      city:         listing.city,
      district:     listing.district ?? '',
      neighborhood: listing.neighborhood ?? '',
      roomCount:    listing.roomCount ?? '',
      areaM2:       listing.areaM2 ? Number(listing.areaM2) : null,
      buildingAge:  listing.buildingAge ?? null,
      hasParking:   listing.hasParking,
      hasElevator:  listing.hasElevator,
      hasBalcony:   listing.hasBalcony,
      coverPhoto:   cover?.url ?? null,
      whatsappLink: listing.whatsappLink ?? null,
      publishedAt:  listing.publishedAt ? Math.floor(listing.publishedAt.getTime() / 1000) : null,
      pricePerM2:   listing.price && listing.areaM2
        ? Math.round(Number(listing.price) / Number(listing.areaM2))
        : null,
    }
  }
}
