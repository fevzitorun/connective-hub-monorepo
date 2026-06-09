/**
 * MlsListing — Modül B: Emlakçılar Arası Portföy Paylaşım Sistemi (MLS)
 *
 * Tek yetkili (authorized_agent) bir ilanı komisyon paylaşımına açar.
 * Diğer emlakçılar (collaborators) bu ilanı kendi portföyleri gibi
 * müşterilerine sunar; satış gerçekleşince komisyon bölünür.
 *
 * Tablo: mls_listings
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Check,
} from 'typeorm'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

// ─── Enum: MLS İlan Durumu ────────────────────────────────────────────────────

export enum MlsStatus {
  /** Paylaşıma açık, diğer emlakçılar görebilir ve katılabilir */
  OPEN       = 'open',
  /** Aktif bir satış/kiralama süreci yürütülüyor */
  IN_PROGRESS = 'in_progress',
  /** İşlem tamamlandı, komisyon dağıtıma hazır */
  CLOSED     = 'closed',
  /** Yetkili emlakçı paylaşımı kapattı */
  CANCELLED  = 'cancelled',
}

// ─── Enum: Komisyon Tipi ──────────────────────────────────────────────────────

export enum CommissionType {
  /** Yüzde bazlı: ör. %2.5 + %1.25 */
  PERCENTAGE = 'percentage',
  /** Sabit TL tutarı */
  FIXED_TRY  = 'fixed_try',
}

// ─── Entity: MlsListing ──────────────────────────────────────────────────────

@Entity('mls_listings')
@Check(`"authorized_agent_share" + "collaborator_share" = 100`)
export class MlsListing {

  @ApiProperty({ example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  // ── İlan referansı ─────────────────────────────────────────────────────────

  /**
   * Paylaşıma açılan orijinal ilan (listings.id).
   * UNIQUE kısıtı: Bir ilan aynı anda yalnızca bir aktif MLS kaydına sahip olabilir.
   */
  @ApiProperty({ description: 'Paylaşıma açılan listings.id' })
  @Column({ name: 'listing_id', type: 'uuid' })
  listingId: string

  // ── Yetkili Emlakçı ────────────────────────────────────────────────────────

  /**
   * İlanın orijinal sahibi olan emlakçının users.id'si.
   * Bu kullanıcı komisyon oranını belirler ve MLS kaydını yönetir.
   */
  @ApiProperty({ description: 'Yetkili emlakçı (users.id)' })
  @Column({ name: 'authorized_agent_id', type: 'uuid' })
  authorizedAgentId: string

  @ApiProperty({ description: 'Yetkili emlakçının ajansı (agencies.id)' })
  @Column({ name: 'authorized_agency_id', type: 'uuid', nullable: true })
  authorizedAgencyId: string | null

  // ── Komisyon Yapısı ────────────────────────────────────────────────────────

  @ApiProperty({ enum: CommissionType, default: CommissionType.PERCENTAGE })
  @Column({
    name: 'commission_type',
    type: 'enum',
    enum: CommissionType,
    default: CommissionType.PERCENTAGE,
  })
  commissionType: CommissionType

  /**
   * Toplam komisyon oranı veya sabit tutarı.
   * PERCENTAGE → yüzde (ör. 3.5 = %3.5)
   * FIXED_TRY  → TL tutarı (ör. 50000)
   */
  @ApiProperty({ example: 3.5, description: 'Toplam komisyon oranı (%) veya TL tutarı' })
  @Column({ name: 'total_commission_value', type: 'decimal', precision: 8, scale: 2 })
  totalCommissionValue: number

  /**
   * Yetkili emlakçının alacağı oran (0-100).
   * Kalan (100 - authorizedAgentShare) işlemi kapatan emlakçıya gider.
   * CHECK kısıtı: authorized_agent_share + collaborator_share = 100
   */
  @ApiProperty({ example: 50, description: 'Yetkili emlakçı payı (%)' })
  @Column({ name: 'authorized_agent_share', type: 'smallint', default: 50 })
  authorizedAgentShare: number

  @ApiProperty({ example: 50, description: 'İşbirlikçi emlakçı payı (%)' })
  @Column({ name: 'collaborator_share', type: 'smallint', default: 50 })
  collaboratorShare: number

  // ── MLS Durumu ─────────────────────────────────────────────────────────────

  @ApiProperty({ enum: MlsStatus, default: MlsStatus.OPEN })
  @Column({ type: 'enum', enum: MlsStatus, default: MlsStatus.OPEN })
  status: MlsStatus

  // ── Kısıtlar ve Kurallar ───────────────────────────────────────────────────

  /**
   * MLS havuzuna yalnızca bu şehirdeki emlakçılar katılabilir.
   * NULL → Türkiye geneli.
   */
  @ApiPropertyOptional({ example: 'İstanbul' })
  @Column({ name: 'region_filter', type: 'varchar', length: 100, nullable: true })
  regionFilter: string | null

  /** Maksimum kaç farklı emlakçı bu ilana katılabilir? */
  @ApiProperty({ example: 5 })
  @Column({ name: 'max_collaborators', type: 'smallint', default: 10 })
  maxCollaborators: number

  /** Son başvuru tarihi — bu tarihten sonra yeni katılım kabul edilmez */
  @ApiPropertyOptional()
  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date | null

  // ── Notlar ─────────────────────────────────────────────────────────────────

  @ApiPropertyOptional({ description: 'Yetkili emlakçının işbirlikçiler için notu' })
  @Column({ name: 'agent_notes', type: 'text', nullable: true })
  agentNotes: string | null

  // ── İlişkiler ──────────────────────────────────────────────────────────────

  /** Bu MLS ilanına katılan tüm işbirlikçi kayıtları */
  @OneToMany(() => MlsCollaboration, (collab) => collab.mlsListing, { cascade: ['insert'] })
  collaborations: MlsCollaboration[]

  // ── Zaman Damgaları ────────────────────────────────────────────────────────

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

// ─── Enum: İşbirliği Durumu ───────────────────────────────────────────────────

export enum CollaborationStatus {
  /** Başvuru yapıldı, yetkili emlakçı henüz onaylamadı */
  PENDING   = 'pending',
  /** Yetkili emlakçı onayladı — ilan bu emlakçının portföyünde görünür */
  APPROVED  = 'approved',
  /** Yetkili emlakçı reddetti */
  REJECTED  = 'rejected',
  /** İşbirlikçi kendi isteğiyle çekildi */
  WITHDRAWN = 'withdrawn',
  /** İşbirlikçi bu ilan üzerinden müşteri getirdi ve işlem tamamlandı */
  COMPLETED = 'completed',
}

// ─── Entity: MlsCollaboration ─────────────────────────────────────────────────

/**
 * Bir emlakçının belirli bir MLS ilanına katılım kaydı.
 * Her emlakçı bir MLS ilanına yalnızca bir kez katılabilir (UNIQUE kısıtı).
 *
 * Tablo: mls_collaborations
 */
@Entity('mls_collaborations')
export class MlsCollaboration {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string

  // ── MLS İlan Referansı ─────────────────────────────────────────────────────

  @ApiProperty({ description: 'mls_listings.id' })
  @Column({ name: 'mls_listing_id', type: 'uuid' })
  mlsListingId: string

  @ManyToOne(() => MlsListing, (ml) => ml.collaborations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mls_listing_id' })
  mlsListing: MlsListing

  // ── İşbirlikçi Emlakçı ────────────────────────────────────────────────────

  @ApiProperty({ description: 'Katılan emlakçının users.id\'si' })
  @Column({ name: 'collaborator_agent_id', type: 'uuid' })
  collaboratorAgentId: string

  @ApiPropertyOptional({ description: 'Katılan emlakçının agencies.id\'si' })
  @Column({ name: 'collaborator_agency_id', type: 'uuid', nullable: true })
  collaboratorAgencyId: string | null

  // ── Durum ─────────────────────────────────────────────────────────────────

  @ApiProperty({ enum: CollaborationStatus, default: CollaborationStatus.PENDING })
  @Column({ type: 'enum', enum: CollaborationStatus, default: CollaborationStatus.PENDING })
  status: CollaborationStatus

  // ── Müşteri Yönlendirme Notu ───────────────────────────────────────────────

  /** İşbirlikçi hangi müşteriyi getirdiğini kaydedebilir (KVKK: kısmi ad/tel) */
  @ApiPropertyOptional()
  @Column({ name: 'client_ref_note', type: 'text', nullable: true })
  clientRefNote: string | null

  // ── Onay / Red Tarihleri ───────────────────────────────────────────────────

  @ApiPropertyOptional()
  @Column({ name: 'reviewed_at', type: 'timestamptz', nullable: true })
  reviewedAt: Date | null

  @ApiPropertyOptional()
  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null

  // ── İlişkiler ──────────────────────────────────────────────────────────────

  /** Bu işbirliğinden doğan komisyon dağıtımı */
  @OneToMany(() => MlsCommissionSplit, (split) => split.collaboration)
  commissionSplits: MlsCommissionSplit[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

// ─── Enum: Komisyon Dağıtım Durumu ────────────────────────────────────────────

export enum SplitStatus {
  /** İşlem tamamlandı, komisyon hesaplandı ama henüz ödenmedi */
  CALCULATED = 'calculated',
  /** Platform tarafından onaylandı */
  APPROVED   = 'approved',
  /** Ödeme yapıldı */
  PAID       = 'paid',
  /** İtiraz — hakem sürecinde */
  DISPUTED   = 'disputed',
}

// ─── Entity: MlsCommissionSplit ───────────────────────────────────────────────

/**
 * MLS işlemi tamamlandığında komisyonun nasıl bölüşüldüğünü kayıt altına alır.
 * Hem yetkili emlakçının hem de işbirlikçinin payı ayrı satırlarda tutulur.
 *
 * Tablo: mls_commission_splits
 */
@Entity('mls_commission_splits')
export class MlsCommissionSplit {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string

  // ── İşbirliği Referansı ───────────────────────────────────────────────────

  @ApiProperty({ description: 'mls_collaborations.id' })
  @Column({ name: 'collaboration_id', type: 'uuid' })
  collaborationId: string

  @ManyToOne(() => MlsCollaboration, (c) => c.commissionSplits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'collaboration_id' })
  collaboration: MlsCollaboration

  // ── Alıcı Bilgisi ─────────────────────────────────────────────────────────

  /** Komisyonu alacak kullanıcı (yetkili veya işbirlikçi emlakçı) */
  @ApiProperty({ description: 'Komisyon alıcısı users.id' })
  @Column({ name: 'recipient_user_id', type: 'uuid' })
  recipientUserId: string

  @ApiProperty({ description: 'Yetkili mi? TRUE → authorized_agent, FALSE → collaborator' })
  @Column({ name: 'is_authorized_agent', type: 'boolean' })
  isAuthorizedAgent: boolean

  // ── Tutar ─────────────────────────────────────────────────────────────────

  @ApiProperty({ example: 25000, description: 'Komisyon tutarı (TRY)' })
  @Column({ name: 'amount_try', type: 'decimal', precision: 12, scale: 2 })
  amountTry: number

  @ApiProperty({ example: 50, description: 'Yüzdelik pay' })
  @Column({ name: 'percentage_share', type: 'smallint' })
  percentageShare: number

  // ── Durum ─────────────────────────────────────────────────────────────────

  @ApiProperty({ enum: SplitStatus, default: SplitStatus.CALCULATED })
  @Column({ type: 'enum', enum: SplitStatus, default: SplitStatus.CALCULATED })
  status: SplitStatus

  // ── Ödeme Referansı ───────────────────────────────────────────────────────

  @ApiPropertyOptional({ description: 'İyzico veya havale referans no' })
  @Column({ name: 'payment_ref', type: 'varchar', length: 255, nullable: true })
  paymentRef: string | null

  @ApiPropertyOptional()
  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt: Date | null

  @ApiPropertyOptional()
  @Column({ name: 'dispute_note', type: 'text', nullable: true })
  disputeNote: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
