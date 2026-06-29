import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum LeadSource {
  WEBSITE        = 'website',
  PHONE          = 'phone',
  WHATSAPP       = 'whatsapp',
  REFERRAL       = 'referral',
  SOCIAL_MEDIA   = 'social_media',
  PORTAL         = 'portal',       // sahibinden, hepsiemlak vb.
  WALK_IN        = 'walk_in',
  EMAIL          = 'email',
  OTHER          = 'other',
}

export enum LeadStatus {
  NEW            = 'new',          // Yeni geldi
  CONTACTED      = 'contacted',    // İlk temas kuruldu
  QUALIFIED      = 'qualified',    // Nitelikli müşteri
  SHOWING        = 'showing',      // Gezme aşamasında
  OFFER          = 'offer',        // Teklif verildi
  NEGOTIATION    = 'negotiation',  // Müzakere
  WON            = 'won',          // Satış/kiralama tamamlandı
  LOST           = 'lost',         // Kaybedildi
  NURTURING      = 'nurturing',    // Uzun vadeli takip
}

export enum LeadType {
  BUYER          = 'buyer',
  RENTER         = 'renter',
  SELLER         = 'seller',
  LANDLORD       = 'landlord',
  INVESTOR       = 'investor',
}

export enum LeadPriority {
  LOW            = 'low',
  MEDIUM         = 'medium',
  HIGH           = 'high',
  HOT            = 'hot',
}

// ─── Lead Entity ─────────────────────────────────────────────────────────────

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** Sahibi acenta */
  @Column({ name: 'agency_id', type: 'uuid' })
  agencyId: string

  /** Sorumlu danışman */
  @Column({ name: 'assigned_agent_id', type: 'uuid', nullable: true })
  assignedAgentId: string | null

  // ─── Müşteri bilgileri ────────────────────────────────────────────────

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null

  @Column({ type: 'varchar', length: 200, nullable: true })
  email: string | null

  // ─── CRM durumu ───────────────────────────────────────────────────────

  @Column({ type: 'enum', enum: LeadSource, default: LeadSource.WEBSITE })
  source: LeadSource

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus

  @Column({ type: 'enum', enum: LeadType, default: LeadType.BUYER })
  type: LeadType

  @Column({ type: 'enum', enum: LeadPriority, default: LeadPriority.MEDIUM })
  priority: LeadPriority

  // ─── İlgilenilen mülk kriterleri ─────────────────────────────────────

  /** İlgilenilen ilan (opsiyonel — direkt bir ilana bağlanabilir) */
  @Column({ name: 'listing_id', type: 'uuid', nullable: true })
  listingId: string | null

  /** İstediği şehir */
  @Column({ name: 'preferred_city', type: 'varchar', length: 100, nullable: true })
  preferredCity: string | null

  /** İstediği semt/ilçe */
  @Column({ name: 'preferred_district', type: 'varchar', length: 100, nullable: true })
  preferredDistrict: string | null

  /** Min bütçe (TL) */
  @Column({ name: 'budget_min', type: 'numeric', precision: 14, scale: 2, nullable: true })
  budgetMin: string | null

  /** Max bütçe (TL) */
  @Column({ name: 'budget_max', type: 'numeric', precision: 14, scale: 2, nullable: true })
  budgetMax: string | null

  /** Min m² */
  @Column({ name: 'size_min_m2', type: 'int', nullable: true })
  sizeMinM2: number | null

  /** Max m² */
  @Column({ name: 'size_max_m2', type: 'int', nullable: true })
  sizeMaxM2: number | null

  /** Oda sayısı tercihi (serbest text: "2+1, 3+1") */
  @Column({ name: 'room_preference', type: 'varchar', length: 100, nullable: true })
  roomPreference: string | null

  // ─── Takip ───────────────────────────────────────────────────────────

  /** Son temas tarihi */
  @Column({ name: 'last_contacted_at', type: 'timestamptz', nullable: true })
  lastContactedAt: Date | null

  /** Bir sonraki hatırlatma */
  @Column({ name: 'next_follow_up_at', type: 'timestamptz', nullable: true })
  nextFollowUpAt: Date | null

  /** Genel not */
  @Column({ type: 'text', nullable: true })
  notes: string | null

  /** Kazanılan deal değeri (TL) — status=won olduğunda dolu */
  @Column({ name: 'deal_value_try', type: 'numeric', precision: 14, scale: 2, nullable: true })
  dealValueTry: string | null

  /** Kaybedilme sebebi — status=lost olduğunda dolu */
  @Column({ name: 'lost_reason', type: 'varchar', length: 500, nullable: true })
  lostReason: string | null

  /** KVKK açık rıza */
  @Column({ name: 'kvkk_consent', type: 'boolean', default: false })
  kvkkConsent: boolean

  /** Silindi mi (soft delete) */
  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date

  // ─── Relations ────────────────────────────────────────────────────────

  @OneToMany(() => LeadActivity, (a) => a.lead, { cascade: false })
  activities: LeadActivity[]
}

// ─── LeadActivity Entity ──────────────────────────────────────────────────────

export enum ActivityType {
  NOTE           = 'note',
  CALL           = 'call',
  EMAIL_SENT     = 'email_sent',
  WHATSAPP       = 'whatsapp',
  MEETING        = 'meeting',
  SHOWING        = 'showing',
  OFFER_SENT     = 'offer_sent',
  STATUS_CHANGE  = 'status_change',
  AI_ACTION      = 'ai_action',    // SCRIBE / CAMPAIGNER agent aksiyon
}

@Entity('lead_activities')
export class LeadActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'lead_id', type: 'uuid' })
  leadId: string

  @Column({ name: 'performed_by_user_id', type: 'uuid', nullable: true })
  performedByUserId: string | null

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType

  @Column({ type: 'text', nullable: true })
  body: string | null

  /** Metadata: eski status → yeni status, agent adı, vb. */
  @Column({ type: 'jsonb', nullable: true })
  meta: Record<string, unknown> | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  // ─── Relations ────────────────────────────────────────────────────────

  @ManyToOne(() => Lead, (l) => l.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead
}
