import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('ticari_market_snapshots')
export class TicariSnapshot {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column({ length: 100 }) city: string
  @Column({ nullable: true }) district: string | null

  @Column({
    name: 'property_type',
    type: 'enum',
    enum: ['residential', 'commercial', 'land', 'industrial'],
  })
  propertyType: string

  @Column({ name: 'listing_type', type: 'enum', enum: ['sale', 'rent'] })
  listingType: string

  @Column({ name: 'avg_price_m2', type: 'decimal', precision: 14, scale: 2, nullable: true }) avgPriceM2: number | null
  @Column({ name: 'median_price', type: 'decimal', precision: 14, scale: 2, nullable: true }) medianPrice: number | null
  @Column({ name: 'min_price_m2', type: 'decimal', precision: 14, scale: 2, nullable: true }) minPriceM2: number | null
  @Column({ name: 'max_price_m2', type: 'decimal', precision: 14, scale: 2, nullable: true }) maxPriceM2: number | null
  @Column({ name: 'listing_count', type: 'int', nullable: true }) listingCount: number | null
  @Column({ name: 'sample_date', type: 'date' }) sampleDate: string

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date
}
