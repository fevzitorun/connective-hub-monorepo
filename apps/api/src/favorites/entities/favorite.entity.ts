import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Listing } from '../../listings/entities/listing.entity'

@Entity('favorites')
export class Favorite {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string

  @PrimaryColumn({ name: 'listing_id', type: 'uuid' })
  listingId: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Listing, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
