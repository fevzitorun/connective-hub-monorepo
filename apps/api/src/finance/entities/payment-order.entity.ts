import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('payment_orders')
export class PaymentOrder {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column({ name: 'agency_id', type: 'uuid' }) agencyId: string
  @Column({ name: 'user_id', type: 'uuid', nullable: true }) userId: string | null

  @Column({ type: 'enum', enum: ['free', 'pro', 'corporate', 'enterprise'] }) plan: string
  @Column({ default: 1 }) months: number
  @Column({ type: 'decimal', precision: 10, scale: 2 }) amount: number
  @Column({ length: 3, default: 'TRY' }) currency: string

  @Column({ name: 'iyzico_token', nullable: true }) iyzicoToken: string | null
  @Column({ name: 'iyzico_ref', nullable: true, unique: true }) iyzicoRef: string | null

  @Column({ type: 'enum', enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' })
  status: 'pending' | 'success' | 'failed' | 'refunded'

  @Column({ name: 'error_msg', nullable: true, type: 'text' }) errorMsg: string | null

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date
}
