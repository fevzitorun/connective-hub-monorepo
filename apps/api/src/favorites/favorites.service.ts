import { Injectable } from '@nestjs/common'
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { Favorite } from './entities/favorite.entity'

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly repo: Repository<Favorite>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  // Kullanıcının tüm favorileri (ilan detaylarıyla birlikte)
  async findByUser(userId: string) {
    const rows = await this.dataSource.query(
      `SELECT
         l.id, l.title, l.price, l.currency, l.city, l.district,
         l.property_type AS "propertyType", l.listing_type AS "listingType",
         l.room_count AS "roomCount", l.area_m2 AS "areaM2",
         l.whatsapp_link AS "whatsappLink", l.status,
         f.created_at AS "favoritedAt",
         (SELECT url FROM listing_photos WHERE listing_id = l.id AND is_cover = true LIMIT 1) AS "coverPhoto"
       FROM favorites f
       JOIN listings l ON l.id = f.listing_id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    )
    return rows
  }

  // Favori ekle (zaten varsa sessizce geç)
  async add(userId: string, listingId: string): Promise<void> {
    await this.dataSource.query(
      `INSERT INTO favorites (user_id, listing_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, listingId]
    )
    // favorite_count sayacını artır
    await this.dataSource.query(
      `UPDATE listings SET favorite_count = favorite_count + 1 WHERE id = $1`,
      [listingId]
    )
  }

  // Favori kaldır
  async remove(userId: string, listingId: string): Promise<void> {
    const result = await this.dataSource.query(
      `DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2`,
      [userId, listingId]
    )
    const deleted = result[1] ?? 0
    if (deleted > 0) {
      await this.dataSource.query(
        `UPDATE listings SET favorite_count = GREATEST(0, favorite_count - 1) WHERE id = $1`,
        [listingId]
      )
    }
  }

  // Belirli ilanların favori durumunu toplu kontrol et
  async checkBatch(userId: string, listingIds: string[]): Promise<Record<string, boolean>> {
    if (listingIds.length === 0) return {}
    const rows = await this.repo.find({
      where: listingIds.map((lid) => ({ userId, listingId: lid })),
      select: ['listingId'],
    })
    const set = new Set(rows.map((r) => r.listingId))
    return Object.fromEntries(listingIds.map((id) => [id, set.has(id)]))
  }

  // Tek ilan favori mi?
  async isFavorite(userId: string, listingId: string): Promise<boolean> {
    const count = await this.repo.count({ where: { userId, listingId } })
    return count > 0
  }
}
