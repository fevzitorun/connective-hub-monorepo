import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Agency } from '../../users/entities/agency.entity'
import { ListingPhoto } from './listing-photo.entity'

export enum PropertyType {
  RESIDENTIAL = 'residential',
  COMMERCIAL  = 'commercial',
  LAND        = 'land',
  INDUSTRIAL  = 'industrial',
}

export enum ListingType {
  SALE = 'sale',
  RENT = 'rent',
}

export enum ListingStatus {
  DRAFT   = 'draft',
  ACTIVE  = 'active',
  PASSIVE = 'passive',
  SOLD    = 'sold',
  RENTED  = 'rented',
  EXPIRED = 'expired',
}

// Konut kategorileri
export enum ResidentialCategory {
  APARTMENT  = 'apartment',   // Daire
  VILLA      = 'villa',
  DETACHED   = 'detached',    // Müstakil
  STUDIO     = 'studio',      // Stüdyo
  DUPLEX     = 'duplex',
  PENTHOUSE  = 'penthouse',
  BUILDING   = 'building',    // Bina
  TIMESHARE  = 'timeshare',   // Devre Mülk
}

// Ticari kategoriler (Modül 11 TicariMetre için de kullanılır)
export enum CommercialCategory {
  OFFICE     = 'office',
  RETAIL     = 'retail',      // Dükkan/Mağaza
  WAREHOUSE  = 'warehouse',   // Depo
  FACTORY    = 'factory',     // Fabrika
  HOTEL      = 'hotel',
  SHOWROOM   = 'showroom',
  PLAZA      = 'plaza',
}

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Agency, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'agency_id' })
  agency: Agency

  @Column({ name: 'agency_id', type: 'uuid', nullable: true })
  agencyId: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_user_id' })
  owner: User

  @Column({ name: 'owner_user_id', type: 'uuid' })
  ownerUserId: string

  @Column({ length: 500 })
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  // AI tarafından üretilen açıklama (FILTERRA.AI)
  @Column({ name: 'ai_description', type: 'text', nullable: true })
  aiDescription: string

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: true })
  price: number

  @Column({ length: 3, default: 'TRY' })
  currency: string

  @Column({ name: 'property_type', type: 'enum', enum: PropertyType })
  propertyType: PropertyType

  @Column({ name: 'listing_type', type: 'enum', enum: ListingType })
  listingType: ListingType

  @Column({ length: 100, nullable: true })
  category: string

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.DRAFT })
  status: ListingStatus

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat: number | null

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng: number | null

  @Column({ name: 'address_text', type: 'text', nullable: true })
  addressText: string

  @Column({ length: 100 })
  city: string

  @Column({ length: 100, nullable: true })
  district: string

  @Column({ length: 100, nullable: true })
  neighborhood: string

  // ─── Özellikler ──────────────────────────────────────────────────────────

  @Column({ name: 'area_m2', type: 'decimal', precision: 10, scale: 2, nullable: true })
  areaM2: number

  @Column({ name: 'room_count', length: 20, nullable: true })
  roomCount: string    // '1+1', '2+1', '3+1', '4+1', '5+'

  @Column({ name: 'floor_no', type: 'int', nullable: true })
  floorNo: number

  @Column({ name: 'total_floors', type: 'int', nullable: true })
  totalFloors: number

  @Column({ name: 'building_age', type: 'int', nullable: true })
  buildingAge: number

  @Column({ name: 'is_furnished', type: 'boolean', nullable: true })
  isFurnished: boolean

  @Column({ name: 'has_parking', type: 'boolean', default: false })
  hasParking: boolean

  @Column({ name: 'has_elevator', type: 'boolean', default: false })
  hasElevator: boolean

  @Column({ name: 'has_balcony', type: 'boolean', default: false })
  hasBalcony: boolean

  @Column({ name: 'has_garden', type: 'boolean', default: false })
  hasGarden: boolean

  @Column({ name: 'has_pool', type: 'boolean', default: false })
  hasPool: boolean

  // ─── Ticari özellikler (TicariMetre için) ────────────────────────────────

  @Column({ name: 'ceiling_height_m', type: 'decimal', precision: 5, scale: 2, nullable: true })
  ceilingHeightM: number

  @Column({ name: 'power_kva', type: 'int', nullable: true })
  powerKva: number

  @Column({ name: 'floor_load_tons', type: 'decimal', precision: 8, scale: 2, nullable: true })
  floorLoadTons: number

  // ─── WhatsApp ────────────────────────────────────────────────────────────

  @Column({ name: 'whatsapp_link', type: 'text', nullable: true })
  whatsappLink: string

  @Column({ name: 'whatsapp_qr_url', type: 'text', nullable: true })
  whatsappQrUrl: string

  // ─── FILTERRA.AI ─────────────────────────────────────────────────────────

  @Column({ name: 'valuation_min', type: 'decimal', precision: 14, scale: 2, nullable: true })
  valuationMin: number

  @Column({ name: 'valuation_max', type: 'decimal', precision: 14, scale: 2, nullable: true })
  valuationMax: number

  @Column({ name: 'legal_risk_score', type: 'smallint', nullable: true })
  legalRiskScore: number

  // ─── İstatistikler ───────────────────────────────────────────────────────

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number

  @Column({ name: 'whatsapp_clicks', type: 'int', default: 0 })
  whatsappClicks: number

  @Column({ name: 'favorite_count', type: 'int', default: 0 })
  favoriteCount: number

  // ─── Zamanlama ───────────────────────────────────────────────────────────

  @Column({ name: 'expires_at', nullable: true })
  expiresAt: Date

  @Column({ name: 'published_at', nullable: true })
  publishedAt: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  // ─── İlişkiler ───────────────────────────────────────────────────────────

  @OneToMany(() => ListingPhoto, (photo) => photo.listing, { cascade: true })
  photos: ListingPhoto[]
}
