import {
  Injectable, BadRequestException, NotFoundException, ForbiddenException,
} from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

export type AuctionStatus = 'scheduled' | 'active' | 'ended' | 'cancelled'

@Injectable()
export class AuctionService {
  constructor(@InjectDataSource() private ds: DataSource) {}

  // ── Create ────────────────────────────────────────────────────────────────

  async createAuction(agencyId: string, dto: {
    listingId: string
    title: string
    description?: string
    startPrice: number
    reservePrice?: number
    minIncrement?: number
    buyNowPrice?: number
    startsAt: string
    endsAt: string
  }) {
    const starts = new Date(dto.startsAt)
    const ends = new Date(dto.endsAt)
    if (ends <= starts) throw new BadRequestException('Bitiş tarihi başlangıçtan sonra olmalı.')
    if (starts < new Date()) throw new BadRequestException('Başlangıç tarihi geçmişte olamaz.')
    if (dto.startPrice <= 0) throw new BadRequestException('Başlangıç fiyatı sıfırdan büyük olmalı.')

    const rows = await this.ds.query(`
      INSERT INTO auctions (
        listing_id, agency_id, title, description,
        start_price, reserve_price, min_increment, buy_now_price,
        current_price, starts_at, ends_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `, [
      dto.listingId, agencyId, dto.title, dto.description ?? null,
      dto.startPrice, dto.reservePrice ?? null,
      dto.minIncrement ?? 1000, dto.buyNowPrice ?? null,
      dto.startPrice, starts.toISOString(), ends.toISOString(),
    ])
    return rows[0] as Record<string, unknown>
  }

  // ── List ──────────────────────────────────────────────────────────────────

  async listAuctions(status?: AuctionStatus, page = 1, limit = 20) {
    const offset = (page - 1) * limit
    const where = status ? `WHERE a.status = '${status}'` : ''

    const rows = await this.ds.query(`
      SELECT
        a.*,
        l.title AS listing_title, l.city, l.district,
        l.property_type, l.listing_type,
        (SELECT lp.url FROM listing_photos lp WHERE lp.listing_id = l.id AND lp.is_cover = true LIMIT 1) AS cover_url,
        u.name AS winner_name
      FROM auctions a
      JOIN listings l ON l.id = a.listing_id
      LEFT JOIN users u ON u.id = a.winner_user_id
      ${where}
      ORDER BY a.ends_at ASC
      LIMIT $1 OFFSET $2
    `, [limit, offset])

    const countRow = await this.ds.query(
      `SELECT COUNT(*)::int AS total FROM auctions ${where}`,
    )
    return { data: rows, total: (countRow[0] as { total: number }).total, page, limit }
  }

  async getAgencyAuctions(agencyId: string) {
    return this.ds.query(`
      SELECT a.*, l.title AS listing_title, l.city
      FROM auctions a JOIN listings l ON l.id = a.listing_id
      WHERE a.agency_id = $1
      ORDER BY a.created_at DESC
    `, [agencyId])
  }

  // ── Detail ────────────────────────────────────────────────────────────────

  async getAuction(id: string) {
    const rows = await this.ds.query(`
      SELECT
        a.*,
        l.title AS listing_title, l.city, l.district, l.price AS original_price,
        l.property_type, l.listing_type, l.area_m2, l.room_count,
        l.description AS listing_description,
        (SELECT lp.url FROM listing_photos lp WHERE lp.listing_id = l.id AND lp.is_cover = true LIMIT 1) AS cover_url,
        (SELECT json_agg(lp.url ORDER BY lp.sort_order) FROM listing_photos lp WHERE lp.listing_id = l.id) AS photos,
        u.name AS winner_name
      FROM auctions a
      JOIN listings l ON l.id = a.listing_id
      LEFT JOIN users u ON u.id = a.winner_user_id
      WHERE a.id = $1
    `, [id])
    if (!rows[0]) throw new NotFoundException('Açık artırma bulunamadı.')
    return rows[0] as Record<string, unknown>
  }

  // ── Bids ──────────────────────────────────────────────────────────────────

  async getBids(auctionId: string, limit = 20) {
    return this.ds.query(`
      SELECT ab.id, ab.amount, ab.is_auto, ab.created_at,
             u.name AS bidder_name,
             LEFT(u.email, 3) || '***' AS bidder_email_masked
      FROM auction_bids ab
      JOIN users u ON u.id = ab.user_id
      WHERE ab.auction_id = $1
      ORDER BY ab.amount DESC
      LIMIT $2
    `, [auctionId, limit])
  }

  // ── Place Bid ─────────────────────────────────────────────────────────────

  async placeBid(auctionId: string, userId: string, amount: number, ip?: string) {
    // Load current auction state (row-level lock for concurrency)
    const aRows = await this.ds.query(
      `SELECT * FROM auctions WHERE id = $1 FOR UPDATE`, [auctionId],
    )
    const auction = aRows[0] as {
      status: AuctionStatus
      ends_at: string
      starts_at: string
      current_price: string
      min_increment: string
      buy_now_price: string | null
      agency_id: string
    } | undefined

    if (!auction) throw new NotFoundException('Açık artırma bulunamadı.')
    if (auction.status !== 'active') throw new BadRequestException('Açık artırma aktif değil.')
    if (new Date() > new Date(auction.ends_at)) throw new BadRequestException('Açık artırma sona erdi.')

    const current = Number(auction.current_price)
    const minIncrement = Number(auction.min_increment)
    const minBid = current + minIncrement

    if (amount < minBid) {
      throw new BadRequestException(
        `Minimum teklif: ${minBid.toLocaleString('tr-TR')} ₺ (mevcut + ${minIncrement.toLocaleString('tr-TR')} ₺ artış)`,
      )
    }

    // Check agency can't bid on own auction
    const userAgency = await this.ds.query(
      `SELECT id FROM agencies WHERE user_id = $1 LIMIT 1`, [userId],
    )
    if (userAgency[0]?.id === auction.agency_id) {
      throw new ForbiddenException('Kendi açık artırmanıza teklif veremezsiniz.')
    }

    // Insert bid + update auction
    const bidRows = await this.ds.query(`
      INSERT INTO auction_bids (auction_id, user_id, amount, ip_address)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [auctionId, userId, amount, ip ?? null])

    await this.ds.query(`
      UPDATE auctions SET
        current_price = $1,
        bid_count = bid_count + 1,
        updated_at = NOW()
      WHERE id = $2
    `, [amount, auctionId])

    const isBuyNow = auction.buy_now_price && amount >= Number(auction.buy_now_price)
    if (isBuyNow) {
      await this.closeAuction(auctionId, userId, bidRows[0]?.id as string)
    }

    return {
      bid: bidRows[0],
      currentPrice: amount,
      buyNowTriggered: !!isBuyNow,
    }
  }

  // ── Status management ─────────────────────────────────────────────────────

  async activateDueAuctions() {
    return this.ds.query(`
      UPDATE auctions SET status = 'active', updated_at = NOW()
      WHERE status = 'scheduled' AND starts_at <= NOW()
      RETURNING id, title
    `)
  }

  async closeExpiredAuctions() {
    const rows = await this.ds.query(`
      SELECT a.id,
        (SELECT ab.user_id FROM auction_bids ab WHERE ab.auction_id = a.id ORDER BY ab.amount DESC LIMIT 1) AS winner_user_id,
        (SELECT ab.id    FROM auction_bids ab WHERE ab.auction_id = a.id ORDER BY ab.amount DESC LIMIT 1) AS winner_bid_id
      FROM auctions a
      WHERE a.status = 'active' AND a.ends_at <= NOW()
    `)

    for (const row of rows as { id: string; winner_user_id: string | null; winner_bid_id: string | null }[]) {
      await this.ds.query(`
        UPDATE auctions SET
          status = 'ended',
          winner_user_id = $2,
          winner_bid_id = $3,
          updated_at = NOW()
        WHERE id = $1
      `, [row.id, row.winner_user_id, row.winner_bid_id])
    }
    return rows as Record<string, unknown>[]
  }

  async cancelAuction(id: string, agencyId: string) {
    const rows = await this.ds.query(
      `SELECT agency_id, status FROM auctions WHERE id = $1`, [id],
    )
    const a = rows[0] as { agency_id: string; status: AuctionStatus } | undefined
    if (!a) throw new NotFoundException('Bulunamadı.')
    if (a.agency_id !== agencyId) throw new ForbiddenException()
    if (a.status === 'ended') throw new BadRequestException('Sona eren açık artırma iptal edilemez.')

    await this.ds.query(
      `UPDATE auctions SET status = 'cancelled', updated_at = NOW() WHERE id = $1`, [id],
    )
  }

  private async closeAuction(id: string, winnerId: string, winnerBidId: string) {
    await this.ds.query(`
      UPDATE auctions SET status = 'ended', winner_user_id = $2, winner_bid_id = $3, updated_at = NOW()
      WHERE id = $1
    `, [id, winnerId, winnerBidId])
  }
}
