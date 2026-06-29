import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm'
import { Listing } from '../../listings/entities/listing.entity'
import { User } from '../../users/entities/user.entity'

export type FilterraAgent =
  | 'listing_writer'
  | 'title_optimizer'
  | 'valuation'
  | 'legal_precheck'
  | 'neighborhood'
  | 'market_trend'
  | 'photo_description'
  | 'translation'

@Entity('filterra_reports')
export class FilterraReport {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'listing_id', type: 'uuid', nullable: true })
  listingId: string

  @ManyToOne(() => Listing, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'listing_id' })
  listing: Listing

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ type: 'enum', enum: [
    'listing_writer', 'title_optimizer', 'valuation',
    'legal_precheck', 'neighborhood', 'market_trend',
    'photo_description', 'translation',
  ] })
  agent: FilterraAgent

  @Column({ name: 'input_data', type: 'jsonb', nullable: true })
  inputData: Record<string, unknown>

  @Column({ name: 'output_data', type: 'jsonb', nullable: true })
  outputData: Record<string, unknown>

  @Column({ name: 'model_id', type: 'varchar', nullable: true })
  modelId: string

  @Column({ name: 'tokens_used', type: 'int', nullable: true })
  tokensUsed: number

  @Column({ name: 'duration_ms', type: 'int', nullable: true })
  durationMs: number

  @Column({ type: 'text', nullable: true })
  error: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
