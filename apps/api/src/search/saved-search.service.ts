import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SavedSearch, AlertChannel } from './entities/saved-search.entity'

@Injectable()
export class SavedSearchService {
  constructor(
    @InjectRepository(SavedSearch)
    private readonly repo: Repository<SavedSearch>,
  ) {}

  async findByUser(userId: string): Promise<SavedSearch[]> {
    return this.repo.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    })
  }

  async create(
    userId: string,
    filters: Record<string, any>,
    channel: AlertChannel,
    label?: string,
  ): Promise<SavedSearch> {
    // Aynı filtrelerle alarm varsa güncelle
    const existing = await this.repo.findOne({ where: { userId, isActive: true } })

    // Otomatik etiket üret
    const autoLabel = this.generateLabel(filters)

    const alert = this.repo.create({
      userId,
      filters,
      channel,
      label: label ?? autoLabel,
    })
    return this.repo.save(alert)
  }

  async remove(id: string, userId: string): Promise<void> {
    const alert = await this.repo.findOne({ where: { id } })
    if (!alert) throw new NotFoundException()
    if (alert.userId !== userId) throw new ForbiddenException()
    await this.repo.remove(alert)
  }

  /** Yeni ilan eklenince aktif alarmlarla eşleştir (Modül 13'te e-posta ile tetiklenir) */
  async findMatchingAlerts(listing: {
    city: string
    district?: string
    propertyType: string
    listingType: string
    price?: number
    areaM2?: number
    roomCount?: string
  }): Promise<SavedSearch[]> {
    const all = await this.repo.find({ where: { isActive: true } })
    return all.filter((alert) => {
      const f = alert.filters
      if (f.city         && f.city         !== listing.city)         return false
      if (f.district     && f.district     !== listing.district)     return false
      if (f.propertyType && f.propertyType !== listing.propertyType) return false
      if (f.listingType  && f.listingType  !== listing.listingType)  return false
      if (f.priceMax     && listing.price  && listing.price > f.priceMax) return false
      if (f.priceMin     && listing.price  && listing.price < f.priceMin) return false
      if (f.roomCount    && f.roomCount    !== listing.roomCount)    return false
      return true
    })
  }

  private generateLabel(filters: Record<string, any>): string {
    const parts: string[] = []
    if (filters.city)         parts.push(filters.city)
    if (filters.district)     parts.push(filters.district)
    if (filters.roomCount)    parts.push(filters.roomCount)
    if (filters.listingType === 'sale') parts.push('Satılık')
    if (filters.listingType === 'rent') parts.push('Kiralık')
    return parts.join(' ') || 'Kayıtlı Arama'
  }
}
