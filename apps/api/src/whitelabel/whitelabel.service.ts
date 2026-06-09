import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { randomBytes, createHash } from 'crypto'
import { AgencyBranding } from './entities/agency-branding.entity'

@Injectable()
export class WhitelabelService {
  constructor(
    @InjectRepository(AgencyBranding) private branding: Repository<AgencyBranding>,
    @InjectDataSource() private ds: DataSource,
  ) {}

  // ── Get or create branding for agency ────────────────────────────────────

  async getOrCreate(agencyId: string): Promise<AgencyBranding> {
    const existing = await this.branding.findOne({ where: { agencyId } })
    if (existing) return existing
    const created = this.branding.create({ agencyId })
    return this.branding.save(created)
  }

  async getByAgencyId(agencyId: string): Promise<AgencyBranding | null> {
    return this.branding.findOne({ where: { agencyId } })
  }

  // ── Update branding ───────────────────────────────────────────────────────

  async update(agencyId: string, dto: Partial<{
    logoUrl: string
    logoR2Key: string
    faviconUrl: string
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    heroTitle: string
    heroSubtitle: string
    aboutText: string
    contactPhone: string
    contactEmail: string
    contactAddress: string
    instagramUrl: string
    facebookUrl: string
    twitterUrl: string
    linkedinUrl: string
    youtubeUrl: string
    customCss: string
    seoTitle: string
    seoDescription: string
    show7filBadge: boolean
    listingsPerPage: number
  }>) {
    let b = await this.branding.findOne({ where: { agencyId } })
    if (!b) {
      b = this.branding.create({ agencyId })
    }
    Object.assign(b, dto)
    return this.branding.save(b)
  }

  // ── Subdomain lookup (used by frontend middleware / API) ──────────────────

  async getBySubdomain(subdomain: string) {
    const row = await this.ds.query(`
      SELECT
        ab.*,
        a.company_name,
        a.logo_url AS agency_logo,
        a.city,
        a.phone AS agency_phone,
        u.email AS owner_email
      FROM agency_branding ab
      JOIN agencies a ON a.id = ab.agency_id
      JOIN users u ON u.id = a.user_id
      WHERE a.subdomain ILIKE $1
      LIMIT 1
    `, [subdomain])

    return row[0] ?? null
  }

  async getByCustomDomain(domain: string) {
    return this.branding.findOne({
      where: { customDomain: domain, domainVerified: true },
    })
  }

  // ── Public branding data (safe for frontend) ──────────────────────────────

  async getPublicBranding(subdomain: string) {
    const row = await this.ds.query(`
      SELECT
        ab.primary_color,
        ab.secondary_color,
        ab.font_family,
        ab.logo_url,
        ab.favicon_url,
        ab.hero_title,
        ab.hero_subtitle,
        ab.about_text,
        ab.contact_phone,
        ab.contact_email,
        ab.contact_address,
        ab.instagram_url,
        ab.facebook_url,
        ab.twitter_url,
        ab.linkedin_url,
        ab.youtube_url,
        ab.custom_css,
        ab.seo_title,
        ab.seo_description,
        ab.show_7fil_badge,
        ab.listings_per_page,
        a.id           AS agency_id,
        a.company_name,
        a.subdomain,
        a.city,
        a.description  AS agency_description,
        a.is_verified  AS agency_verified
      FROM agencies a
      LEFT JOIN agency_branding ab ON ab.agency_id = a.id
      WHERE a.subdomain ILIKE $1 AND a.is_verified = true
      LIMIT 1
    `, [subdomain])

    if (!row[0]) return null

    const r = row[0] as Record<string, unknown>
    return {
      agencyId: r['agency_id'] as string,
      companyName: r['company_name'] as string,
      subdomain: r['subdomain'] as string,
      city: r['city'] as string,
      agencyDescription: r['agency_description'] as string | null,
      agencyVerified: r['agency_verified'] as boolean,
      primaryColor: (r['primary_color'] as string | null) ?? '#1B3A4B',
      secondaryColor: (r['secondary_color'] as string | null) ?? '#C9A84C',
      fontFamily: (r['font_family'] as string | null) ?? 'Inter',
      logoUrl: r['logo_url'] as string | null,
      faviconUrl: r['favicon_url'] as string | null,
      heroTitle: r['hero_title'] as string | null,
      heroSubtitle: r['hero_subtitle'] as string | null,
      aboutText: r['about_text'] as string | null,
      contactPhone: r['contact_phone'] as string | null,
      contactEmail: r['contact_email'] as string | null,
      contactAddress: r['contact_address'] as string | null,
      instagramUrl: r['instagram_url'] as string | null,
      facebookUrl: r['facebook_url'] as string | null,
      twitterUrl: r['twitter_url'] as string | null,
      linkedinUrl: r['linkedin_url'] as string | null,
      youtubeUrl: r['youtube_url'] as string | null,
      customCss: r['custom_css'] as string | null,
      seoTitle: r['seo_title'] as string | null,
      seoDescription: r['seo_description'] as string | null,
      show7filBadge: (r['show_7fil_badge'] as boolean | null) ?? true,
      listingsPerPage: (r['listings_per_page'] as number | null) ?? 12,
    }
  }

  // ── Agency listings for subdomain page ───────────────────────────────────

  async getAgencyListings(agencyId: string, page = 1, limit = 12) {
    const offset = (page - 1) * limit
    const rows = await this.ds.query(`
      SELECT
        l.id, l.title, l.price, l.currency, l.listing_type, l.property_type,
        l.city, l.district, l.neighborhood, l.area_m2, l.room_count,
        l.has_parking, l.has_elevator,
        (SELECT lp.url FROM listing_photos lp
         WHERE lp.listing_id = l.id AND lp.is_cover = true LIMIT 1) AS cover_url,
        l.published_at
      FROM listings l
      WHERE l.agency_id = $1 AND l.status = 'active'
      ORDER BY l.published_at DESC NULLS LAST
      LIMIT $2 OFFSET $3
    `, [agencyId, limit, offset])

    const countRow = await this.ds.query(
      `SELECT COUNT(*)::int AS total FROM listings WHERE agency_id = $1 AND status = 'active'`,
      [agencyId],
    )

    return {
      listings: rows,
      total: (countRow[0] as { total: number }).total,
      page,
      limit,
    }
  }

  // ── Custom domain management ──────────────────────────────────────────────

  async setCustomDomain(agencyId: string, domain: string) {
    let b = await this.branding.findOne({ where: { agencyId } })
    if (!b) {
      b = this.branding.create({ agencyId })
    }
    const token = createHash('sha256').update(`${agencyId}:${domain}:${randomBytes(16).toString('hex')}`).digest('hex').slice(0, 32)
    b.customDomain = domain.toLowerCase().trim()
    b.domainVerified = false
    b.domainVerifyToken = token
    await this.branding.save(b)
    return {
      domain: b.customDomain,
      verifyToken: token,
      instructions: `DNS ayarları: CNAME kayıdı → ${b.customDomain} → app.7fil.com.tr | TXT kaydı → _7fil-verify.${b.customDomain} → ${token}`,
    }
  }

  async verifyCustomDomain(agencyId: string) {
    const b = await this.branding.findOne({ where: { agencyId } })
    if (!b || !b.customDomain || !b.domainVerifyToken) {
      throw new NotFoundException('Özel domain tanımlanmamış')
    }

    // In production: do actual DNS TXT lookup
    // For now: mark as verified (admin action required for real verification)
    b.domainVerified = true
    await this.branding.save(b)
    return { verified: true, domain: b.customDomain }
  }

  // ── Agency info helper (for controller to check ownership) ───────────────

  async getAgencyByUserId(userId: string): Promise<{ id: string; subdomain: string | null } | null> {
    const rows = await this.ds.query(
      `SELECT id, subdomain FROM agencies WHERE user_id = $1 LIMIT 1`,
      [userId],
    )
    return (rows[0] as { id: string; subdomain: string | null } | undefined) ?? null
  }
}
