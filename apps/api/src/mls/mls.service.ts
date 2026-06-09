/**
 * MlsService — Modül B: MLS İş Mantığı
 *
 * Tüm MLS işlemleri bu servis üzerinden yönetilir:
 *   1. Yetkili emlakçı ilanı MLS havuzuna açar       → openListing()
 *   2. İşbirlikçi emlakçı ilana katılım başvurusu yapar → joinListing()
 *   3. Yetkili emlakçı başvuruyu onaylar/reddeder     → reviewCollaboration()
 *   4. İşbirlikçi ilandan çekilir                     → withdrawCollaboration()
 *   5. Yetkili emlakçı işlemi kapatır                 → closeDeal()
 *   6. Partner portal MLS havuzunu listeler            → listPool()
 *   7. Yetkili emlakçı kendi açık ilanlarını görür    → listMyMlsListings()
 *   8. İşbirlikçi kendi onaylı ilanlarını görür       → listMyCollaborations()
 */

import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import {
  MlsStatus,
  CommissionType,
  CollaborationStatus,
  SplitStatus,
} from './entities/mls-listing.entity'
import { CreateMlsListingDto } from './dto/create-mls-listing.dto'
import { JoinMlsListingDto } from './dto/join-mls-listing.dto'
import { ReviewCollaborationDto, ReviewAction } from './dto/review-collaboration.dto'
import { CloseMlsDealDto } from './dto/close-mls-deal.dto'
import { MlsPoolFiltersDto } from './dto/mls-pool-filters.dto'

@Injectable()
export class MlsService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  // ────────────────────────────────────────────────────────────────────────────
  // 1. İlanı MLS Havuzuna Aç
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Yetkili emlakçı bir ilanını komisyon paylaşımına açar.
   *
   * İş kuralları:
   * - İlan bu emlakçıya ait olmalı (owner_user_id = userId)
   * - İlan "active" statüsünde olmalı
   * - İlanın zaten açık/devam eden bir MLS kaydı olmamalı
   * - authorizedAgentShare + collaboratorShare = 100 olmalı
   */
  async openListing(dto: CreateMlsListingDto, userId: string): Promise<Record<string, unknown>> {
    // ── Ön doğrulama ──────────────────────────────────────────────────────────

    const collaboratorShare = 100 - dto.authorizedAgentShare
    if (collaboratorShare < 0 || collaboratorShare > 100) {
      throw new BadRequestException('Yetkili emlakçı payı 0-100 arasında olmalı.')
    }

    // İlan sahibi mi?
    const listingRows = await this.ds.query(
      `SELECT id, status, agency_id FROM listings WHERE id = $1 AND owner_user_id = $2`,
      [dto.listingId, userId],
    )
    if (!listingRows.length) {
      throw new ForbiddenException('Bu ilan size ait değil veya bulunamadı.')
    }
    const listing = listingRows[0] as { id: string; status: string; agency_id: string | null }

    if (listing.status !== 'active') {
      throw new BadRequestException(
        'Yalnızca "active" statüsündeki ilanlar MLS havuzuna açılabilir.',
      )
    }

    // Çakışan MLS kaydı var mı?
    const existingRows = await this.ds.query(
      `SELECT id FROM mls_listings
       WHERE listing_id = $1 AND status IN ('open', 'in_progress')`,
      [dto.listingId],
    )
    if (existingRows.length) {
      throw new ConflictException('Bu ilan zaten aktif bir MLS kaydına sahip.')
    }

    // ── Kayıt oluştur ─────────────────────────────────────────────────────────

    const rows = await this.ds.query(
      `INSERT INTO mls_listings (
          listing_id, authorized_agent_id, authorized_agency_id,
          commission_type, total_commission_value,
          authorized_agent_share, collaborator_share,
          region_filter, max_collaborators, expires_at, agent_notes,
          status
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'open')
       RETURNING *`,
      [
        dto.listingId,
        userId,
        listing.agency_id ?? null,
        dto.commissionType ?? CommissionType.PERCENTAGE,
        dto.totalCommissionValue,
        dto.authorizedAgentShare,
        collaboratorShare,
        dto.regionFilter ?? null,
        dto.maxCollaborators ?? 10,
        dto.expiresAt ? new Date(dto.expiresAt) : null,
        dto.agentNotes ?? null,
      ],
    )

    return rows[0] as Record<string, unknown>
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 2. MLS İlanına Katıl (İşbirlikçi Başvurusu)
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * İşbirlikçi bir emlakçı, MLS havuzundaki ilana katılım başvurusu yapar.
   *
   * İş kuralları:
   * - MLS ilanı "open" statüsünde olmalı
   * - Yetkili emlakçı kendi ilanına başvuramaz
   * - Aynı emlakçı aynı ilana ikinci kez başvuramaz
   * - max_collaborators limitine ulaşılmamış olmalı
   * - regionFilter varsa başvuranın şehri uyuşmalı (future: users tablosunda city alanıyla)
   */
  async joinListing(
    mlsListingId: string,
    dto: JoinMlsListingDto,
    userId: string,
  ): Promise<Record<string, unknown>> {
    // MLS ilanını getir
    const mlsRows = await this.ds.query(
      `SELECT ml.*, l.city AS listing_city
       FROM mls_listings ml
       JOIN listings l ON l.id = ml.listing_id
       WHERE ml.id = $1`,
      [mlsListingId],
    )
    if (!mlsRows.length) throw new NotFoundException('MLS ilanı bulunamadı.')
    const mls = mlsRows[0] as {
      status: string
      authorized_agent_id: string
      max_collaborators: number
      expires_at: string | null
      region_filter: string | null
      listing_city: string
    }

    if (mls.status !== MlsStatus.OPEN) {
      throw new BadRequestException('Bu MLS ilanı artık başvuruya açık değil.')
    }

    if (mls.authorized_agent_id === userId) {
      throw new ForbiddenException('Kendi ilanınıza işbirlikçi olarak başvuramazsınız.')
    }

    if (mls.expires_at && new Date(mls.expires_at) < new Date()) {
      throw new BadRequestException('Bu MLS ilanının başvuru süresi dolmuş.')
    }

    // Aynı emlakçı daha önce başvurmuş mu?
    const dupRows = await this.ds.query(
      `SELECT id FROM mls_collaborations
       WHERE mls_listing_id = $1 AND collaborator_agent_id = $2
         AND status NOT IN ('rejected', 'withdrawn')`,
      [mlsListingId, userId],
    )
    if (dupRows.length) {
      throw new ConflictException('Bu ilana zaten başvurdunuz.')
    }

    // Limit kontrolü
    const countRows = await this.ds.query(
      `SELECT COUNT(*) AS cnt FROM mls_collaborations
       WHERE mls_listing_id = $1 AND status = 'approved'`,
      [mlsListingId],
    )
    if (parseInt((countRows[0] as { cnt: string }).cnt, 10) >= mls.max_collaborators) {
      throw new BadRequestException('Bu ilan maksimum işbirlikçi sayısına ulaştı.')
    }

    // Başvuruyu kaydet
    const rows = await this.ds.query(
      `INSERT INTO mls_collaborations (
          mls_listing_id, collaborator_agent_id, collaborator_agency_id,
          client_ref_note, status
       ) VALUES ($1,$2,$3,$4,'pending')
       RETURNING *`,
      [
        mlsListingId,
        userId,
        dto.collaboratorAgencyId ?? null,
        dto.clientRefNote ?? null,
      ],
    )

    return rows[0] as Record<string, unknown>
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 3. Başvuruyu Onayla / Reddet
  // ────────────────────────────────────────────────────────────────────────────

  async reviewCollaboration(
    collaborationId: string,
    dto: ReviewCollaborationDto,
    userId: string,
  ): Promise<Record<string, unknown>> {
    // İşbirliği kaydını ve yetkili emlakçı kontrolünü birlikte al
    const rows = await this.ds.query(
      `SELECT mc.*, ml.authorized_agent_id, ml.status AS mls_status
       FROM mls_collaborations mc
       JOIN mls_listings ml ON ml.id = mc.mls_listing_id
       WHERE mc.id = $1`,
      [collaborationId],
    )
    if (!rows.length) throw new NotFoundException('İşbirliği başvurusu bulunamadı.')
    const collab = rows[0] as {
      status: string
      mls_status: string
      authorized_agent_id: string
    }

    if (collab.authorized_agent_id !== userId) {
      throw new ForbiddenException('Yalnızca yetkili emlakçı başvuruları değerlendirebilir.')
    }
    if (collab.status !== CollaborationStatus.PENDING) {
      throw new BadRequestException('Yalnızca bekleyen başvurular değerlendirilebilir.')
    }
    if (collab.mls_status !== MlsStatus.OPEN) {
      throw new BadRequestException('MLS ilanı artık aktif değil.')
    }

    const newStatus =
      dto.action === ReviewAction.APPROVE
        ? CollaborationStatus.APPROVED
        : CollaborationStatus.REJECTED

    const updated = await this.ds.query(
      `UPDATE mls_collaborations
       SET status = $1, reviewed_at = NOW(), client_ref_note = COALESCE($2, client_ref_note),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [newStatus, dto.note ?? null, collaborationId],
    )

    // Onay sonrası MLS durumu hâlâ OPEN ise IN_PROGRESS'e al (ilk onay)
    if (dto.action === ReviewAction.APPROVE) {
      await this.ds.query(
        `UPDATE mls_listings SET status = 'in_progress', updated_at = NOW()
         WHERE id = (SELECT mls_listing_id FROM mls_collaborations WHERE id = $1)
           AND status = 'open'`,
        [collaborationId],
      )
    }

    return updated[0] as Record<string, unknown>
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 4. İşbirliğinden Çekil
  // ────────────────────────────────────────────────────────────────────────────

  async withdrawCollaboration(collaborationId: string, userId: string): Promise<void> {
    const rows = await this.ds.query(
      `SELECT id, status, collaborator_agent_id
       FROM mls_collaborations WHERE id = $1`,
      [collaborationId],
    )
    if (!rows.length) throw new NotFoundException('İşbirliği kaydı bulunamadı.')
    const collab = rows[0] as { status: string; collaborator_agent_id: string }

    if (collab.collaborator_agent_id !== userId) {
      throw new ForbiddenException('Yalnızca kendi başvurunuzdan çekilebilirsiniz.')
    }
    if (
      collab.status === CollaborationStatus.COMPLETED ||
      collab.status === CollaborationStatus.WITHDRAWN
    ) {
      throw new BadRequestException('Bu başvurudan çekilmek artık mümkün değil.')
    }

    await this.ds.query(
      `UPDATE mls_collaborations
       SET status = 'withdrawn', updated_at = NOW()
       WHERE id = $1`,
      [collaborationId],
    )
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 5. İşlemi Kapat & Komisyon Hesapla
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Yetkili emlakçı satış/kira işleminin tamamlandığını bildirir.
   *
   * Adımlar:
   * 1. MLS kaydını CLOSED yap
   * 2. Seçilen işbirliği kaydını COMPLETED yap
   * 3. İki komisyon split kaydı oluştur (authorized_agent + collaborator)
   * 4. Listing'in statüsünü sold/rented yap (listing_type'a göre)
   *
   * Komisyon hesaplama:
   *   PERCENTAGE: (finalPriceTry * totalCommissionValue / 100)
   *   FIXED_TRY:  totalCommissionValue direkt kullanılır
   */
  async closeDeal(
    mlsListingId: string,
    dto: CloseMlsDealDto,
    userId: string,
  ): Promise<Record<string, unknown>> {
    // ── MLS ve işbirliği doğrula ──────────────────────────────────────────────

    const mlsRows = await this.ds.query(
      `SELECT ml.*, l.listing_type
       FROM mls_listings ml
       JOIN listings l ON l.id = ml.listing_id
       WHERE ml.id = $1`,
      [mlsListingId],
    )
    if (!mlsRows.length) throw new NotFoundException('MLS ilanı bulunamadı.')
    const mls = mlsRows[0] as {
      status: string
      authorized_agent_id: string
      commission_type: CommissionType
      total_commission_value: string
      authorized_agent_share: number
      collaborator_share: number
      listing_type: string
      listing_id: string
    }

    if (mls.authorized_agent_id !== userId) {
      throw new ForbiddenException('Yalnızca yetkili emlakçı işlemi kapatabilir.')
    }
    if (!([MlsStatus.OPEN, MlsStatus.IN_PROGRESS] as string[]).includes(mls.status)) {
      throw new BadRequestException('Bu MLS ilanı zaten kapatılmış veya iptal edilmiş.')
    }

    // Belirtilen işbirliği bu MLS'e ait mi ve APPROVED mı?
    const collabRows = await this.ds.query(
      `SELECT id, collaborator_agent_id FROM mls_collaborations
       WHERE id = $1 AND mls_listing_id = $2 AND status = 'approved'`,
      [dto.collaborationId, mlsListingId],
    )
    if (!collabRows.length) {
      throw new BadRequestException('Geçerli bir işbirlikçi seçilmedi.')
    }
    const collab = collabRows[0] as { id: string; collaborator_agent_id: string }

    // ── Komisyon tutarları ────────────────────────────────────────────────────

    const totalCommValue = parseFloat(mls.total_commission_value)
    let totalCommissionTry: number

    if (mls.commission_type === CommissionType.PERCENTAGE) {
      totalCommissionTry = (dto.finalPriceTry * totalCommValue) / 100
    } else {
      totalCommissionTry = totalCommValue
    }

    const authorizedAmount = (totalCommissionTry * mls.authorized_agent_share) / 100
    const collaboratorAmount = (totalCommissionTry * mls.collaborator_share) / 100

    // ── Transaction ───────────────────────────────────────────────────────────

    const queryRunner = this.ds.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // 1. MLS kaydını kapat
      await queryRunner.query(
        `UPDATE mls_listings SET status = 'closed', updated_at = NOW() WHERE id = $1`,
        [mlsListingId],
      )

      // 2. Seçilen işbirliğini COMPLETED yap
      await queryRunner.query(
        `UPDATE mls_collaborations
         SET status = 'completed', completed_at = NOW(), updated_at = NOW()
         WHERE id = $1`,
        [dto.collaborationId],
      )

      // 3. Diğer onaylı işbirliklerini geri al (opsiyonel: OPEN bırakılabilir)
      await queryRunner.query(
        `UPDATE mls_collaborations
         SET status = 'withdrawn', updated_at = NOW()
         WHERE mls_listing_id = $1 AND id != $2 AND status = 'approved'`,
        [mlsListingId, dto.collaborationId],
      )

      // 4. Komisyon split kayıtları
      await queryRunner.query(
        `INSERT INTO mls_commission_splits (
            collaboration_id, recipient_user_id, is_authorized_agent,
            amount_try, percentage_share, status
         ) VALUES
           ($1, $2, TRUE,  $3, $4, 'calculated'),
           ($1, $5, FALSE, $6, $7, 'calculated')`,
        [
          dto.collaborationId,
          userId,
          authorizedAmount.toFixed(2),
          mls.authorized_agent_share,
          collab.collaborator_agent_id,
          collaboratorAmount.toFixed(2),
          mls.collaborator_share,
        ],
      )

      // 5. İlan durumunu güncelle
      const newListingStatus = mls.listing_type === 'rent' ? 'rented' : 'sold'
      await queryRunner.query(
        `UPDATE listings SET status = $1, updated_at = NOW() WHERE id = $2`,
        [newListingStatus, mls.listing_id],
      )

      await queryRunner.commitTransaction()
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }

    // Güncel MLS kaydını döndür
    const finalRows = await this.ds.query(
      `SELECT ml.*,
              mc.id AS collaboration_id,
              mc.collaborator_agent_id,
              mc.completed_at,
              cs_auth.amount_try AS authorized_commission,
              cs_coll.amount_try AS collaborator_commission
       FROM mls_listings ml
       JOIN mls_collaborations mc ON mc.id = $1
       LEFT JOIN mls_commission_splits cs_auth
         ON cs_auth.collaboration_id = mc.id AND cs_auth.is_authorized_agent = TRUE
       LEFT JOIN mls_commission_splits cs_coll
         ON cs_coll.collaboration_id = mc.id AND cs_coll.is_authorized_agent = FALSE
       WHERE ml.id = $2`,
      [dto.collaborationId, mlsListingId],
    )

    return finalRows[0] as Record<string, unknown>
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 6. MLS Havuzunu Listele (Partner Portal — "Havuzdaki Portföyler")
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Tüm onaylı emirlik durumundaki ilanları, ilan detaylarıyla birlikte döndürür.
   * Yalnızca kendi onaylı işbirliği olmayan ve başvurmamış emlakçılara gösterilir.
   * (Frontend join durumuna göre "Başvur" / "Bekliyor" / "Onaylandı" butonu gösterir.)
   */
  async listPool(filters: MlsPoolFiltersDto, requestingUserId?: string) {
    const page    = filters.page    ?? 1
    const perPage = filters.perPage ?? 20
    const offset  = (page - 1) * perPage
    const status  = filters.status  ?? MlsStatus.OPEN

    const params: unknown[] = [status, perPage, offset]
    const conditions: string[] = ['ml.status = $1']

    if (filters.city) {
      params.push(filters.city)
      conditions.push(`l.city = $${params.length}`)
    }
    if (filters.district) {
      params.push(filters.district)
      conditions.push(`l.district = $${params.length}`)
    }

    const whereClause = conditions.join(' AND ')

    const rows = await this.ds.query(
      `SELECT
          ml.id                     AS mls_id,
          ml.status                 AS mls_status,
          ml.commission_type,
          ml.total_commission_value,
          ml.authorized_agent_share,
          ml.collaborator_share,
          ml.max_collaborators,
          ml.region_filter,
          ml.expires_at,
          ml.agent_notes,
          ml.created_at             AS mls_created_at,
          -- İlan bilgileri
          l.id                      AS listing_id,
          l.title,
          l.city,
          l.district,
          l.neighborhood,
          l.property_type,
          l.listing_type,
          l.price,
          l.currency,
          l.area_m2,
          l.room_count,
          -- Kapak fotoğrafı
          (SELECT lp.url FROM listing_photos lp
           WHERE lp.listing_id = l.id AND lp.is_cover = TRUE LIMIT 1) AS cover_url,
          -- Onaylı işbirlikçi sayısı
          (SELECT COUNT(*) FROM mls_collaborations mc2
           WHERE mc2.mls_listing_id = ml.id
             AND mc2.status = 'approved') AS approved_count,
          -- İsteyen kullanıcının katılım durumu (varsa)
          ${requestingUserId
            ? `(SELECT mc3.status FROM mls_collaborations mc3
                WHERE mc3.mls_listing_id = ml.id
                  AND mc3.collaborator_agent_id = '${requestingUserId}'
                  AND mc3.status NOT IN ('rejected','withdrawn')
                LIMIT 1)`
            : 'NULL'
          } AS my_collaboration_status
       FROM mls_listings ml
       JOIN listings l ON l.id = ml.listing_id
       WHERE ${whereClause}
       ORDER BY ml.created_at DESC
       LIMIT $2 OFFSET $3`,
      params,
    )

    // Toplam sayım
    const countParams: unknown[] = [status]
    const countConditions = ['ml.status = $1']
    if (filters.city)     { countParams.push(filters.city);     countConditions.push(`l.city = $${countParams.length}`) }
    if (filters.district) { countParams.push(filters.district); countConditions.push(`l.district = $${countParams.length}`) }

    const countRows = await this.ds.query(
      `SELECT COUNT(*) AS total
       FROM mls_listings ml
       JOIN listings l ON l.id = ml.listing_id
       WHERE ${countConditions.join(' AND ')}`,
      countParams,
    )
    const total = parseInt((countRows[0] as { total: string }).total, 10)

    return { data: rows, total, page, perPage, totalPages: Math.ceil(total / perPage) }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 7. Yetkili Emlakçının Kendi MLS İlanları
  // ────────────────────────────────────────────────────────────────────────────

  async listMyMlsListings(userId: string, page = 1, perPage = 20) {
    const offset = (page - 1) * perPage

    const rows = await this.ds.query(
      `SELECT
          ml.*,
          l.title, l.city, l.district, l.property_type, l.listing_type, l.price,
          (SELECT lp.url FROM listing_photos lp
           WHERE lp.listing_id = l.id AND lp.is_cover = TRUE LIMIT 1) AS cover_url,
          (SELECT COUNT(*) FROM mls_collaborations mc
           WHERE mc.mls_listing_id = ml.id AND mc.status = 'pending') AS pending_count,
          (SELECT COUNT(*) FROM mls_collaborations mc
           WHERE mc.mls_listing_id = ml.id AND mc.status = 'approved') AS approved_count
       FROM mls_listings ml
       JOIN listings l ON l.id = ml.listing_id
       WHERE ml.authorized_agent_id = $1
       ORDER BY ml.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, perPage, offset],
    )

    const countRows = await this.ds.query(
      `SELECT COUNT(*) AS total FROM mls_listings WHERE authorized_agent_id = $1`,
      [userId],
    )
    const total = parseInt((countRows[0] as { total: string }).total, 10)

    return { data: rows, total, page, perPage, totalPages: Math.ceil(total / perPage) }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 8. İşbirlikçi Emlakçının Onaylı İlanları
  // ────────────────────────────────────────────────────────────────────────────

  async listMyCollaborations(userId: string, page = 1, perPage = 20) {
    const offset = (page - 1) * perPage

    const rows = await this.ds.query(
      `SELECT
          mc.id AS collaboration_id,
          mc.status AS collaboration_status,
          mc.client_ref_note,
          mc.created_at AS applied_at,
          ml.id AS mls_id,
          ml.commission_type,
          ml.total_commission_value,
          ml.collaborator_share,
          ml.authorized_agent_share,
          ml.status AS mls_status,
          l.id AS listing_id,
          l.title,
          l.city,
          l.district,
          l.property_type,
          l.listing_type,
          l.price,
          l.currency,
          (SELECT lp.url FROM listing_photos lp
           WHERE lp.listing_id = l.id AND lp.is_cover = TRUE LIMIT 1) AS cover_url,
          -- Tahmini komisyon (eğer satış yapılırsa)
          CASE
            WHEN ml.commission_type = 'percentage'
            THEN ROUND(l.price * ml.total_commission_value / 100 * ml.collaborator_share / 100, 2)
            ELSE ROUND(ml.total_commission_value * ml.collaborator_share / 100, 2)
          END AS estimated_commission_try
       FROM mls_collaborations mc
       JOIN mls_listings ml ON ml.id = mc.mls_listing_id
       JOIN listings l ON l.id = ml.listing_id
       WHERE mc.collaborator_agent_id = $1
         AND mc.status NOT IN ('rejected', 'withdrawn')
       ORDER BY mc.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, perPage, offset],
    )

    const countRows = await this.ds.query(
      `SELECT COUNT(*) AS total FROM mls_collaborations
       WHERE collaborator_agent_id = $1 AND status NOT IN ('rejected','withdrawn')`,
      [userId],
    )
    const total = parseInt((countRows[0] as { total: string }).total, 10)

    return { data: rows, total, page, perPage, totalPages: Math.ceil(total / perPage) }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 9. Komisyon Bölüşümü Detayı
  // ────────────────────────────────────────────────────────────────────────────

  async getCommissionSplits(collaborationId: string, userId: string) {
    // Erişim kontrolü: yetkili veya işbirlikçi olmalı
    const accessRows = await this.ds.query(
      `SELECT ml.authorized_agent_id, mc.collaborator_agent_id
       FROM mls_collaborations mc
       JOIN mls_listings ml ON ml.id = mc.mls_listing_id
       WHERE mc.id = $1`,
      [collaborationId],
    )
    if (!accessRows.length) throw new NotFoundException('İşbirliği kaydı bulunamadı.')
    const access = accessRows[0] as {
      authorized_agent_id: string
      collaborator_agent_id: string
    }
    if (access.authorized_agent_id !== userId && access.collaborator_agent_id !== userId) {
      throw new ForbiddenException('Bu komisyon kaydına erişim yetkiniz yok.')
    }

    return this.ds.query(
      `SELECT cs.*, u.full_name AS recipient_name, u.email AS recipient_email
       FROM mls_commission_splits cs
       JOIN users u ON u.id = cs.recipient_user_id
       WHERE cs.collaboration_id = $1
       ORDER BY cs.is_authorized_agent DESC`,
      [collaborationId],
    )
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 10. MLS İlanını İptal Et
  // ────────────────────────────────────────────────────────────────────────────

  async cancelMlsListing(mlsListingId: string, userId: string): Promise<void> {
    const rows = await this.ds.query(
      `SELECT id, authorized_agent_id, status FROM mls_listings WHERE id = $1`,
      [mlsListingId],
    )
    if (!rows.length) throw new NotFoundException('MLS ilanı bulunamadı.')
    const mls = rows[0] as { authorized_agent_id: string; status: string }

    if (mls.authorized_agent_id !== userId) {
      throw new ForbiddenException('Yalnızca yetkili emlakçı iptal edebilir.')
    }
    if (mls.status === MlsStatus.CLOSED || mls.status === MlsStatus.CANCELLED) {
      throw new BadRequestException('Bu MLS ilanı zaten kapatılmış veya iptal edilmiş.')
    }

    await this.ds.query(
      `UPDATE mls_listings SET status = 'cancelled', updated_at = NOW() WHERE id = $1`,
      [mlsListingId],
    )

    // Bekleyen başvuruları da kapat
    await this.ds.query(
      `UPDATE mls_collaborations
       SET status = 'withdrawn', updated_at = NOW()
       WHERE mls_listing_id = $1 AND status IN ('pending', 'approved')`,
      [mlsListingId],
    )
  }
}
