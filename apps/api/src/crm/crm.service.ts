import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { CreateLeadDto } from './dto/create-lead.dto'
import { UpdateLeadDto } from './dto/update-lead.dto'
import { AddActivityDto } from './dto/add-activity.dto'
import { LeadFiltersDto } from './dto/lead-filters.dto'
import { LeadStatus, ActivityType } from './entities/lead.entity'

@Injectable()
export class CrmService {
  constructor(
    @InjectDataSource() private readonly ds: DataSource,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────
  // LEADS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Yeni lead oluştur.
   * agencyId JWT'den alınır — kullanıcı kendi acentasına ait lead açar.
   */
  async createLead(dto: CreateLeadDto, agencyId: string, userId: string) {
    const result = await this.ds.query(
      `INSERT INTO leads (
         agency_id, assigned_agent_id,
         first_name, last_name, phone, email,
         source, status, type, priority,
         listing_id, preferred_city, preferred_district,
         budget_min, budget_max, size_min_m2, size_max_m2, room_preference,
         next_follow_up_at, notes, kvkk_consent
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
       ) RETURNING *`,
      [
        agencyId,
        dto.assignedAgentId ?? userId,
        dto.firstName,
        dto.lastName,
        dto.phone ?? null,
        dto.email ?? null,
        dto.source ?? 'website',
        'new',
        dto.type ?? 'buyer',
        dto.priority ?? 'medium',
        dto.listingId ?? null,
        dto.preferredCity ?? null,
        dto.preferredDistrict ?? null,
        dto.budgetMin ?? null,
        dto.budgetMax ?? null,
        dto.sizeMinM2 ?? null,
        dto.sizeMaxM2 ?? null,
        dto.roomPreference ?? null,
        dto.nextFollowUpAt ?? null,
        dto.notes ?? null,
        dto.kvkkConsent ?? false,
      ],
    )

    const lead = result[0]

    // İlk aktivite kaydı
    await this._addActivity(lead.id, userId, {
      type: ActivityType.NOTE,
      body: `Lead oluşturuldu. Kaynak: ${lead.source}`,
      meta: { auto: true },
    })

    return lead
  }

  /**
   * Acenta leadlerini listele — Kanban veya tablo görünümü için.
   * Soft-delete filtrelenmiş.
   */
  async listLeads(filters: LeadFiltersDto, agencyId: string) {
    const { page = 1, perPage = 25 } = filters
    const offset = (page - 1) * perPage
    const params: unknown[] = [agencyId]
    const conditions: string[] = ['l.agency_id = $1', 'l.deleted_at IS NULL']
    let pi = 2

    if (filters.status) {
      conditions.push(`l.status = $${pi++}`)
      params.push(filters.status)
    }
    if (filters.source) {
      conditions.push(`l.source = $${pi++}`)
      params.push(filters.source)
    }
    if (filters.type) {
      conditions.push(`l.type = $${pi++}`)
      params.push(filters.type)
    }
    if (filters.priority) {
      conditions.push(`l.priority = $${pi++}`)
      params.push(filters.priority)
    }
    if (filters.assignedAgentId) {
      conditions.push(`l.assigned_agent_id = $${pi++}`)
      params.push(filters.assignedAgentId)
    }
    if (filters.city) {
      conditions.push(`l.preferred_city ILIKE $${pi++}`)
      params.push(`%${filters.city}%`)
    }
    if (filters.q) {
      conditions.push(
        `(l.first_name ILIKE $${pi} OR l.last_name ILIKE $${pi} OR l.phone ILIKE $${pi} OR l.email ILIKE $${pi})`,
      )
      params.push(`%${filters.q}%`)
      pi++
    }

    const where = conditions.join(' AND ')

    const [rows, countRows] = await Promise.all([
      this.ds.query(
        `SELECT l.*,
                u.full_name AS assigned_agent_name,
                (SELECT COUNT(*) FROM lead_activities a WHERE a.lead_id = l.id) AS activity_count
           FROM leads l
           LEFT JOIN users u ON u.id = l.assigned_agent_id
          WHERE ${where}
          ORDER BY
            CASE l.priority
              WHEN 'hot'    THEN 1
              WHEN 'high'   THEN 2
              WHEN 'medium' THEN 3
              ELSE 4
            END,
            l.next_follow_up_at ASC NULLS LAST,
            l.created_at DESC
          LIMIT $${pi} OFFSET $${pi + 1}`,
        [...params, perPage, offset],
      ),
      this.ds.query(
        `SELECT COUNT(*) AS total FROM leads l WHERE ${where}`,
        params,
      ),
    ])

    return {
      data: rows,
      total: parseInt(countRows[0].total, 10),
      page,
      perPage,
    }
  }

  /**
   * Kanban formatında leadleri döner (status → leads[])
   */
  async kanbanBoard(agencyId: string) {
    const rows = await this.ds.query(
      `SELECT l.*,
              u.full_name AS assigned_agent_name,
              (SELECT COUNT(*) FROM lead_activities a WHERE a.lead_id = l.id) AS activity_count
         FROM leads l
         LEFT JOIN users u ON u.id = l.assigned_agent_id
        WHERE l.agency_id = $1
          AND l.deleted_at IS NULL
          AND l.status NOT IN ('won','lost')
        ORDER BY
          CASE l.priority WHEN 'hot' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
          l.next_follow_up_at ASC NULLS LAST`,
      [agencyId],
    )

    // Status'a göre grupla
    const columns: Record<string, unknown[]> = {
      new: [],
      contacted: [],
      qualified: [],
      showing: [],
      offer: [],
      negotiation: [],
      nurturing: [],
    }

    for (const row of rows) {
      if (columns[row.status]) columns[row.status].push(row)
    }

    return columns
  }

  /**
   * Tek lead detayı — aktivitelerle birlikte.
   */
  async getLead(leadId: string, agencyId: string) {
    const [leads, activities] = await Promise.all([
      this.ds.query(
        `SELECT l.*, u.full_name AS assigned_agent_name
           FROM leads l
           LEFT JOIN users u ON u.id = l.assigned_agent_id
          WHERE l.id = $1 AND l.agency_id = $2 AND l.deleted_at IS NULL`,
        [leadId, agencyId],
      ),
      this.ds.query(
        `SELECT a.*, u.full_name AS performed_by_name
           FROM lead_activities a
           LEFT JOIN users u ON u.id = a.performed_by_user_id
          WHERE a.lead_id = $1
          ORDER BY a.created_at DESC`,
        [leadId],
      ),
    ])

    if (!leads.length) throw new NotFoundException('Lead bulunamadı')

    return { ...leads[0], activities }
  }

  /**
   * Lead güncelle — status değişimini otomatik logla.
   */
  async updateLead(leadId: string, dto: UpdateLeadDto, agencyId: string, userId: string) {
    const existing = await this.ds.query(
      `SELECT id, status FROM leads WHERE id = $1 AND agency_id = $2 AND deleted_at IS NULL`,
      [leadId, agencyId],
    )
    if (!existing.length) throw new NotFoundException('Lead bulunamadı')

    const oldStatus = existing[0].status

    const updates: string[] = ['updated_at = NOW()']
    const params: unknown[] = []
    let pi = 1

    const fieldMap: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      phone: 'phone',
      email: 'email',
      source: 'source',
      status: 'status',
      type: 'type',
      priority: 'priority',
      listingId: 'listing_id',
      preferredCity: 'preferred_city',
      preferredDistrict: 'preferred_district',
      budgetMin: 'budget_min',
      budgetMax: 'budget_max',
      sizeMinM2: 'size_min_m2',
      sizeMaxM2: 'size_max_m2',
      roomPreference: 'room_preference',
      nextFollowUpAt: 'next_follow_up_at',
      notes: 'notes',
      assignedAgentId: 'assigned_agent_id',
      kvkkConsent: 'kvkk_consent',
      dealValueTry: 'deal_value_try',
      lostReason: 'lost_reason',
    }

    for (const [dtoKey, colName] of Object.entries(fieldMap)) {
      if ((dto as Record<string, unknown>)[dtoKey] !== undefined) {
        updates.push(`${colName} = $${pi++}`)
        params.push((dto as Record<string, unknown>)[dtoKey])
      }
    }

    // last_contacted_at güncelle (herhangi bir güncelleme = temas)
    if (dto.status && dto.status !== oldStatus) {
      updates.push(`last_contacted_at = NOW()`)
    }

    params.push(leadId)
    const result = await this.ds.query(
      `UPDATE leads SET ${updates.join(', ')} WHERE id = $${pi} RETURNING *`,
      params,
    )

    // Status değişimini logla
    if (dto.status && dto.status !== oldStatus) {
      await this._addActivity(leadId, userId, {
        type: ActivityType.STATUS_CHANGE,
        body: `Durum değişti: ${oldStatus} → ${dto.status}`,
        meta: { from: oldStatus, to: dto.status },
      })
    }

    return result[0]
  }

  /**
   * Soft delete — lead silindi olarak işaretle.
   */
  async deleteLead(leadId: string, agencyId: string) {
    const result = await this.ds.query(
      `UPDATE leads SET deleted_at = NOW() WHERE id = $1 AND agency_id = $2 AND deleted_at IS NULL RETURNING id`,
      [leadId, agencyId],
    )
    if (!result.length) throw new NotFoundException('Lead bulunamadı')
    return { success: true }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACTIVITIES
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Lead'e manuel aktivite ekle.
   */
  async addActivity(leadId: string, dto: AddActivityDto, agencyId: string, userId: string) {
    // Sahiplik kontrolü
    const [lead] = await this.ds.query(
      `SELECT id FROM leads WHERE id = $1 AND agency_id = $2 AND deleted_at IS NULL`,
      [leadId, agencyId],
    )
    if (!lead) throw new NotFoundException('Lead bulunamadı')

    // Son temas güncelle
    await this.ds.query(
      `UPDATE leads SET last_contacted_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [leadId],
    )

    return this._addActivity(leadId, userId, dto)
  }

  /** İç yardımcı — direktten aktivite yaz (hem servis hem agent kullanır) */
  async _addActivity(
    leadId: string,
    userId: string | null,
    dto: { type: ActivityType; body?: string; meta?: Record<string, unknown> },
  ) {
    const result = await this.ds.query(
      `INSERT INTO lead_activities (lead_id, performed_by_user_id, type, body, meta)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [leadId, userId, dto.type, dto.body ?? null, dto.meta ? JSON.stringify(dto.meta) : null],
    )
    return result[0]
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DASHBOARD & STATS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * CRM özet istatistikleri — admin/acenta paneli için.
   */
  async dashboardStats(agencyId: string) {
    const [stats, sources, pipeline] = await Promise.all([
      // Genel sayımlar
      this.ds.query(
        `SELECT
           COUNT(*) FILTER (WHERE deleted_at IS NULL)                          AS total,
           COUNT(*) FILTER (WHERE status = 'new' AND deleted_at IS NULL)       AS new_count,
           COUNT(*) FILTER (WHERE status = 'won' AND deleted_at IS NULL)       AS won_count,
           COUNT(*) FILTER (WHERE status = 'lost' AND deleted_at IS NULL)      AS lost_count,
           COUNT(*) FILTER (WHERE priority = 'hot' AND deleted_at IS NULL
                            AND status NOT IN ('won','lost'))                   AS hot_count,
           COUNT(*) FILTER (WHERE next_follow_up_at <= NOW()
                            AND deleted_at IS NULL
                            AND status NOT IN ('won','lost'))                   AS overdue_count,
           COALESCE(SUM(deal_value_try) FILTER (WHERE status = 'won'), 0)      AS total_won_value
         FROM leads
         WHERE agency_id = $1`,
        [agencyId],
      ),
      // Kaynak dağılımı
      this.ds.query(
        `SELECT source, COUNT(*) AS count
           FROM leads
          WHERE agency_id = $1 AND deleted_at IS NULL
          GROUP BY source
          ORDER BY count DESC`,
        [agencyId],
      ),
      // Pipeline (status dağılımı)
      this.ds.query(
        `SELECT status, COUNT(*) AS count
           FROM leads
          WHERE agency_id = $1 AND deleted_at IS NULL AND status NOT IN ('won','lost')
          GROUP BY status`,
        [agencyId],
      ),
    ])

    return {
      summary: stats[0],
      bySource: sources,
      pipeline,
    }
  }

  /**
   * Hatırlatma gereken leadler (next_follow_up_at geçmiş veya bugün).
   * Cron job / push notification için.
   */
  async getOverdueFollowUps(agencyId: string) {
    return this.ds.query(
      `SELECT l.id, l.first_name, l.last_name, l.phone, l.email,
              l.status, l.priority, l.next_follow_up_at,
              u.full_name AS assigned_agent_name,
              u.email     AS assigned_agent_email
         FROM leads l
         LEFT JOIN users u ON u.id = l.assigned_agent_id
        WHERE l.agency_id = $1
          AND l.deleted_at IS NULL
          AND l.next_follow_up_at <= NOW()
          AND l.status NOT IN ('won','lost')
        ORDER BY l.next_follow_up_at ASC
        LIMIT 50`,
      [agencyId],
    )
  }
}
