import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm'
import { Agency } from '../../users/entities/agency.entity'
import { AgencyPlan } from '../../users/entities/agency.entity'

export enum SubStatus {
  ACTIVE    = 'active',
  CANCELLED = 'cancelled',
  PAST_DUE  = 'past_due',
  TRIALING  = 'trialing',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Agency, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'agency_id' })
  agency: Agency

  @Column({ name: 'agency_id', type: 'uuid' })
  agencyId: string

  @Column({ type: 'enum', enum: AgencyPlan })
  plan: AgencyPlan

  @Column({ type: 'enum', enum: SubStatus, default: SubStatus.ACTIVE })
  status: SubStatus

  @Column({ name: 'iyzico_sub_id', type: 'varchar', nullable: true })
  iyzicoSubId: string

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number

  @Column({ type: 'varchar', length: 3, default: 'TRY' })
  currency: string

  @Column({ name: 'starts_at', type: 'timestamptz' })
  startsAt: Date

  @Column({ name: 'ends_at', type: 'timestamptz', nullable: true })
  endsAt: Date

  @Column({ name: 'trial_ends_at', type: 'timestamptz', nullable: true })
  trialEndsAt: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
