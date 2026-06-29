import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

export enum AlertChannel {
  EMAIL    = 'email',
  WHATSAPP = 'whatsapp',
}

@Entity('search_alerts')
export class SavedSearch {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  // Filtre parametreleri JSON olarak saklanır
  @Column({ type: 'jsonb' })
  filters: Record<string, any>

  // İnsan okunabilir etiket: "İstanbul Kadıköy 3+1 Satılık"
  @Column({ length: 255, nullable: true })
  label: string

  @Column({ type: 'enum', enum: AlertChannel, default: AlertChannel.EMAIL })
  channel: AlertChannel

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean

  @Column({ name: 'last_sent', type: 'timestamptz', nullable: true })
  lastSent: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
