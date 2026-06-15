import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger,
} from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { Listing, ListingStatus } from './entities/listing.entity'
import { ListingPhoto } from './entities/listing-photo.entity'
import { CreateListingDto } from './dto/create-listing.dto'
import { ListingFiltersDto } from './dto/listing-filters.dto'
import { WhatsappService } from '../common/services/whatsapp.service'
import { StorageService } from '../storage/storage.service'
import { UsersService } from '../users/users.service'
import { UserRole } from '../users/entities/user.entity'
import { SearchService } from '../search/search.service'

const LISTING_EXPIRY_DAYS = 15

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepo: Repository<Listing>,
    @InjectRepository(ListingPhoto)
    private readonly photoRepo: Repository<ListingPhoto>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly whatsappService: WhatsappService,
    private readonly storageService: StorageService,
    private readonly usersService: UsersService,
    private readonly searchService: SearchService,
  ) {}

  // ─── Oluştur ─────────────────────────────────────────────────────────────

  async create(dto: CreateListingDto, userId: string): Promise<Listing> {
    const user = await this.usersService.findById(userId)
    const agency = await this.usersService.findAgencyByUserId(userId)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + LISTING_EXPIRY_DAYS)

    const listing = this.listingRepo.create({
      ...dto,
      ownerUserId: userId,
      agencyId: agency?.id,
      status: ListingStatus.DRAFT,
      expiresAt,
      // PostGIS Point — raw string format
      coordinates: dto.lat && dto.lng
        ? () => `ST_SetSRID(ST_MakePoint(${dto.lng}, ${dto.lat}), 4326)`
        : undefined,
    })

    const saved = await this.listingRepo.save(listing)

    // WhatsApp Deep Link + QR oluştur
    if (dto.agentPhone) {
      await this.attachWhatsApp(saved, dto.agentPhone, user.phone ?? dto.agentPhone)
    }

    await this.usersService.audit({ userId, action: 'LISTING_CREATED', resource: saved.id })

    return this.findById(saved.id)
  }

  // ─── Listele (filtrelenmiş) ───────────────────────────────────────────────

  async findAll(filters: ListingFiltersDto) {
    const page    = filters.page    ?? 1
    const perPage = filters.perPage ?? 20
    const offset  = (page - 1) * perPage

    // Coğrafi arama için raw query kullan
    if (filters.lat && filters.lng) {
      return this.geoSearch(filters, page, perPage, offset)
    }

    const qb = this.listingRepo.createQueryBuilder('l')
      .leftJoinAndSelect('l.photos', 'photos')
      .where('l.status = :status', { status: ListingStatus.ACTIVE })

    if (filters.city)         qb.andWhere('l.city = :city', { city: filters.city })
    if (filters.district)     qb.andWhere('l.district = :district', { district: filters.district })
    if (filters.neighborhood) qb.andWhere('l.neighborhood = :neighborhood', { neighborhood: filters.neighborhood })
    if (filters.propertyType) qb.andWhere('l.property_type = :pt', { pt: filters.propertyType })
    if (filters.listingType)  qb.andWhere('l.listing_type = :lt', { lt: filters.listingType })
    if (filters.category)     qb.andWhere('l.category = :cat', { cat: filters.category })
    if (filters.priceMin)     qb.andWhere('l.price >= :pMin', { pMin: filters.priceMin })
    if (filters.priceMax)     qb.andWhere('l.price <= :pMax', { pMax: filters.priceMax })
    if (filters.areaMin)      qb.andWhere('l.area_m2 >= :aMin', { aMin: filters.areaMin })
    if (filters.areaMax)      qb.andWhere('l.area_m2 <= :aMax', { aMax: filters.areaMax })
    if (filters.roomCount)    qb.andWhere('l.room_count = :rc', { rc: filters.roomCount })
    if (filters.hasParking)   qb.andWhere('l.has_parking = true')
    if (filters.hasElevator)  qb.andWhere('l.has_elevator = true')

    // Sıralama
    switch (filters.sortBy) {
      case 'price_asc':  qb.orderBy('l.price', 'ASC');       break
      case 'price_desc': qb.orderBy('l.price', 'DESC');      break
      case 'area_asc':   qb.orderBy('l.area_m2', 'ASC');     break
      default:           qb.orderBy('l.published_at', 'DESC')
    }

    const [data, total] = await qb.skip(offset).take(perPage).getManyAndCount()
    return { data, total, page, perPage, totalPages: Math.ceil(total / perPage) }
  }

  private async geoSearch(filters: ListingFiltersDto, page: number, perPage: number, offset: number) {
    const radiusM = (filters.radiusKm ?? 5) * 1000

    const result = await this.dataSource.query(
      `SELECT l.*, ST_Distance(l.coordinates::geography, ST_MakePoint($1,$2)::geography) as distance
       FROM listings l
       WHERE l.status = 'active'
       AND ST_DWithin(l.coordinates::geography, ST_MakePoint($1,$2)::geography, $3)
       ORDER BY distance ASC
       LIMIT $4 OFFSET $5`,
      [filters.lng, filters.lat, radiusM, perPage, offset]
    )

    return { data: result, total: result.length, page, perPage }
  }

  // ─── Tekil getir ─────────────────────────────────────────────────────────

  async findById(id: string): Promise<Listing> {
    const listing = await this.listingRepo.findOne({
      where: { id },
      relations: ['photos', 'agency'],
    })
    if (!listing) throw new NotFoundException('İlan bulunamadı')
    return listing
  }

  // ─── Görüntülenme say ─────────────────────────────────────────────────────

  async getSitemapIds(): Promise<string[]> {
    const rows = await this.listingRepo.find({
      where: { status: ListingStatus.ACTIVE },
      select: ['id'],
      order: { publishedAt: 'DESC' },
      take: 50000,
    })
    return rows.map((r) => r.id)
  }

  async incrementView(id: string): Promise<void> {
    await this.listingRepo.increment({ id }, 'viewCount', 1)
  }

  async incrementWhatsappClick(id: string): Promise<void> {
    await this.listingRepo.increment({ id }, 'whatsappClicks', 1)
  }

  // ─── Güncelle ─────────────────────────────────────────────────────────────

  async update(id: string, dto: Partial<CreateListingDto>, userId: string): Promise<Listing> {
    const listing = await this.findById(id)
    if (listing.ownerUserId !== userId) throw new ForbiddenException()

    Object.assign(listing, dto)

    if (dto.lat && dto.lng) {
      await this.dataSource.query(
        `UPDATE listings SET coordinates = ST_SetSRID(ST_MakePoint($1,$2),4326) WHERE id = $3`,
        [dto.lng, dto.lat, id]
      )
    }

    return this.listingRepo.save(listing)
  }

  // ─── Yayınla ──────────────────────────────────────────────────────────────

  async publish(id: string, userId: string): Promise<Listing> {
    const listing = await this.findById(id)
    if (listing.ownerUserId !== userId) throw new ForbiddenException()

    listing.status      = ListingStatus.ACTIVE
    listing.publishedAt = new Date()

    const published = await this.listingRepo.save(listing)

    // Meilisearch'e indeksle
    await this.searchService.indexListing(published)

    return published
  }

  // ─── Sil ──────────────────────────────────────────────────────────────────

  async remove(id: string, userId: string): Promise<void> {
    const listing = await this.findById(id)
    if (listing.ownerUserId !== userId) throw new ForbiddenException()

    // R2'deki fotoğrafları sil
    for (const photo of listing.photos ?? []) {
      await this.storageService.delete(photo.r2Key)
    }

    await this.listingRepo.remove(listing)

    // Meilisearch'ten kaldır
    await this.searchService.removeListing(id)
  }

  // ─── Fotoğraf yükle ───────────────────────────────────────────────────────

  async uploadPhoto(
    listingId: string,
    userId: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<ListingPhoto> {
    const listing = await this.findById(listingId)
    if (listing.ownerUserId !== userId) throw new ForbiddenException()

    const photoCount = await this.photoRepo.count({ where: { listingId } })
    if (photoCount >= 20) throw new BadRequestException('Bir ilana en fazla 20 fotoğraf eklenebilir')

    const { url, key } = await this.storageService.upload(buffer, {
      folder: `listings/${listingId}`,
      mimeType,
    })

    const photo = this.photoRepo.create({
      listingId,
      url,
      r2Key: key,
      sortOrder: photoCount,
      isCover: photoCount === 0,
    })

    return this.photoRepo.save(photo)
  }

  async deletePhoto(photoId: string, userId: string): Promise<void> {
    const photo = await this.photoRepo.findOne({
      where: { id: photoId },
      relations: ['listing'],
    })
    if (!photo) throw new NotFoundException()
    if (photo.listing.ownerUserId !== userId) throw new ForbiddenException()

    await this.storageService.delete(photo.r2Key)
    await this.photoRepo.remove(photo)
  }

  async reorderPhotos(listingId: string, userId: string, orderedIds: string[]): Promise<void> {
    const listing = await this.findById(listingId)
    if (listing.ownerUserId !== userId) throw new ForbiddenException()

    await Promise.all(
      orderedIds.map((photoId, index) =>
        this.photoRepo.update(photoId, {
          sortOrder: index,
          isCover: index === 0,
        })
      )
    )
  }

  // ─── WhatsApp ────────────────────────────────────────────────────────────

  private async attachWhatsApp(listing: Listing, agentPhone: string, fallbackPhone: string): Promise<void> {
    const phone = WhatsappService.normalizePhone(agentPhone || fallbackPhone)
    const { link, qrUrl } = await this.whatsappService.generateForListing({
      agentPhone: phone,
      listingId:    listing.id,
      listingTitle: listing.title,
      city:         listing.city,
    })
    await this.listingRepo.update(listing.id, { whatsappLink: link, whatsappQrUrl: qrUrl })
  }

  // ─── Emlakçı ilanları ────────────────────────────────────────────────────

  async findByAgency(agencyId: string, page = 1, perPage = 20) {
    const [data, total] = await this.listingRepo.findAndCount({
      where: { agencyId },
      relations: ['photos'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * perPage,
      take: perPage,
    })
    return { data, total, page, perPage }
  }

  // ─── Zamanlanmış görevler ─────────────────────────────────────────────────

  private readonly logger = new Logger(ListingsService.name)

  /** Her gün 03:00'te süresi dolmuş ilanları pasife çeker */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async expireListings() {
    const result = await this.dataSource.query(`
      UPDATE listings
      SET status = 'expired', updated_at = NOW()
      WHERE status = 'active'
        AND expires_at IS NOT NULL
        AND expires_at < NOW()
    `)
    const count = result[1] ?? 0
    if (count > 0) this.logger.log(`${count} ilan süresi doldu → 'expired' yapıldı`)
  }

  /** Her gün 04:00'te kullanılmış/süresi dolmuş doğrulama tokenlarını temizle */
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async cleanExpiredTokens() {
    await this.dataSource.query(`
      DELETE FROM email_verification_tokens
      WHERE expires_at < NOW() OR used_at IS NOT NULL
    `)
    await this.dataSource.query(`
      DELETE FROM password_reset_tokens
      WHERE expires_at < NOW() OR used_at IS NOT NULL
    `)
  }
}
