import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { randomBytes, createHash } from 'crypto'

const COMMISSION_RATES: Record<string, number> = {
  listing_lead: 2.5,   // % of deal value when lead converts
  mortgage_lead: 150,  // flat fee per mortgage lead (TRY)
  subscription_ref: 20, // % of subscription payment
}

@Injectable()
export class PartnerService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  // ── Dashboard stats ───────────────────────────────────────────────────────

  async getDashboardStats(partnerId: string) {
    const [refs, comms, apikeys] = await Promise.all([
      this.ds.query(`
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'converted')::int AS converted,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS last_30d
        FROM partner_referrals WHERE partner_id = $1
      `, [partnerId]),
      this.ds.query(`
        SELECT
          COALESCE(SUM(amount), 0)::numeric AS total_earned,
          COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0)::numeric AS paid,
          COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0)::numeric AS pending
        FROM partner_commissions WHERE partner_id = $1
      `, [partnerId]),
      this.ds.query(`SELECT COUNT(*)::int AS total FROM partner_api_keys WHERE partner_id = $1 AND revoked_at IS NULL`, [partnerId]),
    ])

    return {
      referrals: refs[0] as { total: number; converted: number; last_30d: number },
      commissions: comms[0] as { total_earned: string; paid: string; pending: string },
      activeApiKeys: (apikeys[0] as { total: number }).total,
    }
  }

  // ── Referrals ─────────────────────────────────────────────────────────────

  async listReferrals(partnerId: string, opts: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = opts
    const offset = (page - 1) * limit

    const params: unknown[] = [partnerId]
    let pi = 2
    const where = status ? `AND pr.status = $${pi++}` : ''
    if (status) params.push(status)

    const rows = await this.ds.query(`
      SELECT
        pr.id, pr.ref_type, pr.status, pr.notes, pr.created_at, pr.converted_at,
        pr.contact_name, pr.contact_email, pr.contact_phone,
        a.company_name AS agency_name,
        pc.amount AS commission_amount, pc.status AS commission_status
      FROM partner_referrals pr
      LEFT JOIN agencies a ON a.id = pr.agency_id
      LEFT JOIN partner_commissions pc ON pc.referral_id = pr.id
      WHERE pr.partner_id = $1 ${where}
      ORDER BY pr.created_at DESC
      LIMIT $${pi} OFFSET $${pi + 1}
    `, [...params, limit, offset])

    const countRow = await this.ds.query(
      `SELECT COUNT(*)::int AS total FROM partner_referrals pr WHERE partner_id = $1 ${where}`,
      status ? [partnerId, status] : [partnerId],
    )

    return { data: rows, total: (countRow[0] as { total: number }).total, page, limit }
  }

  async createReferral(partnerId: string, data: {
    refType: 'listing_lead' | 'mortgage_lead' | 'agency_signup'
    agencyId?: string
    contactName: string
    contactEmail: string
    contactPhone?: string
    notes?: string
    estimatedValue?: number
  }) {
    const rows = await this.ds.query(`
      INSERT INTO partner_referrals
        (partner_id, agency_id, ref_type, contact_name, contact_email, contact_phone, notes, estimated_value, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
      RETURNING id
    `, [
      partnerId, data.agencyId ?? null, data.refType,
      data.contactName, data.contactEmail, data.contactPhone ?? null,
      data.notes ?? null, data.estimatedValue ?? null,
    ])

    return { id: (rows[0] as { id: string }).id }
  }

  // ── Commissions ───────────────────────────────────────────────────────────

  async listCommissions(partnerId: string, opts: { page: number; limit: number }) {
    const { page, limit } = opts
    const offset = (page - 1) * limit

    const rows = await this.ds.query(`
      SELECT
        pc.id, pc.amount, pc.currency, pc.status, pc.commission_type,
        pc.created_at, pc.paid_at,
        pr.contact_name, pr.ref_type
      FROM partner_commissions pc
      LEFT JOIN partner_referrals pr ON pr.id = pc.referral_id
      WHERE pc.partner_id = $1
      ORDER BY pc.created_at DESC
      LIMIT $2 OFFSET $3
    `, [partnerId, limit, offset])

    const countRow = await this.ds.query(
      `SELECT COUNT(*)::int AS total FROM partner_commissions WHERE partner_id = $1`, [partnerId],
    )

    return { data: rows, total: (countRow[0] as { total: number }).total, page, limit }
  }

  // ── API Keys ──────────────────────────────────────────────────────────────

  async listApiKeys(partnerId: string) {
    return this.ds.query(`
      SELECT id, name, key_prefix, created_at, last_used_at, expires_at, revoked_at
      FROM partner_api_keys
      WHERE partner_id = $1
      ORDER BY created_at DESC
    `, [partnerId])
  }

  async createApiKey(partnerId: string, name: string) {
    const key = `pk_live_${randomBytes(24).toString('base64url')}`
    const keyPrefix = key.substring(0, 16)
    const keyHash = createHash('sha256').update(key).digest('hex')

    await this.ds.query(`
      INSERT INTO partner_api_keys (partner_id, name, key_prefix, key_hash, expires_at)
      VALUES ($1, $2, $3, $4, NOW() + INTERVAL '1 year')
    `, [partnerId, name, keyPrefix, keyHash])

    return { key, keyPrefix }
  }

  async revokeApiKey(partnerId: string, keyId: string) {
    const rows = await this.ds.query(
      `SELECT id FROM partner_api_keys WHERE id = $1 AND partner_id = $2`, [keyId, partnerId],
    )
    if (!rows[0]) throw new NotFoundException('API anahtarı bulunamadı.')
    await this.ds.query(
      `UPDATE partner_api_keys SET revoked_at = NOW() WHERE id = $1`, [keyId],
    )
  }

  // ── Embed config ──────────────────────────────────────────────────────────

  getEmbedConfig(opts: {
    type: 'search' | 'listing' | 'calculator'
    listingId?: string
    agencyId?: string
    theme?: 'light' | 'dark'
    primaryColor?: string
  }) {
    const baseUrl = process.env.FRONTEND_URL ?? 'https://7fil.com.tr'
    const params = new URLSearchParams({
      embed: '1',
      ...(opts.theme && { theme: opts.theme }),
      ...(opts.primaryColor && { color: opts.primaryColor }),
      ...(opts.agencyId && { agency: opts.agencyId }),
    })

    const paths: Record<string, string> = {
      search: `/ara?${params}`,
      listing: `/ilan/${opts.listingId ?? ''}?${params}`,
      calculator: `/kredi-hesaplama?${params}`,
    }

    const src = `${baseUrl}${paths[opts.type] ?? paths.search}`

    return {
      src,
      iframeCode: `<iframe src="${src}" width="100%" height="700" frameborder="0" style="border-radius:12px;"></iframe>`,
      scriptCode: `<script async src="${baseUrl}/embed.js" data-7fil-type="${opts.type}" data-7fil-agency="${opts.agencyId ?? ''}"></script>`,
    }
  }

  getCommissionRates() { return COMMISSION_RATES }
}
