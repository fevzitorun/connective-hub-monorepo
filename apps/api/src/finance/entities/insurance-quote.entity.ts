import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('insurance_quotes')
export class InsuranceQuote {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column({ name: 'listing_id', type: 'uuid', nullable: true }) listingId: string | null
  @Column({ name: 'user_id', type: 'uuid', nullable: true }) userId: string | null

  @Column({ name: 'insurance_type', type: 'enum', enum: ['dask', 'konut', 'both'] })
  insuranceType: 'dask' | 'konut' | 'both'

  @Column({ name: 'area_m2', type: 'decimal', precision: 10, scale: 2, nullable: true }) areaM2: number | null
  @Column({ name: 'building_age', type: 'int', nullable: true }) buildingAge: number | null
  @Column({ type: 'varchar', nullable: true }) city: string | null
  @Column({ type: 'varchar', nullable: true }) district: string | null
  @Column({ name: 'construction_type', type: 'varchar', default: 'betonarme' }) constructionType: string
  @Column({ name: 'floor_count', type: 'int', nullable: true }) floorCount: number | null

  @Column({ name: 'dask_premium', type: 'decimal', precision: 10, scale: 2, nullable: true }) daskPremium: number | null
  @Column({ name: 'konut_premium', type: 'decimal', precision: 10, scale: 2, nullable: true }) konutPremium: number | null
  @Column({ name: 'dask_coverage', type: 'decimal', precision: 14, scale: 2, nullable: true }) daskCoverage: number | null

  @Column({ type: 'enum', enum: ['draft', 'sent', 'accepted', 'expired'], default: 'draft' })
  status: 'draft' | 'sent' | 'accepted' | 'expired'

  @Column({ name: 'valid_until', type: 'timestamptz', nullable: true }) validUntil: Date | null
  @Column({ name: 'contact_email', type: 'varchar', nullable: true }) contactEmail: string | null

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date
}
