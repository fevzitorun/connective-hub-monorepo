import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@Injectable()
export class AdminService {
  constructor(@InjectDataSource() private ds: DataSource) {}

  // ── Users ─────────────────────────────────────────────────────────────────

  async listUsers(opts: {
    page: number; limit: number; role?: string; q?: string; isActive?: boolean
  }) {
    const { page, limit, role, q, isActive } = opts
    const offset = (page - 1) * limit
    const conditions: string[] = []
    const params: unknown[] = []
    let pi = 1

    if (role) { conditions.push(`u.role = $${pi++}`); params.push(role) }
    if (q) { conditions.push(`(u.email ILIKE $${pi} OR u.full_name ILIKE $${pi})`); pi++; params.push(`%${q}%`) }
    if (isActive !== undefined) { conditions.push(`u.is_active = $${pi++}`); params.push(isActive) }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const rows = await this.ds.query(`
      SELECT
        u.id, u.email, u.full_name, u.role, u.is_active,
        u.phone, u.created_at,
        a.id AS agency_id, a.company_name, a.plan, a.is_verified
      FROM users u
      LEFT JOIN agencies a ON a.user_id = u.id
      ${where}
      ORDER BY u.created_at DESC
      LIMIT $${pi} OFFSET $${pi + 1}
    `, [...params, limit, offset])

    const countRow = await this.ds.query(
      `SELECT COUNT(*)::int AS total FROM users u ${where}`, params,
    )

    return { data: rows, total: (countRow[0] as { total: number }).total, page, limit }
  }

  async getUser(id: string) {
    const rows = await this.ds.query(`
      SELECT
        u.*,
        a.id AS agency_id, a.company_name, a.plan, a.is_verified, a.license_no, a.city,
        (SELECT COUNT(*)::int FROM listings l WHERE l.owner_user_id = u.id) AS listing_count,
        (SELECT COUNT(*)::int FROM favorites f WHERE f.user_id = u.id) AS favorite_count
      FROM users u
      LEFT JOIN agencies a ON a.user_id = u.id
      WHERE u.id = $1
    `, [id])
    if (!rows[0]) throw new NotFoundException('Kullanıcı bulunamadı.')
    const u = rows[0] as Record<string, unknown>
    delete u['password']
    delete u['refresh_token_hash']
    return u
  }

  async updateUser(id: string, data: { isActive?: boolean; role?: string }) {
    const sets: string[] = []
    const params: unknown[] = []
    let pi = 1
    if (data.isActive !== undefined) { sets.push(`is_active = $${pi++}`); params.push(data.isActive) }
    if (data.role) { sets.push(`role = $${pi++}`); params.push(data.role) }
    if (sets.length === 0) return
    params.push(id)
    await this.ds.query(
      `UPDATE users SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${pi}`, params,
    )
  }

  // ── Agencies ──────────────────────────────────────────────────────────────

  async listAgencies(opts: { page: number; limit: number; plan?: string; q?: string; isVerified?: boolean }) {
    const { page, limit, plan, q, isVerified } = opts
    const offset = (page - 1) * limit
    const conditions: string[] = []
    const params: unknown[] = []
    let pi = 1

    if (plan) { conditions.push(`a.plan = $${pi++}`); params.push(plan) }
    if (q) { conditions.push(`(a.company_name ILIKE $${pi} OR u.email ILIKE $${pi})`); pi++; params.push(`%${q}%`) }
    if (isVerified !== undefined) { conditions.push(`a.is_verified = $${pi++}`); params.push(isVerified) }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const rows = await this.ds.query(`
      SELECT
        a.id, a.company_name, a.license_no, a.plan, a.is_verified,
        a.city, a.subdomain, a.created_at,
        u.email, u.full_name, u.is_active,
        (SELECT COUNT(*)::int FROM listings l WHERE l.agency_id = a.id) AS listing_count,
        (SELECT COUNT(*)::int FROM listings l WHERE l.agency_id = a.id AND l.status = 'active') AS active_listings,
        COALESCE((SELECT s.plan FROM subscriptions s WHERE s.agency_id = a.id AND s.status = 'active' LIMIT 1), 'none') AS sub_plan,
        (SELECT s.ends_at FROM subscriptions s WHERE s.agency_id = a.id AND s.status = 'active' LIMIT 1) AS sub_expires
      FROM agencies a
      JOIN users u ON u.id = a.user_id
      ${where}
      ORDER BY a.created_at DESC
      LIMIT $${pi} OFFSET $${pi + 1}
    `, [...params, limit, offset])

    const countRow = await this.ds.query(
      `SELECT COUNT(*)::int AS total FROM agencies a JOIN users u ON u.id = a.user_id ${where}`, params,
    )

    return { data: rows, total: (countRow[0] as { total: number }).total, page, limit }
  }

  async verifyAgency(id: string, verified: boolean) {
    const rows = await this.ds.query(`SELECT id FROM agencies WHERE id = $1`, [id])
    if (!rows[0]) throw new NotFoundException('Ajans bulunamadı.')
    await this.ds.query(
      `UPDATE agencies SET is_verified = $1, updated_at = NOW() WHERE id = $2`, [verified, id],
    )
  }

  async updateAgencyPlan(id: string, plan: string) {
    const valid = ['free', 'pro', 'corporate']
    if (!valid.includes(plan)) throw new BadRequestException('Geçersiz plan.')
    await this.ds.query(`UPDATE agencies SET plan = $1, updated_at = NOW() WHERE id = $2`, [plan, id])
  }

  // ── Listings ──────────────────────────────────────────────────────────────

  async listListings(opts: {
    page: number; limit: number; status?: string; q?: string; city?: string
  }) {
    const { page, limit, status, q, city } = opts
    const offset = (page - 1) * limit
    const conditions: string[] = []
    const params: unknown[] = []
    let pi = 1

    if (status) { conditions.push(`l.status = $${pi++}`); params.push(status) }
    if (city) { conditions.push(`l.city ILIKE $${pi++}`); params.push(`%${city}%`) }
    if (q) { conditions.push(`l.title ILIKE $${pi++}`); params.push(`%${q}%`) }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const rows = await this.ds.query(`
      SELECT
        l.id, l.title, l.status, l.listing_type, l.property_type,
        l.city, l.district, l.price, l.currency,
        l.view_count, l.whatsapp_clicks, l.favorite_count,
        l.created_at, l.published_at,
        a.company_name AS agency_name,
        u.email AS owner_email,
        (SELECT lp.url FROM listing_photos lp WHERE lp.listing_id = l.id AND lp.is_cover = true LIMIT 1) AS cover_url
      FROM listings l
      LEFT JOIN agencies a ON a.id = l.agency_id
      LEFT JOIN users u ON u.id = l.owner_user_id
      ${where}
      ORDER BY l.created_at DESC
      LIMIT $${pi} OFFSET $${pi + 1}
    `, [...params, limit, offset])

    const countRow = await this.ds.query(
      `SELECT COUNT(*)::int AS total FROM listings l ${where}`, params,
    )

    return { data: rows, total: (countRow[0] as { total: number }).total, page, limit }
  }

  async updateListingStatus(id: string, status: string) {
    const valid = ['active', 'passive', 'pending', 'rejected', 'sold', 'rented']
    if (!valid.includes(status)) throw new BadRequestException('Geçersiz durum.')
    await this.ds.query(
      `UPDATE listings SET status = $1, updated_at = NOW() WHERE id = $2`, [status, id],
    )
  }

  async deleteListing(id: string) {
    await this.ds.query(`DELETE FROM listings WHERE id = $1`, [id])
  }

  // ── Subscriptions ─────────────────────────────────────────────────────────

  async listSubscriptions(opts: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = opts
    const offset = (page - 1) * limit

    const params: unknown[] = []
    let pi = 1
    const where = status ? `WHERE s.status = $${pi++}` : ''
    if (status) params.push(status)

    const rows = await this.ds.query(`
      SELECT
        s.id, s.plan, s.status, s.amount, s.currency,
        s.starts_at, s.ends_at, s.created_at,
        a.company_name, a.city,
        u.email
      FROM subscriptions s
      JOIN agencies a ON a.id = s.agency_id
      JOIN users u ON u.id = a.user_id
      ${where}
      ORDER BY s.created_at DESC
      LIMIT $${pi} OFFSET $${pi + 1}
    `, [...params, limit, offset])

    const countRow = await this.ds.query(
      `SELECT COUNT(*)::int AS total FROM subscriptions s ${where}`, params,
    )

    return { data: rows, total: (countRow[0] as { total: number }).total, page, limit }
  }

  async upsertSubscription(agencyId: string, plan: string, months: number) {
    const valid = ['free', 'pro', 'corporate', 'enterprise']
    if (!valid.includes(plan)) throw new BadRequestException('Geçersiz plan.')

    const planPrices: Record<string, number> = { free: 0, pro: 499, corporate: 999, enterprise: 2499 }
    const amount = (planPrices[plan] ?? 0) * months
    const expiresAt = new Date(Date.now() + months * 30 * 24 * 3_600_000).toISOString()

    // Deactivate existing
    await this.ds.query(
      `UPDATE subscriptions SET status = 'cancelled' WHERE agency_id = $1 AND status = 'active'`, [agencyId],
    )
    await this.ds.query(`
      INSERT INTO subscriptions (agency_id, plan, status, amount, currency, starts_at, ends_at)
      VALUES ($1, $2, 'active', $3, 'TRY', NOW(), $4)
    `, [agencyId, plan, amount, expiresAt])

    // Sync agency plan
    await this.ds.query(`UPDATE agencies SET plan = $1, updated_at = NOW() WHERE id = $2`, [plan, agencyId])
  }

  // ── AI token kullanım istatistikleri ──────────────────────────────────────

  async getAiStats() {
    const [filterra, atlas, scribe] = await Promise.all([
      this.ds.query(`
        SELECT
          COUNT(*)::int                                           AS total_calls,
          COALESCE(SUM(tokens_used), 0)::int                     AS total_tokens,
          COALESCE(SUM(tokens_used) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours'), 0)::int AS tokens_24h,
          COALESCE(SUM(tokens_used) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days'), 0)::int  AS tokens_7d,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours')::int                     AS calls_24h,
          agent_type,
          COUNT(*) AS agent_calls
        FROM filterra_reports
        GROUP BY agent_type
        ORDER BY agent_calls DESC
      `),
      this.ds.query(`
        SELECT
          COUNT(*)::int                                           AS total_messages,
          COALESCE(SUM(tokens_used), 0)::int                     AS total_tokens,
          COALESCE(SUM(tokens_used) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours'), 0)::int AS tokens_24h,
          COALESCE(SUM(tokens_used) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days'), 0)::int  AS tokens_7d
        FROM atlas_messages
        WHERE role = 'assistant'
      `),
      this.ds.query(`
        SELECT
          COUNT(*)::int                                           AS total_calls,
          COALESCE(SUM(tokens_used), 0)::int                     AS total_tokens,
          COALESCE(SUM(tokens_used) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours'), 0)::int AS tokens_24h,
          COALESCE(SUM(tokens_used) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days'), 0)::int  AS tokens_7d
        FROM scribe_contents
      `),
    ])

    const filerra0 = filterra[0] as Record<string, number> ?? {}
    const atlas0 = atlas[0] as Record<string, number> ?? {}
    const scribe0 = scribe[0] as Record<string, number> ?? {}

    const totalTokens = (filerra0['total_tokens'] ?? 0) + (atlas0['total_tokens'] ?? 0) + (scribe0['total_tokens'] ?? 0)
    const tokens24h = (filerra0['tokens_24h'] ?? 0) + (atlas0['tokens_24h'] ?? 0) + (scribe0['tokens_24h'] ?? 0)
    const tokens7d = (filerra0['tokens_7d'] ?? 0) + (atlas0['tokens_7d'] ?? 0) + (scribe0['tokens_7d'] ?? 0)

    return {
      summary: { totalTokens, tokens24h, tokens7d },
      filterra: { totalCalls: filerra0['total_calls'] ?? 0, totalTokens: filerra0['total_tokens'] ?? 0, tokens24h: filerra0['tokens_24h'] ?? 0, byAgent: filterra },
      atlas: { totalMessages: atlas0['total_messages'] ?? 0, totalTokens: atlas0['total_tokens'] ?? 0, tokens24h: atlas0['tokens_24h'] ?? 0 },
      scribe: { totalCalls: scribe0['total_calls'] ?? 0, totalTokens: scribe0['total_tokens'] ?? 0, tokens24h: scribe0['tokens_24h'] ?? 0 },
    }
  }

  // ── Summary stats ─────────────────────────────────────────────────────────

  async getDashboardStats() {
    const [users, listings, agencies, subs, leads, auctions] = await Promise.all([
      this.ds.query(`SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE is_active)::int AS active,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS new_7d,
        COUNT(*) FILTER (WHERE role = 'agency')::int AS agencies,
        COUNT(*) FILTER (WHERE role = 'buyer')::int AS buyers
        FROM users`),
      this.ds.query(`SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'active')::int AS active,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS new_7d
        FROM listings`),
      this.ds.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE is_verified)::int AS verified FROM agencies`),
      this.ds.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'active')::int AS active FROM subscriptions`),
      this.ds.query(`SELECT COUNT(*)::int AS total FROM mortgage_leads`),
      this.ds.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'active')::int AS live FROM auctions`),
    ])

    return {
      users: users[0],
      listings: listings[0],
      agencies: agencies[0],
      subscriptions: subs[0],
      mortgageLeads: (leads[0] as { total: number }).total,
      auctions: auctions[0],
    }
  }
}
