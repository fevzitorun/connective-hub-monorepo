import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { User } from './user.entity'

@Entity('kvkk_audit_log')
export class KvkkAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string

  @Column({ type: 'varchar' })
  action: string

  @Column({ type: 'varchar', nullable: true })
  resource: string

  @Column({ name: 'ip_address', type: 'varchar', nullable: true })
  ipAddress: string

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
