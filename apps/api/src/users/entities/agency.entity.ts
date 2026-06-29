import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn,
} from 'typeorm'
import { User } from './user.entity'

export enum AgencyPlan {
  FREE      = 'free',
  PRO       = 'pro',
  CORPORATE = 'corporate',
}

@Entity('agencies')
export class Agency {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string

  @Column({ name: 'company_name', type: 'varchar' })
  companyName: string

  @Column({ name: 'license_no', type: 'varchar', nullable: true })
  licenseNo: string

  @Column({ type: 'enum', enum: AgencyPlan, default: AgencyPlan.FREE })
  plan: AgencyPlan

  @Column({ type: 'varchar', nullable: true, unique: true })
  subdomain: string

  @Column({ name: 'logo_url', type: 'varchar', nullable: true })
  logoUrl: string

  @Column({ type: 'varchar', nullable: true })
  phone: string

  @Column({ type: 'varchar', nullable: true })
  address: string

  @Column({ type: 'varchar', nullable: true })
  city: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
