import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@Injectable()
export class AnalyticsService {
  constructor(@InjectDataSource() private ds: DataSource) {}

  // ── Agency Dashboard ──────────────────────────────────────────────────────

  async getAgencyStats(agencyId: string) {
    const [overview, statusDist, topListings, trend] = await Promise.all([
      this.agencyOverview(agencyId),
      this.agencyStatusDistribution(agencyId),
      this.agencyTopListings(agencyId),
      this.agencyTrend(agencyId, 30),
    ])
    return { overview, statusDist, topListings, trend }
  }

  private async agencyOverview(agencyId: string) {
    const rows = await this.ds.query(`
      SELECT
        COUNT(*)::int                                       AS total_listings,
        COUNT(*) FILTER (WHERE status = 'active')::int      AS active_listings,
        COALESCE(SUM(view_count), 0)::int                  AS total_views,
        COALESCE(SUM(whatsapp_clicks), 0)::int             AS total_wa_clicks,
        COALESCE(SUM(favorite_count), 0)::int              AS total_favorites,
        COALESCE(AVG(NULLIF(view_count, 0)), 0)::int       AS avg_views_per_listing,
        COALESCE(
          ROUND(SUM(whatsapp_clicks)::numeric / NULLIF(SUM(view_count), 0) * 100, 1),
          0
        )                                                  AS wa_conversion_rate
      FROM listings
      WHERE agency_id = $1
    `, [agencyId])

    const r = rows[0] as {
      total_listings: number; active_listings: number
      total_views: number; total_wa_clicks: number; total_favorites: number
      avg_views_per_listing: number; wa_conversion_rate: string
    }

    // Mortgage leads count
    const leads = await this.ds.query(
      `SELECT COUNT(*)::int AS cnt FROM mortgage_leads WHERE listing_id IN
       (SELECT id FROM listings WHERE agency_id = $1)`,
      [agencyId],
    )

    // Legal cases count
    const legal = await this.ds.query(
      `SELECT COUNT(*)::int AS cnt FROM legal_cases WHERE listing_id IN
       (SELECT id FROM listings WHERE agency_id = $1)`,
      [agencyId],
    )

    return {
      totalListings: r?.total_listings ?? 0,
      activeListings: r?.active_listings ?? 0,
      totalViews: r?.total_views ?? 0,
      totalWaClicks: r?.total_wa_clicks ?? 0,
      totalFavorites: r?.total_favorites ?? 0,
      avgViewsPerListing: r?.avg_views_per_listing ?? 0,
      waConversionRate: Number(r?.wa_conversion_rate ?? 0),
      mortgageLeads: (leads[0] as { cnt: number }).cnt ?? 0,
      legalCases: (legal[0] as { cnt: number }).cnt ?? 0,
    }
  }

  private async agencyStatusDistribution(agencyId: string) {
    const rows = await this.ds.query(`
      SELECT status, COUNT(*)::int AS cnt
      FROM listings WHERE agency_id = $1
      GROUP BY status ORDER BY cnt DESC
    `, [agencyId])
    return rows as { status: string; cnt: number }[]
  }

  private async agencyTopListings(agencyId: string, limit = 10) {
    const rows = await this.ds.query(`
      SELECT
        l.id, l.title, l.status, l.listing_type,
        l.city, l.district, l.price, l.currency,
        l.view_count, l.whatsapp_clicks, l.favorite_count,
        CASE WHEN l.view_count > 0
          THEN ROUND(l.whatsapp_clicks::numeric / l.view_count * 100, 1)
          ELSE 0
        END AS conversion_rate,
        l.published_at
      FROM listings l
      WHERE l.agency_id = $1
      ORDER BY l.view_count DESC NULLS LAST
      LIMIT $2
    `, [agencyId, limit])
    return rows as {
      id: string; title: string; status: string; listing_type: string
      city: string; district: string; price: string; currency: string
      view_count: number; whatsapp_clicks: number; favorite_count: number
      conversion_rate: string; published_at: string
    }[]
  }

  private async agencyTrend(agencyId: string, days: number) {
    // WA clicks per day from whatsapp_clicks table
    const waRows = await this.ds.query(`
      SELECT
        DATE(wc.created_at) AS day,
        COUNT(*)::int AS clicks
      FROM whatsapp_clicks wc
      JOIN listings l ON l.id = wc.listing_id
      WHERE l.agency_id = $1
        AND wc.created_at >= NOW() - INTERVAL '${Number(days)} days'
      GROUP BY day
      ORDER BY day ASC
    `, [agencyId])

    // New listings per day
    const listingRows = await this.ds.query(`
      SELECT
        DATE(created_at) AS day,
        COUNT(*)::int AS new_listings
      FROM listings
      WHERE agency_id = $1
        AND created_at >= NOW() - INTERVAL '${Number(days)} days'
      GROUP BY day
      ORDER BY day ASC
    `, [agencyId])

    return {
      waClicks: waRows as { day: string; clicks: number }[],
      newListings: listingRows as { day: string; new_listings: number }[],
    }
  }

  // Per-listing performance (paginated)
  async getListingPerformance(agencyId: string, page = 1, limit = 20, sort = 'views') {
    const sortCol = sort === 'wa' ? 'l.whatsapp_clicks'
      : sort === 'favorites' ? 'l.favorite_count'
      : 'l.view_count'

    const rows = await this.ds.query(`
      SELECT
        l.id, l.title, l.status, l.listing_type, l.property_type,
        l.city, l.district, l.price, l.currency, l.area_m2,
        l.view_count, l.whatsapp_clicks, l.favorite_count,
        CASE WHEN l.view_count > 0
          THEN ROUND(l.whatsapp_clicks::numeric / l.view_count * 100, 1)
          ELSE 0 END AS conversion_rate,
        (SELECT COUNT(*)::int FROM mortgage_leads ml WHERE ml.listing_id = l.id) AS lead_count,
        (SELECT COUNT(*)::int FROM legal_cases lc WHERE lc.listing_id = l.id)    AS legal_count,
        (SELECT lp.url FROM listing_photos lp WHERE lp.listing_id = l.id AND lp.is_cover = true LIMIT 1) AS cover_url,
        l.published_at, l.created_at
      FROM listings l
      WHERE l.agency_id = $1
      ORDER BY ${sortCol} DESC NULLS LAST
      LIMIT $2 OFFSET $3
    `, [agencyId, limit, (page - 1) * limit])

    const countRow = await this.ds.query(
      `SELECT COUNT(*)::int AS total FROM listings WHERE agency_id = $1`, [agencyId],
    )

    return {
      data: rows,
      total: (countRow[0] as { total: number }).total,
      page,
      limit,
    }
  }

  // ── Admin Global Analytics ────────────────────────────────────────────────

  async getAdminStats() {
    const [platform, topAgencies, recentActivity, cityDist] = await Promise.all([
      this.platformOverview(),
      this.topAgenciesByListings(),
      this.recentActivity(),
      this.cityDistribution(),
    ])
    return { platform, topAgencies, recentActivity, cityDist }
  }

  private async platformOverview() {
    const [users, listings, wa, legal, leads] = await Promise.all([
      this.ds.query(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS new_30d,
          COUNT(*) FILTER (WHERE role = 'agency')::int AS agencies,
          COUNT(*) FILTER (WHERE role = 'buyer')::int  AS buyers,
          COUNT(*) FILTER (WHERE role = 'lawyer')::int AS lawyers
        FROM users WHERE is_active = true
      `),
      this.ds.query(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'active')::int  AS active,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS new_30d,
          COALESCE(SUM(view_count), 0)::int               AS total_views,
          COALESCE(SUM(whatsapp_clicks), 0)::int          AS total_wa
        FROM listings
      `),
      this.ds.query(`SELECT COUNT(*)::int AS total FROM whatsapp_clicks WHERE created_at >= NOW() - INTERVAL '30 days'`),
      this.ds.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'approved')::int AS approved FROM legal_cases`),
      this.ds.query(`SELECT COUNT(*)::int AS total FROM mortgage_leads`),
    ])

    const u = users[0] as { total: number; new_30d: number; agencies: number; buyers: number; lawyers: number }
    const l = listings[0] as { total: number; active: number; new_30d: number; total_views: number; total_wa: number }
    const le = legal[0] as { total: number; approved: number }

    return {
      users: { total: u.total, new30d: u.new_30d, agencies: u.agencies, buyers: u.buyers, lawyers: u.lawyers },
      listings: { total: l.total, active: l.active, new30d: l.new_30d, totalViews: l.total_views, totalWa: l.total_wa },
      waClicks30d: (wa[0] as { total: number }).total,
      legalCases: { total: le.total, approved: le.approved },
      mortgageLeads: (leads[0] as { total: number }).total,
    }
  }

  private async topAgenciesByListings(limit = 10) {
    const rows = await this.ds.query(`
      SELECT
        a.id, a.company_name, a.city, a.plan,
        COUNT(l.id)::int AS listing_count,
        COALESCE(SUM(l.view_count), 0)::int AS total_views,
        COALESCE(SUM(l.whatsapp_clicks), 0)::int AS total_wa
      FROM agencies a
      LEFT JOIN listings l ON l.agency_id = a.id AND l.status = 'active'
      GROUP BY a.id, a.company_name, a.city, a.plan
      ORDER BY listing_count DESC
      LIMIT $1
    `, [limit])
    return rows as { id: string; company_name: string; city: string; plan: string; listing_count: number; total_views: number; total_wa: number }[]
  }

  private async recentActivity() {
    const rows = await this.ds.query(`
      SELECT day, new_users, new_listings, wa_clicks FROM (
        SELECT
          DATE(created_at) AS day,
          COUNT(*)::int    AS new_users,
          0::int           AS new_listings,
          0::int           AS wa_clicks
        FROM users
        WHERE created_at >= NOW() - INTERVAL '14 days'
        GROUP BY day
        UNION ALL
        SELECT
          DATE(created_at) AS day,
          0, COUNT(*)::int, 0
        FROM listings WHERE created_at >= NOW() - INTERVAL '14 days'
        GROUP BY day
        UNION ALL
        SELECT
          DATE(created_at) AS day,
          0, 0, COUNT(*)::int
        FROM whatsapp_clicks WHERE created_at >= NOW() - INTERVAL '14 days'
        GROUP BY day
      ) t
      GROUP BY day
      ORDER BY day ASC
    `)
    // Re-aggregate across union
    const map = new Map<string, { new_users: number; new_listings: number; wa_clicks: number }>()
    for (const row of rows as { day: string; new_users: number; new_listings: number; wa_clicks: number }[]) {
      const key = String(row.day).slice(0, 10)
      const existing = map.get(key) ?? { new_users: 0, new_listings: 0, wa_clicks: 0 }
      map.set(key, {
        new_users: existing.new_users + Number(row.new_users),
        new_listings: existing.new_listings + Number(row.new_listings),
        wa_clicks: existing.wa_clicks + Number(row.wa_clicks),
      })
    }
    return Array.from(map.entries()).map(([day, v]) => ({ day, ...v })).sort((a, b) => a.day.localeCompare(b.day))
  }

  private async cityDistribution() {
    const rows = await this.ds.query(`
      SELECT city, COUNT(*)::int AS count
      FROM listings WHERE status = 'active'
      GROUP BY city ORDER BY count DESC LIMIT 15
    `)
    return rows as { city: string; count: number }[]
  }

  // CSV export helper
  async exportListingsCsv(agencyId: string): Promise<string> {
    const rows = await this.ds.query(`
      SELECT
        l.id, l.title, l.status, l.listing_type, l.property_type,
        l.city, l.district, l.price, l.currency, l.area_m2, l.room_count,
        l.view_count, l.whatsapp_clicks, l.favorite_count,
        l.published_at, l.created_at
      FROM listings l
      WHERE l.agency_id = $1
      ORDER BY l.created_at DESC
    `, [agencyId])

    const header = 'ID,Başlık,Durum,Tür,Tip,Şehir,İlçe,Fiyat,Para Birimi,Alan (m²),Oda,Görüntülenme,WA Tıklama,Favori,Yayın Tarihi,Oluşturulma\n'
    const lines = (rows as Record<string, unknown>[]).map((r) =>
      [r['id'], `"${String(r['title']).replace(/"/g, '""')}"`,
        r['status'], r['listing_type'], r['property_type'],
        r['city'], r['district'], r['price'], r['currency'],
        r['area_m2'], r['room_count'],
        r['view_count'], r['whatsapp_clicks'], r['favorite_count'],
        r['published_at'], r['created_at'],
      ].join(',')
    ).join('\n')

    return header + lines
  }
}
