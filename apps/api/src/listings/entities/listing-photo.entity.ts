import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm'
import { Listing } from './listing.entity'

@Entity('listing_photos')
export class ListingPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Listing, (listing) => listing.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing

  @Column({ name: 'listing_id', type: 'uuid' })
  listingId: string

  @Column({ type: 'text' })
  url: string

  @Column({ name: 'r2_key', type: 'text' })
  r2Key: string

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number

  @Column({ name: 'is_cover', type: 'boolean', default: false })
  isCover: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
