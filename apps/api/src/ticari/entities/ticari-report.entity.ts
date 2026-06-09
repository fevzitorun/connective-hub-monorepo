import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('ticari_reports')
export class TicariReport {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column({ name: 'user_id', type: 'uuid', nullable: true }) userId: string | null
  @Column({ name: 'listing_id', type: 'uuid', nullable: true }) listingId: string | null
  @Column({ name: 'report_type', length: 50 }) reportType: string
  @Column({ name: 'input_data', type: 'jsonb', nullable: true }) inputData: Record<string, unknown> | null
  @Column({ name: 'result_data', type: 'jsonb', nullable: true }) resultData: Record<string, unknown> | null
  @Column({ nullable: true, length: 255 }) title: string | null

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date
}
